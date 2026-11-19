'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createRelay}=require('../relay');
test('relay requires four players and only first artist receives the secret',()=>{
 const sent=new Map(),players=new Map();
 for(let i=0;i<4;i++){const id='p'+i;const ws={id};players.set(id,{id,ws});sent.set(id,[])}
 const send=(ws,msg)=>sent.get(ws.id).push(msg);
 const broadcast=(r,msg)=>r.players.forEach(p=>send(p.ws,msg));
 const sync=()=>{};
 const relay=createRelay({send,broadcast,sync,online:r=>[...r.players.values()]});
 const room={players,phase:'lobby',drawSeconds:30,watchSeconds:15,round:0,strokes:[]};
 assert.equal(relay.start(room,['秘密词']),true);
 assert.equal(room.phase,'relay');
 const artist=room.relay.order[0];
 for(const p of players.values()){
   const events=sent.get(p.id);
   assert.equal(events.some(x=>x.type==='secret'),p.id===artist);
   const state=relay.state(room,p);
   assert.equal(state.word,null);
   assert.equal(state.strokes.length,0);
 }
 clearTimeout(room.timer);
});
test('relay cannot start with fewer than three',()=>{
 const players=new Map([['a',{id:'a',ws:{}}],['b',{id:'b',ws:{}}],]);
 const relay=createRelay({send:()=>{},broadcast:()=>{},sync:()=>{},online:r=>[...r.players.values()]});
 assert.equal(relay.start({players},['词']),false);
});
