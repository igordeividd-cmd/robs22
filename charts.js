import {DOMAINS,LABELS,summary,assess} from './core.js';
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const colors=['#92D050','#FFFF00','#FF0000'];
const riskIndex=v=>['Low','Some concerns','High'].indexOf(v);
const symbols=['+','!','−'];
export function summarySVG(studies,rules,options={}){
 const r=summary(studies,rules,options),aim=options.aim||'ITT',w=1040,h=490,left=302,plot=682,top=108,rowH=43;
 let svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Gráfico de proporções de risco de viés, ${aim}" style="font-family:Arial,sans-serif"><rect width="${w}" height="${h}" fill="white"/><text x="32" y="35" font-size="20" font-weight="700" fill="#203b34">Risco de viés — ${aim}</text><text x="32" y="59" font-size="12" fill="#61716b">${r.n} avaliação(ões) · ${options.basis==='algorithm'?'Sugestões do algoritmo':'Julgamentos finais'} · ${options.weighted===false?'Pesos iguais':`Ponderado · soma dos pesos: ${r.total.toLocaleString('pt-BR')}`}</text>`;
 for(let i=0;i<=4;i++){const x=left+i*plot/4;svg+=`<line x1="${x}" y1="91" x2="${x}" y2="365" stroke="#e5eae7"/><text x="${x}" y="385" text-anchor="middle" font-size="11" fill="#64726b">${i*25}%</text>`;}
 r.rows.forEach((row,d)=>{
  const y=top+d*rowH;svg+=`<text x="32" y="${y+18}" font-size="13" fill="#31483f">${d<5?`D${d+1} · ${DOMAINS[d].short}`:'Julgamento global'}</text><rect x="${left}" y="${y}" width="${plot}" height="29" fill="#e9edeb" rx="2"/>`;
  let x=left;
  row.values.forEach((v,i)=>{const width=r.total>0?v/r.total*plot:0;if(width>0)svg+=`<rect x="${x}" y="${y}" width="${width}" height="29" fill="${colors[i]}"/><title>${LABELS[['Low','Some concerns','High'][i]]}: ${row.pct[i]}%</title>${width>49?`<text x="${x+width/2}" y="${y+19}" text-anchor="middle" font-size="11" font-weight="600" fill="${i===2?'white':'#15291d'}">${row.pct[i].toLocaleString('pt-BR')}%</text>`:''}`;x+=width;});
  if(row.unknown>12)svg+=`<text x="${x+(left+plot-x)/2}" y="${y+19}" text-anchor="middle" font-size="11" fill="#64726b">${r.n?'Sem julgamento':'Sem avaliações'}</text>`;
 });
 const labels=['Baixo risco','Algumas preocupações','Alto risco','Sem julgamento'];
 [32,213,471,653].forEach((x,i)=>svg+=`<rect x="${x}" y="420" width="12" height="12" rx="2" fill="${[...colors,'#e9edeb'][i]}"/><text x="${x+20}" y="430" font-size="12" fill="#40574b">${labels[i]}</text>`);
 svg+=`<text x="32" y="465" font-size="11" fill="#7c8982">Percentuais com uma casa decimal. O denominador inclui os pesos de todas as avaliações deste efeito.</text></svg>`;return svg;
}
export function trafficSVG(studies,rules,options={}){
 const list=studies.filter(s=>s.aim===(options.aim||'ITT')),height=Math.max(280,196+list.length*48),width=1040,left=520;
 let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Semáforo de risco de viés por avaliação" style="font-family:Arial,sans-serif"><rect width="${width}" height="${height}" fill="white"/><text x="32" y="34" font-size="20" font-weight="700" fill="#203b34">Risco de viés por avaliação — ${options.aim||'ITT'}</text><text x="32" y="57" font-size="12" fill="#61716b">${list.length} avaliação(ões) · ${options.basis==='algorithm'?'Sugestões do algoritmo':'Julgamentos finais'}</text><rect x="24" y="78" width="992" height="37" rx="4" fill="#f1f5f2"/><text x="40" y="101" font-size="12" font-weight="600" fill="#536b60">ESTUDO / DESFECHO</text>`;
 for(let i=0;i<6;i++)s+=`<text x="${left+i*78}" y="101" text-anchor="middle" font-size="12" font-weight="600" fill="#536b60">${i<5?`D${i+1}`:'Global'}</text>`;
 list.forEach((a,i)=>{
  const y=143+i*48,result=assess(a,rules),values=options.basis==='algorithm'?result.suggestions:result.finals;
  const label=a.studyId||a.uniqueId||'Sem identificação',sub=[a.uniqueId,a.outcome||'Desfecho não informado',a.status!=='completed'?'rascunho':''].filter(Boolean).join(' · ');
  s+=`<text x="40" y="${y-1}" font-size="13" font-weight="600" fill="#243d31">${esc(label.length>53?label.slice(0,50)+'…':label)}</text><text x="40" y="${y+15}" font-size="10" fill="#76847c">${esc(sub.length>70?sub.slice(0,67)+'…':sub)}</text><line x1="32" y1="${y+26}" x2="1008" y2="${y+26}" stroke="#edf0ed"/>`;
  values.forEach((v,j)=>{const n=riskIndex(v),x=left+j*78;s+=`<circle cx="${x}" cy="${y+2}" r="13" fill="${n>=0?colors[n]:'#e9edeb'}"/><text x="${x}" y="${y+7}" text-anchor="middle" font-size="17" font-weight="700" fill="${n===2?'white':'#243d31'}">${n>=0?symbols[n]:'·'}</text><title>${esc(label)} · ${j<5?'D'+(j+1):'Global'}: ${v?LABELS[v]:'Sem julgamento'}</title>`;});
 });
 if(!list.length)s+=`<text x="520" y="161" text-anchor="middle" font-size="14" fill="#76847c">Nenhuma avaliação para este efeito de interesse.</text>`;
 const y=height-42;[40,224,496,680].forEach((x,i)=>s+=`<circle cx="${x}" cy="${y}" r="9" fill="${[...colors,'#e9edeb'][i]}"/><text x="${x}" y="${y+4}" text-anchor="middle" font-size="12" font-weight="700" fill="${i===2?'white':'#243d31'}">${[...symbols,'·'][i]}</text><text x="${x+17}" y="${y+4}" font-size="12" fill="#40574b">${['Baixo risco','Algumas preocupações','Alto risco','Sem julgamento'][i]}</text>`);
 return s+'</svg>';
}
export async function svgPNG(svg,filename,download){
 const blob=new Blob([svg],{type:'image/svg+xml'}),url=URL.createObjectURL(blob);
 try{const image=new Image();await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=url;});const canvas=document.createElement('canvas');const vb=svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);canvas.width=Number(vb[1])*3;canvas.height=Number(vb[2])*3;const ctx=canvas.getContext('2d');ctx.fillStyle='white';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);const b=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!b)throw new Error('Não foi possível criar o PNG.');download(filename,b);}
 finally{URL.revokeObjectURL(url);}
}
