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

export interface ImageInfo {
  type: string;
  body: string;
}

@customElement('gr-opacity-diff-mode')
export class OpacityDiffMode extends LitElement {
  static override get styles() {
    return [
      css`
        :host {
          display: block;
        }
        .wrapper {
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          margin: 1em 0;
        }
        img {
          display: block;
          height: var(--img-height);
          margin: auto;
          position: absolute;
          width: var(--img-width);
        }
        #imageRevision {
          opacity: var(--my-opacity-value);
          z-index: 0.5;
        }
        #imageDiffContainer {
          height: var(--div-height);
          margin: auto;
          width: var(--div-width);
        }
        #controlsContainer {
          border-top: 1px solid var(--border-color, #ddd);
          display: flex;
        }
        #controlsBox {
          display: flex;
          justify-content: space-between;
          margin: 0 0.5em;
          min-width: 32em;
          width: 100%;
        }
        label {
          align-items: center;
          display: flex;
          padding: 1em 0.5em;
        }
        input {
          margin: 0.5em;
        }
        #opacitySlider {
          width: 10em;
        }
      `
    ];
  }

  @property({type: Object})
  baseImage?: ImageInfo;

  @property({type: Object})
  revisionImage?: ImageInfo;

  @property({type: Number})
  opacityValue = 0.5;

  @state()
  protected maxHeight = 0;

  @state()
  protected maxWidth = 0;

  @state()
  protected scaledWidth: number | null = null;

  @state()
  protected scaledHeight: number | null = null;

  override render() {
    return html`
      <div
        class="wrapper"
        style="
          --my-opacity-value: ${this.opacityValue};
          --img-width: ${this.scaledWidth ? this.scaledWidth + 'px' : 'initial'};
          --img-height: ${this.scaledHeight ? this.scaledHeight + 'px' : 'initial'};
          --div-width: ${this.maxWidth ? this.maxWidth + 'px' : 'initial'};
          --div-height: ${this.maxHeight ? this.maxHeight + 'px' : 'initial'};
      "
      >
        <div id="imageDiffContainer">
          <img
            @load=${this.onImageLoad}
            id="imageBase"
            src=${this.computeSrcString(this.baseImage)}
          />
          <img
            @load=${this.onImageLoad}
            data-opacity=${this.opacityValue}
            id="imageRevision"
            src=${this.computeSrcString(this.revisionImage)}
          />
        </div>
        <div id="controlsContainer">
          <div id="controlsBox">
            <label>
              <input
                id="scaleSizesToggle"
                @click=${this.handleScaleSizesToggle}
                type="checkbox"
              />
              Scale to same size
            </label>
            <label>
              Revision image opacity
              <input
                id="opacitySlider"
                max="1.0"
                min="0.0"
                @input=${this.handleOpacityChange}
                step=".01"
                .value=${String(this.opacityValue ?? 0.5)}
              />
            </label>
          </div>
        </div>
      </div>
    `;
  }

  override updated(changedProperties: PropertyValues) {
    if (
      changedProperties.has('baseImage') ||
      changedProperties.has('revisionImage')
    ) {
      this.handleImageChange();
    }
  }

  protected onImageLoad(e: Event) {
    const target = e.target as HTMLImageElement;
    this.maxHeight = Math.max(this.maxHeight, target.naturalHeight);
    this.maxWidth = Math.max(this.maxWidth, target.naturalWidth);
  }

  protected handleImageChange() {
    if (this.baseImage === undefined || this.revisionImage === undefined) return;
    this.handleOpacityChange();
  }

  handleOpacityChange(e?: Event) {
    const value = e ? (e.target as HTMLInputElement).value : this.opacityValue;
    this.opacityValue = Number(value);
  }

  computeSrcString(image?: ImageInfo) {
    if (!image) return '';
    return 'data:' + image.type + ';base64, ' + image.body;
  }

  handleScaleSizesToggle(e?: Event) {
    const isChecked = e ? (e.target as HTMLInputElement).checked : false;
    if (isChecked) {
      this.scaledWidth = this.maxWidth;
      this.scaledHeight = this.maxHeight;
    } else {
      this.scaledWidth = null;
      this.scaledHeight = null;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gr-opacity-diff-mode': OpacityDiffMode;
  }
}
