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
  private colorValue = '#00ffff';

  @state()
  private difference = 0;

  @state()
  private ignoreColors = false;

  @state()
  private transparent = false;

  @state()
  private diffImageSrc = '';

  @property({type: Boolean, reflect: true})
  loading = false;

  override render() {
    return html`
      <div id="modeContainer">
        <div id="diffContainer">
          <h2>Loading...</h2>
          <img id="imageDiff" src=${this.diffImageSrc || ''} />
        </div>
        <div id="controlsContainer">
          <div>${this.difference}% changed</div>
          <label class="toggle">
            <input
              id="ignoreColorsToggle"
              type="checkbox"
              .checked=${this.ignoreColors}
              @click=${this.handleIgnoreColorsToggle}
            />
            Ignore colors
          </label>
          <label class="toggle">
            <input
              id="transparentToggle"
              type="checkbox"
              .checked=${this.transparent}
              @click=${this.handleTransparentToggle}
            />
            Transparent
          </label>
          <input
            id="color"
            type="color"
            .value=${this.colorValue}
            @change=${this.handleColorChange}
          />
          <button id="fullscreen" @click=${this.handleFullScreen}>
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
      this.handleImageDiff(this.baseImage, this.revisionImage);
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    window.resemble.outputSettings(DEFAULT_SETTING);
  }

  private handleImageDiff(baseImage?: ImageInfo, revisionImage?: ImageInfo) {
    if (baseImage === undefined || revisionImage === undefined) {
      return;
    }
    this.reload();
  }

  private setImageDiffSrc(src: string) {
    this.diffImageSrc = src;
  }

  private setDifferenceValue(percentage: number) {
    this.difference = percentage;
  }

  private getDataUrl(image: ImageInfo) {
    return 'data:' + image.type + ';base64,' + image.body;
  }

  private maybeIgnoreColors(diffProcess: any, ignoreColors: boolean) {
    ignoreColors ? diffProcess.ignoreColors() : diffProcess.ignoreNothing();
    return diffProcess;
  }

  private createDiffProcess(base: string, rev: string, ignoreColors: boolean) {
    window.resemble.outputSettings(this.setOutputSetting());
    const process = window.resemble(base).compareTo(rev);
    return this.maybeIgnoreColors(process, ignoreColors);
  }

  private setOutputSetting() {
    const rgb = this.hexToRGB(this.colorValue);
    return {
      transparency: this.transparent ? 0.1 : 1,
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
      const base = this.getDataUrl(this.baseImage);
      const rev = this.getDataUrl(this.revisionImage);

      return new Promise((resolve) => {
        this.createDiffProcess(base, rev, this.ignoreColors).onComplete(
          (data: any) => {
            this.setImageDiffSrc(data.getImageDataUrl());
            this.setDifferenceValue(data.misMatchPercentage);
            this.loading = false;
            resolve();
          }
        );
      });
    }
    this.loading = false;
  }

  private handleIgnoreColorsToggle(e: Event) {
    this.ignoreColors = (e.target as HTMLInputElement).checked;
    this.reload();
  }

  private handleTransparentToggle(e: Event) {
    this.transparent = (e.target as HTMLInputElement).checked;
    this.reload();
  }

  private handleColorChange(e: Event) {
    this.colorValue = (e.target as HTMLInputElement).value;
    this.reload();
  }

  private hexToRGB(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  private handleFullScreen() {
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
  interface Window {
    resemble: any;
  }
}
