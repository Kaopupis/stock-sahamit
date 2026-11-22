const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:1600},deviceScaleFactor:2});
await p.goto('file://'+__dirname+'/poster-3x4.html',{waitUntil:'networkidle'});await p.waitForFunction(()=>window.__done);await p.waitForTimeout(500);
console.log(JSON.stringify(await p.evaluate(()=>window.__dbg)));
await p.locator('#poster').screenshot({path:__dirname+'/poster-3x4.png'});await b.close();})();
