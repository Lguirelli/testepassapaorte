import {defineConfig} from '@playwright/test';
const remote=process.env.BASE_URL;
export default defineConfig({
 testDir:'./tests/visual',workers:1,retries:process.env.CI?1:0,
 reporter:[['list'],['html',{open:'never'}]],outputDir:'test-results',
 use:{baseURL:remote||'http://localhost:4173',browserName:'chromium',trace:'retain-on-failure',screenshot:'only-on-failure'},
 webServer:remote?undefined:{command:'npm start',url:'http://localhost:4173/health',reuseExistingServer:false,env:{APP_MODE:'visual'},timeout:60000},
 projects:[
  {name:'wide',use:{viewport:{width:1371,height:936}}},
  {name:'narrow',use:{viewport:{width:347,height:844},isMobile:true,hasTouch:true}},
  {name:'landscape',use:{viewport:{width:844,height:390},isMobile:true,hasTouch:true}},
  {name:'reduced-motion',use:{viewport:{width:887,height:700},reducedMotion:'reduce'}},
 ],
});
