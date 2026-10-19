import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectLanguage, fr, en, formatHistoryDate } from './i18n.ts';
import { dialogue } from './selena-dialogue.ts';

test('French regional preferences select French', () => {
    for (const preference of ['fr', 'fr-BE', 'fr-CA', 'FR-fr', 'fr_CH']) {
        assert.equal(detectLanguage([preference]), 'fr');
    }
});

test('English regional preferences select English', () => {
    for (const preference of ['en', 'en-US', 'en-GB', 'en-AU']) {
        assert.equal(detectLanguage([preference]), 'en');
    }
});

test('the first supported preference wins, with English as fallback', () => {
    assert.equal(detectLanguage(['en-US', 'fr-BE']), 'en');
    assert.equal(detectLanguage(['fr-BE', 'en-US']), 'fr');
    assert.equal(detectLanguage(['nl-BE', 'fr-BE', 'en-US']), 'fr');
    assert.equal(detectLanguage(['de-DE', 'ja-JP']), 'en');
    assert.equal(detectLanguage([]), 'en');
    assert.equal(detectLanguage(['french', 'enough']), 'en');
});

test('both languages have complete nonempty interface and dialogue translations', () => {
    assert.deepEqual(Object.keys(fr).sort(), Object.keys(en).sort());
    for (const bundle of [fr, en]) {
        for (const message of Object.values(bundle)) {
            assert.ok(message.trim().length > 0);
        }
    }
    for (const result of ['win', 'loss', 'push', 'blackjack'] as const) {
        assert.equal(dialogue.fr[result].length, 6);
        assert.equal(dialogue.en[result].length, dialogue.fr[result].length);
        assert.ok(dialogue.en[result].every(reply => reply.trim().length > 0));
    }
    assert.equal(dialogue.fr.blackjack[3], 'Putain, un blackjack. Lydia ne me croira jamais.');
});

test('legacy history dates are preserved and new ISO dates are readable', () => {
    const legacyDate = '20/10/2026 15:30:00';
    assert.equal(formatHistoryDate(legacyDate), legacyDate);
    assert.equal(formatHistoryDate('invalid date'), 'invalid date');
    assert.notEqual(formatHistoryDate('2026-10-20T15:30:00.000Z'), '2026-10-20T15:30:00.000Z');
});

test('browser language selects the matching messages and number locale at startup', async () => {
    const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
    try {
        Object.defineProperty(globalThis, 'navigator', {
            configurable: true,
            value: { languages: ['fr-BE', 'en-US'], language: 'fr-BE' },
        });
        const french = await import('./i18n.ts?browser-fr');
        assert.equal(french.language, 'fr');
        assert.equal(french.t.play, 'Jouer');
        assert.equal(french.locale, 'fr-FR');
        assert.match(french.streakReply(3), /^3 victoires/);

        Object.defineProperty(globalThis, 'navigator', {
            configurable: true,
            value: { languages: [], language: 'en-US' },
        });
        const english = await import('./i18n.ts?browser-en');
        assert.equal(english.language, 'en');
        assert.equal(english.t.play, 'Play');
        assert.equal(english.locale, 'en-GB');
        assert.match(english.streakReply(3), /^3 wins/);
    } finally {
        if (originalNavigator) Object.defineProperty(globalThis, 'navigator', originalNavigator);
        else Reflect.deleteProperty(globalThis, 'navigator');
    }
});
