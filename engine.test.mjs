import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {legacy} from './legacy-oracle.mjs';
import {runRule,createAssessment,assess,summary,questionStates,completionIssues,normalizeStudy,QUESTIONS,ITT,PP} from '../dist/core.js';
import {fromResults,toResults,toSummary,parseCSV,encodeCSV,readZip,importFile,colName,QUESTION_COLUMNS} from '../dist/io.js';
import {summarySVG,trafficSVG} from '../dist/charts.js';
const rules=JSON.parse(fs.readFileSync(new URL('../dist/rules.json',import.meta.url)));
const model=JSON.parse(fs.readFileSync(new URL('../dist/model.json',import.meta.url)));
const raw=(d,answers,aim='ITT')=>runRule(rules,d,answers,aim);
const lowAnswers={'1.1':'Y','1.2':'Y','1.3':'N','2.1':'N','2.2':'N','2.6':'Y','3.1':'Y','4.1':'N','4.2':'N','4.3':'N','5.1':'Y','5.2':'N','5.3':'N'};
test('Golden decisions: randomization, deviations, missingness, measurement, selection',()=>{
 for(const [d,a,result,aim] of [
  [1,{'1.1':'Y','1.2':'Y','1.3':'N'},'Low'],[1,{'1.1':'N','1.2':'Y','1.3':'N'},'Some concerns'],[1,{'1.2':'PN'},'High'],[1,{'1.1':'Y','1.2':'NI','1.3':'Y'},'High'],
  [2,{'2.1':'N','2.2':'PN','2.6':'Y'},'Low'],[2,{'2.1':'Y','2.2':'N','2.3':'Y','2.4':'N','2.6':'Y'},'Some concerns'],[2,{'2.1':'Y','2.2':'Y','2.3':'Y','2.4':'Y','2.5':'N','2.6':'Y'},'High'],
  [2,{'2.1':'Y','2.2':'N','2.3':'Y','2.4':'N','2.5':'N','2.6':'NA'},'Low','PP'],[2,{'2.1':'N','2.2':'N','2.3':'NA','2.4':'Y','2.5':'N','2.6':'Y'},'Some concerns','PP'],[2,{'2.1':'N','2.2':'N','2.4':'Y','2.5':'N','2.6':'NI'},'High','PP'],
  [3,{'3.1':'PY'},'Low'],[3,{'3.1':'N','3.2':'Y'},'Low'],[3,{'3.1':'N','3.2':'N','3.3':'N'},'Low'],[3,{'3.1':'N','3.2':'N','3.3':'Y','3.4':'N'},'Some concerns'],[3,{'3.1':'N','3.2':'N','3.3':'Y','3.4':'Y'},'High'],
  [4,{'4.1':'Y'},'High'],[4,{'4.1':'N','4.2':'N','4.3':'PN','4.4':'NA','4.5':'NA'},'Low'],[4,{'4.1':'N','4.2':'NI','4.3':'N'},'Some concerns'],[4,{'4.1':'N','4.2':'N','4.3':'Y','4.4':'Y','4.5':'Y'},'High'],
  [5,{'5.1':'Y','5.2':'N','5.3':'N'},'Low'],[5,{'5.1':'NI','5.2':'N','5.3':'N'},'Some concerns'],[5,{'5.1':'Y','5.2':'Y','5.3':'N'},'High']
 ])assert.equal(raw(d,a,aim),result,`D${d} ${JSON.stringify(a)} ${aim}`);
});
test('Exhaustive equivalence to independently translated original VBA, including blanks and NA',()=>{
 const values=['Y','PY','PN','N','NI','NA',''];let tested=0;
 for(const [d,aim] of [[1,'ITT'],[2,'ITT'],[2,'PP'],[3,'ITT'],[4,'ITT'],[5,'ITT']]){
  const ids=Object.keys(QUESTIONS).filter(k=>k.startsWith(d+'.')&&!(aim==='PP'&&k==='2.7'));
  const count=values.length**ids.length;
  for(let index=0;index<count;index++){
   let n=index;const answers={},env={'ComboBox13.Value':aim==='PP'?PP:ITT,'Question21.Value':'question'};
   for(const id of ids){const value=values[n%values.length];n=Math.floor(n/values.length);answers[id]=value;env[`Ans${id.replace('.','')}.Value`]=value;}
   assert.equal(runRule(rules,d,answers,aim),legacy[d](env),`D${d} ${aim}: ${JSON.stringify(answers)}`);tested++;
  }
 }
 for(let i=0;i<4**5;i++){
  let n=i;const env={},judgements=[];
  for(let d=1;d<=5;d++){const value=['Low','Some concerns','High',''][n%4];n=Math.floor(n/4);judgements.push(value);env[`Judge${d}.Value`]=value;}
  assert.equal(runRule(rules,6,{},'ITT',judgements),legacy[6](env));tested++;
 }
 console.log(`Verified ${tested.toLocaleString('en-US')} response combinations against original VBA statements.`);
});
test('Guided flow, completed evaluation and pending safeguards',()=>{
 const s=createAssessment({studyId:'Trial 2025',outcome:'Outcome at 4 weeks',answers:lowAnswers});const r=assess(s,rules);
 assert.deepEqual(r.finals,Array(6).fill('Low'));assert.deepEqual(completionIssues(s,rules),[]);
 assert.equal(r.states['2.3'],'skip');assert.equal(r.answers['2.3'],'NA');assert.equal(r.states['2.7'],'skip');assert.equal(r.states['4.5'],'skip');
 const draft=createAssessment({answers:{'1.2':'N'}});assert.equal(assess(draft,rules).suggestions[0],'High');assert.equal(assess(draft,rules).finals[0],null);
 const ni=createAssessment({answers:{'3.1':'N','3.2':'NI'}});assert.equal(questionStates(ni).answers['3.3'],'NA');assert.equal(assess(ni,rules).suggestions[2],null);
 const unblind=createAssessment({answers:{'2.1':'Y'}});assert.equal(questionStates(unblind).states['2.3'],'active');
 const pp=createAssessment({aim:'PP',scopes:[],answers:{'2.1':'Y','2.2':'Y'}});assert.equal(questionStates(pp).answers['2.4'],'NA');assert.equal(assess(pp,rules).finals[1],'Low');
});
test('Manual judgments require justification to complete',()=>{
 const s=createAssessment({studyId:'Test',outcome:'O',answers:lowAnswers,overrides:{1:'High'}});assert(completionIssues(s,rules).some(x=>x.startsWith('D1: justifique')));
 s.domainNotes[1]='Reason with supporting study evidence';assert.deepEqual(completionIssues(s,rules),[]);assert.equal(assess(s,rules).finals[5],'High');
});
test('Weighted proportions use all weights, separate aims, and final judgments',()=>{
 const a=createAssessment({aim:'ITT',weight:1,overrides:{1:'Low'}}),b=createAssessment({aim:'ITT',weight:3,overrides:{1:'High'}}),c=createAssessment({aim:'ITT',weight:6}),d=createAssessment({aim:'PP',weight:9,overrides:{1:'Low'}});
 const stats=summary([a,b,c,d],rules);assert.equal(stats.n,3);assert.equal(stats.total,10);assert.deepEqual(stats.rows[0].pct,[10,0,30]);assert.equal(stats.rows[0].unknown,60);
 assert.deepEqual(summary([a,b,c,d],rules,{aim:'PP'}).rows[0].pct,[100,0,0]);assert.deepEqual(summary([a,b,c],rules,{weighted:false}).rows[0].pct,[33.3,0,33.3]);
 assert.equal(summary([createAssessment({weight:0})],rules).rows[0].unknown,100);
});
test('Source seed and CSV Results / Summary round-trip',async()=>{
 const s=fromResults(model.seed,model);assert.equal(s.uniqueId,'AAA');assert.equal(s.studyId,'X');assert.equal(s.overrides[1],'High');assert.equal(s.answers['1.2'],'PN');
 const complete=createAssessment({uniqueId:'ROB-001',studyId:'A; B "C"',outcome:'Line1\nLine2',weight:2.5,answers:lowAnswers,notes:{'1.1':'Evidence at page 3','1.2':'Allocation page 4'},domainNotes:{1:'Text\nNew line'}});
 const cols=Array.from({length:85},(_,i)=>colName(i));const c=toResults(complete,rules,model);const text=encodeCSV([cols.map(k=>model.resultHeaders[k]),cols.map(k=>c[k]||'')]);
 const records=await importFile({name:'test.csv',size:text.length,text:async()=>text},model);assert.equal(records.studies[0].studyId,complete.studyId);assert.equal(records.studies[0].outcome,complete.outcome);assert.equal(records.studies[0].weight,2.5);assert.equal(records.studies[0].overrides[1],'Low');assert.equal(parseCSV(text)[0].length,85);
 assert.deepEqual(assess(records.studies[0],rules).finals,Array(6).fill('Low'));
 assert.equal(toSummary(complete,rules,model).length,23);assert.equal(model.resultHeaders.CG,'6.0 Note for optional question');
});
test('Native ZIP reads the actual supplied XLSM without evaluating macros',async t=>{
 const path=process.env.ROB2_FIXTURE||new URL('./fixtures/original.xlsm',import.meta.url);
 if(!fs.existsSync(path)){t.skip('Opcional: informe ROB2_FIXTURE com o caminho da planilha original.');return;}
 const source=fs.readFileSync(path);const z=await readZip(source.buffer.slice(source.byteOffset,source.byteOffset+source.byteLength));assert(z['xl/workbook.xml'].includes('Results'));assert(z['xl/sharedStrings.xml']);assert.equal(z['xl/vbaProject.bin'],undefined);assert(z['xl/worksheets/sheet2.xml'].includes('r="B3"'));
});
test('SVG exports contain exact Excel colors and escape external study text',()=>{
 const s=createAssessment({studyId:'<script>alert(1)</script>',outcome:'A & B',overrides:{1:'Low'}});const traffic=trafficSVG([s],rules);assert(!traffic.includes('<script>'));assert(traffic.includes('&lt;script&gt;'));assert(traffic.includes('#92D050'));const graph=summarySVG([s],rules);assert(graph.includes('#FFFF00'));assert(graph.includes('#FF0000'));assert(graph.includes('Sem julgamento'));
});
test('JSON validation and unsafe weights are rejected',()=>{
 assert.throws(()=>normalizeStudy({weight:-3}));assert.throws(()=>normalizeStudy({weight:'abc'}));const s=normalizeStudy({answers:{'1.1':'X'},overrides:{1:'invalid'}});assert.equal(s.answers['1.1'],undefined);assert.equal(s.overrides[1],undefined);
});
