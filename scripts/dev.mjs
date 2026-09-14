import {spawn} from 'node:child_process';

// O modo padrão é a apresentação visual. `npm run local` troca explicitamente para database.
const env={...process.env,APP_MODE:process.env.APP_MODE||'visual'};
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--webpack','--hostname','0.0.0.0','--port','4173'],{stdio:'inherit',env});
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exit(code??1));
