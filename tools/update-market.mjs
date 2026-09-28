// Her akşam CoinGecko'dan piyasa değerlerini çeker, Coinlore ile karşılaştırır ve ertesi günün verisini iki sayfaya yazar.
// Sayfada bugünün verisi "prev" olarak kalır; gece yarısı sayfa kendiliğinden yeni güne geçer, gün içinde kadro değişmez.
import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const G=createRequire(import.meta.url)('./shared.cjs');
const FILES=['index.html','kampanyali.html'];
const BLOCK=/\/\*MARKET_DATA_BEGIN\*\/window\.STABLEX_MARKET=(.*?);\/\*MARKET_DATA_END\*\//s;
const MAX_SOURCE_GAP=0.30; // CoinGecko ile Coinlore arasında izin verilen en büyük fark
const sig=x=>Number(x.toPrecision(3));
const istDate=d=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'}).format(d);
const istHour=d=>Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Istanbul',hour:'2-digit',hour12:false}).format(d));
async function coingecko(){
  if(process.env.MARKET_FIXTURE)return JSON.parse(await readFile(process.env.MARKET_FIXTURE,'utf8'));
  const key=process.env.COINGECKO_API_KEY;if(!key)throw Error('COINGECKO_API_KEY tanımlı değil');
  const url=new URL('https://api.coingecko.com/api/v3/coins/markets');
  url.search=new URLSearchParams({vs_currency:'usd',ids:Object.values(G.LISTING).join(','),per_page:'250',page:'1',sparkline:'false'});
  const res=await fetch(url,{headers:{'x-cg-demo-api-key':key,accept:'application/json'},signal:AbortSignal.timeout(20000)});
  if(!res.ok)throw Error('CoinGecko yanıtı: '+res.status);
  return res.json();
}
async function coinlore(){
  if(process.env.COINLORE_FIXTURE)return JSON.parse(await readFile(process.env.COINLORE_FIXTURE,'utf8'));
  const out=new Map();
  for(const start of [0,100,200,300]){
    const res=await fetch(`https://api.coinlore.net/api/tickers/?start=${start}&limit=100`,{signal:AbortSignal.timeout(20000)});
    if(!res.ok)throw Error('Coinlore yanıtı: '+res.status);
    for(const r of (await res.json()).data||[]){const s=String(r.symbol).toUpperCase();if(!out.has(s))out.set(s,Number(r.market_cap_usd));}
  }
  return Object.fromEntries(out);
}
const now=new Date();
const target=/^\d{4}-\d{2}-\d{2}$/.test(process.env.TARGET_DATE||'')?process.env.TARGET_DATE:istHour(now)>=12?istDate(new Date(now.getTime()+864e5)):istDate(now);
const coins=G.normalizeMarkets(await coingecko()).filter(c=>!G.STABLE.includes(c.s));
if(coins.length<40)throw Error(`Yetersiz veri: ${coins.length} coin`);
let second=null;try{second=await coinlore();}catch(e){console.warn('İkinci kaynak alınamadı, tek kaynakla devam:',e.message);}
const excluded=[];
const checked=coins.map(c=>{const m2=second?.[c.s]>0?second[c.s]/1e9:null;return {...c,m2};}).filter(c=>{
  if(!second)return true;
  if(!c.m2){excluded.push(c.s+'(ikinci kaynakta yok)');return false;}
  const gap=Math.abs(c.m-c.m2)/Math.max(c.m,c.m2);
  if(gap>MAX_SOURCE_GAP){excluded.push(`${c.s}(%${Math.round(gap*100)} fark)`);return false;}
  return true;});
const top=G.dailyPool(checked);
if(top.length<12)throw Error('Havuz için yeterli tutarlı coin yok: '+top.length);
const next={date:target,coins:top.map(c=>c.m2?[c.s,c.n,sig(c.m),Math.max(0.001,sig(c.v)),sig(c.m2)]:[c.s,c.n,sig(c.m),Math.max(0.001,sig(c.v))])};
for(const f of FILES){
  const html=await readFile(f,'utf8');const m=html.match(BLOCK);
  if(!m||html.split('/*MARKET_DATA_BEGIN*/').length!==2)throw Error(f+': veri bloğu bulunamadı');
  const cur=JSON.parse(m[1]);
  // Güvenlik: bir önceki veriye göre 0.5x–2x dışına çıkan coin sayısı 6'yı geçerse dur.
  const old=new Map(cur.coins.map(c=>[c[0],c[2]]));
  const jumps=next.coins.filter(c=>old.has(c[0])&&(c[2]<old.get(c[0])*0.5||c[2]>old.get(c[0])*2));
  if(jumps.length>6)throw Error('Şüpheli veri, güncelleme yapılmadı: '+jumps.map(c=>c[0]).join(','));
  const strip=({date,coins})=>({date,coins});
  const prev=cur.date===target?(cur.prev||null):(cur.date<target?strip(cur):null);
  const market=prev?{...next,prev}:next;
  await writeFile(f,html.replace(BLOCK,()=>`/*MARKET_DATA_BEGIN*/window.STABLEX_MARKET=${JSON.stringify(market)};/*MARKET_DATA_END*/`));
}
console.log('Hedef gün',target,'| dışlanan:',excluded.join(', ')||'yok');
console.log(next.coins.map(c=>c[0]+'='+c[2]+(c[4]?'/'+c[4]:'')).join(' '));
