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

class OpacityDiffMode extends LitElement {
  static get is() {
    return 'gr-opacity-diff-mode';
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        .wrapper {
          box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
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
          margin: 0 .5em;
          min-width: 32em;
          width: 100%;
        }
        label {
          align-items: center;
          display: flex;
          padding: 1em .5em;
        }
        input {
          margin: .5em;
        }
        #opacitySlider {
          width: 10em;
        }
      `
    ];
  }

  render() {
    return html`
      <div class="wrapper" style="
          --my-opacity-value: ${this.opacityValue};
          --img-width: ${this._scaledWidth ? this._scaledWidth + 'px' : 'initial'};
          --img-height: ${this._scaledHeight ? this._scaledHeight + 'px' : 'initial'};
          --div-width: ${this._maxWidth ? this._maxWidth + 'px' : 'initial'};
          --div-height: ${this._maxHeight ? this._maxHeight + 'px' : 'initial'};
      ">
        <div id="imageDiffContainer">
          <img
              @load=${this._onImageLoad}
              id="imageBase"
              src=${this.computeSrcString(this.baseImage)} />
          <img
              @load=${this._onImageLoad}
              data-opacity=${this.opacityValue}
              id="imageRevision"
              src=${this.computeSrcString(this.revisionImage)} />
        </div>
        <div id="controlsContainer">
          <div id="controlsBox">
            <label>
              <input
                  id="scaleSizesToggle"
                  @click=${this.handleScaleSizesToggle}
                  type="checkbox">
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
                  type="range"
                  .value=${this.opacityValue || '0.5'}/>
            </label>
          </div>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      baseImage: {type: Object},
      revisionImage: {type: Object},
      opacityValue: {type: Number},
      _maxHeight: {type: Number},
      _maxWidth: {type: Number},
      _scaledWidth: {type: Number},
      _scaledHeight: {type: Number},
    };
  }

  constructor() {
    super();
    this._maxHeight = 0;
    this._maxWidth = 0;
    this.opacityValue = 0.5;
  }

  updated(changedProperties) {
    if (changedProperties.has('baseImage') || changedProperties.has('revisionImage')) {
      this._handleImageChange();
    }
  }

  _onImageLoad(e) {
    const target = e.target;
    this._maxHeight = Math.max(this._maxHeight, target.naturalHeight);
    this._maxWidth = Math.max(this._maxWidth, target.naturalWidth);
  }

  _handleImageChange() {
    if (this.baseImage === undefined || this.revisionImage === undefined) return;
    this.handleOpacityChange();
  }

  handleOpacityChange(e) {
    const value = e ? e.target.value : this.opacityValue;
    this.opacityValue = Number(value);
  }

  computeSrcString(image) {
    if (!image) return '';
    return 'data:' + image['type'] + ';base64, ' + image['body'];
  }

  handleScaleSizesToggle(e) {
    const isChecked = e ? e.target.checked : false;
    if (isChecked) {
      this._scaledWidth = this._maxWidth;
      this._scaledHeight = this._maxHeight;
    } else {
      this._scaledWidth = null;
      this._scaledHeight = null;
    }
  }
}

customElements.define(OpacityDiffMode.is, OpacityDiffMode);
