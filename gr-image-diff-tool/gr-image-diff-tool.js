// Copyright (C) 2018 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
(function() {
  'use strict';

  Polymer({
    is: 'gr-image-diff-tool',

    properties: {
      _showResembleMode: Boolean,
      _showOpacityMode: Boolean,
      _observeMode: {
        type: String,
        observer: '_handleSelect',
      },
    },

    attached() {
      const diff_mode = window.localStorage.getItem('image-diff-mode');
      diff_mode === 'opacity' ?
          this._displayOpacityMode() : this._displayResembleMode();
    },

    _handleSelect(mode) {
      mode === 'opacity' ?
          this._displayOpacityMode() : this._displayResembleMode();
    },

    _displayResembleMode() {
      this.$.dropdown.options[0].selected = 'selected';
      this._showResembleMode = true;
      this._showOpacityMode = false;
      window.localStorage.setItem('image-diff-mode', 'resemble');
    },

    _displayOpacityMode() {
      this.$.dropdown.options[1].selected = 'selected';
      this._showResembleMode = false;
      this._showOpacityMode = true;
      window.localStorage.setItem('image-diff-mode', 'opacity');
    },
  });
})();