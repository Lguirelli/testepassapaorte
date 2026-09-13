import {mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import * as schema from './schema';
export function embedded(){mkdirSync(dirname(process.env.PGLITE_PATH || '.data/pglite'),{recursive:true});return drizzle(new PGlite(process.env.PGLITE_PATH || '.data/pglite'),{schema});}
