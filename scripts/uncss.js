var uncss = require('uncss')
var glob = require('glob')
var fs = require('fs')

var sourceStylesheet = 'assets/sass/vendors/_bootstrap.scss'
var resultStylesheet = 'assets/sass/vendors/_bootstrap.un.scss'

var bootstrapUncss = function () {
  var css = fs.readFileSync(sourceStylesheet, 'utf8')

  glob('_site/**/*.html', function (err, files) {
    if (err) {
      console.log(err)
    }

    uncss(files, {
      raw: css,
      ignoreSheets: [/\/css\//]
    }, function (err, output) {
      if (err) {
        console.log(err)
      }

      fs.writeFileSync(resultStylesheet, output)
    })
  })
}

bootstrapUncss()
