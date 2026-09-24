/* Extracted from the supplied prototype. Shared by browser and Node; no credentials. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.StablexGame=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
const LISTING={"AAVE": "aave", "ADA": "cardano", "ALGO": "algorand", "ANKR": "ankr", "APE": "apecoin", "ARB": "arbitrum", "ATOM": "cosmos", "AUDIO": "audius", "AVAX": "avalanche-2", "AXS": "axie-infinity", "BAT": "basic-attention-token", "BONK": "bonk", "BTC": "bitcoin", "CHZ": "chiliz", "COMP": "compound-governance-token", "CRV": "curve-dao-token", "DOGE": "dogecoin", "DOT": "polkadot", "EIGEN": "eigenlayer", "ENA": "ethena", "ENS": "ethereum-name-service", "ETHFI": "ether-fi", "ETH": "ethereum", "FET": "fetch-ai", "FLOKI": "floki", "GALA": "gala", "GRT": "the-graph", "IMX": "immutable-x", "IO": "io", "JASMY": "jasmycoin", "JTO": "jito-governance-token", "JUP": "jupiter-exchange-solana", "LDO": "lido-dao", "LINK": "chainlink", "LPT": "livepeer", "LTC": "litecoin", "MANA": "decentraland", "MORPHO": "morpho", "ONDO": "ondo-finance", "PAXG": "pax-gold", "PENDLE": "pendle", "PENGU": "pudgy-penguins", "PEPE": "pepe", "PLUME": "plume", "POL": "polygon-ecosystem-token", "PUMP": "pump-fun", "PYTH": "pyth-network", "QNT": "quant-network", "RENDER": "render-token", "SAHARA": "sahara-ai", "SAND": "the-sandbox", "SHIB": "shiba-inu", "SKL": "skale", "SKY": "sky", "SOL": "solana", "STRK": "starknet", "STX": "blockstack", "TRUMP": "official-trump", "TRX": "tron", "UNI": "uniswap", "USDC": "usd-coin", "USDT": "tether", "VIRTUAL": "virtual-protocol", "WIF": "dogwifcoin", "WLD": "worldcoin-wld", "W": "wormhole", "XAUT": "tether-gold", "XLM": "stellar", "XRP": "ripple", "XTZ": "tezos", "ZRO": "layerzero", "ZRX": "0x", "LIT": "lighter", "MET": "meteora", "SENT": "sentient"};
// Seçili coin halkası için logodan çıkarılmış baskın renk (tek renkli logolar açık gri).
const COIN_COLORS={"AAVE":"#519ebd","ADA":"#3d7bff","ALGO":"#d4d4d4","ANKR":"#356ef5","APE":"#0755f8","ARB":"#466fb9","ATOM":"#4653b9","AUDIO":"#921fe0","AVAX":"#e84142","AXS":"#0065ff","BAT":"#fe4623","BONK":"#ffe000","BTC":"#f7931a","CHZ":"#ff0051","COMP":"#00ffb4","CRV":"#d4d4d4","DOGE":"#c8aa37","DOT":"#ff0087","EIGEN":"#371ae5","ENA":"#d4d4d4","ENS":"#d4d4d4","ETH":"#7f8ef0","ETHFI":"#d4d4d4","FET":"#4665b9","FLOKI":"#f79a23","GALA":"#d4d4d4","GRT":"#6747ed","IMX":"#d4d4d4","IO":"#d4d4d4","JASMY":"#f8951c","JTO":"#d4d4d4","JUP":"#c7f284","LDO":"#f7a778","LINK":"#2a5ada","LIT":"#d4d4d4","LPT":"#4cc48a","LTC":"#3f71c0","MANA":"#ff5457","MET":"#d4d4d4","MORPHO":"#2a73ff","ONDO":"#d4d4d4","PAXG":"#f5ee0a","PENDLE":"#306ecf","PENGU":"#71a1ff","PEPE":"#58ba45","PLUME":"#d4d4d4","POL":"#8246e5","PUMP":"#54d392","PYTH":"#a47cf3","QNT":"#d4d4d4","RENDER":"#ed1213","SAHARA":"#f4ff70","SAND":"#01a1fe","SENT":"#fd6a8e","SHIB":"#ff0500","SKL":"#d4d4d4","SKY":"#d4d4d4","SOL":"#9945ff","STRK":"#4545ba","STX":"#fc6432","TRUMP":"#f2c14e","TRX":"#ff0509","UNI":"#ff70b5","USDC":"#297cd6","USDT":"#46b99a","VIRTUAL":"#8ae5c9","W":"#d4d4d4","WIF":"#e9a686","WLD":"#d4d4d4","XAUT":"#d3b25b","XLM":"#d4d4d4","XRP":"#d4d4d4","XTZ":"#2b7cf7","ZRO":"#d4d4d4","ZRX":"#d4d4d4"};
const STABLE=["USDT","USDC","PAXG","XAUT"];
const DEFAULT_MARKET={date:'2026-09-24',coins:[
 // Piyasa değeri ve 24s hacim, milyar USD
 ["BTC","Bitcoin",1665,35.1],["ETH","Ethereum",323,14.2],["XRP","XRP",87.5,3.66],["SOL","Solana",61.5,3.81],
 ["TRX","TRON",32.1,0.43],["DOGE","Dogecoin",15.5,1.47],["ADA","Cardano",8.41,0.48],["LINK","Chainlink",8.25,0.44],
 ["XLM","Stellar",6.42,0.29],["UNI","Uniswap",5.59,1.0],["LTC","Litecoin",5.1,0.98],["AVAX","Avalanche",4.27,0.48],
 ["SHIB","Shiba Inu",3.28,0.11],["AAVE","Aave",2.07,0.24],["PEPE","Pepe",1.79,0.38],["DOT","Polkadot",1.69,0.17],
 ["ONDO","Ondo",1.33,0.26],["ARB","Arbitrum",1.15,0.29],["RENDER","Render",0.91,0.036],["FET","Artificial Superintelligence",0.51,0.085],
 ["BONK","Bonk",0.29,0.13],["FLOKI","Floki",0.28,0.037],["WIF","dogwifhat",0.24,0.088],["GALA","Gala",0.097,0.019]
]};
// Statik yayında sayfaya gömülen günlük veri (window.STABLEX_MARKET) varsa onu kullan.
const MARKET=(()=>{const m=globalThis.STABLEX_MARKET;return m&&/^\d{4}-\d{2}-\d{2}$/.test(m.date)&&Array.isArray(m.coins)&&m.coins.length>=6&&m.coins.every(c=>Array.isArray(c)&&typeof c[0]==='string'&&Number.isFinite(c[2])&&c[2]>0)?m:DEFAULT_MARKET;})();
const DATA_DATE=MARKET.date.split('-').reverse().join('.');
const FALLBACK=MARKET.coins.map(([s,n,m,v])=>({s,n,m,v,img:null}));
const DAILY_SYMBOLS=FALLBACK.map(c=>c.s).sort();
const VERSION='stablex-daily-v3-five';
function dayKey(date=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);}
function rnd(seed){let t=seed>>>0;return()=>{t+=0x6D2B79F5;let r=Math.imul(t^t>>>15,1|t);r^=r+Math.imul(r^r>>>7,61|r);return((r^r>>>14)>>>0)/4294967296;};}
function dailyPool(coins=FALLBACK){return coins.filter(c=>LISTING[c.s]&&!STABLE.includes(c.s)&&Number.isFinite(c.m)&&c.m>0).sort((a,b)=>b.m-a.m||a.s.localeCompare(b.s,'en')).slice(0,24);}
function dailySymbols(day,metric='m',coins=FALLBACK){
 const pool=dailyPool(coins).map(c=>c.s);if(pool.length<6)throw Error('Daily pool needs 6 coins');
 const random=rnd(Number(day.replaceAll('-','')));
 for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
 return pool.slice(0,6);
}
// Preserve the day's exact 6-coin roster; vary only its order for each run.
function dailyMatches(day,coins=FALLBACK,seed=0){
 const roster=dailySymbols(day,'m',coins),byS=new Map(coins.map(c=>[c.s,c.m]));
 // Değerleri birbirine %10'dan yakın çiftler art arda gelmesin: veri biraz oynasa bile doğru cevap değişmesin.
 const gap=(a,b)=>{const x=byS.get(a),y=byS.get(b);return x&&y?Math.abs(x-y)/Math.max(x,y):1;};
 let best=null,bestMin=-1;
 for(let attempt=0;attempt<200;attempt++){
  const symbols=[...roster],random=rnd((seed+attempt*0x9E3779B1)>>>0);
  for(let i=symbols.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[symbols[i],symbols[j]]=[symbols[j],symbols[i]];}
  let min=1;for(let i=1;i<symbols.length;i++)min=Math.min(min,gap(symbols[i-1],symbols[i]));
  if(min>=0.1)return symbols;
  if(min>bestMin){bestMin=min;best=symbols;}
 }
 return best;
}
function nextSeriesAt(day){return Date.parse(day+'T00:00:00+03:00')+86400000;}
function hardestRound(rounds){return rounds.reduce((best,row)=>{const gap=Math.abs(row.left.m-row.right.m)/Math.max(row.left.m,row.right.m);return !best||gap<best.gap?{...row,gap}:best;},null);}
function utm(url,mode,content){const u=new URL(url);u.searchParams.set('utm_source','game');u.searchParams.set('utm_medium','hangisi_buyuk');u.searchParams.set('utm_campaign',mode);u.searchParams.set('utm_content',content);return u.href;}
function coinURL(symbol,mode){if(!LISTING[symbol])throw Error('Unknown coin');return utm('https://stablex.com.tr/piyasalar/'+symbol.toLowerCase()+'try',mode,symbol);}
function normalizeMarkets(rows){if(!Array.isArray(rows))throw Error('Invalid market data');const byId=new Map(rows.map(r=>[r.id,r]));return Object.entries(LISTING).flatMap(([s,id])=>{const r=byId.get(id);if(!r||String(r.symbol).toUpperCase()!==s||typeof r.market_cap!=='number'||!Number.isFinite(r.market_cap)||r.market_cap<=0||typeof r.total_volume!=='number'||!Number.isFinite(r.total_volume)||r.total_volume<0)return [];return [{s,n:String(r.name).slice(0,100),m:r.market_cap/1e9,v:r.total_volume/1e9,img:'assets/coins/'+s.toLowerCase()+'.png'}];}).sort((a,b)=>a.s<b.s?-1:1);}
return {COIN_COLORS,LISTING,STABLE,FALLBACK,DATA_DATE,DAILY_SYMBOLS,VERSION,dayKey,rnd,dailyPool,dailySymbols,dailyMatches,nextSeriesAt,hardestRound,utm,coinURL,normalizeMarkets};
});
