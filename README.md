# My Modulo Gulp

### Usage / Install

```js
npm install
```
### Folders / Structure

```js
folder
  |__gulpfile.js
  |__package.json
  |__.gitignore
  |__README.md
  |__node_modules
  |__app
      |__index.html //or index.shtm
      |__inc //includes SSI
      |__css
          |__fonts
          |__less
          |__sass
      |__js
      |__images
      |__xls
      |__json
      |__template
```
### Basic Commands

```js
// Compile JADE to HTML
gulp compiler-jade

// Compile LESS to CSS
gulp compiler-less

// Compile SASS to CSS
gulp compiler-sass

// Convert lESS to SASS
gulp less2sass

// Joining in a single css (all.css)
gulp concat-css

// Minify all.css (all.min.css)
gulp minify-css

// Start BrowserSync (support SSI)
gulp server

// To assign auto prefixer in CSS
gulp autoprefixer-css

// Compress image
gulp images

// Compile .Xls and .Xlsx to .Json
// Usage (!) ignore column
gulp xls2json

// Minify .Json
gulp json-minify

// UnMinify .Json
gulp json-unminify

// Transfer ftp (adjust parameters in gulpfile.js)
gulp ftp

// Generate build
gulp build

// Compact build
gulp zip
```
