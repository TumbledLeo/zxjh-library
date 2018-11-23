//提前声明好路径常量
var app = {
    srcPath: 'src/',
    buildPath: 'build/',
    distPath: 'dist/'
};

/*引入gulp与gulp插件*/
var gulp = require('gulp');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var imagemin = require('gulp-imagemin');
var open = require('open');
var babel = require("gulp-babel");

/*把bower下载的前端框架放到我们项目中*/
gulp.task('lib', function () {
    gulp.src(app.srcPath + 'lib/**')
        .pipe(gulp.dest(app.buildPath + 'lib'))
        .pipe(gulp.dest(app.distPath + 'lib'))
        .pipe(connect.reload())
});

// 把所有字体文件移动到另一个位置
gulp.task('font', function () {
    gulp.src(app.srcPath+'font/*.ttf')
        .pipe(gulp.dest(app.buildPath + 'font'))
        .pipe(gulp.dest(app.distPath + 'font'))
        .pipe(connect.reload())
});


/*任务2把所有html文件移动到另一个位置*/
gulp.task('html', function () {
    gulp.src(app.srcPath + '**/*.html')
        .pipe(gulp.dest(app.buildPath))
        .pipe(gulp.dest(app.distPath))
        .pipe(connect.reload())
});

/*任务3 把*/
gulp.task('scss', function () {
    gulp.src(app.srcPath + 'style/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(app.buildPath + 'css/'))
        .pipe(cssmin())
        .pipe(gulp.dest(app.distPath + 'css/'))
        .pipe(connect.reload())
});


/*合并js*/
gulp.task('js', function () {
    gulp.src(app.srcPath + 'js/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(app.buildPath + 'js/'))
        .pipe(uglify())
        .pipe(gulp.dest(app.distPath + 'js/'))
        .pipe(connect.reload())
});

/*压缩图片*/
gulp.task('image', function () {
    gulp.src(app.srcPath + 'images/**/*')
        .pipe(gulp.dest(app.buildPath + 'images'))
        // .pipe(imagemin())
        .pipe(gulp.dest(app.distPath + 'images'))
        .pipe(connect.reload());
});

/*同时执行多个任务【其他任务的名称】
* 当bulid执行时，会把数组中的所有任务执行了
* */
gulp.task('build', ['scss', 'html', 'js', 'lib', 'font', 'image']);

/*定义server服务
* 搭建一个服务器，设置运行构建目录
* 目的时刻监听文件里面内容的变化
* */
gulp.task('server', ['build'], function () {
    // 设置服务器
    connect.server({
        root: [app.buildPath],//要运行那个目录
        livereload: true,// 是否热更新
        port: 9900 // 端口号
    });
    // 监听哪些任务
    gulp.watch(app.srcPath + '**/*.html', ['html']);
    gulp.watch(app.srcPath + 'js/**/*.js', ['js']);
    gulp.watch(app.srcPath + 'images/**/*', ['image']);
    gulp.watch(app.srcPath + 'style/**/*.scss', ['scss']);
    open('http://localhost:9999');
});
gulp.task('default', ['server']);

