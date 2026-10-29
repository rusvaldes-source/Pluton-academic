import assert from 'node:assert/strict';
import {verifiedSocialAccounts} from '../social/social-links.js';
import fs from 'node:fs';
const cfg = JSON.parse(fs.readFileSync(new URL('../social/social-links.json', import.meta.url)));
assert.equal(verifiedSocialAccounts({networks:cfg.networks.map(item=>({...item,verified:false}))}).length, 0, 'No unverified profile may be published');
const valid = {networks:[
 {id:'instagram',label:'Instagram',url:'https://www.instagram.com/plutonacademic/',verified:true,priority:1},
 {id:'facebook',label:'Facebook',url:'https://facebook.com/',verified:true},
 {id:'youtube',label:'YouTube',url:'https://youtube.com.evil.com/channel/a',verified:true},
 {id:'linkedin',label:'LinkedIn',url:'http://linkedin.com/company/a',verified:true},
 {id:'tiktok',label:'TikTok',url:'https://tiktok.com/@plutonacademic',verified:false}
]};
assert.deepEqual(verifiedSocialAccounts(valid).map(x=>x.id), ['instagram']);
console.log('PASS: verified URLs, allowed domains, no placeholder/false accounts');
