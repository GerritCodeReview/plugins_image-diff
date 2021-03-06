/**
 * @license
 * Copyright (C) 2020 The Android Open Source Project
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

export const htmlTemplate = Polymer.html`
    <style>
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
    </style>
    <div class="wrapper">
      <div id="imageDiffContainer">
        <img on-load="_onImageLoad" id="imageBase"/>
        <img on-load="_onImageLoad" data-opacity$="{{opacityValue}}" id="imageRevision"/>
      </div>
      <div id="controlsContainer">
        <div id="controlsBox">
          <label>
            <input
                id="scaleSizesToggle"
                on-click="handleScaleSizesToggle"
                type="checkbox">
            Scale to same size
          </label>
          <label>
            Revision image opacity
            <input
                id="opacitySlider"
                max="1.0"
                min="0.0"
                on-input="handleOpacityChange"
                step=".01"
                type="range"
                value="0.5"/>
          </label>
        </div>
      </div>
    </div>`;