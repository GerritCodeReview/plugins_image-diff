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

const DEFAULT_SETTING = {
  errorType: 'flat',
  largeImageThreshold: 1200,
};

class ResembleDiffMode extends LitElement {
  static get is() {
    return 'gr-resemble-diff-mode';
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        h2 {
          display: none;
        }
        :host([loading]) #imageDiff {
          display: none;
        }
        :host([loading]) h2 {
          display: inline;
          padding: 1em 0;
        }
        .toggle {
          padding: .5em;
        }
        #controlsContainer {
          align-items: center;
          border-top: 1px solid var(--border-color, #ddd);
          display: flex;
          justify-content: space-between;
          padding: 1em;
          white-space: nowrap;
          width: 100%;
        }
        #diffContainer {
          display: block;
          width: 100%;
        }
        #color {
          border: 1px solid var(--border-color, #ddd);
          border-radius: 2px;
        }
        #fullscreen {
          border: 1px solid var(--border-color, #ddd);
          border-radius: 2px;
          color: var(--primary-text-color, #000);
          padding: .5em;
        }
        #controlsContainer,
        #color,
        #fullscreen {
          background-color: var(--table-header-background-color, #fafafa);
        }
        #color:hover,
        #fullscreen:hover {
          background-color: var(--header-background-color, #eeeeee);
        }
        #imageDiff {
          display: block;
          height: auto;
          margin: auto;
          max-width: 50em;
        }
        #modeContainer {
          box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
          display: block;
          margin: 1em 0em;
          width: 50em;
        }
      `
    ];
  }

  render() {
    return html`
      <div id="modeContainer">
        <div id="diffContainer">
          <h2>Loading...</h2>
          <img id="imageDiff" src=${this._diffImageSrc || ''}>
        </div>
        <div id="controlsContainer">
          <div>${this._difference}% changed</div>
          <label class="toggle">
            <input
                id="ignoreColorsToggle"
                type="checkbox"
                .checked=${this._ignoreColors}
                @click=${this._handleIgnoreColorsToggle}>
            Ignore colors
          </label>
          <label class="toggle">
            <input
                id="transparentToggle"
                type="checkbox"
                .checked=${this._transparent}
                @click=${this._handleTransparentToggle}>
            Transparent
          </label>
          <input
              id="color"
              type="color"
              .value=${this._colorValue}
              @change=${this._handleColorChange}>
          <button
              id="fullscreen"
              @click=${this._handleFullScreen}>
            View full sized
          </button>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      baseImage: {type: Object},
      revisionImage: {type: Object},
      _colorValue: {type: String},
      _difference: {type: Number},
      _ignoreColors: {type: Boolean},
      _transparent: {type: Boolean},
      _diffImageSrc: {type: String},
      loading: {type: Boolean, reflect: true},
    };
  }

  constructor() {
    super();
    this._colorValue = '#00ffff';
    this._difference = 0;
    this._ignoreColors = false;
    this._transparent = false;
    this._diffImageSrc = '';
    this.loading = false;
  }

  updated(changedProperties) {
    if (changedProperties.has('baseImage') || changedProperties.has('revisionImage')) {
      this._handleImageDiff(this.baseImage, this.revisionImage);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    window.resemble.outputSettings(DEFAULT_SETTING);
  }

  _handleImageDiff(baseImage, revisionImage) {
    if ([baseImage, revisionImage].includes(undefined)) {
      return;
    }
    this.reload();
  }

  _setImageDiffSrc(src) {
    this._diffImageSrc = src;
  }

  _setDifferenceValue(percentage) {
    this._difference = percentage;
  }

  _getDataUrl(image) {
    return 'data:' + image['type'] + ';base64,' + image['body'];
  }

  _maybeIgnoreColors(diffProcess, ignoreColors) {
    ignoreColors ? diffProcess.ignoreColors() : diffProcess.ignoreNothing();
    return diffProcess;
  }

  _createDiffProcess(base, rev, ignoreColors) {
    window.resemble.outputSettings(this._setOutputSetting());
    const process = window.resemble(base).compareTo(rev);
    return this._maybeIgnoreColors(process, ignoreColors);
  }

  _setOutputSetting() {
    const rgb = this._hexToRGB(this._colorValue);
    return {
      transparency: this._transparent ? 0.1 : 1,
      errorColor: {
        red: rgb.r,
        green: rgb.g,
        blue: rgb.b,
      },
    };
  }

  /**
   * Reloads the diff. Resemble 1.2.1 seems to have an issue with successive
   * reloads via the repaint() function, so this implementation creates a
   * fresh diff each time it is called.
   *
   * @return {Promise} resolves if and when the reload succeeds.
   */
  reload() {
    this.loading = true;
    if (this.baseImage && this.revisionImage) {
      const base = this._getDataUrl(this.baseImage);
      const rev = this._getDataUrl(this.revisionImage);

      return new Promise((resolve, reject) => {
        this._createDiffProcess(base, rev, this._ignoreColors).onComplete(
            data => {
              this._setImageDiffSrc(data.getImageDataUrl());
              this._setDifferenceValue(data.misMatchPercentage);
              this.loading = false;
              resolve();
            }
        );
      });
    }
    this.loading = false;
  }

  _handleIgnoreColorsToggle(e) {
    this._ignoreColors = e.target.checked;
    this.reload();
  }

  _handleTransparentToggle(e) {
    this._transparent = e.target.checked;
    this.reload();
  }

  _handleColorChange(e) {
    this._colorValue = e.target.value;
    this.reload();
  }

  _hexToRGB(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
      : null;
  }

  _handleFullScreen() {
    const w = window.open('about:blank', '_blank');
    const imageDiff = this.shadowRoot.getElementById('imageDiff');
    if (imageDiff) {
      w.document.body.appendChild(imageDiff.cloneNode(true));
    }
  }
}

customElements.define(ResembleDiffMode.is, ResembleDiffMode);