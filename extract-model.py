"""Extract an auditable, restricted decision AST from the supplied VBA. No VBA is executed."""
import json, re, hashlib, os
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
ANALYSIS=Path(os.environ.get('ROB2_ANALYSIS_DIR', str(ROOT/'analysis')))
WORKBOOK=Path(os.environ.get('ROB2_FIXTURE', str(ROOT/'tests/fixtures/original.xlsm')))
TOK=re.compile(r'"[^"]*"|<>|=|\(|\)|\bAnd\b|\bOr\b|[A-Za-z][A-Za-z0-9.]*')

def expression(text):
    tokens=TOK.findall(text); pos=0
    def atom():
        nonlocal pos
        t=tokens[pos]; pos+=1
        if t=='(':
            value=or_expr(); assert tokens[pos]==')'; pos+=1; return value
        return ['literal',t[1:-1]] if t.startswith('"') else ['get',t]
    def comparison():
        nonlocal pos
        left=atom()
        if pos<len(tokens) and tokens[pos] in ['=','<>']:
            op=tokens[pos]; pos+=1; return [op,left,atom()]
        return left
    def and_expr():
        nonlocal pos
        value=comparison()
        while pos<len(tokens) and tokens[pos]=='And':
            pos+=1; value=['and',value,comparison()]
        return value
    def or_expr():
        nonlocal pos
        value=and_expr()
        while pos<len(tokens) and tokens[pos]=='Or':
            pos+=1; value=['or',value,and_expr()]
        return value
    value=or_expr(); assert pos==len(tokens),text
    return value

def parse_proc(source,number):
    block=re.search(rf'Private Sub SugButton{number}_Click\(\)(.*?)End Sub',source,re.S).group(1)
    lines=[line.strip() for line in block.splitlines()]
    tree=[]; current=tree; stack=[]
    for line in lines:
        if not line or line.startswith("'") or line.startswith(('Dim ','MsgBox ')) or '.BackColor' in line:continue
        if line.startswith('If ') and line.endswith(' Then'):
            node={'if':expression(line[3:-5]),'then':[],'else':[]};current.append(node);stack.append((node,current));current=node['then']
        elif line.startswith('ElseIf ') and line.endswith(' Then'):
            parent,outer=stack[-1]
            node={'if':expression(line[7:-5]),'then':[],'else':[]};parent['else'].append(node);stack[-1]=(node,outer);current=node['then']
        elif line=='Else':current=stack[-1][0]['else']
        elif line=='End If':_,current=stack.pop()
        elif line.startswith('Select Case '):
            node={'select':expression(line[12:]),'cases':[]};current.append(node);stack.append((node,current))
        elif line.startswith('Case '):
            node=stack[-1][0]; case={'value':expression(line[5:]),'body':[]};node['cases'].append(case);current=case['body']
        elif line=='End Select':_,current=stack.pop()
        elif re.match(r'\w+(?:\.\w+)?\s*=',line):
            key,value=line.split('=',1);current.append({'set':key.strip(),'value':expression(value.strip())})
        else:raise ValueError(line)
    assert not stack
    return tree,block

source=(ANALYSIS/'UserForm3.vba').read_text(); second=(ANALYSIS/'UserForm4.vba').read_text()
rules={};blocks=[]
for n in range(1,7):
    ast,block=parse_proc(source,n)
    assert ast==parse_proc(second,n)[0]
    rules[str(n)]=ast;blocks.append(f'Private Sub SugButton{n}_Click()'+block+'End Sub')
(ROOT/'dist'/'rules.json').write_text(json.dumps(rules,ensure_ascii=False,separators=(',',':')))
(ROOT/'reference').mkdir(exist_ok=True)
(ROOT/'reference'/'algorithm.vba').write_text('\n\n'.join(blocks))
book=json.loads((ANALYSIS/'workbook.json').read_text())
ft=next(s['cells'] for s in book['sheets'] if s['name']=='Function Tab')
question_en={}
for domain,col,length in [(1,'F',3),(2,'I',7),(3,'K',4),(4,'M',5),(5,'O',3)]:
    for n in range(1,length+1):question_en[f'{domain}.{n}']=ft[f'{col}{n}']['value']
pp={f'2.{n}':ft[f'H{n}']['value'] for n in range(1,7)}
results=next(s['cells'] for s in book['sheets'] if s['name']=='Results')
headers={re.sub(r'2$','',k):v['value'] for k,v in results.items() if re.match(r'^[A-Z]+2$',k)}
seed={re.sub(r'3$','',k):v['value'] for k,v in results.items() if re.match(r'^[A-Z]+3$',k)}
model={'version':'IRPG beta v9','sourceName':'ROB2_IRPG_beta_v9 (1)(2).xlsm','sourceSHA256':hashlib.sha256(WORKBOOK.read_bytes()).hexdigest(),'questionsEN':question_en,'questionsPP_EN':pp,'resultHeaders':headers,'seed':seed,'sources':[ft[f'B{n}']['value'] for n in range(1,13)],'directions':[ft[f'C{n}']['value'].strip() for n in range(1,7)],'scopes':[ft[f'S{n}']['value'] for n in range(1,4)]}
(ROOT/'dist'/'model.json').write_text(json.dumps(model,ensure_ascii=False,indent=2))
print('Extracted 6 decision trees; identical in both workbook assessment forms. Preserved 85 Results columns and seed record.')
