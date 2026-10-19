import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fresh,load,persist} from './storage.ts';
let value:string|null=null;
Object.defineProperty(globalThis,'localStorage',{value:{getItem:()=>value,setItem:(_key:string,v:string)=>{value=v;}},configurable:true});
test('new player starts at 100',()=>{value=null;assert.equal(load().balance,100);});
test('balance and statistics survive a reload',()=>{const s=fresh();s.balance=112.5;s.wins=2;s.blackjacks=1;s.frequencies.A=3;s.history.push({date:'20/10/2026',result:'blackjack',bet:5,net:7.5});assert.equal(persist(s),true);assert.deepEqual(load(),s);});
test('corrupt save recovers safely',()=>{value='{broken';assert.equal(load().balance,100);value='{"balance":-12}';assert.equal(load().balance,100);});
