/** Current phase: visual development. Set APP_MODE=database to restore persistence. */
export function isVisualMode(){return process.env.APP_MODE!=='database';}
