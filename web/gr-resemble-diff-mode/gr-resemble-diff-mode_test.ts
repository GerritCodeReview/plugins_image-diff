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
import './gr-resemble-diff-mode';
import {ResembleDiffMode} from './gr-resemble-diff-mode';
import {fixture, html, assert} from '@open-wc/testing';
import sinon from 'sinon';
import 'resemblejs/resemble.js';

suite('gr-resemble-diff-mode tests', () => {
  let element: ResembleDiffMode;
  let sandbox: sinon.SinonSandbox;

  setup(async () => {
    sandbox = sinon.createSandbox();
    element = await fixture<ResembleDiffMode>(
      html`<gr-resemble-diff-mode></gr-resemble-diff-mode>`
    );
  });

  teardown(() => {
    sandbox.restore();
  });

  test('test initialization', () => {
    assert.isOk(element);
    assert.isUndefined(element.baseImage);
    assert.isUndefined(element.revisionImage);
  });

  test('setImageDiffSrc', () => {
    const img = element.shadowRoot!.querySelector('#imageDiff') as HTMLImageElement;
    const src = 'data:image/png;base64,SGVsbG8=';
    assert.notOk(img.getAttribute('src'));
    (element as any).setImageDiffSrc(src);
    assert.equal(img.getAttribute('src'), src);
  });

  test('setDifferenceValue', () => {
    const expected = 0.15;
    (element as any).setDifferenceValue(expected);
    assert.equal((element as any).difference, expected);
  });

  test('maybeIgnoreColors', () => {
    const dummyProcess = {
      ignoreColors: sandbox.stub(),
      ignoreNothing: sandbox.stub(),
    };
    (element as any).maybeIgnoreColors(dummyProcess, false);
    assert.isFalse(dummyProcess.ignoreColors.called);
    assert.isTrue(dummyProcess.ignoreNothing.called);
    (element as any).maybeIgnoreColors(dummyProcess, true);
    assert.isTrue(dummyProcess.ignoreColors.called);
  });

  test('setOutputSetting', async () => {
    sandbox.stub(window.resemble, 'outputSettings');
    (element as any).transparent = true;
    (element as any).colorValue = '#00ffff';
    const expectedResult = {
      transparency: 0.1,
      errorColor: {
        red: 0,
        green: 255,
        blue: 255,
      },
    };
    try {
      (element as any).createDiffProcess('base', 'rev', false);
    } catch(e) { /* might throw because of dummy image data, we only care about outputSettings call */ }
    await element.updateComplete;

    assert.isTrue((window.resemble.outputSettings as any).called);
    sinon.assert.calledWith(window.resemble.outputSettings as any, expectedResult);
  });

  test('handleIgnoreColorsToggle', async () => {
    sandbox.stub(element, 'reload');
    (element as any).ignoreColors = false;
    const ignoreColorsToggle = element.shadowRoot!.getElementById('ignoreColorsToggle') as HTMLInputElement;
    assert.isFalse(ignoreColorsToggle.checked);
    ignoreColorsToggle.checked = true;
    ignoreColorsToggle.dispatchEvent(new Event('click'));
    (element as any).handleIgnoreColorsToggle({target: ignoreColorsToggle} as any);
    await element.updateComplete;

    assert.isTrue((element as any).ignoreColors);
    assert.isTrue((element.reload as any).called);
  });

  test('handleTransparentToggle', async () => {
    sandbox.stub(element, 'reload');
    (element as any).transparent = false;
    const transparentToggle = element.shadowRoot!.getElementById('transparentToggle') as HTMLInputElement;
    assert.isFalse(transparentToggle.checked);
    transparentToggle.checked = true;
    transparentToggle.dispatchEvent(new Event('click'));
    (element as any).handleTransparentToggle({target: transparentToggle} as any);
    await element.updateComplete;

    assert.isTrue((element as any).transparent);
    assert.isTrue((element.reload as any).called);
  });

  test('handleColorChange', async () => {
    sandbox.stub(element, 'reload');
    (element as any).colorValue = '';
    await element.updateComplete;

    (element as any).handleColorChange({target: {value: '#ffffff'}} as any);
    assert.isTrue((element.reload as any).called);
  });

  test('hexToRGB', () => {
    const expected = {r: 0, g: 255, b: 255};
    const input = '#00ffff';
    const output = (element as any).hexToRGB(input);
    assert.equal(output.r, expected.r);
    assert.equal(output.g, expected.g);
    assert.equal(output.b, expected.b);
  });

  test('handleFullScreen', async () => {
    sandbox.stub(element as any, 'handleFullScreen');
    const fullscreenButton = element.shadowRoot!.getElementById('fullscreen') as HTMLButtonElement;
    fullscreenButton.click();
    await element.updateComplete;

    assert.isTrue((element as any).handleFullScreen.called);
  });

  test('calls reload', () => {
    sandbox.stub(element, 'reload');
    element.baseImage = {type: 'IMG/src', body: ''};
    assert.equal((element.reload as any).callCount, 0);
    element.revisionImage = {type: 'IMG/src', body: ''};
    assert.equal((element.reload as any).callCount, 1);
    const ignoreColorsToggle = element.shadowRoot!.getElementById('ignoreColorsToggle') as HTMLInputElement;
    ignoreColorsToggle.click();
    assert.equal((element.reload as any).callCount, 2);
    const transparentToggle = element.shadowRoot!.getElementById('transparentToggle') as HTMLInputElement;
    transparentToggle.click();
    assert.equal((element.reload as any).callCount, 3);
  });
});
