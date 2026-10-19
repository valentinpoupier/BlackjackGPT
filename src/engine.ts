export type Card = { rank: string; suit: string };
export const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
export function score(hand: Card[]): number {
  let sum = 0, aces = 0;
  for (const c of hand) { sum += c.rank === 'A' ? 11 : ['J','Q','K'].includes(c.rank) ? 10 : Number(c.rank); if(c.rank === 'A') aces++; }
  while(sum > 21 && aces-- > 0) sum -= 10;
  return sum;
}
export const natural = (hand: Card[]) => hand.length === 2 && score(hand) === 21;
export function shoe(): Card[] {
  const cards = Array.from({length:6}, () => ['♠','♥','♦','♣'].flatMap(suit => ranks.map(rank => ({rank,suit})))).flat();
  for(let i=cards.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [cards[i],cards[j]]=[cards[j],cards[i]]; }
  return cards;
}
export function outcome(player: Card[], dealer: Card[]): 'win'|'loss'|'push'|'blackjack' {
  if(score(player)>21) return 'loss';
  if(natural(player)) return natural(dealer)?'push':'blackjack';
  if(natural(dealer)) return 'loss';
  return score(dealer)>21 || score(player)>score(dealer)?'win':score(player)===score(dealer)?'push':'loss';
}
export const payout = (result: ReturnType<typeof outcome>, bet: number) => result==='blackjack'?bet*2.5:result==='win'?bet*2:result==='push'?bet:0;
