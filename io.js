import {createAssessment,normalizeStudy,questionStates,assess,ITT,PP,SCOPES,RISKS} from './core.js';
export const QUESTION_COLUMNS={'1.1':'N','1.2':'O','1.3':'Q','2.1':'X','2.2':'Y','2.3':'AA','2.4':'AC','2.5':'AE','2.6':'AG','2.7':'AI','3.1':'AP','3.2':'AR','3.3':'AT','3.4':'AV','4.1':'BC','4.2':'BE','4.3':'BG','4.4':'BI','4.5':'BK','5.1':'BR','5.2':'BT','5.3':'BV'};
export const NOTE_COLUMNS={'1.1':'P','1.2':'P','1.3':'R','2.1':'Z','2.2':'Z','2.3':'AB','2.4':'AD','2.5':'AF','2.6':'AH','2.7':'AJ','3.1':'AQ','3.2':'AS','3.3':'AU','3.4':'AU','4.1':'BD','4.2':'BF','4.3':'BH','4.4':'BJ','4.5':'BJ','5.1':'BS','5.2':'BU','5.3':'BW'};
const JUDGEMENT_COLUMNS=['T','AL','AY','BN','BY','CD'];
const ALGORITHM_COLUMNS=['S','AK','AX','BM','BX','CC'];
const GENERAL_COLUMNS=['U','AM','AZ','BO','BZ','CE'];
const DIRECTION_COLUMNS=['V','AN','BA','BP','CA','CF'];
const DIRECTION_NOTE_COLUMNS=['W','AO','BB','BQ','CB','CG'];
export const SUMMARY_HEADERS=['Unique ID','Reviewer','Study ID','Reference','Experimental','Comparator','Outcome','Result','Aim','Effect of adhering to intervention?','Weight','Randomization process','Comment for randomization process','Deviations from intended interventions','Comment for deviations from intended interventions','Missing outcome data','Comment for missing outcome data','Measurement of the outcome','Comment for measurement of the outcome','Selection of the reported result','Comment for selection of the reported result','Overall Bias','Comment for overall bias'];
export function colName(index){let n=index+1,s='';while(n){n--;s=String.fromCharCode(65+n%26)+s;n=Math.floor(n/26);}return s;}
const validRisk=v=>RISKS.find(x=>x.toLowerCase()===String(v||'').trim().toLowerCase())||null;
export function fromResults(cells,model){
 const get=k=>String(cells[k]??'').trim();
 const s=createAssessment({uniqueId:get('B'),reviewer:get('C'),studyId:get('D'),reference:get('E'),experimental:get('F'),comparator:get('G'),outcome:get('H'),result:get('I'),aim:get('J').toLowerCase().includes('per-protocol')?'PP':'ITT',weight:get('L')===''?1:Number(get('L').replace(',','.')),sources:get('M').split(';').map(x=>x.trim()).filter(Boolean),imported:true});
 if(s.aim==='PP')s.scopes=model.scopes.flatMap((text,i)=>get('K').includes(text)?[SCOPES[i][0]]:[]);
 for(const [q,c] of Object.entries(QUESTION_COLUMNS))if(get(c)!=='NA'&&get(c)!=='')s.answers[q]=get(c);
 for(const [q,c] of Object.entries(NOTE_COLUMNS))if(get(c))s.notes[q]=get(c);
 for(let d=1;d<=6;d++){
  const risk=validRisk(get(JUDGEMENT_COLUMNS[d-1]));if(risk)s.overrides[d]=risk;
  if(get(GENERAL_COLUMNS[d-1]))s.domainNotes[d]=get(GENERAL_COLUMNS[d-1]);
  if(get(DIRECTION_COLUMNS[d-1]))s.directions[d]=get(DIRECTION_COLUMNS[d-1]);
  if(get(DIRECTION_NOTE_COLUMNS[d-1]))s.directionNotes[d]=get(DIRECTION_NOTE_COLUMNS[d-1]);
 }
 return normalizeStudy(s);
}
function fromSummary(values,model){
 const c={B:values[0],C:values[1],D:values[2],E:values[3],F:values[4],G:values[5],H:values[6],I:values[7],J:values[8],K:values[9],L:values[10]};
 for(let d=0;d<6;d++){c[JUDGEMENT_COLUMNS[d]]=values[11+d*2];c[GENERAL_COLUMNS[d]]=values[12+d*2];}
 return fromResults(c,model);
}
export async function readZip(buffer){
 const view=new DataView(buffer),bytes=new Uint8Array(buffer);let eocd=-1;
 for(let p=bytes.length-22;p>=Math.max(0,bytes.length-65557);p--)if(view.getUint32(p,true)===0x06054b50){eocd=p;break;}
 if(eocd<0)throw new Error('O arquivo não é uma pasta de trabalho XLSX/XLSM válida.');
 const count=view.getUint16(eocd+10,true);let p=view.getUint32(eocd+16,true),total=0;const result={};
 for(let i=0;i<count;i++){
  if(p+46>bytes.length||view.getUint32(p,true)!==0x02014b50)throw new Error('Estrutura ZIP inválida.');
  const method=view.getUint16(p+10,true),compressed=view.getUint32(p+20,true),size=view.getUint32(p+24,true),nl=view.getUint16(p+28,true),el=view.getUint16(p+30,true),cl=view.getUint16(p+32,true),offset=view.getUint32(p+42,true);
  const name=new TextDecoder().decode(bytes.subarray(p+46,p+46+nl));p+=46+nl+el+cl;
  if(!/^xl\/(workbook\.xml|_rels\/workbook\.xml\.rels|sharedStrings\.xml|worksheets\/sheet\d+\.xml)$/.test(name))continue;
  total+=size;if(total>60*1024*1024)throw new Error('Arquivo muito grande. Use uma exportação CSV da aba Results.');
  if(offset+30>bytes.length||view.getUint32(offset,true)!==0x04034b50)throw new Error('Entrada ZIP inválida.');
  const start=offset+30+view.getUint16(offset+26,true)+view.getUint16(offset+28,true);if(start+compressed>bytes.length)throw new Error('Arquivo ZIP truncado.');
  const packed=bytes.slice(start,start+compressed);let raw;
  if(method===0)raw=packed;
  else if(method===8){
   if(typeof DecompressionStream==='undefined')throw new Error('Este navegador não permite ler Excel diretamente. Importe CSV ou use um navegador atualizado.');
   const stream=new Blob([packed]).stream().pipeThrough(new DecompressionStream('deflate-raw'));raw=new Uint8Array(await new Response(stream).arrayBuffer());
  }else throw new Error('Compressão não suportada. Exporte a aba Results como CSV.');
  if(raw.length!==size)throw new Error('Tamanho de entrada ZIP inconsistente.');
  result[name]=new TextDecoder().decode(raw);
 }
 return result;
}
const descendants=(node,name)=>Array.from(node.getElementsByTagNameNS('*',name));
function xml(text){if(!text)throw new Error('Planilha sem estrutura XML esperada.');const doc=new DOMParser().parseFromString(text,'application/xml');if(descendants(doc,'parsererror').length)throw new Error('XML inválido no arquivo.');return doc;}
export async function readExcel(file,model){
 const z=await readZip(await file.arrayBuffer()),workbook=xml(z['xl/workbook.xml']),relationships=xml(z['xl/_rels/workbook.xml.rels']);
 const sheets=descendants(workbook,'sheet');
 const sheet=sheets.find(s=>s.getAttribute('name').toLowerCase()==='results')||sheets.find(s=>s.getAttribute('name').toLowerCase()==='summary');
 if(!sheet)throw new Error('Não encontrei a aba Results ou Summary do modelo RoB 2.');
 const rel=descendants(relationships,'Relationship').find(r=>r.getAttribute('Id')===sheet.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships','id'));
 if(!rel)throw new Error('Referência de aba ausente.');
 const target=rel.getAttribute('Target');const path=target.startsWith('/')?target.slice(1):'xl/'+target.replace(/^\.\//,'');
 const strings=z['xl/sharedStrings.xml']?descendants(xml(z['xl/sharedStrings.xml']),'si').map(si=>descendants(si,'t').map(t=>t.textContent).join('')):[];
 const rows=descendants(xml(z[path]),'row');const records=[];
 for(const row of rows){
  const index=Number(row.getAttribute('r'));if(index<(sheet.getAttribute('name').toLowerCase()==='results'?3:2))continue;
  const cells={};for(const c of descendants(row,'c')){
   const col=c.getAttribute('r').replace(/\d/g,''),type=c.getAttribute('t'),v=descendants(c,'v')[0]?.textContent||'';
   cells[col]=type==='s'?(strings[Number(v)]||''):type==='inlineStr'?descendants(c,'t').map(t=>t.textContent).join(''):v;
  }
  if(sheet.getAttribute('name').toLowerCase()==='results'){
   if(cells.B||cells.D)records.push(fromResults(cells,model));
  }else if(cells.A||cells.C){records.push(fromSummary(Array.from({length:23},(_,i)=>cells[colName(i)]||''),model));}
 }
 return records;
}
export function parseCSV(text){
 text=text.replace(/^\uFEFF/,'');const first=text.split(/\r?\n/)[0];
 const delimiter=[';',',','\t'].map(d=>[d,first.split(d).length]).sort((a,b)=>b[1]-a[1])[0][0];
 const rows=[];let row=[],value='',quoted=false;
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(c==='"'){if(quoted&&text[i+1]==='"'){value+='"';i++;}else quoted=!quoted;}
  else if(c===delimiter&&!quoted){row.push(value);value='';}
  else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(value);if(row.some(Boolean))rows.push(row);row=[];value='';}
  else value+=c;
 }
 if(quoted)throw new Error('CSV com aspas não fechadas.');
 row.push(value);if(row.some(Boolean))rows.push(row);return rows;
}
export async function importFile(file,model){
 if(file.size>30*1024*1024)throw new Error('Limite de 30 MB por arquivo. Exporte a aba Results como CSV para arquivos maiores.');
 if(/\.xls[mx]$/i.test(file.name))return {studies:await readExcel(file,model)};
 if(/\.json$/i.test(file.name)){
  const data=JSON.parse(await file.text());if(!Array.isArray(data.studies)||data.studies.length>5000)throw new Error('Arquivo de projeto inválido ou acima de 5.000 avaliações.');
  return {studies:data.studies.map(normalizeStudy),title:typeof data.title==='string'?data.title:null};
 }
 if(/\.(csv|tsv)$/i.test(file.name)){
  const rows=parseCSV(await file.text());const hi=rows.findIndex(row=>row.includes('Unique ID'));
  if(hi<0)throw new Error('CSV sem o cabeçalho Unique ID. Exporte Results ou Summary com os títulos de coluna.');
  const headers=rows[hi];const isResults=headers.includes('1.1')&&headers.includes('Time');
  const records=rows.slice(hi+1).filter(row=>row.some(Boolean)).map(row=>{
   if(isResults){const cells={};for(const [col,label] of Object.entries(model.resultHeaders)){const i=headers.indexOf(label);if(i>=0)cells[col]=row[i]||'';}return fromResults(cells,model);}
   if(!headers.includes('Randomization process'))throw new Error('Cabeçalhos diferentes do modelo Results/Summary.');
   return fromSummary(SUMMARY_HEADERS.map(h=>row[headers.indexOf(h)]||''),model);
  });return {studies:records};
 }
 throw new Error('Selecione um arquivo XLSM, XLSX, CSV, TSV ou JSON.');
}
export function toResults(s,rules,model){
 const r=assess(s,rules),a=questionStates(s).answers;
 const c={A:s.updatedAt,B:s.uniqueId,C:s.reviewer,D:s.studyId,E:s.reference,F:s.experimental,G:s.comparator,H:s.outcome,I:s.result,J:s.aim==='PP'?PP:ITT,K:s.aim==='PP'?SCOPES.flatMap((x,i)=>s.scopes.includes(x[0])?[model.scopes[i]]:[]).join('; '):'NA',L:s.weight,M:s.sources.join('; ')};
 for(const [q,col] of Object.entries(QUESTION_COLUMNS))c[col]=a[q]||'';
 for(const col of new Set(Object.values(NOTE_COLUMNS))){const notes=Object.entries(NOTE_COLUMNS).flatMap(([q,c])=>c===col&&s.notes[q]?[s.notes[q]]:[]);c[col]=[...new Set(notes)].join('\n');}
 for(let d=0;d<6;d++){c[JUDGEMENT_COLUMNS[d]]=r.finals[d]||'';c[ALGORITHM_COLUMNS[d]]=r.suggestions[d]||'';c[GENERAL_COLUMNS[d]]=s.domainNotes[d+1]||'';c[DIRECTION_COLUMNS[d]]=s.directions[d+1]||'';c[DIRECTION_NOTE_COLUMNS[d]]=s.directionNotes[d+1]||'';}
 return c;
}
export function toSummary(s,rules,model){
 const c=toResults(s,rules,model);return [c.B,c.C,c.D,c.E,c.F,c.G,c.H,c.I,c.J,c.K,c.L,...JUDGEMENT_COLUMNS.flatMap((col,i)=>[c[col],c[GENERAL_COLUMNS[i]]])];
}
export function encodeCSV(rows){return '\uFEFF'+rows.map(row=>row.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(';')).join('\r\n');}
export function download(name,contents,type='text/plain;charset=utf-8'){
 const blob=contents instanceof Blob?contents:new Blob([contents],{type});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
