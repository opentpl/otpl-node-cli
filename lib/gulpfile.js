const gulp = require('gulp');
const browserSync = require('browser-sync').create();//https://www.browsersync.io/docs/gulp
const otpl = require("opentpl");
const fs = require('fs')
const path = require('path')
const nodemon = require('gulp-nodemon')
const watcher = require('./watcher')


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


    // gulp.task('js', function () {
    //     return gulp.src('js/*js')
    //         .pipe(browserify())
    //         .pipe(uglify())
    //         .pipe(gulp.dest('dist/js'))
    // })

    // gulp.task('js-watch', ['js'], function (done) {
    //     browserSync.reload();
    //     done();
    // })


    gulp.task('serve', ['otpl'], function () {
        nodemon({
            script: __dirname+'/server.js',//TODO
            ignore: ['.vscode', '.idea', 'node_modules'],
            env: {
                'NODE_ENV': 'development',
                'ROOT':`${dir}`
            },
            watch: [
                `${dir}/routing.js`
            ],
        })
        .on('readable', function(){
            this.stdout.on('data',data=>{
                console.log('>>>',data)
            })
        })

        browserSync.init({
            proxy: `http://localhost:${config.devServerPort}`,
            notify: true,
            open: true,
            port: 3000
        })

        //gulp.watch("app/scss/*.scss", ['sass']);
        //gulp.watch("*.html").on('change', browserSync.reload);
        // gulp.watch(`${dir}/routing.js`).on('change', browserSync.reload)
        // gulp.watch(`${dir}/gulp.js`).on('change', browserSync.reload)
    })

    gulp.task('default', ['serve'])

    require(dir + '/gulp')(gulp, dir, config,browserSync)

    
    gulp.run();

}