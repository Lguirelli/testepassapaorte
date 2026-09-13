import {spawn} from 'node:child_process';
// Sites preview appends Vite flags. Next uses --hostname and has no --strictPort.
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--webpack','--hostname','0.0.0.0','--port','4173'],{stdio:'inherit',env:process.env});
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exit(code??1));
