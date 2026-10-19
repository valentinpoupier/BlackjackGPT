import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSelenaPortrait, portraits } from './selena.ts';

class PreloadedImage {
    static instances: PreloadedImage[] = [];
    src = '';
    onload = () => {};
    onerror = () => {};

    constructor() {
        PreloadedImage.instances.push(this);
    }
}

Object.defineProperty(globalThis, 'Image', { value: PreloadedImage, configurable: true });
Object.defineProperty(globalThis, 'matchMedia', {
    value: () => ({ matches: true }),
    configurable: true,
});

function createPortrait() {
    PreloadedImage.instances = [];
    const image = {
        src: portraits.confident.src,
        alt: portraits.confident.description,
        dataset: { expression: 'confident' },
    };
    const setExpression = createSelenaPortrait(image as unknown as HTMLImageElement);
    return { image, setExpression, preloads: [...PreloadedImage.instances] };
}

test('a loaded reaction updates both the portrait and its accessible description', async () => {
    const { image, setExpression, preloads } = createPortrait();
    preloads.forEach(preload => preload.onload());
    await setExpression('annoyed');
    assert.equal(image.src, portraits.annoyed.src);
    assert.equal(image.alt, portraits.annoyed.description);
    assert.equal(image.dataset.expression, 'annoyed');
    await setExpression('confident');
    assert.equal(image.src, portraits.confident.src);
});

test('a late image load cannot overwrite the more recent reaction', async () => {
    const { image, setExpression, preloads } = createPortrait();
    const oldReaction = setExpression('smug');
    const newReaction = setExpression('surprised');
    preloads.find(preload => preload.src === portraits.surprised.src)!.onload();
    await newReaction;
    preloads.find(preload => preload.src === portraits.smug.src)!.onload();
    await oldReaction;
    assert.equal(image.src, portraits.surprised.src);
});

test('a missing asset keeps the current portrait visible', async () => {
    const { image, setExpression, preloads } = createPortrait();
    const reaction = setExpression('unimpressed');
    preloads.find(preload => preload.src === portraits.unimpressed.src)!.onerror();
    await reaction;
    assert.equal(image.src, portraits.confident.src);
});
