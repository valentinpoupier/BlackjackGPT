import { t } from './i18n.ts';

// Les réactions appartiennent uniquement à l'interface : elles ne changent aucune règle.
export const portraits = {
    confident: {
        src: '/selena-casino.png',
        description: t.confident,
    },
    smug: {
        src: '/selena-smug.png',
        description: t.smug,
    },
    annoyed: {
        src: '/selena-annoyed.png',
        description: t.annoyed,
    },
    surprised: {
        src: '/selena-surprised.png',
        description: t.surprised,
    },
    unimpressed: {
        src: '/selena-unimpressed.png',
        description: t.unimpressed,
    },
} as const;

export type SelenaExpression = keyof typeof portraits;

/** Précharge les portraits et ignore les changements devenus obsolètes pendant le chargement. */
export function createSelenaPortrait(image: HTMLImageElement) {
    let currentExpression: SelenaExpression = 'confident';
    let latestRequest = 0;
    let animation: Animation | undefined;

    const loadedPortraits = new Map<SelenaExpression, Promise<boolean>>();
    for (const [expression, portrait] of Object.entries(portraits)) {
        const preload = new Image();
        const loaded = new Promise<boolean>(resolve => {
            preload.onload = () => resolve(true);
            preload.onerror = () => resolve(false);
        });
        preload.src = portrait.src;
        loadedPortraits.set(expression as SelenaExpression, loaded);
    }

    return async function setExpression(expression: SelenaExpression) {
        const request = ++latestRequest;
        const loaded = await loadedPortraits.get(expression);

        // En cas d'image indisponible, conserver le portrait actuel plutôt qu'une image cassée.
        if (!loaded || request !== latestRequest || expression === currentExpression) return;

        currentExpression = expression;
        image.src = portraits[expression].src;
        image.alt = portraits[expression].description;
        image.dataset.expression = expression;

        animation?.cancel();
        if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
            animation = image.animate(
                [{ opacity: 0.65 }, { opacity: 1 }],
                { duration: 220, easing: 'ease-out' },
            );
        }
    };
}
