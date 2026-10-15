import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {importFile} from '../dist/io.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const handlers={};
const elements=new Map();
class Element {
 constructor(id){this.id=id;this.innerHTML='';this.value='';this.hidden=false;this.dataset={};this.style={};this.listeners={};}
 addEventListener(name,fn){this.listeners[name]=fn;}
 focus(){} querySelector(){return null;}querySelectorAll(){return [];}scrollIntoView(){}remove(){}append(){}
 get firstElementChild(){return this.innerHTML?{}:null;}
}
for(const id of ['app','modal-root','file-import','toast','main','completion-issues','print-report'])elements.set(id,new Element(id));
const storage=new Map();
globalThis.document={getElementById:id=>elements.get(id)||null,addEventListener:(name,fn)=>{handlers[name]=fn;},querySelector:()=>null,body:new Element('body'),createElement:()=>new Element('created'),activeElement:null};
globalThis.window={scrollY:0,scrollTo(){},addEventListener(){},print(){}};
globalThis.history={replaceState(){}};globalThis.location={hash:''};
globalThis.localStorage={getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)};
globalThis.fetch=async p=>({ok:true,json:async()=>JSON.parse(fs.readFileSync(path.join(root,'dist',p)))});
const click=async dataset=>handlers.click({target:{closest:()=>({dataset})},preventDefault(){}});
const input=(field,value)=>handlers.input({target:{dataset:{field},tagName:'INPUT',value}});
const change=(dataset,value,extra={})=>handlers.change({target:{dataset,value,tagName:'INPUT',...extra}});
const state=()=>JSON.parse(storage.get('rob2-studio-v1'));
const markup=()=>elements.get('app').innerHTML;

test('Application: render all views, complete ITT, switch PP flow, persist notes, show export options',async()=>{
 await import('../dist/app.js');
 assert(markup().includes('Sua revisão, com mais clareza.'));
 assert(markup().includes('Importado do Excel · parcial'));assert.equal(state().studies.length,1);
 const snapshots=[];snapshots.push(['overview',markup()]);
 for(const v of ['studies','charts','method']){await click({view:v});assert(markup().includes('<main'));snapshots.push([v,markup()]);}
 await click({action:'new'});input('studyId','Test trial 2025');input('outcome','Pain at four weeks');input('reviewer','Reviewer 1');
 const answers={'1.1':'Y','1.2':'Y','1.3':'N','2.1':'N','2.2':'N','2.6':'Y','3.1':'Y','4.1':'N','4.2':'N','4.3':'N','5.1':'Y','5.2':'N','5.3':'N'};
 for(const [k,v] of Object.entries(answers))change({answer:k},v);
 await click({step:'1'});assert(markup().includes('Processo de randomização'));assert(markup().includes('Baixo risco'));handlers.input({target:{dataset:{questionNote:'1.1'},value:'Evidence from page 4'}});assert.equal(state().studies.at(-1).notes['1.1'],'Evidence from page 4');snapshots.push(['domain1',markup()]);
 for(const n of [2,3,4,5]){await click({step:String(n)});snapshots.push(['domain'+n,markup()]);}
 await click({step:'6'});assert(markup().includes('Todas as etapas estão prontas'));snapshots.push(['review',markup()]);
 await click({action:'complete'});assert.equal(state().studies.at(-1).status,'completed');assert(markup().includes('Concluída'));
 await click({action:'new'});input('studyId','PP trial');input('outcome','Sleep');change({field:'aim'},'PP',{tagName:'SELECT'});await click({step:'2'});
 assert(markup().includes('As intervenções importantes não previstas no protocolo'));assert(!markup().includes('name="q2.7"'));snapshots.push(['pp-domain2',markup()]);
 await click({action:'export'});assert(elements.get('modal-root').innerHTML.includes('Tabela Results'));snapshots.push(['export',elements.get('modal-root').innerHTML]);
 await click({action:'close-modal'});
 if(process.env.ROB2_SNAPSHOT_DIR){const out=path.resolve(process.env.ROB2_SNAPSHOT_DIR);fs.mkdirSync(out,{recursive:true});for(const [name,html] of snapshots)fs.writeFileSync(path.join(out,name+'.html'),html);}
});

test('Actual XLSM Results import through the app parser using a SAX-backed test DOM',async t=>{
 const p=process.env.ROB2_FIXTURE||path.join(root,'tests/fixtures/original.xlsm');
 if(!fs.existsSync(p)){t.skip('Opcional: informe ROB2_FIXTURE com o caminho da planilha original.');return;}
 const require=createRequire(import.meta.url);let sax;
 try{sax=require('sax');}catch{t.skip('Opcional: instale sax para este teste de leitura XML (npm install --no-save sax).');return;}
 class XmlNode {
  constructor(name,attrs={},text=''){this.name=name;this.attrs=attrs;this.children=[];this.text=text;}
  get textContent(){return this.text+this.children.map(c=>c.textContent).join('');}
  getElementsByTagNameNS(ns,name){return this.children.flatMap(c=>[...(c.name.split(':').at(-1)===name?[c]:[]),...c.getElementsByTagNameNS(ns,name)]);}
  getAttribute(name){return this.attrs[name]??null;}
  getAttributeNS(ns,name){return this.attrs['r:'+name]??this.attrs[name]??null;}
 }
 globalThis.DOMParser=class{
  parseFromString(text){const root=new XmlNode('document'),stack=[root],parser=sax.parser(true);parser.onopentag=node=>{const n=new XmlNode(node.name,node.attributes);stack.at(-1).children.push(n);stack.push(n);};parser.ontext=text=>stack.at(-1).text+=text;parser.onclosetag=()=>stack.pop();parser.write(text).close();return root;}
 };
 const bytes=fs.readFileSync(p),model=JSON.parse(fs.readFileSync(path.join(root,'dist/model.json')));
 const result=await importFile({name:'original.xlsm',size:bytes.length,arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)},model);
 assert.equal(result.studies.length,1);assert.equal(result.studies[0].uniqueId,'AAA');assert.equal(result.studies[0].studyId,'X');assert.equal(result.studies[0].answers['1.1'],'Y');assert.equal(result.studies[0].overrides[1],'High');
});
