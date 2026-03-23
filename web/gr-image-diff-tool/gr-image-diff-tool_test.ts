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


import './gr-image-diff-tool';
import {ImageDiffTool} from './gr-image-diff-tool';
import {fixture, html, assert} from '@open-wc/testing';
import sinon from 'sinon';

suite('gr-image-diff-tool tests', () => {
  let element: ImageDiffTool;
  let sandbox: sinon.SinonSandbox;

  setup(async () => {
    sandbox = sinon.createSandbox();
    (window as any).resemble = {
      outputSettings: sandbox.stub(),
      compareTo: sandbox.stub().returnsThis(),
      onComplete: sandbox.stub(),
    };
    const resembleStub: any = sandbox.stub().returns((window as any).resemble);
    resembleStub.outputSettings = (window as any).resemble.outputSettings;
    (window as any).resemble = resembleStub;
    element = await fixture<ImageDiffTool>(
      html`<gr-image-diff-tool></gr-image-diff-tool>`
    );
    await element.updateComplete;
  });

  teardown(() => {
    sandbox.restore();
  });

  test('test opacity mode', async () => {
    (element as any).observeMode = 'opacity';
    await element.updateComplete;
    await element.updateComplete;
    assert.isTrue((element as any).showOpacityMode);
    assert.isFalse((element as any).showResembleMode);

    assert.isOk(element.shadowRoot!.querySelector('gr-opacity-diff-mode'));
    assert.isNull(element.shadowRoot!.querySelector('gr-resemble-diff-mode'));
  });

  test('test resemble mode', async () => {
    (element as any).observeMode = 'resemble';
    await element.updateComplete;
    await element.updateComplete;
    assert.isTrue((element as any).showResembleMode);
    assert.isFalse((element as any).showOpacityMode);

    assert.isOk(element.shadowRoot!.querySelector('gr-resemble-diff-mode'));
    assert.isNull(element.shadowRoot!.querySelector('gr-opacity-diff-mode'));
  });

  test('localStorage persists', async () => {
    sandbox.stub(element as any, 'setMode');
    sandbox.stub(element as any, 'getMode');
    element.connectedCallback();
    assert.equal((element as any).getMode.callCount, 1);
    assert.equal((element as any).setMode.callCount, 1);
    (element as any).observeMode = 'opacity';
    await element.updateComplete;
    await element.updateComplete;
    assert.equal((element as any).setMode.callCount, 2);
    (element as any).observeMode = 'resemble';
    await element.updateComplete;
    await element.updateComplete;
    assert.equal((element as any).setMode.callCount, 3);
  });
});
