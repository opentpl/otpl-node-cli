const gulp = require('gulp')
const browserSync = require('browser-sync').create()//https://www.browsersync.io/docs/gulp
const otpl = require("opentpl")
const fs = require('fs')
const path = require('path')
const nodemon = require('gulp-nodemon')
const watcher = require('./watcher')
const sass = require('gulp-sass');
const babel = require('gulp-babel')
const es2015 = require('babel-preset-es2015')
const uglify = require('gulp-uglify')



module.exports = function (dir, config) {

    otpl.config(config.dir, {
        debug: true,
        soruceDir: config.map(config.soruceDir),
        targetDir: config.map(config.targetDir),
        functions: {
            test: () => {
                return "test fn!"
            }
        }
    })
    //不能创建目标多级目录

    gulp.task('otpl', function () {
        watcher(config.map(config.soruceDir), otpl, err => {
            browserSync.reload();
        })
    })

    // gulp.task('sass', function () {
    //     return gulp.src("app/scss/*.scss")
    //         .pipe(sass())
    //         .pipe(gulp.dest("app/css"))
    //         .pipe(browserSync.stream())
    // })


    gulp.task('js', function () {
        return gulp.src(`${dir}/src/js/**/*.js`)
            .pipe(babel({
                presets: [es2015]
            }))
            .pipe(uglify())
            .pipe(gulp.dest(`${dir}/public/js`))
            .pipe(browserSync.stream())
            // .pipe(browserify())
    })

    gulp.task('js-watch', ['js'], function (done) {
        // browserSync.reload();
        // done();
        gulp.watch(`${dir}/src/js/**/*.js`, ['js'])
    })

    // 监听 scss 源文件
    gulp.task('scss', function () {
        return gulp.src(`${dir}/src/scss/**/*.scss`)
            .pipe(sass())
            .pipe(gulp.dest(`${dir}/public/css`))
            .pipe(browserSync.stream())
    })

    gulp.task('scss-watch', ['scss'], function (done) {
        gulp.watch(`${dir}/src/scss/**/*.scss`, ['scss'])
    })

    // node 热加载（重启）
    gulp.task('nodemon', function (cb) {
        let started = false
        return nodemon({
            script: __dirname + '/server.js',//TODO
            ignore: ['.vscode', '.idea', 'node_modules'],
            env: {
                'NODE_ENV': 'development',
                'ROOT': `${dir}`
            },
            watch: [
                `${dir}/*.js`,
                `${dir}/*.json`
            ],
        }).on('start', function () {
            if (started) {
                browserSync.reload()
                return
            }
            started = true
            cb()
        })
    })


    gulp.task('serve', ['otpl', 'nodemon'], function () {
        browserSync.init({
            proxy: `http://localhost:${config.devServerPort}`,
            notify: true,
            open: false,
            port: 3000
        })

        //gulp.watch("app/scss/*.scss", ['sass']);
        //gulp.watch("*.html").on('change', browserSync.reload);
        // gulp.watch(`${dir}/routing.js`).on('change', browserSync.reload)
        // gulp.watch(`${dir}/gulp.js`).on('change', browserSync.reload)
    })
    gulp.task('default', ['serve', 'scss-watch','js-watch'])


    require(dir + '/gulp')(gulp, dir, config, browserSync)


    gulp.run();

}