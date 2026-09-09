import type {Repository} from "./repository";
import {LocalRepository} from "./local-repository";
import {PostgresRepository} from "./postgres-repository";
let singleton:Repository|undefined;
export function getRepository():Repository {
  const mode=process.env.PERSISTENCE_MODE === "postgres" ? "postgres" : "local";
  if(!singleton || singleton.mode!==mode) singleton=mode==="postgres"?new PostgresRepository():new LocalRepository();
  return singleton;
}
export type {Repository,EntityRecord} from "./repository";
