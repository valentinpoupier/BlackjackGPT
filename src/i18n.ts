// La première langue prise en charge dans les préférences du navigateur gagne.
// Pour une autre langue ou une liste vide, l'anglais est utilisé.
export type Language = 'fr' | 'en';

export function detectLanguage(preferences: readonly string[]): Language {
    for (const preference of preferences) {
        const primary = preference.trim().toLowerCase().split(/[-_]/)[0];
        if (primary === 'fr' || primary === 'en') return primary;
    }
    return 'en';
}

export function resolveLanguage(
    preferences: readonly string[],
    savedChoice?: string | null,
    linkChoice?: string | null,
): Language {
    if (linkChoice === 'fr' || linkChoice === 'en') return linkChoice;
    if (savedChoice === 'fr' || savedChoice === 'en') return savedChoice;
    return detectLanguage(preferences);
}

function readSavedLanguage(): string | null {
    try {
        return localStorage.getItem('debilus-language');
    } catch {
        return null;
    }
}

function readLinkLanguage(): string | null {
    return typeof location === 'undefined'
        ? null
        : new URLSearchParams(location.search).get('lang');
}

export function saveLanguagePreference(choice: Language): void {
    try {
        localStorage.setItem('debilus-language', choice);
    } catch {
        // Le paramètre du lien permet de changer de langue même sans stockage local.
    }
}

const preferences = typeof navigator === 'undefined'
    ? []
    : navigator.languages?.length ? navigator.languages : [navigator.language];
export const language = resolveLanguage(preferences, readSavedLanguage(), readLinkLanguage());
export const locale = language === 'fr' ? 'fr-FR' : 'en-GB';

export const fr = {
    "languageLabel": "Langue de l’application",
    "languageHint": "Termine la manche avant de changer de langue.",
    "privateClub": "CLUB PRIVÉ DEBILUS",
    "motto": "PAS D’ARGENT. JUSTE DU CARACTÈRE.",
    "offline": "LOCAL / HORS LIGNE",
    "play": "Jouer",
    "statistics": "Statistiques",
    "rules": "Règles",
    "club": "LE CLUB DE SELENA · TABLE 01",
    "headline": "La chance a du mordant.",
    "tagline": "Six jeux. Une croupière. Ton ego en jeu.",
    "confident": "Selena te regarde avec assurance.",
    "online": "● EN LIGNE",
    "identity": "Androïde · Punk · Mauvaise perdante",
    "welcome": "100 Debilus. Voyons combien de temps tu les gardes.",
    "shoe": "Sabot de six jeux",
    "pays": "PAIE 3 POUR 2",
    "stands": "LE CROUPIER RESTE SUR TOUT 17",
    "yourHand": "TA MAIN",
    "placeBet": "La table est à toi. Place ta mise.",
    "chip": "Jeton Selena",
    "yourBet": "TA MISE",
    "betLabel": "Mise en points Debilus",
    "deal": "Distribuer ↗",
    "hit": "Tirer +",
    "stand": "Rester ✋",
    "double": "Doubler ×2",
    "localSave": "POINTS VIRTUELS UNIQUEMENT · SAUVEGARDE LOCALE AUTOMATIQUE",
    "statsEyebrow": "TON PASSAGE AU CLUB",
    "statsHeadline": "Les chiffres parlent.",
    "reset": "Réinitialiser la progression",
    "rulesEyebrow": "LES RÈGLES DE LA TABLE",
    "rulesHeadline": "Vise 21. Garde ton sang-froid.",
    "rule1": "Tu commences avec 100 points Debilus virtuels. Mise un nombre entier de points, puis tire ou reste. Les figures valent 10, l’as vaut 1 ou 11 selon ta main.",
    "rule2": "Selena tire jusqu’à 16 et reste dès 17, même souple. Sa deuxième carte reste cachée pendant ton tour. Un blackjack naturel est vérifié dès la distribution ; une égalité rend la mise et un blackjack naturel paie 3:2.",
    "rule3": "Tu peux doubler sur tes deux premières cartes si ton solde couvre la mise supplémentaire : tu reçois exactement une carte, puis Selena joue. Cette table ne propose ni partage, ni assurance, ni abandon.",
    "rule4": "Le sabot contient 6 jeux de 52 cartes et est mélangé avant une manche s’il reste moins de 52 cartes. Aucun avantage artificiel pour Selena.",
    "rule5": "Solde, statistiques et 30 dernières manches sont conservés dans ce navigateur. Une manche commencée est débitée immédiatement ; quitter pendant une manche compte comme une défaite. À zéro, utilise la réinitialisation confirmée pour repartir avec 100 points.",
    "saveUnavailable": " · Sauvegarde indisponible",
    "cards": "CARTES",
    "hiddenCard": "Carte face cachée",
    "win": "Victoire",
    "loss": "Défaite",
    "push": "Égalité",
    "blackjackResult": "Blackjack !",
    "bust": "Le but, c’est d’atteindre 21, pas de mesurer l’étendue de ta connerie.",
    "invalidBet": "Choisis une mise entière entre 1 et ton solde.",
    "dealing": "Distribution…",
    "dealReply": "Fais tes calculs. Je fais les miens.",
    "yourTurn": "À toi de jouer.",
    "hitReply": "Encore une ? Ton optimisme est fascinant.",
    "doubleReply": "Deux fois la mise. Deux fois plus de panache.",
    "wins": "Victoires",
    "losses": "Défaites",
    "pushes": "Égalités",
    "blackjacks": "Blackjacks",
    "gained": "Points gagnés",
    "lost": "Points perdus",
    "dealtCards": "Cartes distribuées",
    "frequencies": "Fréquences absolues, y compris les cartes cachées et les manches interrompues.",
    "history": "Dernières manches",
    "emptyHistory": "La table attend ta première manche.",
    "bet": "Mise",
    "finishBeforeReset": "Termine la manche avant de réinitialiser.",
    "confirmReset": "Effacer le solde, les statistiques et l’historique pour repartir avec 100 Debilus ?",
    "smug": "Selena affiche un sourire moqueur et triomphant.",
    "annoyed": "Selena fronce les sourcils, contrariée par ta victoire.",
    "surprised": "Selena ouvre de grands yeux, surprise.",
    "unimpressed": "Selena prend un air blasé devant cette égalité."
};

export const en: Record<keyof typeof fr, string> = {
    "languageLabel": "Application language",
    "languageHint": "Finish the round before changing language.",
    "privateClub": "DEBILUS PRIVATE CLUB",
    "motto": "NO CASH. JUST ATTITUDE.",
    "offline": "LOCAL / OFFLINE",
    "play": "Play",
    "statistics": "Statistics",
    "rules": "Rules",
    "club": "SELENA’S CLUB · TABLE 01",
    "headline": "Luck has a bite.",
    "tagline": "Six decks. One dealer. Your ego at stake.",
    "confident": "Selena looks at you confidently.",
    "online": "● ONLINE",
    "identity": "Android · Punk · Sore loser",
    "welcome": "100 Debilus. Let’s see how long you keep them.",
    "shoe": "Six-deck shoe",
    "pays": "PAYS 3 TO 2",
    "stands": "DEALER STANDS ON ALL 17s",
    "yourHand": "YOUR HAND",
    "placeBet": "The table is yours. Place your bet.",
    "chip": "Selena chip",
    "yourBet": "YOUR BET",
    "betLabel": "Bet in Debilus points",
    "deal": "Deal ↗",
    "hit": "Hit +",
    "stand": "Stand ✋",
    "double": "Double ×2",
    "localSave": "VIRTUAL POINTS ONLY · AUTOMATIC LOCAL SAVE",
    "statsEyebrow": "YOUR TIME AT THE CLUB",
    "statsHeadline": "The numbers speak.",
    "reset": "Reset progress",
    "rulesEyebrow": "TABLE RULES",
    "rulesHeadline": "Aim for 21. Keep your cool.",
    "rule1": "You start with 100 virtual Debilus points. Bet a whole number of points, then hit or stand. Face cards are worth 10; an ace counts as 1 or 11 depending on your hand.",
    "rule2": "Selena hits on 16 or less and stands on all 17s, including soft 17. Her second card stays hidden during your turn. Natural blackjacks are checked after the initial deal; a push returns your bet and a natural blackjack pays 3:2.",
    "rule3": "You may double on your first two cards if your balance covers the extra bet: you receive exactly one card, then Selena plays. This table does not offer splitting, insurance or surrender.",
    "rule4": "The shoe contains six 52-card decks and is shuffled before a round if fewer than 52 cards remain. Selena gets no artificial advantage.",
    "rule5": "Your balance, statistics and last 30 rounds are saved in this browser. Your bet is deducted immediately; leaving during a round counts as a loss. At zero, confirm a progress reset to start again with 100 points.",
    "saveUnavailable": " · Saving unavailable",
    "cards": "CARDS",
    "hiddenCard": "Face-down card",
    "win": "Win",
    "loss": "Loss",
    "push": "Push",
    "blackjackResult": "Blackjack!",
    "bust": "The goal is to reach 21, not to measure the full extent of your stupidity.",
    "invalidBet": "Choose a whole-number bet between 1 and your balance.",
    "dealing": "Dealing…",
    "dealReply": "Do your calculations. I’m doing mine.",
    "yourTurn": "Your turn.",
    "hitReply": "Another one? Your optimism is fascinating.",
    "doubleReply": "Twice the bet. Twice the swagger.",
    "wins": "Wins",
    "losses": "Losses",
    "pushes": "Pushes",
    "blackjacks": "Blackjacks",
    "gained": "Points won",
    "lost": "Points lost",
    "dealtCards": "Cards dealt",
    "frequencies": "Total counts, including hidden cards and interrupted rounds.",
    "history": "Recent rounds",
    "emptyHistory": "The table is waiting for your first round.",
    "bet": "Bet",
    "finishBeforeReset": "Finish the round before resetting.",
    "confirmReset": "Erase your balance, statistics and history and start again with 100 Debilus?",
    "smug": "Selena wears a smug, triumphant smile.",
    "annoyed": "Selena frowns, annoyed by your victory.",
    "surprised": "Selena opens her eyes wide in surprise.",
    "unimpressed": "Selena looks unimpressed by the push."
};

export const t = language === 'fr' ? fr : en;

export function streakReply(count: number): string {
    return language === 'fr'
        ? `${count} victoires d'affilée... C'est statistiquement suspect. Ludo, si t'es dans le coin, dégage !`
        : `${count} wins in a row... That’s statistically suspicious. Ludo, if you’re around, piss off!`;
}

// Les anciennes sauvegardes contiennent des dates françaises : on les garde intactes.
// Les nouvelles dates ISO peuvent être affichées dans les deux langues sans perte.
export function formatHistoryDate(value: string): string {
    if (!/^\d{4}-\d{2}-\d{2}T/.test(value)) return value;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString(locale);
}
