'use strict'

const Processor = require('./processor')
const colors = require('colors')
const program = require('commander')

//http://blog.csdn.net/dai_jing/article/details/47295067

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'red',
    info: 'green',
    data: 'blue',
    help: 'cyan',
    warn: 'yellow',
    debug: 'magenta',
    error: 'red'
});

var processor;
//https://github.com/tj/commander.js

program
    .version('0.4.3');

program
    .command('init')
    .description('初始化项目')
    .action(function (env, options) {
        processor.init();
    });


program
    .command('serve')
    .description('启动开发服务器')
    .action(function (env, options) {
        processor.serve();
    });

program
    .command('make')
    .description('编译项目视图')
    .option('-w, --watch [watch]', '监视视图文件的变化', 'nowatch')
    .action(function (env, options) {
        processor.make();
        // console.log(options)
        // var mode = env.watch || "normal";
        // env = env || 'all';
        // console.log('make for %s env(s) with %s mode', env, mode);
    });

program
    .command('-c')
    .description('编译指定文件')
    .action(function (env, options) {
        var mode = options.setup_mode || "normal";
        env = env || 'all';
        console.log('c for %s env(s) with %s mode', env, mode);
    });

program
    .command('*')
    .action(function (env) {
        console.log('deploying "%s"', env);
    });

module.exports = function (exectionPath) {

    processor = new Processor(exectionPath)

    program.parse(process.argv)
}