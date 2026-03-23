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
  private showResembleMode = false;

  @state()
  private showOpacityMode = false;

  @state()
  private observeMode = '';

  override render() {
    return html`
      <div id="header">
        <h3>Image diff</h3>
        <select
          .value=${this.observeMode}
          @change=${this.handleSelectChange}
          id="dropdown"
        >
          <option
            value="resemble"
            title="Scale the images to the same size and compute a diff with highlights"
            >Highlight differences</option
          >
          <option
            value="opacity"
            title="Overlay the new image over the old and use an opacity control to view the differences"
            >Onion skin</option
          >
        </select>
      </div>
      <div class="diffmode">
        ${this.showResembleMode
          ? html`
              <gr-resemble-diff-mode
                .baseImage=${this.baseImage}
                .revisionImage=${this.revisionImage}
              ></gr-resemble-diff-mode>
            `
          : ''}
      </div>
      <div class="diffmode">
        ${this.showOpacityMode
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
    if (changedProperties.has('observeMode')) {
      this.handleSelect(this.observeMode);
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    if (!this.baseImage || !this.revisionImage) {
      // No need to show the diff tool if there are no images.
      this.hidden = true;
    }
    const diff_mode = this.getMode();
    diff_mode === DiffModes.OPACITY
      ? this.displayOpacityMode()
      : this.displayResembleMode();
  }

  private getMode() {
    return window.localStorage.getItem('image-diff-mode');
  }

  private setMode(mode: string) {
    window.localStorage.setItem('image-diff-mode', mode);
  }

  private handleSelectChange(e: Event) {
    this.observeMode = (e.target as HTMLSelectElement).value;
  }

  private handleSelect(mode: string) {
    mode === DiffModes.OPACITY
      ? this.displayOpacityMode()
      : this.displayResembleMode();
  }

  private displayResembleMode() {
    this.observeMode = DiffModes.RESEMBLE;
    this.showResembleMode = true;
    this.showOpacityMode = false;
    this.setMode(DiffModes.RESEMBLE);
  }

  private displayOpacityMode() {
    this.observeMode = DiffModes.OPACITY;
    this.showResembleMode = false;
    this.showOpacityMode = true;
    this.setMode(DiffModes.OPACITY);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gr-image-diff-tool': ImageDiffTool;
  }
}
