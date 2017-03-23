var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    imageMin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    cache        = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer');

//SASS+AUTOPREFIX
gulp.task('sass', function(){
  return gulp.src('app/sass/**/*.scss')
  .pipe(sass())
  .pipe(autoprefixer(['last 15 versions','> 1%', 'ie 8', 'ie 7'], {cascade: true}))
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({stream: true}))
});

//SCRIPTS+MINIFICATION
gulp.task('scripts',function(){
  return gulp.src([
    'app/libs/jquery/dist/jquery.min.js',
    'app/libs/magnific-popup/dist/jquery.magnific-popup.minjs'

  ])
  .pipe(concat('libs.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('app/js'));
});

gulp.task('css-libs',['sass'], function(){
  return gulp.src('app/css/libs.css')
  .pipe(cssnano())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/css'));
});

//BOWER
gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
});


gulp.task('clean', function(){
  return del.sync('dist');
});

gulp.task('cache-clean',function () {
  return cache.clearAll();
});

gulp.task('img',function(){
  return gulp.src('app/img/**/*')
  .pipe(cache(imageMin({
    interlaced: true,
    progressive: true,
    svgoPlagins:[{removeViewBox: false}],
    une:[pngquant()]
  })))
  .pipe(gulp.dest('dist/img'));
});

//WATCH
gulp.task('watch',['browser-sync', 'css-libs', 'scripts'], function() {//2param ['brow..'] вызов таска перед функцией
  gulp.watch('app/sass/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

//BUILD
gulp.task('build',['clean','img','sass','scripts'],function(){

  var buildCss = gulp.src([
    'app/css/libs.min.css',
    'app/css/main.css'
  ])
  .pipe(gulp.dest('dist/css'));

  var buildFonts = gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'));

  var buildJs = gulp.src('app/js/**/*')
  .pipe(gulp.dest('dist/js'));

  var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
});


//npm i с джисона все установит

//если перенисти папку которая кешируется появятся траблы надо кеш клин
//tips
//**/*.sass -- все директории и поддиректории
//! в -- начале все коме этого
//.+(sass|scss) -- сас и сцсс
//файлы начинающийся с _ не компилятся
