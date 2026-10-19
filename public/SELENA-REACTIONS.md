# Portraits de Selena

Images créées avec l’outil intégré imagegen, à partir de `selena-casino.png`.
Les fichiers sont locaux : aucune génération ni requête externe pendant le jeu.

| Fichier | Expression | Déclencheur |
| --- | --- | --- |
| selena-casino.png | Confiante | Accueil, nouvelle manche, réinitialisation |
| selena-smug.png | Moqueuse | Le joueur tire, perd ou dépasse 21 |
| selena-annoyed.png | Contrariée | Victoire du joueur, y compris séries |
| selena-surprised.png | Surprise | Le joueur double ou obtient un blackjack naturel gagnant |
| selena-unimpressed.png | Blasée | Égalité |

Les réactions de fin de manche ne se déclenchent qu’après le règlement du résultat.
Une égalité entre deux blackjacks utilise donc le portrait blasé.

## Prompts de génération

Tronc commun exact envoyé à imagegen pour chacune des quatre variantes :

> Use case: identity-preserve. Edit this exact illustration to make a facial expression variant for the same blackjack game character. Change ONLY Selena's facial expression: [EXPRESSION] Preserve exact identity, adult woman, red hair, cat ears, clothing, hand under chin, pose, head position and scale, camera framing, composition, casino background, green and gold lighting, anime illustration style, image dimensions. Facial changes must be clearly readable at small portrait size. Keep eyes directed toward viewer. No added text, no extra people, no new objects. One single portrait, not a collage or expression sheet.

Valeurs de `[EXPRESSION]` :

- **smug**: Triumphant teasing grin, narrowed amused green eyes, one raised eyebrow; Selena has just beaten the player.
- **annoyed**: Clearly annoyed but comically dignified: brows drawn down, narrowed eyes, small frustrated pout, closed mouth; the player has beaten Selena.
- **surprised**: Genuinely surprised expression: wide green eyes, both eyebrows raised, mouth slightly open, startled by the player's natural blackjack.
- **unimpressed**: Unimpressed deadpan expression: half-lidded green eyes, flat mouth, bored eyebrows, a dry sarcastic stare after a tied round.
