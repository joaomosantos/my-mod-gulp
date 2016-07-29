# My Modulo Gulp

### Global / Preinstall

```js
npm install -g bower
npm install -g gulp
```

### Usage / Install

```js
bower install
npm install
```
### Folders / Structure

```js
folder
  |__gulpfile.js
  |__package.json
  |__node_modules
  |__bower.json
  |__bower_components
  |__.bowerrc
  |__.gitignore
  |__.editorconfig
  |__README.md
  |__app
      |__index.html //or index.shtm
      |__inc //includes SSI
      |__css
      |   |__less
      |   |__sass
      |   |__fonts
      |__js
      |__images
      |__json
      |__template
```
### Basic Commands

```js
// Start BrowserSync (support SSI)
gulp server

// Import dependency bower
gulp bower

// Compile LESS to CSS
gulp compiler-less

// Compile SASS to CSS
gulp compiler-sass

// Compress image
gulp images

// Generate build
gulp build

// Start server (build)
gulp server:build

// Compact build
gulp zip

// Transfer ftp (adjust parameters in gulpfile.js)
gulp ftp
```
