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
    </style>
    <div id="modeContainer">
      <div id="diffContainer">
        <h2>Loading...</h2>
        <img id="imageDiff">
      </div>
      <div id="controlsContainer">
        <div>[[_difference]]% changed</div>
        <label class="toggle">
          <input
              id="ignoreColorsToggle"
              type="checkbox"
              checked$="[[_ignoreColors]]"
              on-click="_handleIgnoreColorsToggle">
          Ignore colors
        </label>
        <label class="toggle">
          <input
              id="transparentToggle"
              type="checkbox"
              checked$="[[_transparent]]"
              on-click="_handleTransparentToggle">
          Transparent
        </label>
        <input
            id="color"
            type="color"
            value="{{_colorValue::change}}">
        <button
            id="fullscreen"
            on-click="_handleFullScreen">
          View full sized
        </button>
      </div>
    </div>`;
