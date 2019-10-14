# gulp-html-imports

- A gulp plugin.
- Import html files into html files.
- Restore html files.

## Install
```bash
 $ npm install gulp-html-imports --save-dev
```

## Usage

### `gulpfile.js`:

```js
var htmlImport = require('gulp-html-imports')
```

### Simple

```js
gulp.task('html_imports', function () {
  gulp.src('./index.html')
    .pipe(htmlImport('./components/'))
    .pipe(gulp.dest('dist'))
})

```

### Option `"template"`: Replace html contents

```js
gulp.task('html_imports', function () {
  gulp.src('./index.html')
    .pipe(htmlImport({
      componentsPath: './components/',
      template: {
        '_VERSION_': '2018'
      }
    }))
    .pipe(gulp.dest('dist'))
})

// If you want to restore the html
gulp.task('html_restore', function () {
  gulp.src('dist/index.html')
    .pipe(htmlImport({
      componentsPath: './components/',
      restore: true
    }))
    .pipe(gulp.dest('./'))
})
```

## Example

`index.html`

```html
<html>
  <body>
    <div>HTML import HTML</div>
    <!-- @import "demo.html" -->
  </body>
</html>
```

`./components/demo.html`

```html
<div>This is demo.html.</div>
<div>Version is _VERSION_</div>
```

```bash
 $ gulp html_imports  
```

`dist/index.html`

```html
<html>
  <body>
    <div>HTML import HTML</div>
    <!-- import "demo.html" -->
    <div>This is demo.html.</div>
    <div>Version is 2018</div>
    <!-- import end -->
  </body>
</html>
```

```bash
 $ gulp html_restore
```

`index.html`

```html
<html>
  <body>
    <div>HTML import HTML</div>
    <!-- @import "demo.html" -->
  </body>
</html>
```

## Options

| Name             | Type    | Default         | Description                                |
| ---------------- | ------- | --------------- | ------------------------------------------ |
| `componentsPath` | String  | './components/' | Components html file path.                 |
| `template`       | Object  | null            | Replace components html's content keyword. |
| `restore`        | Boolean | false           | Restore html initial content.              |
| `nestedIncludes` | Boolean | false           | Replace include html's content.            |

---

[MIT](https://opensource.org/licenses/MIT)

Copyright © 2018 Vic Yang
