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

const DEFAULT_SETTING = {
  errorType: 'flat',
  largeImageThreshold: 1200,
};

@customElement('gr-resemble-diff-mode')
export class ResembleDiffMode extends LitElement {
  static override get styles() {
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
          padding: 0.5em;
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
          padding: 0.5em;
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
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          display: block;
          margin: 1em 0em;
          width: 50em;
        }
      `
    ];
  }

  @property({type: Object})
  baseImage?: ImageInfo;

  @property({type: Object})
  revisionImage?: ImageInfo;

  @state()
  private _colorValue = '#00ffff';

  @state()
  private _difference = 0;

  @state()
  private _ignoreColors = false;

  @state()
  private _transparent = false;

  @state()
  private _diffImageSrc = '';

  @property({type: Boolean, reflect: true})
  loading = false;

  override render() {
    return html`
      <div id="modeContainer">
        <div id="diffContainer">
          <h2>Loading...</h2>
          <img id="imageDiff" src=${this._diffImageSrc || ''} />
        </div>
        <div id="controlsContainer">
          <div>${this._difference}% changed</div>
          <label class="toggle">
            <input
              id="ignoreColorsToggle"
              type="checkbox"
              .checked=${this._ignoreColors}
              @click=${this._handleIgnoreColorsToggle}
            />
            Ignore colors
          </label>
          <label class="toggle">
            <input
              id="transparentToggle"
              type="checkbox"
              .checked=${this._transparent}
              @click=${this._handleTransparentToggle}
            />
            Transparent
          </label>
          <input
            id="color"
            type="color"
            .value=${this._colorValue}
            @change=${this._handleColorChange}
          />
          <button id="fullscreen" @click=${this._handleFullScreen}>
            View full sized
          </button>
        </div>
      </div>
    `;
  }

  override updated(changedProperties: PropertyValues) {
    if (
      changedProperties.has('baseImage') ||
      changedProperties.has('revisionImage')
    ) {
      this._handleImageDiff(this.baseImage, this.revisionImage);
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    (window as any).resemble.outputSettings(DEFAULT_SETTING);
  }

  private _handleImageDiff(baseImage?: ImageInfo, revisionImage?: ImageInfo) {
    if (baseImage === undefined || revisionImage === undefined) {
      return;
    }
    this.reload();
  }

  private _setImageDiffSrc(src: string) {
    this._diffImageSrc = src;
  }

  private _setDifferenceValue(percentage: number) {
    this._difference = percentage;
  }

  private _getDataUrl(image: ImageInfo) {
    return 'data:' + image.type + ';base64,' + image.body;
  }

  private _maybeIgnoreColors(diffProcess: any, ignoreColors: boolean) {
    ignoreColors ? diffProcess.ignoreColors() : diffProcess.ignoreNothing();
    return diffProcess;
  }

  private _createDiffProcess(base: string, rev: string, ignoreColors: boolean) {
    (window as any).resemble.outputSettings(this._setOutputSetting());
    const process = (window as any).resemble(base).compareTo(rev);
    return this._maybeIgnoreColors(process, ignoreColors);
  }

  private _setOutputSetting() {
    const rgb = this._hexToRGB(this._colorValue);
    return {
      transparency: this._transparent ? 0.1 : 1,
      errorColor: {
        red: rgb?.r ?? 0,
        green: rgb?.g ?? 255,
        blue: rgb?.b ?? 255,
      },
    };
  }

  /**
   * Reloads the diff. Resemble 1.2.1 seems to have an issue with successive
   * reloads via the repaint() function, so this implementation creates a
   * fresh diff each time it is called.
   *
   * @return resolves if and when the reload succeeds.
   */
  reload(): Promise<void> | void {
    this.loading = true;
    if (this.baseImage && this.revisionImage) {
      const base = this._getDataUrl(this.baseImage);
      const rev = this._getDataUrl(this.revisionImage);

      return new Promise((resolve) => {
        this._createDiffProcess(base, rev, this._ignoreColors).onComplete(
          (data: any) => {
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

  private _handleIgnoreColorsToggle(e: Event) {
    this._ignoreColors = (e.target as HTMLInputElement).checked;
    this.reload();
  }

  private _handleTransparentToggle(e: Event) {
    this._transparent = (e.target as HTMLInputElement).checked;
    this.reload();
  }

  private _handleColorChange(e: Event) {
    this._colorValue = (e.target as HTMLInputElement).value;
    this.reload();
  }

  private _hexToRGB(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  private _handleFullScreen() {
    const w = window.open('about:blank', '_blank');
    const imageDiff = this.shadowRoot?.getElementById('imageDiff');
    if (imageDiff && w) {
      w.document.body.appendChild(imageDiff.cloneNode(true));
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gr-resemble-diff-mode': ResembleDiffMode;
  }
}
