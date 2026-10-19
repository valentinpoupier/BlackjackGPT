export type RecordEntry = {date:string; result:string; bet:number; net:number};
export type Save = {balance:number; wins:number; losses:number; pushes:number; blackjacks:number; gained:number; lost:number; streak:number; frequencies:Record<string,number>; history:RecordEntry[]};
export const fresh = ():Save => ({balance:100,wins:0,losses:0,pushes:0,blackjacks:0,gained:0,lost:0,streak:0,frequencies:{},history:[]});
export function load():Save { try { const s=JSON.parse(localStorage.getItem('debilus-v1') || 'null'); if(s && Number.isFinite(s.balance) && s.balance>=0 && ['wins','losses','pushes','blackjacks','gained','lost','streak'].every(k=>Number.isFinite(s[k])) && Array.isArray(s.history) && s.frequencies && typeof s.frequencies==='object') return s; } catch {} return fresh(); }
export function persist(s:Save):boolean { try { localStorage.setItem('debilus-v1',JSON.stringify(s)); return true; } catch {return false;} }
