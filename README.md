# My Modulo Gulp

### Usage / Install

```js
npm install
```
### Folders / Structure

```js
folder
  |__index.html //or index.shtm
  |__css
  |   |__less
  |   |__sass
  |   |__final
  |__node_modules
  |__package.json
  |__gulpfile.js
  |__.gitignore
  |__README.md
```
### Basic Commands

```js
// Compile LESS to CSS
gulp compiler-less

// Compile SASS to CSS
gulp compiler-sass

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

// Transfer ftp (adjust parameters in gulpfile.js)
gulp ftp

// Generate build
gulp build

// Compact build
gulp zip
```
