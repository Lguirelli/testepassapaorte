import {chromium} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';

const storageStatePath='test-results/.auth/vercel.json';

export default async function globalSetup(){
  const bootstrapUrl=process.env.E2E_BOOTSTRAP_URL;
  if(!bootstrapUrl)return;

  const browser=await chromium.launch();
  const context=await browser.newContext();
  const page=await context.newPage();
  try{
    const response=await page.goto(bootstrapUrl,{waitUntil:'domcontentloaded',timeout:30_000});
    if(!response||response.status()>=400)throw new Error(`Preview bootstrap failed with status ${response?.status()??'unknown'}.`);
    await page.waitForLoadState('networkidle',{timeout:15_000}).catch(()=>undefined);
    await mkdir(dirname(storageStatePath),{recursive:true});
    await context.storageState({path:storageStatePath});
  }finally{
    await browser.close();
  }
}

export {storageStatePath};
