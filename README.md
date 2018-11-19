# gulp-html-imports

- A gulp plugin.
- Import html files into html files.

## Usage
```bash
 $ npm install gulp-html-imports --save-dev
```

## Gulp

`gulpfile.js`:

```js
var htmlImport = require('gulp-html-imports');

gulp.task('html_imports', function () {
    gulp.src('./index.html')
        .pipe(htmlImport('./components/'))
        .pipe(gulp.dest('dist')); 
})

// Or this

gulp.task('html_imports', function () {
    gulp.src('./index.html')
        .pipe(htmlImport({
            componentsUrl: './components/'
        }))
        .pipe(gulp.dest('dist')); 
})
```

## Example


## Options

---

[MIT](https://opensource.org/licenses/MIT)

Copyright © 2018 Vic Yang
