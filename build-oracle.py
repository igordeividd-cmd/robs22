"""Generate test-only legacy functions independently from the raw VBA statements."""
import re
from pathlib import Path
root=Path(__file__).resolve().parents[1]
source=(root/'reference/algorithm.vba').read_text()
def exp(text):
    # Keep string literals untouched; VBA And has precedence over Or, as in JS.
    parts=re.split(r'("[^"]*")',text)
    for i in range(0,len(parts),2):
        p=parts[i]
        p=re.sub(r'\bAnd\b','&&',p);p=re.sub(r'\bOr\b','||',p)
        p=p.replace('<>','!==');p=re.sub(r'(?<![!<>=])=(?!=)','===',p)
        p=re.sub(r'\b(?:Ans\d+|Judge\d+|ComboBox13|Question21)\.Value\b',lambda m:'env['+repr(m.group())+']',p)
        parts[i]=p
    return ''.join(parts)
out=['// Test-only direct statement translation from reference/algorithm.vba.','export const legacy = {};']
for n in range(1,7):
    block=re.search(rf'Private Sub SugButton{n}_Click\(\)(.*?)End Sub',source,re.S).group(1)
    body=[];selection=None;cases=False
    for line in map(str.strip,block.splitlines()):
        if not line or line.startswith("'") or line.startswith(('Dim ','MsgBox ')) or '.BackColor' in line:continue
        if line.startswith('If ') and line.endswith(' Then'):body.append('if ('+exp(line[3:-5])+') {')
        elif line.startswith('ElseIf ') and line.endswith(' Then'):body.append('} else if ('+exp(line[7:-5])+') {')
        elif line=='Else':body.append('} else {')
        elif line=='End If':body.append('}')
        elif line.startswith('Select Case '):selection=exp(line[12:]);cases=False
        elif line.startswith('Case '):body.append(('} else if (' if cases else 'if (')+selection+' === '+exp(line[5:])+') {');cases=True
        elif line=='End Select':body.append('}');selection=None
        else:
            key,value=line.split('=',1);key=key.strip()
            body.append(('result' if key.startswith('SugButton') else key)+' = '+exp(value.strip())+';')
    out.append(f'legacy[{n}] = env => {{ let result="", Part1="", Part2="";\n'+ '\n'.join(body)+'\nreturn ["Low","Some concerns","High"].includes(result)?result:null;\n};')
(root/'tests'/'legacy-oracle.mjs').write_text('\n'.join(out))
print('Generated direct legacy oracle for the six original button handlers.')
