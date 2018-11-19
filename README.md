# gulp-html-imports

> A gulp plugin which can import html files into html files

## Usage
```bash
 $ npm install gulp-html-imports --save-dev
```

Then add it to the `gulpfile.js`:

```js
var htmlImport = require('gulp-html-imports');

gulp.task('html_imports', function () {
    gulp.src('./demo/index.html')
        .pipe(htmlImport('./demo/components/'))
        .pipe(gulp.dest('dist')); 
})
```

## Example


## API

---
[MIT](https://opensource.org/licenses/MIT)

Copyright © 2018 Vic Yang
