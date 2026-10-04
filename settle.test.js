const assert=require('assert');
const settle=require('./settle.js');
const P=['霸子','華哲','裝逼','拓也'];
const E=[['華哲',330],['華哲',135],['華哲',75],['裝逼',135],['霸子',600],['霸子',254],['霸子',900],['霸子',620],['霸子',215],['裝逼',130],['裝逼',100]].map(([payer,amount])=>({payer,amount}));
const r=settle(E,P);

assert.strictEqual(r.total,3494);
P.forEach(p=>assert.strictEqual(r.share[p],873.5));
// invariants: balances sum 0; applying transfers zeroes everyone
const bal={...r.balance};
assert.strictEqual(Math.round(Object.values(bal).reduce((a,b)=>a+b,0)*100)+0,0);
r.transfers.forEach(t=>{bal[t.from]+=t.amount;bal[t.to]-=t.amount;});
P.forEach(p=>assert.strictEqual(Math.round(bal[p]*100)+0,0));
assert(r.transfers.length<=P.length-1);
// random fuzz
for(let k=0;k<2000;k++){
  const es=[...Array(1+Math.floor(Math.random()*15))].map(()=>({payer:P[Math.floor(Math.random()*4)],amount:Math.round(Math.random()*100000)/100}));
  const x=settle(es,P), b={...x.balance};
  const sumShare=Math.round(P.reduce((a,p)=>a+x.share[p]*100,0));
  assert.strictEqual(sumShare,Math.round(x.total*100));
  x.transfers.forEach(t=>{assert(t.amount>0);b[t.from]+=t.amount;b[t.to]-=t.amount;});
  P.forEach(p=>assert.strictEqual(Math.round(b[p]*100)+0,0));
  assert(x.transfers.length<=3);
}
assert.throws(()=>settle([{payer:'路人',amount:1}],P));
console.log('ALL TESTS PASS');
