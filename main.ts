// Tiny stack VM (make.fun tiny-stack-vm-01): answers /input/i001..i040,
// writes /output/<id>/stdout.bin + exit.txt. Plain Node 22, no deps.
import fs from 'node:fs';
// Binary ops 0x10..0x22 as (a,b)->r; holes at 0x17, 0x1b (unary) and 0x1f.
const F=[(a,b)=>(a+b)|0,(a,b)=>(a-b)|0,(a,b)=>Math.imul(a,b),(a,b)=>(a/b)|0,(a,b)=>(a%b)|0,
(a,b)=>((a>>>0)/(b>>>0))|0,(a,b)=>((a>>>0)%(b>>>0))|0,0,(a,b)=>a&b,(a,b)=>a|b,(a,b)=>a^b,
0,(a,b)=>a<<b,(a,b)=>a>>b,(a,b)=>(a>>>b)|0,0,(a,b)=>a===b?1:0,(a,b)=>a<b?1:0,(a,b)=>(a>>>0)<(b>>>0)?1:0];
for(let i=1;i<=40;i++){
const id='i'+String(i).padStart(3,'0');
const p=fs.readFileSync('/input/'+id+'/program.bin'),q=fs.readFileSync('/input/'+id+'/input.bin');
const S=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),O=[];
let sp=0,cp=0,pc=0,n=0,ip=0,ol=0,code=-1;
while(code<0){
if(n>=1e6){code=10;break}
if(pc<0||pc>=p.length){code=9;break}
const op=p[pc];
const k=op<8||op>=0x10&&op<=0x22||op>=0x30&&op<=0x34||op===0x40||op===0x41||op>=0x50&&op<=0x53;
if(!k){code=5;break}
const L=op===1?1:op===2?4:op>=0x30&&op<=0x33?2:0;
if(pc+1+L>p.length){code=9;break}
n++;
const lo=p[pc+1],hi=p[pc+2];
// Stack contract: nd popped, ps pushed; underflow (2) checked before overflow (3).
let nd=0,ps=0;
if(op>=0x10&&op<=0x22){nd=2;ps=1;if(op===0x17||op===0x1b)nd=1}
else if(op===3||op===0x31||op===0x32||op===0x50||op===0x51||op===0x53)nd=1;
else if(op===0x41)nd=2;
else if(op===5){nd=2;ps=2}
else if(op===7){nd=3;ps=3}
else if(op===4){nd=1;ps=2}
else if(op===6){nd=2;ps=3}
else if(op===1||op===2||op===0x52)ps=1;
else if(op===0x40){nd=1;ps=1}
if(sp<nd){code=2;break}
if(sp-nd+ps>256){code=3;break}
switch(op){
case 0:code=0;break;
case 1:S[sp++]=(lo<<24)>>24;pc+=2;break;
case 2:S[sp++]=lo|hi<<8|p[pc+3]<<16|p[pc+4]<<24;pc+=5;break;
case 3:sp--;pc++;break;
case 4:S[sp]=S[sp-1];sp++;pc++;break;
case 5:{const t=S[sp-1];S[sp-1]=S[sp-2];S[sp-2]=t}pc++;break;
case 6:S[sp]=S[sp-2];sp++;pc++;break;
case 7:{const t=S[sp-3];S[sp-3]=S[sp-2];S[sp-2]=S[sp-1];S[sp-1]=t}pc++;break;
case 0x10:case 0x11:case 0x12:case 0x13:case 0x14:case 0x15:case 0x16:case 0x18:case 0x19:case 0x1a:case 0x1c:case 0x1d:case 0x1e:case 0x20:case 0x21:case 0x22:{
const b=S[sp-1],a=S[sp-2];
if(op>=0x13&&op<=0x16&&b===0){code=4;break}
S[sp-2]=F[op-0x10](a,b);sp--;pc++;break}
case 0x17:S[sp-1]=(-S[sp-1])|0;pc++;break;
case 0x1b:S[sp-1]=~S[sp-1];pc++;break;
case 0x30:pc=pc+3+(((lo|hi<<8)<<16)>>16);break;
case 0x31:case 0x32:{const v=S[--sp],o=((lo|hi<<8)<<16)>>16;pc=(op===0x31?v===0:v!==0)?pc+3+o:pc+3;break}
case 0x33:if(cp>=64){code=7;break}C[cp++]=pc+3;pc=lo|hi<<8;break;
case 0x34:if(cp===0){code=8;break}pc=C[--cp];break;
case 0x40:{const a=S[sp-1];if(a<0||a>255){code=6;break}S[sp-1]=M[a];pc++;break}
case 0x41:{const a=S[sp-1],v=S[sp-2];if(a<0||a>255){code=6;break}M[a]=v;sp-=2;pc++;break}
case 0x50:{const s=String(S[--sp]);if(ol+s.length>65536){code=11;break}for(let j=0;j<s.length;j++)O.push(s.charCodeAt(j));ol+=s.length;pc++;break}
case 0x51:if(ol+1>65536){code=11;break}O.push(S[--sp]&255);ol++;pc++;break;
case 0x52:S[sp++]=ip<q.length?q[ip++]:-1;pc++;break;
case 0x53:code=S[--sp]&255;break;
}
}
fs.mkdirSync('/output/'+id,{recursive:true});
fs.writeFileSync('/output/'+id+'/stdout.bin',Buffer.from(O));
fs.writeFileSync('/output/'+id+'/exit.txt',String(code));
}
