/**
 * @license
 * Copyright (C) 2026 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import '../../../test/common-test-setup';
import './gr-opacity-diff-mode';
import {OpacityDiffMode} from './gr-opacity-diff-mode';
import {fixture, html, assert} from '@open-wc/testing';

function getComputedStyleValue(name: string, el: HTMLElement) {
  let style;
  if ((window as any).ShadyCSS) {
    style = (window as any).ShadyCSS.getComputedStyleValue(el, name);
  } else if ((el as any).getComputedStyleValue) {
    style = ((el as any).getComputedStyleValue(name));
  } else {
    style = getComputedStyle(el).getPropertyValue(name);
  }
  return style;
}

suite('gr-opacity-diff-tool tests', () => {
  let element: OpacityDiffMode;

  setup(async () => {
    element = await fixture<OpacityDiffMode>(
      html`<gr-opacity-diff-mode></gr-opacity-diff-mode>`
    );
  });

  test('slider changes opacity of image', () => {
    const arrayOfNumbers = [0.73, 0.5, 0.0];
    const opacitySlider = element.shadowRoot!.querySelector(
      '#opacitySlider'
    ) as HTMLInputElement;
    arrayOfNumbers.forEach(number => {
      assert.notEqual(getComputedStyleValue('--my-opacity-value', element), String(number));
      opacitySlider.value = String(number);
      // Mock firing input event
      opacitySlider.dispatchEvent(new Event('input'));
      element.handleOpacityChange({target: opacitySlider} as any);
      assert.equal(getComputedStyleValue('--my-opacity-value', element).trim(), String(number));
    });
  });

  test('create the src string for images', () => {
    element.revisionImage = {
      type: 'IMG/src',
      body: 'Zx3Cgffk=',
    };
    const expectedOutcome = 'data:IMG/src;base64, Zx3Cgffk=';
    assert.equal(element.computeSrcString(element.revisionImage), expectedOutcome);
  });

  test('size scaling', async () => {
    (element as any).maxWidth = 200;
    (element as any).maxHeight = 400;

    assert.equal(getComputedStyleValue('--img-width', element).trim(), '');
    assert.equal(getComputedStyleValue('--img-height', element).trim(), '');
    const scaleSizesToggle = element.shadowRoot!.querySelector(
      '#scaleSizesToggle'
    ) as HTMLInputElement;

    scaleSizesToggle.checked = true;
    scaleSizesToggle.dispatchEvent(new Event('click'));
    element.handleScaleSizesToggle({target: scaleSizesToggle} as any);
    await element.updateComplete;

    assert.equal(getComputedStyleValue('--img-width', element).trim(), '200px');
    assert.equal(getComputedStyleValue('--img-height', element).trim(), '400px');
  });

  test('resize the div container for base & revision image comparison', async () => {
    assert.equal(getComputedStyleValue('--div-height', element).trim(), '');
    (element as any).maxHeight = 500;
    (element as any).maxWidth = 300;
    await element.updateComplete;

    assert.equal(getComputedStyleValue('--div-height', element).trim(), '500px');
  });
});
