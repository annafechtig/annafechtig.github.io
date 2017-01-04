;(function () {
  document.addEventListener('DOMContentLoaded', initAbout)

  var about = document.querySelector('.about')
  var aboutButton = document.querySelector('.about-button')
  var header = document.querySelector('.header')
  var main = document.querySelector('.main')

  var bodyModifierClass = 'body--unscrollable'
  var headerModifierClass = 'header--pushed'
  var aboutTransitionDuration = about && (parseFloat(
    window.getComputedStyle(about)['transitionDuration']
  ) * 1000)

  function initAbout () {
    aboutButton && aboutButton.addEventListener('click', toggleAbout)
  }

  function isAboutExpanded () {
    return about.getAttribute('aria-expanded') === 'true'
  }

  function changeAriaStates (state) {
    aboutButton.setAttribute('aria-pressed', state)
    about.setAttribute('aria-expanded', state)

    // Allows/Disallows tabbing through all children of about & main.
    main.setAttribute('aria-hidden', state)

    // Delays the `aria-hidden` switch when closing the about section, so that
    // it doesn’t break the animation.
    var timeout = (state ? 0 : aboutTransitionDuration)

    setTimeout(function () {
      about.setAttribute('aria-hidden', !state)
    }, timeout)
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
