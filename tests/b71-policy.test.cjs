const {test}=require('node:test'),assert=require('node:assert/strict');
test('advertising remains off without every release gate and never runs in learning routes',async()=>{
 const {canLoadAds}=await import('../b71/policy.mjs'),approved={enabled:true,activationAuthorized:true,accountApproved:true,policyReviewed:true,cmpReady:true,publisherId:'ca-pub-1234567890123456'};
 assert.equal(canLoadAds(approved,{advertising:true},'/b71/public/'),true);
 for(const gate of ['enabled','activationAuthorized','accountApproved','policyReviewed','cmpReady'])assert.equal(canLoadAds({...approved,[gate]:false},{advertising:true},'/b71/public/'),false);
 for(const route of ['/courses','/dashboard','/aula-b64.html','/b67/id101/','/b68/mkt201/','/b70/na101/','/admin/','/payments/'])assert.equal(canLoadAds(approved,{advertising:true},route),false);
 assert.equal(canLoadAds(approved,{advertising:false},'/b71/public/'),false);
});
test('affiliates need verified approval and disclose compensation next to their links',async()=>{
 const {linkModel}=await import('../b71/policy.mjs');const p={name:'Example',url:'https://www.coursera.org/',allowedHosts:['www.coursera.org'],affiliate:{enabled:false,approved:false,activationAuthorized:false,url:null}};
 assert.equal(linkModel(p,'es').sponsored,false);
 const q={...p,affiliate:{enabled:true,approved:true,activationAuthorized:true,url:'https://www.coursera.org/?campaign=test'}};assert.equal(linkModel(q,'es').sponsored,true);assert.match(linkModel(q,'en').disclosure,/commission/);
 for(const url of ['javascript:alert(1)','https://evil.invalid/','https://www.coursera.org.evil.invalid/','https://user:pass@www.coursera.org/'])assert.equal(linkModel({...q,affiliate:{...q.affiliate,url}},'es'),null);
});
test('revenue model is explicit about assumptions and rejects invalid numbers',async()=>{
 const {estimate}=await import('../b71/policy.mjs');assert.deepEqual(estimate({views:25000,rpm:4,clickRate:.02,conversionRate:.02,commission:5}),{ads:100,affiliates:50,total:150});
 assert.throws(()=>estimate({views:-1,rpm:4,clickRate:.02,conversionRate:.02,commission:5}));
});
