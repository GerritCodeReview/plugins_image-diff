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
    is: 'gr-opacity-diff-mode',

    properties: {
      baseImage: Object,
      revisionImage: Object,
      opacityValue: Number,
    },

    attached() {
      if (this.revisionImage) {
        const srcRevision = this.computeSrcString(this.revisionImage);
        this.$.imageRevision.setAttribute('src', srcRevision);
        this.handleTheDivSize();
      }
      if (this.baseImage) {
        const srcBase = this.computeSrcString(this.baseImage);
        this.$.imageBase.setAttribute('src', srcBase);
        this.handleTheDivSize();
      }
    },

    handleOpacityChange() {
      this.customStyle['--my-opacity-value'] = this.$.opacitySlider.value;
      this.updateStyles();
    },

    computeSrcString(image) {
      return 'data:' + image['type'] + ';base64, ' + image['body'];
    },

    handleScaleSizesToggle() {
      let width;
      let height;
      if (this.$.scaleSizesToggle.checked) {
<<<<<<< HEAD
        width = Math.max(this.revisionImage._width, this.baseImage._width);
        height = Math.max(this.revisionImage._height, this.baseImage._height);
=======
        if ((this.baseImage == undefined) ||
          (this.revisionImage == undefined)) {
          width = undefined;
          height = undefined;
        } else {
          width = Math.max(this.revisionImage._width, this.baseImage._width);
          height = Math.max(this.revisionImage._height, this.baseImage._height);
        }
>>>>>>> Create functionality to change opacity image size
      }
      this.customStyle['--img-width'] = width ? width + 'px' : null;
      this.customStyle['--img-height'] = height ? height + 'px' : null;
      this.updateStyles();
    },
<<<<<<< HEAD
=======

    handleTheDivSize() {
      let widthDiv;
      let heightDiv;
      if (this.baseImage == undefined) {
        widthDiv = this.revisionImage._width;
        heightDiv = this.revisionImage._height;
      } else if (this.revisionImage == undefined) {
        widthDiv = this.baseImage._width;
        heightDiv = this.baseImage._height;
      } else if ((this.baseImage == undefined) &&
        (this.revisionImage == undefined)) {
        widthDiv = undefined;
        heightDiv = undefined;
      } else {
        widthDiv = Math.max(this.revisionImage._width,
            this.baseImage._width);
        heightDiv = Math.max(this.revisionImage._height,
            this.baseImage._height);
      }
      this.customStyle['--div-width'] = widthDiv + 'px';
      this.customStyle['--div-height'] = heightDiv + 'px';
      this.updateStyles();
    },
>>>>>>> Create functionality to change opacity image size
  });
})();