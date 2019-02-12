# My Modulo Gulp

### Install

```js
npm install
```

### Usage

```js
npx gulp task_name
npx bower package_name
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
gulp serve

// Compile LESS to CSS
gulp less

// Compile SASS to CSS
gulp sass

// Compress image
gulp images

// Compress json
gulp json

// Import dependency bower
gulp bower

// bundle
gulp vendor

// Generate build
gulp build
```
