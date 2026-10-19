# Blackjack Debilus

## Langues

L’application sélectionne au chargement la première langue prise en charge dans
`navigator.languages` (ou `navigator.language` si la liste est vide) : français
pour `fr`, `fr-BE`, `fr-CA`, etc., anglais pour `en`, `en-US`, etc. Si aucune
préférence n’est prise en charge, elle utilise l’anglais. Recharger l’application
après avoir changé les préférences linguistiques du navigateur.

Les textes d’interface se trouvent dans `src/i18n.ts` ; les 24 répliques françaises
personnalisées de Selena et leurs traductions anglaises sont dans
`src/selena-dialogue.ts`. Les répliques de dépassement de 21, de série de victoires
et d’action sont dans `src/i18n.ts`. Aucune traduction distante n’est utilisée.
Les sauvegardes existantes restent compatibles ; les anciennes dates d’historique
gardent leur affichage d’origine, les nouvelles s’affichent dans la langue choisie.

Jeu local en TypeScript, HTML et CSS, avec Vite. Node.js 22.18+ recommandé.

```powershell
npm install
npm run dev
```

Ouvrir l’adresse locale affichée. Le serveur Vite ne sert que les fichiers sur votre ordinateur : aucun serveur de jeu, aucune API ni base distante. Après installation, aucune connexion Internet n’est nécessaire.

`npm test` vérifie le moteur ; `npm run build` vérifie TypeScript et produit `dist/`. `npm run preview` sert cette compilation localement. Conserver la même adresse et le même port pour retrouver la sauvegarde localStorage.

Architecture : `src/engine.ts` contient les règles pures, `src/storage.ts` la persistance, `src/main.ts` l’interface et les séquences de distribution, `src/style.css` la présentation responsive. Le portrait `public/selena.png` provient de la référence fournie.

Les cartes partent du sabot avec Web Animations pendant 400 ms. Le retournement dure également 400 ms. Le mode de réduction des animations du système est respecté. Les actions sont verrouillées pendant la distribution.

Variantes : sans partage, assurance ni abandon ; double sur les deux premières cartes. Une fermeture pendant une manche conserve la mise débitée et compte une défaite. Les manches interrompues ne figurent pas dans l’historique des manches terminées. Le jeton utilise une caricature emoji de Selena ; ce n’est pas une illustration personnalisée. Les statistiques de rang comptent toutes les cartes distribuées, y compris cachées.
# BlackjackGPT
