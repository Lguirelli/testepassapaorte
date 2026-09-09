import fs from "node:fs/promises";
import path from "node:path";
const file=path.resolve(process.cwd(),process.env.LOCAL_STORE_PATH||".data/validation-store.json");
try{await fs.unlink(file);console.log(`Removido: ${file}`)}catch(e){if(e?.code!=="ENOENT")throw e;console.log("Store já estava limpo.")}
