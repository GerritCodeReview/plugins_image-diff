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
      baseImage: Object,
      revisionImage: Object,
      hidden: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
      _showResembleMode: {
        type: Boolean,
        value: true,
      },
      _showOpacityMode: {
        type: Boolean,
        value: true,
      },
    },

    attached() {
      if (!this.baseImage || !this.revisionImage) {
        // No need to show the diff tool if there are no
        this.hidden = true;
      }
    },

    handleSelect() {
      const mode = this.$.dropdown.value;
      if (mode === 'resemble') {
        this._showResembleMode = true;
        this._showOpacityMode = false;
      } else if (mode === 'opacity') {
        this._showOpacityMode = true;
        this._showResembleMode = false;
      }
    },
  });
})();
