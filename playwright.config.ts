import {defineConfig} from '@playwright/test';

const baseURL=process.env.BASE_URL||'http://localhost:4173';
const external=Boolean(process.env.EXTERNAL_SERVER);
const protectedPreview=Boolean(process.env.E2E_BOOTSTRAP_URL);
const storageStatePath='test-results/.auth/vercel.json';

export default defineConfig({
  testDir:'./tests/e2e',
  fullyParallel:false,
  workers:process.env.CI?1:1,
  retries:process.env.CI?1:0,
  timeout:45_000,
  expect:{timeout:7_500},
  reporter:[['list'],['html',{open:'never'}]],
  outputDir:'test-results',
  globalSetup:protectedPreview?'./tests/e2e/global-setup.ts':undefined,
  use:{
    baseURL,
    browserName:'chromium',
    actionTimeout:8_000,
    navigationTimeout:20_000,
    trace:'retain-on-failure',
    screenshot:'only-on-failure',
    video:'retain-on-failure',
    colorScheme:'light',
    storageState:protectedPreview?storageStatePath:undefined,
  },
  projects:[
    {name:'mobile',use:{viewport:{width:390,height:844},hasTouch:true,isMobile:true}},
    {name:'tablet',use:{viewport:{width:768,height:1024},hasTouch:true,isMobile:true}},
    {name:'desktop',use:{viewport:{width:1366,height:936}}},
    {name:'desktop-wide',use:{viewport:{width:1440,height:900}}},
    {
      name:'reduced-motion',
      testMatch:/06-interactions\.spec\.ts/,
      use:{viewport:{width:1366,height:936},reducedMotion:'reduce'},
    },
  ],
  webServer:external?undefined:{
    command:'node scripts/e2e-server.mjs',
    url:'http://localhost:4173/health',
    reuseExistingServer:false,
    timeout:120_000,
  },
});
