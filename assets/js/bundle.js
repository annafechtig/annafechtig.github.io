/**
 *
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Usage:
 * var detabinator = new Detabinator(element)
 * // Sets all focusable children of element to tabindex = -1
 * detabinator.inert(true)
 * // Restores all focusable children of element
 * detabinator.inert(false)
 * Limitations: Doesn't support Shadow DOM v0
 */

;(function () {
  function Detabinator (element) {
    if (!element) {
      console.warn(
        'Missing required argument. new Detabinator needs an element reference'
      )

      return
    }

    this._inert = false
    this._focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex], [contenteditable]'
    this._focusableElements = Array.prototype.slice.call(
      element.querySelectorAll(this._focusableElementsString)
    )
  }

  Detabinator.prototype.inert = function (isInert) {
    if (this._inert === isInert) {
      return
    }

    this._inert = isInert

    this._focusableElements.forEach(function (child) {
      if (isInert) {
        // If the child has an explict tabindex save it
        if (child.hasAttribute('tabindex')) {
          child.__savedTabIndex = child.tabIndex
        }
        // Set ALL focusable children to tabindex -1
        child.setAttribute('tabindex', -1)
      } else {
        // If the child has a saved tabindex, restore it
        // Because the value could be 0, explicitly check that it's not false
        if (child.__savedTabIndex === 0 || child.__savedTabIndex) {
          return child.setAttribute('tabindex', child.__savedTabIndex)
        } else {
          // Remove tabindex from ANY REMAINING children
          child.removeAttribute('tabindex')
        }
      }
    })
  }

  window.Detabinator = Detabinator
}())
;(function () {
  document.addEventListener('DOMContentLoaded', initAbout)

  var about = document.querySelector('.about')
  var aboutButton = document.querySelector('.about-button')
  var header = document.querySelector('.header')
  var main = document.querySelector('.main')

  var aboutDetabinator = new window.Detabinator(about)
  var mainDetabinator = new window.Detabinator(main)

  var bodyModifierClass = 'body--unscrollable'
  var headerModifierClass = 'header--pushed'

  function initAbout () {
    aboutButton.addEventListener('click', toggleAbout)
    // By default, about is closed and the user shouldn’t be able to tab through
    // its elements.
    aboutDetabinator.inert(true)
  }

  function isAboutExpanded () {
    return about.getAttribute('aria-expanded') === 'true'
  }

  function changeAriaStates (state) {
    about.setAttribute('aria-expanded', state)
    aboutButton.setAttribute('aria-pressed', state)

    // Allows/Disallows tabbing through all children of main & about.
    mainDetabinator.inert(state)
    aboutDetabinator.inert(!state)
  }

  function toggleClasses () {
    header.classList.toggle(headerModifierClass)
    document.body.classList.toggle(bodyModifierClass)
  }

  function toggleAbout () {
    toggleClasses()
    changeAriaStates(!isAboutExpanded())
  }
}())
