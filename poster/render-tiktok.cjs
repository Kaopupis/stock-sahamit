// Render the four 3:4 carousel slides in tiktok.html to tiktok-1.png … tiktok-4.png (2x scale).
// Run from this folder:  NODE_PATH=$(npm root -g) node render-tiktok.cjs
const {chromium}=require('playwright');
const path=require('path');
(async()=>{
  const proxy=process.env.HTTPS_PROXY?{server:process.env.HTTPS_PROXY}:undefined;
  const b=await chromium.launch({proxy,args:['--ignore-certificate-errors']});
  const p=await b.newPage({viewport:{width:1080,height:1440},deviceScaleFactor:2});
  await p.goto('file://'+path.join(__dirname,'tiktok.html'),{waitUntil:'networkidle'});
  await p.evaluate(()=>document.fonts.ready);
  for(let i=1;i<=4;i++){
    const over=await p.evaluate(i=>{
      const safe=document.querySelector('#s'+i+' .safe');
      const kids=[...safe.children];
      return Math.round(Math.max(...kids.map(k=>k.getBoundingClientRect().bottom))-safe.getBoundingClientRect().bottom);
    },i);
    if(over>0) console.log(`slide ${i}: content overflows by ${over}px`);
    await p.locator('#s'+i).screenshot({path:path.join(__dirname,`tiktok-${i}.png`)});
  }
  await b.close();
})();
