;(function () {
  document.addEventListener('DOMContentLoaded', initAbout)

  var about = document.querySelector('.about')
  var aboutButton = document.querySelector('.about-button')
  var header = document.querySelector('.header')
  var main = document.querySelector('.main')

  var aboutDetabinator = new window.Detabinator(about)
  var mainDetabinator = new window.Detabinator(main)

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
  }

  function toggleAbout () {
    toggleClasses()
    changeAriaStates(!isAboutExpanded())
  }
}())
