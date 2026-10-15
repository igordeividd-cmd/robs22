export const RISKS=['Low','Some concerns','High'];
export const LABELS={Low:'Baixo risco','Some concerns':'Algumas preocupações',High:'Alto risco'};
export const ITT="assignment to intervention (the 'intention-to-treat' effect)";
export const PP="adhering to intervention (the 'per-protocol' effect)";
export const ANSWERS=[['Y','Sim'],['PY','Provavelmente sim'],['PN','Provavelmente não'],['N','Não'],['NI','Sem informação']];
export const DOMAINS=[
 {id:1,title:'Processo de randomização',short:'Randomização',desc:'Sequência aleatória, sigilo da alocação e equilíbrio dos grupos na linha de base.',hint:'Diferencie a geração da sequência do sigilo da alocação. Diferenças basais devem sugerir um problema no processo, e não apenas ocorrer ao acaso.'},
 {id:2,title:'Desvios das intervenções pretendidas',short:'Desvios das intervenções',desc:'Conhecimento da intervenção, desvios e adequação da análise ao efeito de interesse.',hint:'O fluxo muda conforme o efeito de interesse: atribuição à intervenção (ITT) ou adesão à intervenção (PP). Registre a justificativa com base no estudo e no protocolo.'},
 {id:3,title:'Dados ausentes do desfecho',short:'Dados ausentes',desc:'Disponibilidade dos dados e relação entre as perdas e o verdadeiro valor do desfecho.',hint:'Avalie as perdas para o resultado específico. A proporção de dados ausentes, isoladamente, não define o risco de viés.'},
 {id:4,title:'Mensuração do desfecho',short:'Mensuração do desfecho',desc:'Adequação da medida e possível influência do conhecimento da intervenção.',hint:'Considere quem avaliou o desfecho, como a medida foi obtida e se o conhecimento da intervenção poderia influenciar a avaliação.'},
 {id:5,title:'Seleção do resultado relatado',short:'Seleção do resultado',desc:'Plano de análise prévio, múltiplas medidas e múltiplas análises elegíveis.',hint:'Compare o resultado relatado com o protocolo, o registro e o plano de análise, quando disponíveis. As perguntas 5.2 e 5.3 tratam da seleção em função dos resultados.'}
];
export const QUESTIONS={
 '1.1':'A sequência de alocação foi aleatória?',
 '1.2':'A sequência de alocação foi mantida oculta até que os participantes fossem incluídos e alocados às intervenções?',
 '1.3':'As diferenças basais entre os grupos de intervenção sugeriram um problema no processo de randomização?',
 '2.1':'Os participantes sabiam qual intervenção lhes havia sido atribuída durante o ensaio?',
 '2.2':'Os cuidadores e as pessoas que forneceram as intervenções sabiam qual intervenção havia sido atribuída aos participantes?',
 '2.3':'Houve desvios das intervenções pretendidas que surgiram em razão do contexto do ensaio?',
 '2.4':'Esses desvios provavelmente afetaram o desfecho?',
 '2.5':'Esses desvios das intervenções pretendidas foram equilibrados entre os grupos?',
 '2.6':'Foi utilizada uma análise apropriada para estimar o efeito da atribuição à intervenção?',
 '2.7':'A falha em analisar os participantes no grupo para o qual foram randomizados teve potencial para causar um impacto substancial no resultado?',
 '3.1':'Os dados deste desfecho estavam disponíveis para todos, ou quase todos, os participantes randomizados?',
 '3.2':'Há evidências de que o resultado não foi enviesado pela ausência de dados do desfecho?',
 '3.3':'A ausência de dados do desfecho poderia depender de seu verdadeiro valor?',
 '3.4':'É provável que a ausência de dados do desfecho tenha dependido de seu verdadeiro valor?',
 '4.1':'O método de mensuração do desfecho foi inadequado?',
 '4.2':'A mensuração ou a determinação do desfecho poderia ter diferido entre os grupos de intervenção?',
 '4.3':'Os avaliadores do desfecho sabiam qual intervenção os participantes receberam?',
 '4.4':'A avaliação do desfecho poderia ter sido influenciada pelo conhecimento da intervenção recebida?',
 '4.5':'É provável que a avaliação do desfecho tenha sido influenciada pelo conhecimento da intervenção recebida?',
 '5.1':'Os dados que produziram este resultado foram analisados de acordo com um plano de análise pré-especificado, finalizado antes que dados não cegos do desfecho estivessem disponíveis para análise?',
 '5.2':'O resultado numérico avaliado provavelmente foi selecionado, com base nos resultados, entre múltiplas mensurações elegíveis do desfecho (escalas, definições ou momentos de avaliação)?',
 '5.3':'O resultado numérico avaliado provavelmente foi selecionado, com base nos resultados, entre múltiplas análises elegíveis dos dados?'
};
export const PP_QUESTIONS={
 '2.3':'As intervenções importantes não previstas no protocolo foram equilibradas entre os grupos?',
 '2.4':'Houve falhas na implementação da intervenção que poderiam ter afetado o desfecho?',
 '2.5':'Houve falta de adesão ao regime de intervenção atribuído que poderia ter afetado os desfechos dos participantes?',
 '2.6':'Foi utilizada uma análise apropriada para estimar o efeito da adesão à intervenção?'
};
export const SOURCE_LABELS=['Artigo(s) do estudo','Protocolo do ensaio','Plano de análise estatística (SAP)','Registro público do ensaio','Registro do patrocinador','Literatura cinzenta / tese','Resumo de congresso','Documento regulatório','Solicitação ao comitê de ética','Registro de financiamento','Contato com pesquisador','Contato com patrocinador'];
export const SCOPES=[['nonprotocol','Intervenções não previstas no protocolo'],['implementation','Falhas na implementação da intervenção'],['adherence','Não adesão à intervenção atribuída']];
const yes=v=>['Y','PY'].includes(v), no=v=>['N','PN'].includes(v), uncertain=v=>['Y','PY','NI'].includes(v), negative=v=>['N','PN','NI'].includes(v);
export const questionIds=aim=>Object.keys(QUESTIONS).filter(id=>!(aim==='PP'&&id==='2.7'));
export function createAssessment(existing={}){
 return {id:globalThis.crypto?.randomUUID?.()||`rob-${Date.now()}-${Math.random().toString(36).slice(2)}`,uniqueId:'',reviewer:'',studyId:'',reference:'',experimental:'',comparator:'',outcome:'',result:'',aim:'ITT',scopes:SCOPES.map(s=>s[0]),weight:1,sources:[],answers:{},notes:{},overrides:{},domainNotes:{},directions:{},directionNotes:{},status:'draft',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),...existing};
}
export function questionStates(s){
 const states={},a={};
 const put=(id,state='active')=>{states[id]=state;a[id]=state==='skip'?'NA':state==='active'?(s.answers[id]||''):'';};
 const cond=(id,parent,test)=>put(id,parent==='NA'?'skip':!parent?'wait':test(parent)?'active':'skip');
 for(const id of ['1.1','1.2','1.3','2.1','2.2'])put(id);
 const aware=uncertain(a['2.1'])||uncertain(a['2.2']);
 const blind=no(a['2.1'])&&no(a['2.2']);
 if(s.aim==='PP'){
   put('2.3',!s.scopes.includes('nonprotocol')?'skip':aware?'active':blind?'skip':'wait');
   put('2.4',s.scopes.includes('implementation')?'active':'skip');
   put('2.5',s.scopes.includes('adherence')?'active':'skip');
   const trigger=negative(a['2.3'])||uncertain(a['2.4'])||uncertain(a['2.5']);
   put('2.6',trigger?'active':['2.3','2.4','2.5'].every(k=>a[k])?'skip':'wait');
 }else{
   put('2.3',aware?'active':blind?'skip':'wait');
   cond('2.4',a['2.3'],yes);cond('2.5',a['2.4'],uncertain);put('2.6');cond('2.7',a['2.6'],negative);
 }
 put('3.1');cond('3.2',a['3.1'],negative);
 // Exactly follows Ans32_Change in the workbook: NI also disables 3.3.
 cond('3.3',a['3.2'],no);cond('3.4',a['3.3'],uncertain);
 put('4.1');put('4.2');
 put('4.3',yes(a['4.1'])||yes(a['4.2'])?'skip':negative(a['4.1'])&&negative(a['4.2'])?'active':'wait');
 cond('4.4',a['4.3'],uncertain);cond('4.5',a['4.4'],uncertain);
 for(const id of ['5.1','5.2','5.3'])put(id);
 return {states,answers:a};
}
function evalExpr(node,env){
 const [op,x,y]=node;
 if(op==='literal')return x;
 if(op==='get')return env[x]??'';
 if(op==='=')return evalExpr(x,env)===evalExpr(y,env);
 if(op==='<>')return evalExpr(x,env)!==evalExpr(y,env);
 if(op==='and')return Boolean(evalExpr(x,env)&&evalExpr(y,env));
 if(op==='or')return Boolean(evalExpr(x,env)||evalExpr(y,env));
 throw new Error('Unknown rule operator');
}
function execute(nodes,env){
 for(const n of nodes){
  if(n.if)execute(evalExpr(n.if,env)?n.then:n.else,env);
  else if(n.set)env[n.set]=evalExpr(n.value,env);
  else if(n.select){const v=evalExpr(n.select,env);const c=n.cases.find(c=>evalExpr(c.value,env)===v);if(c)execute(c.body,env);}
 }
}
// A restricted data interpreter, never eval / Function / VBA execution.
export function runRule(rules,domain,answers={},aim='ITT',judgements=[]){
 const env={'ComboBox13.Value':aim==='PP'?PP:ITT,'Question21.Value':'question'};
 for(const id of Object.keys(QUESTIONS))env[`Ans${id.replace('.','')}.Value`]=answers[id]||'';
 for(let i=0;i<5;i++)env[`Judge${i+1}.Value`]=judgements[i]||'';
 execute(rules[String(domain)],env);
 const result=env[`SugButton${domain}.Caption`];return RISKS.includes(result)?result:null;
}
export function assess(s,rules){
 const q=questionStates(s),suggestions=[],finals=[],domainComplete=[];
 for(let d=1;d<=5;d++){
  const ids=questionIds(s.aim).filter(k=>k.startsWith(d+'.'));
  const answered=ids.every(k=>q.states[k]==='skip'||(q.states[k]==='active'&&Boolean(q.answers[k])));
  const algorithm=runRule(rules,d,q.answers,s.aim);
  suggestions.push(algorithm);domainComplete.push(answered);
  finals.push(s.overrides[d]|| (answered?algorithm:null));
 }
 const overall=runRule(rules,6,{},s.aim,finals);
 suggestions.push(overall);finals.push(s.overrides[6]||(finals.every(Boolean)?overall:null));
 const ids=questionIds(s.aim).filter(k=>q.states[k]!=='skip');
 return {...q,suggestions,finals,domainComplete,total:ids.length,answered:ids.filter(k=>q.states[k]==='active'&&q.answers[k]).length};
}
export function completionIssues(s,rules){
 const r=assess(s,rules),issues=[];
 if(!s.studyId.trim())issues.push('Informe o identificador do estudo.');
 if(!s.outcome.trim())issues.push('Informe o desfecho e o momento de avaliação.');
 if(!Number.isFinite(Number(s.weight))||Number(s.weight)<0)issues.push('Informe um peso numérico maior ou igual a zero.');
 for(let d=1;d<=5;d++){
  if(!r.domainComplete[d-1]&&!s.overrides[d])issues.push(`D${d}: responda às perguntas aplicáveis ou registre um julgamento justificado.`);
  if(!r.finals[d-1])issues.push(`D${d}: defina o julgamento final.`);
 }
 for(let d=1;d<=6;d++)if(s.overrides[d]&&(!r.domainComplete[d-1]||s.overrides[d]!==r.suggestions[d-1])&&!s.domainNotes[d]?.trim())issues.push(`${d===6?'Global':`D${d}`}: justifique o julgamento do avaliador.`);
 if(!r.finals[5])issues.push('Defina o julgamento global.');
 return [...new Set(issues)];
}
export function summary(studies,rules,{aim='ITT',basis='final',weighted=true}={}){
 const list=studies.filter(s=>s.aim===aim), total=list.reduce((n,s)=>n+(weighted?Number(s.weight):1),0);
 return {n:list.length,total,rows:Array.from({length:6},(_,d)=>{
  const values=RISKS.map(r=>list.reduce((sum,s)=>sum+((basis==='algorithm'?assess(s,rules).suggestions:assess(s,rules).finals)[d]===r?(weighted?Number(s.weight):1):0),0));
  const pct=values.map(v=>total>0?Math.round((v/total)*1000)/10:0);
  return {domain:d+1,values,pct,unknown:total>0?Math.max(0,100-values.reduce((a,b)=>a+b,0)/total*100):100};
 })};
}
export function normalizeStudy(s){
 if(!s||typeof s!=='object'||Array.isArray(s))throw new Error('Registro de avaliação inválido.');
 const base=createAssessment();
 const textKeys=['id','uniqueId','reviewer','studyId','reference','experimental','comparator','outcome','result','createdAt','updatedAt'];
 for(const k of textKeys)if(typeof s[k]==='string')base[k]=s[k].slice(0,50000);
 base.aim=s.aim==='PP'?'PP':'ITT';
 base.weight=Number(s.weight??1);if(!Number.isFinite(base.weight)||base.weight<0)throw new Error('Peso inválido no arquivo.');
 base.sources=Array.isArray(s.sources)?s.sources.filter(x=>typeof x==='string'):[];
 base.scopes=Array.isArray(s.scopes)?s.scopes.filter(x=>SCOPES.some(c=>c[0]===x)):SCOPES.map(x=>x[0]);
 for(const k of Object.keys(QUESTIONS)){
   if(ANSWERS.some(x=>x[0]===s.answers?.[k]))base.answers[k]=s.answers[k];
   if(typeof s.notes?.[k]==='string')base.notes[k]=s.notes[k];
 }
 for(let d=1;d<=6;d++){
   if(RISKS.includes(s.overrides?.[d]))base.overrides[d]=s.overrides[d];
   for(const key of ['domainNotes','directions','directionNotes'])if(typeof s[key]?.[d]==='string')base[key][d]=s[key][d];
 }
 base.status=s.status==='completed'?'completed':'draft';base.imported=Boolean(s.imported);return base;
}
