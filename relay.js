'use strict';
const crypto=require('crypto');
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=crypto.randomInt(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const relaySettings={watch:[5,10,15,20,30],draw:[30,60,90,120]};
function createRelay({send,broadcast,sync,online}) {
 function state(r,p){const x=r.relay;if(!x)return null;const current=x.order[x.step];const active=p.id===current;const view=x.stage==='view'&&active;const drawing=x.stage==='draw'&&active;const guessing=(x.stage==='guess'||x.stage==='guessInput')&&active;return {stage:x.stage,step:x.step,total:x.order.length,active,view,drawing,guessing,deadline:x.deadline,strokes:(view||drawing||guessing)?x.strokes:[],finished:x.stage==='result',word:x.stage==='result'?x.word:null,guess:x.stage==='result'?x.guess:null,participant:x.order.indexOf(p.id)+1};}
 function tell(r){for(const p of r.players.values())send(p.ws,{type:'relay',state:state(r,p)});}
 function schedule(r,ms,fn){clearTimeout(r.timer);r.relay.deadline=Date.now()+ms;r.timer=setTimeout(fn,ms);tell(r);}
 function end(r,reason){const x=r.relay;if(!x||x.stage==='result')return;x.stage='result';x.deadline=0;clearTimeout(r.timer);broadcast(r,{type:'notice',text:reason});tell(r);r.phase='finished';sync(r);}
 function beginStep(r){const x=r.relay;if(!x)return;if(x.step>=x.order.length){end(r,'接龙结束');return}x.strokes=x.previous; x.previous=[];x.stage=x.step===0?'draw':x.step===x.order.length-1?'guess':'view';sync(r);if(x.stage==='draw'){send(r.players.get(x.order[0])?.ws,{type:'secret',word:x.word});schedule(r,r.drawSeconds*1000,()=>advance(r));}else if(x.stage==='guess'){schedule(r,r.watchSeconds*1000,()=>{x.strokes=[];x.stage='guessInput';tell(r);schedule(r,60000,()=>end(r,'最后猜词时间结束'))})}else schedule(r,r.watchSeconds*1000,()=>{x.strokes=[];x.stage='draw';tell(r);schedule(r,r.drawSeconds*1000,()=>advance(r))});}
 function advance(r){const x=r.relay;if(!x||x.stage!=='draw')return;x.previous=x.strokes.slice();x.strokes=[];x.step++;beginStep(r)}
 function start(r,bank){const ps=online(r);if(ps.length<3)return false;const order=shuffle(ps.map(p=>p.id));r.relay={order,step:0,stage:'draw',strokes:[],previous:[],word:bank[crypto.randomInt(bank.length)],guess:null,deadline:0};r.phase='relay';r.round=1;r.drawer=order[0];r.strokes=[];sync(r);beginStep(r);return true}
 function handle(r,p,m){const x=r.relay;if(!x||r.phase!=='relay')return false;const current=x.order[x.step];if(p.id!==current)return true;if(m.type==='relayGuess'&&x.stage==='guessInput'){const guess=String(m.text||'').trim().slice(0,80);if(!guess)return true;x.guess=guess;const correct=guess.replace(/\s/g,'').toLowerCase()===x.word.replace(/\s/g,'').toLowerCase();if(correct)p.score+=200;end(r,correct?'最终猜对！':'最终答案未猜中');return true}if(m.type==='draw'&&x.stage==='draw'&&x.strokes.length<12000){const s=m.stroke;if(!s||![s.a?.x,s.a?.y,s.b?.x,s.b?.y].every(n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=1)||!/^#[0-9a-f]{6}$/i.test(s.color)||!(s.width>=1&&s.width<=32))return true;x.strokes.push(s);return true}if(m.type==='clear'&&x.stage==='draw'){x.strokes=[];tell(r);return true}return true}
 function departure(r,id){if(r.phase==='relay'&&r.relay?.order.includes(id))end(r,'参与者离开，接龙提前结束')}
 return {state,tell,start,handle,departure,relaySettings};
}
module.exports={createRelay};
