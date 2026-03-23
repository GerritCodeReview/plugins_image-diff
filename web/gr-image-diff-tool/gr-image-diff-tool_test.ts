/**
 * @license
 * Copyright (C) 2018 The Android Open Source Project
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
import './gr-image-diff-tool';
import {ImageDiffTool} from './gr-image-diff-tool';
import {fixture, html, assert} from '@open-wc/testing';
import sinon from 'sinon';

suite('gr-image-diff-tool tests', () => {
  let element: ImageDiffTool;
  let sandbox: sinon.SinonSandbox;

  setup(async () => {
    sandbox = sinon.createSandbox();
    element = await fixture<ImageDiffTool>(
      html`<gr-image-diff-tool></gr-image-diff-tool>`
    );
    await element.updateComplete;
  });

  teardown(() => {
    sandbox.restore();
  });

  test('test opacity mode', async () => {
    (element as any)._observeMode = 'opacity';
    await element.updateComplete;
    assert.isTrue((element as any)._showOpacityMode);
    assert.isFalse((element as any)._showResembleMode);

    assert.isOk(element.shadowRoot!.querySelector('gr-opacity-diff-mode'));
    assert.isNull(element.shadowRoot!.querySelector('gr-resemble-diff-mode'));
  });

  test('test resemble mode', async () => {
    (element as any)._observeMode = 'resemble';
    await element.updateComplete;
    assert.isTrue((element as any)._showResembleMode);
    assert.isFalse((element as any)._showOpacityMode);

    assert.isOk(element.shadowRoot!.querySelector('gr-resemble-diff-mode'));
    assert.isNull(element.shadowRoot!.querySelector('gr-opacity-diff-mode'));
  });

  test('localStorage persists', () => {
    sandbox.stub(element as any, '_setMode');
    sandbox.stub(element as any, '_getMode');
    element.connectedCallback();
    assert.equal((element as any)._getMode.callCount, 1);
    assert.equal((element as any)._setMode.callCount, 1);
    (element as any)._observeMode = 'opacity';
    assert.equal((element as any)._setMode.callCount, 2);
    (element as any)._observeMode = 'resemble';
    assert.equal((element as any)._setMode.callCount, 3);
  });
});
