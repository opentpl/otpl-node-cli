// const readline = require('readline');

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// // rl.prompt(true)
// rl.question('What do you think of Node.js? ', (answer) => {
//   // TODO: Log the answer in a database
//   console.log('Thank you for your valuable feedback:', answer);

//   rl.write('Delete this!');
// // Simulate Ctrl+u to delete the line written previously
// rl.write("null", {ctrl: true, name: 'u'});


//   rl.close();
// });

var colors = require('colors');
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

var Processor=require('./processor')

var program = require('commander');
//https://github.com/tj/commander.js

program
    .version('0.0.1');


program
    .command('init')
    .description('初始化项目')
    .action(function (env, options) {
        new Processor(__dirname).init();
    });

program
    .command('make')
    .description('编译项目视图')
    .option('-w, --watch [watch]', '监视视图文件的变化','nowatch')
    .action(function (env, options) {
        new Processor(__dirname).make();
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

program.parse(process.argv);


// if (program.initialize) {
//     console.log('init')
// }
// else if (program.make && program.watch) {
//     console.log('监视 make')
// }
// else if (program.make) {
//     console.log('监视 make')
// }
// else if (program.compile) {
//     console.log('compile:' + program.compile)
// }
// else {

// }

