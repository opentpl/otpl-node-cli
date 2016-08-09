
const fs = require('fs')
const exec = require('child_process').exec

class Initiator {

    constructor(dir) {
        while (dir.indexOf('\\') > -1) {
            dir = dir.replace('\\', '/')
        }
        this.dir = dir+'/app'
        this.configFile = dir + '/otplrc.json'
    }

    loadConfig() {
        try {
            let json = fs.readFileSync(this.configFile)
            return JSON.parse(json)
        }
        catch (e) { }
        return null
    }

    init() {

        this.config = this.loadConfig()

        if (!this.config) {
            this.config = {}
        }

        let config = this.config;

        config.name = config.name || this.dir.substr(this.dir.lastIndexOf('/') + 1)
        config.description = config.description || ''
        config.soruceDir = config.soruceDir || '/views'
        config.targetDir = config.targetDir || '/bin/otil'
        config.useDevServer = config.useDevServer || true

        //console.log('fhfh'.red)
        //console.log(this.config)
        this.dialog(this.config)
    }

    dialog(config) {
        const me = this
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: '> '
        });

        let actions;
        actions = {
            end: () => {

                fs.writeFile(me.configFile, JSON.stringify(me.config, null, 4), (err) => {
                    if (err) throw err
                    console.log('配置成功完成')
                    process.exit(0);
                });

            },
            name: () => {
                rl.question(`项目名称(${config.name})：`, (answer) => {
                    answer = (answer || '').trim()
                    if (answer) {
                        config.name = answer; //验证名称
                    }
                    console.log(`>${config.name}\n`.green)
                    actions.soruceDir()
                });
            },
            soruceDir: () => {
                rl.question(`视图源码路径(${config.soruceDir})：`, (answer) => {
                    answer = (answer || '').trim()
                    if (answer) {
                        config.soruceDir = answer; //验证路径
                    }
                    console.log(`>${config.soruceDir}\n`.green)
                    actions.targetDir()
                });
            },
            targetDir: () => {
                rl.question(`编译输出路径(${config.targetDir})：`, (answer) => {
                    answer = (answer || '').trim()
                    if (answer) {
                        config.targetDir = answer; //验证路径
                    }
                    console.log(`>${config.targetDir}\n`.green)
                    actions.useDevServer()
                });
            },
            useDevServer: () => {
                rl.question(`是否启用开发服务器(${config.useDevServer}),y/n：`, (answer) => {
                    answer = (answer || '').trim()
                    if (answer == 'y' || answer == 'yes' || answer == 't' || answer == 'true') {
                        config.useDevServer = true;
                    }
                    else if (answer == 'n' || answer == 'no' || answer == 'f' || answer == 'false') {
                        config.useDevServer = false;
                    }
                    console.log(`>${config.useDevServer}\n`.green)
                    if (config.useDevServer) {
                        actions.devServerPort()
                    }
                    else {
                        actions.end()
                    }
                });
            },
            devServerPort: () => {
                let port = config.devServerPort || 8080
                rl.question(`开发服务器端口(${port})：`, (answer) => {
                    answer = (answer || '').trim()
                    let np = parseInt(answer)
                    if (!isNaN(np)) {
                        port = np
                    }
                    if (port > 0 && port < 10000) {
                        config.devServerPort = port
                    }
                    else {
                        console.log(`端口必须位于0-1000之间，${port}\n`.red)
                        actions.devServerPort()
                        return
                    }
                    console.log(`>${config.devServerPort}\n`.green)
                    actions.end()
                });
            }
        }

        actions.name()
        return;

        rl.on('line', (line) => {
            action(line)
        }).on('close', () => {
            console.log('abort init!');
            process.exit(0);
        });

        action = (line) => {
            if (line) {
                config.name = line; //验证名称
            }
            rl.prompt();
            rl.write(`项目名称：(${config.name})`.green);

            action = line => {
                console.log(`视图路径：(${config.viewPath})`);
                rl.prompt();
            }
        }

        console.log(`项目名称：(${config.name})`);
        rl.prompt();
    }

    make() {
        const config = require("./config")(this.dir) //TODO
        // this.config = this.loadConfig()
        // if (!this.config) {
        //     console.log('未找到配置文件，可以使用 init 命令来初始化。'.red)
        // }

        require('./gulpfile')(this.dir,config)
        // return
        // var last = exec('node gulpfile.js')

        // last.stdout.on('data', function (data) {
        //     console.log(`> ${data}`.cyan);
        // });

        // last.on('exit', function (data) {
        //     console.log(`> ${data}`.cyan);
        // });
    }


}

module.exports = function (dir) {
    return new Initiator(dir)
}
