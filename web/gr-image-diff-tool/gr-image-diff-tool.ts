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

import {html, css, LitElement, PropertyValues} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {ImageInfo} from '../gr-opacity-diff-mode/gr-opacity-diff-mode';
import '../gr-opacity-diff-mode/gr-opacity-diff-mode';
import '../gr-resemble-diff-mode/gr-resemble-diff-mode';

const DiffModes = {
  OPACITY: 'opacity',
  RESEMBLE: 'resemble',
};

@customElement('gr-image-diff-tool')
export class ImageDiffTool extends LitElement {
  static override get styles() {
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
          padding: 0.5em;
          width: 100%;
        }
        h3 {
          padding: 0 0.5em;
        }
        #dropdown {
          background-color: var(--view-background-color);
          border: 1px solid var(--border-color);
          border-radius: 2px;
          color: var(--primary-text-color);
          font-size: var(--font-size-normal);
          height: 2em;
          margin-left: 1em;
          padding: 0 0.15em;
        }
        .diffmode {
          align-items: center;
          display: flex;
          justify-content: center;
        }
      `
    ];
  }

  @property({type: Object})
  baseImage?: ImageInfo;

  @property({type: Object})
  revisionImage?: ImageInfo;

  @property({type: Boolean, reflect: true})
  override hidden = false;

  @state()
  private _showResembleMode = false;

  @state()
  private _showOpacityMode = false;

  @state()
  private _observeMode = '';

  override render() {
    return html`
      <div id="header">
        <h3>Image diff</h3>
        <select
          .value=${this._observeMode}
          @change=${this._handleSelectChange}
          id="dropdown"
        >
          <option
            value="resemble"
            title="Scale the images to the same size and compute a diff with highlights"
            >Mito differences</option
          >
          <option
            value="opacity"
            title="Overlay the new image over the old and use an opacity control to view the differences"
            >Onion skin</option
          >
        </select>
      </div>
      <div class="diffmode">
        ${this._showResembleMode
          ? html`
              <gr-resemble-diff-mode
                .baseImage=${this.baseImage}
                .revisionImage=${this.revisionImage}
              ></gr-resemble-diff-mode>
            `
          : ''}
      </div>
      <div class="diffmode">
        ${this._showOpacityMode
          ? html`
              <gr-opacity-diff-mode
                .baseImage=${this.baseImage}
                .revisionImage=${this.revisionImage}
              ></gr-opacity-diff-mode>
            `
          : ''}
      </div>
    `;
  }

  override updated(changedProperties: PropertyValues) {
    if (changedProperties.has('_observeMode')) {
      this._handleSelect(this._observeMode);
    }
  }

  override connectedCallback() {
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

  private _getMode() {
    return window.localStorage.getItem('image-diff-mode');
  }

  private _setMode(mode: string) {
    window.localStorage.setItem('image-diff-mode', mode);
  }

  private _handleSelectChange(e: Event) {
    this._observeMode = (e.target as HTMLSelectElement).value;
  }

  private _handleSelect(mode: string) {
    mode === DiffModes.OPACITY
      ? this._displayOpacityMode()
      : this._displayResembleMode();
  }

  private _displayResembleMode() {
    this._observeMode = DiffModes.RESEMBLE;
    this._showResembleMode = true;
    this._showOpacityMode = false;
    this._setMode(DiffModes.RESEMBLE);
  }

  private _displayOpacityMode() {
    this._observeMode = DiffModes.OPACITY;
    this._showResembleMode = false;
    this._showOpacityMode = true;
    this._setMode(DiffModes.OPACITY);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gr-image-diff-tool': ImageDiffTool;
  }
}
