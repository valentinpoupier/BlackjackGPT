/// <reference types="vite/client" />
import './style.css';
import { language, locale, t, streakReply, formatHistoryDate, saveLanguagePreference } from './i18n.ts';
import { dialogue } from './selena-dialogue.ts';
import { score, natural, shoe, outcome, payout, ranks, type Card } from './engine.ts';
import { load, persist, fresh, type Save } from './storage.ts';
import { createSelenaPortrait, type SelenaExpression } from './selena.ts';

document.documentElement.lang = language;
const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
<header>
  <a class="brand" href="#">
    D
    <span>
       / 
    </span>
    BLACKJACK DEBILUS
  </a>
  <nav>
    <button data-page="play" class="selected">
      ${t.play}
    </button>
    <button data-page="stats">
      ${t.statistics}
    </button>
    <button data-page="rules">
      ${t.rules}
    </button>
  </nav>
  <select id="language" class="language-select" aria-label="${t.languageLabel}">
    <option value="fr" lang="fr" ${language === 'fr' ? 'selected' : ''}>Français</option>
    <option value="en" lang="en" ${language === 'en' ? 'selected' : ''}>English</option>
  </select>
  <div class="wallet">
    ◉ 
    <strong id="balance">
    </strong>
     
    <small>
      DEBILUS
    </small>
  </div>
</header>
<main>
  <section id="play">
    <div class="intro">
      <span class="eyebrow">
        ${t.club}
      </span>
      <h1>
        ${t.headline}
      </h1>
      <p>
        ${t.tagline}
      </p>
    </div>
    <div class="arena">
      <aside>
        <img id="selena-portrait" src="./selena-casino.png" alt="${t.confident}" data-expression="confident">
        <div class="identity">
          <span class="live">
            ${t.online}
          </span>
          <h2>
            Selena 
            <small>
              V.21
            </small>
          </h2>
          <p>
            ${t.identity}
          </p>
        </div>
        <blockquote id="speech" aria-live="polite">
          ${t.welcome}
        </blockquote>
      </aside>
      <div class="table">
        <div class="table-top">
          <span>
            ${t.privateClub}
          </span>
          <div id="shoe" aria-label="${t.shoe}">
            <b>
              D
            </b>
            <small id="remaining">
            </small>
          </div>
        </div>
        <div class="hand-area">
          <div class="label">
            SELENA 
            <span id="dealer-score">
              —
            </span>
          </div>
          <div id="dealer" class="hand">
          </div>
        </div>
        <div class="table-mark">
          <strong>
            BLACKJACK
          </strong>
          <span>
            ${t.pays}
          </span>
          <small>
            ${t.stands}
          </small>
        </div>
        <div class="hand-area player-area">
          <div id="player" class="hand">
          </div>
          <div class="label">
            ${t.yourHand} 
            <span id="player-score">
              —
            </span>
          </div>
        </div>
        <div id="status" role="status">
          ${t.placeBet}
        </div>
      </div>
    </div>
    <div class="controls">
      <div class="bet-panel">
        <div class="coin" title="${t.chip}">
          🐱
          <span>
            🖕
          </span>
        </div>
        <label>
          ${t.yourBet} 
          <div>
            <input id="bet" type="number" min="1" step="1" value="10" aria-label="${t.betLabel}">
             
            <small>
              DEBILUS
            </small>
          </div>
        </label>
        <div class="chips">
          <button data-bet="5">
            5
          </button>
          <button data-bet="10">
            10
          </button>
          <button data-bet="25">
            25
          </button>
        </div>
      </div>
      <div class="actions">
        <button id="deal" class="primary">
          ${t.deal}
        </button>
        <button id="hit">
          ${t.hit}
        </button>
        <button id="stand">
          ${t.stand}
        </button>
        <button id="double">
          ${t.double}
        </button>
      </div>
    </div>
    <p class="footnote">
      ${t.localSave} 
      <span id="save-warning">
      </span>
    </p>
  </section>
  <section id="stats" hidden>
    <span class="eyebrow">
      ${t.statsEyebrow}
    </span>
    <h1>
      ${t.statsHeadline}
    </h1>
    <div id="stats-content">
    </div>
    <button id="reset" class="danger">
      ${t.reset}
    </button>
  </section>
  <section id="rules" hidden>
    <span class="eyebrow">
      ${t.rulesEyebrow}
    </span>
    <h1>
      ${t.rulesHeadline}
    </h1>
    <article>
      <p>
        ${t.rule1}
      </p>
      <p>
        ${t.rule2}
      </p>
      <p>
        ${t.rule3}
      </p>
      <p>
        ${t.rule4}
      </p>
      <p>
        ${t.rule5}
      </p>
    </article>
  </section>
</main>
<footer>
  DEBILUS 
  <span>
    ${t.motto}
  </span>
  <span>
    ${t.offline}
  </span>
</footer>
`;
// État de la partie : les règles elles-mêmes restent dans engine.ts.
let progress: Save = load();
let deck = shoe();
let playerHand: Card[] = [];
let dealerHand: Card[] = [];
let roundInProgress = false;
let animationInProgress = false;
let dealerCardRevealed = false;
let bet = 0;
const getElement = (id: string) => document.getElementById(id)!;
const getButton = (id: string) => getElement(id) as HTMLButtonElement;
const formatPoints = (n: number) => n.toLocaleString(locale, {
    maximumFractionDigits: 1
});
const setSelenaDialogue = (s: string) => {
    getElement('speech').textContent = s;
};
const setSelenaExpression = createSelenaPortrait(
    getElement('selena-portrait') as HTMLImageElement,
);
// Une manche interrompue est enregistrée comme une défaite uniquement dans la sauvegarde.
// Les statistiques en mémoire sont réglées normalement à la fin de la manche.
function saveProgress() {
    const progressToSave = roundInProgress
        ? {
            ...progress,
            losses: progress.losses + 1,
            lost: progress.lost + bet,
            streak: 0,
        }
        : progress;
    const saved = persist(progressToSave);
    getElement('save-warning').textContent = saved ? '' : t.saveUnavailable;
}

function updateInterface() {
    const visibleDealerHand = dealerCardRevealed ? dealerHand : dealerHand.slice(0, 1);
    const hiddenCardIndicator = dealerCardRevealed ? '' : ' + ?';
    const actionsDisabled = !roundInProgress || animationInProgress;
    const bettingDisabled = roundInProgress || animationInProgress;
    const languageSelect = getElement('language') as HTMLSelectElement;
    languageSelect.disabled = bettingDisabled;
    languageSelect.title = bettingDisabled ? t.languageHint : t.languageLabel;

    getElement('balance').textContent = formatPoints(progress.balance);
    getElement('remaining').textContent = `${formatPoints(deck.length)} ${t.cards}`;
    getElement('player-score').textContent = playerHand.length ? String(score(playerHand)) : '—';
    getElement('dealer-score').textContent = dealerHand.length
        ? `${score(visibleDealerHand)}${hiddenCardIndicator}`
        : '—';
    getButton('deal').disabled = roundInProgress || animationInProgress || progress.balance < 1;
    getButton('hit').disabled = actionsDisabled;
    getButton('stand').disabled = actionsDisabled;
    getButton('double').disabled = actionsDisabled || playerHand.length !== 2 || progress.balance < bet;
    (getElement('bet') as HTMLInputElement).disabled = bettingDisabled;
    document.querySelectorAll<HTMLButtonElement>('[data-bet]').forEach(button => {
        button.disabled = bettingDisabled;
    });
}
// Distribue une carte, puis attend la fin de son trajet du sabot vers la main.
async function dealCard(target: 'player' | 'dealer', hidden = false) {
    const card = deck.pop()!;
    (target === 'player' ? playerHand : dealerHand).push(card);
    progress.frequencies[card.rank] = (progress.frequencies[card.rank] || 0) + 1;
    saveProgress();
    const node = document.createElement('div');
    node.className = `card ${[
        '♥', '♦'
    ].includes(card.suit) ? 'red' : ''}${hidden ? ' hidden-card' : ''}`;
    node.innerHTML = `
        <div class="card-inner">
            <div class="card-front">
                <b>${card.rank}<small>${card.suit}</small></b>
                <span>${card.suit}</span>
                <b>${card.rank}<small>${card.suit}</small></b>
            </div>
            <div class="card-back">D<span>DEBILUS</span></div>
        </div>
    `;
    node.setAttribute('aria-label', hidden ? t.hiddenCard : `${card.rank} ${card.suit}`);
    getElement(target).append(node);
    const origin = getElement('shoe').getBoundingClientRect();
    const destination = node.getBoundingClientRect();
    const horizontalDistance = origin.left - destination.left;
    const verticalDistance = origin.top - destination.top;
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        await node.animate([
            {
                transform: `translate(${horizontalDistance}px,${verticalDistance}px) rotate(-16deg) scale(.8)`,
                opacity: 0.5,
            }, {
                transform: 'translate(0,0) rotate(0) scale(1)', opacity: 1
            }
        ], {
            duration: 400, easing: 'cubic-bezier(.2,.7,.2,1)'
        }).finished;
    }
    updateInterface();
}
async function revealDealerCard() {
    dealerCardRevealed = true;
    const node = getElement('dealer').children[1] as HTMLElement | undefined;
    if (node) {
        node.classList.remove('hidden-card');
        node.setAttribute('aria-label', `${dealerHand[1].rank} ${dealerHand[1].suit}`);
    }
    updateInterface();
    await new Promise(r => setTimeout(r, 400));
}

const selenaReplies = dialogue[language];

// Calcule le paiement et met à jour toutes les statistiques une seule fois.
function finishRound() {
    const result = outcome(playerHand, dealerHand);
    const returned = payout(result, bet);
    const net = returned - bet;
    progress.balance += returned;
    if (result === 'win' || result === 'blackjack') {
        progress.wins++;
        progress.streak++;
    }
    else {
        progress.streak = 0;
        if (result === 'loss')
            progress.losses++;
        else
            progress.pushes++;
    }
    if (result === 'blackjack')
        progress.blackjacks++;
    if (net > 0)
        progress.gained += net;
    else
        progress.lost -= net;
    progress.history.unshift({
        date: new Date().toISOString(), result, bet, net
    });
    progress.history = progress.history.slice(0, 30);
    roundInProgress = false;
    animationInProgress = false;
    saveProgress();
    const label = {
        win: t.win, loss: t.loss, push: t.push, blackjack: t.blackjackResult
    }[result];
    getElement('status').textContent = `${label} · ${net > 0 ? '+' : ''}${formatPoints(net)} Debilus`;
    // Le résultat est connu : aucun visage ne révèle les cartes cachées pendant la manche.
    const resultExpressions: Record<typeof result, SelenaExpression> = {
        win: 'annoyed',
        loss: 'smug',
        push: 'unimpressed',
        blackjack: 'surprised',
    };
    void setSelenaExpression(resultExpressions[result]);
    if (score(playerHand) > 21) {
        setSelenaDialogue(t.bust);
    } else if (progress.streak >= 3) {
        setSelenaDialogue(streakReply(progress.streak));
    } else {
        const replies = selenaReplies[result];
        const randomIndex = Math.floor(Math.random() * replies.length);
        setSelenaDialogue(replies[randomIndex]);
    }
    updateInterface();
}
// Le croupier révèle sa carte, tire jusqu’à 16 et reste sur tout 17.
async function playDealerTurn() {
    await revealDealerCard();
    if (score(playerHand) <= 21 && !natural(playerHand) && !natural(dealerHand)) {
        while (score(dealerHand) < 17)
            await dealCard('dealer');
    }
    finishRound();
}
// Actions du joueur. Les entrées restent verrouillées pendant les animations.
getButton('deal').onclick = async () => {
    const value = Number((getElement('bet') as HTMLInputElement).value);
    if (animationInProgress || roundInProgress)
        return;
    if (!Number.isInteger(value) || value < 1 || value > progress.balance) {
        getElement('status').textContent = t.invalidBet;
        return;
    }
    bet = value;
    progress.balance -= bet;
    roundInProgress = true;
    animationInProgress = true;
    saveProgress();
    dealerCardRevealed = false;
    playerHand = [];
    dealerHand = [];
    getElement('player').replaceChildren();
    getElement('dealer').replaceChildren();
    if (deck.length < 52)
        deck = shoe();
    getElement('status').textContent = t.dealing;
    void setSelenaExpression('confident');
    setSelenaDialogue(t.dealReply);
    updateInterface();
    await dealCard('player');
    await dealCard('dealer');
    await dealCard('player');
    await dealCard('dealer', true);
    if (natural(playerHand) || natural(dealerHand))
        await playDealerTurn();
    else {
        animationInProgress = false;
        getElement('status').textContent = t.yourTurn;
        updateInterface();
    }
};
getButton('hit').onclick = async () => {
    if (!roundInProgress || animationInProgress)
        return;
    animationInProgress = true;
    updateInterface();
    setSelenaDialogue(t.hitReply);
    void setSelenaExpression('smug');
    await dealCard('player');
    if (score(playerHand) >= 21)
        await playDealerTurn();
    else {
        animationInProgress = false;
        updateInterface();
    }
};
getButton('stand').onclick = async () => {
    if (!roundInProgress || animationInProgress)
        return;
    animationInProgress = true;
    updateInterface();
    await playDealerTurn();
};
getButton('double').onclick = async () => {
    if (!roundInProgress || animationInProgress || playerHand.length !== 2 || progress.balance < bet)
        return;
    animationInProgress = true;
    progress.balance -= bet;
    bet *= 2;
    saveProgress();
    updateInterface();
    setSelenaDialogue(t.doubleReply);
    void setSelenaExpression('surprised');
    await dealCard('player');
    await playDealerTurn();
};
document.querySelectorAll<HTMLButtonElement>('[data-bet]').forEach(b => b.onclick = () => {
    (getElement('bet') as HTMLInputElement).value = b.dataset.bet!;
});
// Affichage des statistiques et de l’historique.
function renderStatistics() {
    const metrics = [
        [t.wins, progress.wins],
        [t.losses, progress.losses],
        [t.pushes, progress.pushes],
        [t.blackjacks, progress.blackjacks],
        [t.gained, formatPoints(progress.gained)],
        [t.lost, formatPoints(progress.lost)],
    ];
    const metricsHtml = metrics.map(([label, value]) => `
        <div><strong>${value}</strong><span>${label}</span></div>
    `).join('');
    const frequenciesHtml = ranks.map(rank => `
        <div><b>${rank}</b><span>${formatPoints(progress.frequencies[rank] || 0)}</span></div>
    `).join('');

    getElement('stats-content').innerHTML = `
        <div class="metrics">${metricsHtml}</div>
        <h2>${t.dealtCards}</h2>
        <div class="frequencies">${frequenciesHtml}</div>
        <p>${t.frequencies}</p>
        <h2>${t.history}</h2>
        <div id="history"></div>
    `;
    const history = getElement('history');
    if (!progress.history.length)
        history.textContent = t.emptyHistory;
    const resultLabels: Record<string, string> = {
        win: t.win,
        loss: t.loss,
        push: t.push,
        blackjack: 'Blackjack',
    };
    for (const entry of progress.history) {
        const row = document.createElement('p');
        const label = resultLabels[entry.result] || entry.result;
        const signedNet = `${entry.net > 0 ? '+' : ''}${formatPoints(entry.net)}`;
        row.className = 'history-row';
        row.textContent = `${formatHistoryDate(entry.date)} · ${label} · ${t.bet} ${formatPoints(entry.bet)} · ${signedNet}`;
        history.append(row);
    }
}
document.querySelectorAll<HTMLButtonElement>('[data-page]').forEach(b => b.onclick = () => {
    if (animationInProgress)
        return;
    for (const id of [
        'play', 'stats', 'rules'
    ])
        getElement(id).hidden = id !== b.dataset.page;
    document.querySelectorAll('[data-page]').forEach(n => n.classList.toggle('selected', n === b));
    if (b.dataset.page === 'stats')
        renderStatistics();
});
getButton('reset').onclick = () => {
    if (roundInProgress || animationInProgress) {
        alert(t.finishBeforeReset);
        return;
    }
    if (confirm(t.confirmReset)) {
        progress = fresh();
        void setSelenaExpression('confident');
        saveProgress();
        renderStatistics();
        updateInterface();
    }
};
// Le rechargement applique la langue à tous les textes et aux portraits.
// Le sélecteur est verrouillé pendant une manche pour ne perdre aucune mise.
(getElement('language') as HTMLSelectElement).onchange = (event) => {
    if (roundInProgress || animationInProgress) return;
    const choice = (event.currentTarget as HTMLSelectElement).value;
    if (choice !== 'fr' && choice !== 'en') return;
    saveLanguagePreference(choice);
    const url = new URL(location.href);
    url.searchParams.set('lang', choice);
    location.assign(url.href);
};

updateInterface();
