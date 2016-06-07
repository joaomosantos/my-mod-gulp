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
  |__bower.json
  |__.bowerrc
  |__bower_components
  |__app
      |__index.html //or index.shtm
      |__inc //includes SSI
      |__csss
      |   |__less
      |   |__font
      |   |__sass
      |__js
      |__images
      |__json
      |__template
```
### Basic Commands

```js
// Start BrowserSync (support SSI)
gulp server

// Deploy packages bower
gulp deploy-vendor

// Generate build
gulp build

// Compact build
gulp zip

// Transfer ftp (adjust parameters in gulpfile.js)
gulp ftp

// Compile LESS to CSS
gulp compiler-less

// Compile SASS to CSS
gulp compiler-sass

// Minify css
gulp minify-css

// Minify css
gulp minify-js

// Compress image
gulp images

// Minify .Json
gulp json-minify

// UnMinify .Json
gulp json-unminify

// To assign auto prefixer in CSS
gulp autoprefixer-css
```
