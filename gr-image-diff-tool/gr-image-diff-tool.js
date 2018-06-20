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
  const paradoxes = [
    'https://i.pinimg.com/originals/15/6e/82/156e82713957bf0c20c72465ce8e7b07.jpg',
    'https://yt3.ggpht.com/a-/AJLlDp1_KcFdpwhYkIAHfT-P0vYv7JDKn_hlxhE2xw=s900-mo-c-c0xffffffff-rj-k-no',
  ];
  Polymer({
    is: 'infinite-domo-paradox',
    properties: {
      baseImage: Object, 
      revisionImage: Object,
      revisionSrc:{
        type: String,
      },
      src: {
        type: String,
        value() { return paradoxes[Math.floor(Math.random() * paradoxes.length)]; },
      },
    },
    theOpacity() {
      const valueOfOpacity = document.getElementById('opacitySlider').value;
      document.getElementById('sliderOutput').innerHTML= valueOfOpacity;
      document.getElementById('theImage').style.opacity= valueOfOpacity;
    },
    computeRevisionSrc(revisionImage) {
      alert(this.revisionImage);
      return generateSrc(revisionImage['type'], revisionImage['body'])
    },
    attached() {
      let theString = String(this.revisionImage['body'])
      const theStringFXD = theString.slice(0,28)
      theString = theString.replace(theStringFXD, '');
      this.revisionSrc ='data:' + this.revisionImage['type'] + ';base64, ' + theString;
    },
    generateSrc(type, body) {
      console.log(type + ' ' + body);
      return type + ' ' + body;
    },
  });
})();