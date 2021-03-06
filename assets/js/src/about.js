;(function () {
  document.addEventListener('DOMContentLoaded', initAbout)

  var about = document.querySelector('.about')
  var aboutButton = document.querySelector('.about-button')
  var header = document.querySelector('.header')
  var main = document.querySelector('.main')
  var alpacaToggle = document.getElementById('alpaga-toggle')
  var alpacaImage = document.getElementById('alpaca-image')

  var unscrollableModifierClass = 'unscrollable'
  var aboutHintModifierClass = 'header--push-hinted'
  var headerModifierClass = 'header--pushed'
  var aboutImageModifierClass = 'about__background-image--hidden'

  var aboutTransitionDuration = about && (parseFloat(
    window.getComputedStyle(about)['transitionDuration']
  ) * 1000)
  var aboutTimeout
  var mainTimeout

  function initAbout () {
    if (aboutButton) {
      aboutButton.addEventListener('click', toggleAbout)
      initAboutHinting()
      initAlpacaImageToggling()
    }
  }

  function initAboutHinting () {
    ['mouseover', 'focus', 'mouseout', 'blur'].forEach(function (event) {
      aboutButton.addEventListener(event, toggleAboutHinting)
    })
  }

  function initAlpacaImageToggling () {
    ['mouseover', 'mouseout'].forEach(function (event) {
      alpacaToggle.addEventListener(event, toggleAlpacaImage)
    })
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

  function toggleAlpacaImage () {
    alpacaImage.classList.toggle(aboutImageModifierClass)
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

    // Delays the `aria-hidden` switch by the same amount as the transition’s
    // duration so that it doesn’t break the animation.
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
