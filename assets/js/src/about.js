;(function () {
  document.addEventListener('DOMContentLoaded', initAbout)

  var about = document.querySelector('.about')
  var aboutButton = document.querySelector('.about-button')
  var header = document.querySelector('.header')
  var main = document.querySelector('.main')

  var unscrollableModifierClass = 'unscrollable'
  var aboutHintModifierClass = 'header--push-hinted'
  var headerModifierClass = 'header--pushed'

  var aboutTransitionDuration = about && (parseFloat(
    window.getComputedStyle(about)['transitionDuration']
  ) * 1000)
  var aboutTimeout
  var mainTimeout

  function initAbout () {
    if (aboutButton) {
      ['mouseover', 'focus', 'mouseout', 'blur'].forEach(function (event) {
        aboutButton.addEventListener(event, toggleAboutHinting)
      })
      aboutButton.addEventListener('click', toggleAbout)
    }
  }

  function toggleAboutHinting (event) {
    var headerClassList = header.classList

    if (event.type === 'mouseout' || event.type === 'blur') {
      headerClassList.remove(aboutHintModifierClass)
    } else {
      !headerClassList.contains(headerModifierClass) &&
        headerClassList.add(aboutHintModifierClass)
    }
  }

  function toggleAbout () {
    var state = !isAboutExpanded()

    toggleClasses(state)
    changeAriaStates(state)
  }

  function isAboutExpanded () {
    return about.getAttribute('aria-expanded') === 'true'
  }

  function clearTimeouts () {
    [aboutTimeout, mainTimeout].forEach(function (timeout) {
      clearTimeout(timeout)
    })
  }

  function changeAriaStates (state) {
    // Always clear the timeouts to avoid bugs when quickly toggling the
    // about section.
    clearTimeouts()

    aboutButton.setAttribute('aria-pressed', state)
    about.setAttribute('aria-expanded', state)

    // The about button is blurred to avoid the hint class to be unnecessarily
    // applied on the first click after closing the about section.
    !state && aboutButton.blur()

    // Allows/Disallows tabbing through all children of about & main. Delays the
    // `aria-hidden` switch so that it doesn’t break the animation.
    mainTimeout = setTimeout(function () {
      main.setAttribute('aria-hidden', state)
    }, (state ? aboutTransitionDuration : 0))

    aboutTimeout = setTimeout(function () {
      about.setAttribute('aria-hidden', !state)
    }, (state ? 0 : aboutTransitionDuration))
  }

  function toggleClasses (state) {
    [document.documentElement, document.body].forEach(function (node) {
      node.classList.toggle(unscrollableModifierClass)
    })
    header.classList.toggle(headerModifierClass)
    header.classList.remove(aboutHintModifierClass)
  }
}())
