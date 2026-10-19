import {test} from 'node:test';
import assert from 'node:assert/strict';
import {score,natural,shoe,outcome,payout,type Card} from './engine.ts';
const hand=(...r:string[]):Card[]=>r.map(rank=>({rank,suit:'♠'}));
test('aces adapt including several aces',()=>{assert.equal(score(hand('A','A','9')),21);assert.equal(score(hand('A','6')),17);assert.equal(score(hand('A','6','10')),17);assert.equal(score(hand('K','Q','2')),22);});
test('six complete decks',()=>{const s=shoe();assert.equal(s.length,312);assert.equal(s.filter(c=>c.rank==='A'&&c.suit==='♠').length,6);assert.equal(new Set(s.map(c=>c.rank+c.suit)).size,52);});
test('natural blackjack takes precedence over drawn 21',()=>{assert.equal(natural(hand('7','7','7')),false);assert.equal(outcome(hand('A','K'),hand('7','7','7')),'blackjack');assert.equal(outcome(hand('7','7','7'),hand('A','K')),'loss');assert.equal(outcome(hand('A','K'),hand('A','Q')),'push');});
test('busts and ties',()=>{assert.equal(outcome(hand('K','K','2'),hand('K','8')),'loss');assert.equal(outcome(hand('K','8'),hand('K','K','2')),'win');assert.equal(outcome(hand('10','8'),hand('K','8')),'push');});
test('returns include stake, natural pays 3:2, doubles use total stake',()=>{assert.equal(payout('blackjack',5),12.5);assert.equal(payout('win',20),40);assert.equal(payout('push',10),10);assert.equal(payout('loss',10),0);});
