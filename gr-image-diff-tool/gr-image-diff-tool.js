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

import {html, css, LitElement} from 'lit';
import '../gr-opacity-diff-mode/gr-opacity-diff-mode.js';
import '../gr-resemble-diff-mode/gr-resemble-diff-mode.js';

const DiffModes = {
  OPACITY: 'opacity',
  RESEMBLE: 'resemble',
};

class ImageDiffTool extends LitElement {
  static get is() {
    return 'gr-image-diff-tool';
  }

  static get styles() {
    return [
      css`
        :host {
          background-color: var(--table-header-background-color, #fafafa);
          display: block;
          font-family: var(--font-family);
        }
        #header {
          align-items: center;
          border-bottom: 1px solid var(--border-color, #ddd);
          border-top: 1px solid var(--border-color, #ddd);
          display: inline-flex;
          padding: .5em;
          width: 100%;
        }
        h3 {
          padding: 0 .5em;
        }
        #dropdown {
          background-color: var(--view-background-color);
          border: 1px solid var(--border-color);
          border-radius: 2px;
          color: var(--primary-text-color);
          font-size: var(--font-size-normal);
          height: 2em;
          margin-left: 1em;
          padding: 0 .15em;
        }
        .diffmode {
          align-items: center;
          display: flex;
          justify-content: center;
        }
      `
    ];
  }

  render() {
    return html`
      <div id="header">
        <h3>Image diff</h3>
        <select .value=${this._observeMode} @change=${this._handleSelectChange} id="dropdown">
          <option value="resemble" title="Scale the images to the same size and compute a diff with highlights">Highlight differences</option>
          <option value="opacity" title="Overlay the new image over the old and use an opacity control to view the differences">Onion skin</option>
        </select>
      </div>
      <div class="diffmode">
        ${this._showResembleMode ? html`
          <gr-resemble-diff-mode
              .baseImage=${this.baseImage}
              .revisionImage=${this.revisionImage}></gr-resemble-diff-mode>
        ` : ''}
      </div>
      <div class="diffmode">
        ${this._showOpacityMode ? html`
          <gr-opacity-diff-mode
              .baseImage=${this.baseImage}
              .revisionImage=${this.revisionImage}></gr-opacity-diff-mode>
        ` : ''}
      </div>
    `;
  }

  static get properties() {
    return {
      baseImage: {type: Object},
      revisionImage: {type: Object},
      hidden: {type: Boolean, reflect: true},
      _showResembleMode: {type: Boolean},
      _showOpacityMode: {type: Boolean},
      _observeMode: {type: String},
    };
  }

  constructor() {
    super();
    this.hidden = false;
    this._showResembleMode = false;
    this._showOpacityMode = false;
    this._observeMode = '';
  }

  updated(changedProperties) {
    if (changedProperties.has('_observeMode')) {
      this._handleSelect(this._observeMode);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.baseImage || !this.revisionImage) {
      // No need to show the diff tool if there are no images.
      this.hidden = true;
    }
    const diff_mode = this._getMode();
    diff_mode === DiffModes.OPACITY
      ? this._displayOpacityMode()
      : this._displayResembleMode();
  }

  _getMode() {
    return window.localStorage.getItem('image-diff-mode');
  }

  _setMode(mode) {
    window.localStorage.setItem('image-diff-mode', mode);
  }

  _handleSelectChange(e) {
    this._observeMode = e.target.value;
  }

  _handleSelect(mode) {
    mode === DiffModes.OPACITY
      ? this._displayOpacityMode()
      : this._displayResembleMode();
  }

  _displayResembleMode() {
    this._observeMode = DiffModes.RESEMBLE;
    this._showResembleMode = true;
    this._showOpacityMode = false;
    this._setMode(DiffModes.RESEMBLE);
  }

  _displayOpacityMode() {
    this._observeMode = DiffModes.OPACITY;
    this._showResembleMode = false;
    this._showOpacityMode = true;
    this._setMode(DiffModes.OPACITY);
  }
}

customElements.define(ImageDiffTool.is, ImageDiffTool);