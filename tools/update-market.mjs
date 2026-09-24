// Her gün CoinGecko'dan piyasa değerlerini çeker ve iki sayfadaki veri bloğunu günceller.
import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const G=createRequire(import.meta.url)('./shared.cjs');
const FILES=['index.html','kampanyali.html'];
const BLOCK=/\/\*MARKET_DATA_BEGIN\*\/window\.STABLEX_MARKET=(.*?);\/\*MARKET_DATA_END\*\//s;
const sig=x=>Number(x.toPrecision(3));
async function getRows(){
  if(process.env.MARKET_FIXTURE)return JSON.parse(await readFile(process.env.MARKET_FIXTURE,'utf8'));
  const key=process.env.COINGECKO_API_KEY;if(!key)throw Error('COINGECKO_API_KEY tanımlı değil');
  const url=new URL('https://api.coingecko.com/api/v3/coins/markets');
  url.search=new URLSearchParams({vs_currency:'usd',ids:Object.values(G.LISTING).join(','),per_page:'250',page:'1',sparkline:'false'});
  const res=await fetch(url,{headers:{'x-cg-demo-api-key':key,accept:'application/json'},signal:AbortSignal.timeout(20000)});
  if(!res.ok)throw Error('CoinGecko yanıtı: '+res.status);
  return res.json();
}
const coins=G.normalizeMarkets(await getRows()).filter(c=>!G.STABLE.includes(c.s));
if(coins.length<40)throw Error(`Yetersiz veri: ${coins.length} coin`);
const top=G.dailyPool(coins);
if(top.length!==24)throw Error('24 coinlik havuz oluşmadı');
const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const market={date,coins:top.map(c=>[c.s,c.n,sig(c.m),Math.max(0.001,sig(c.v))])};
for(const f of FILES){
  const html=await readFile(f,'utf8');const m=html.match(BLOCK);
  if(!m||html.split('/*MARKET_DATA_BEGIN*/').length!==2)throw Error(f+': veri bloğu bulunamadı');
  const prev=JSON.parse(m[1]);
  // Güvenlik: önceki günde de olan coinlerde değer 0.5x–2x dışına çıktıysa dur.
  const old=new Map(prev.coins.map(c=>[c[0],c[2]]));
  const jumps=market.coins.filter(c=>old.has(c[0])&&(c[2]<old.get(c[0])*0.5||c[2]>old.get(c[0])*2));
  if(jumps.length>6)throw Error('Şüpheli veri, güncelleme yapılmadı: '+jumps.map(c=>c[0]).join(','));
  await writeFile(f,html.replace(BLOCK,()=>`/*MARKET_DATA_BEGIN*/window.STABLEX_MARKET=${JSON.stringify(market)};/*MARKET_DATA_END*/`));
}
console.log(date,market.coins.map(c=>c[0]+'='+c[2]).join(' '));
