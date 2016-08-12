'use strict'

const getConfig = require("./config")
const copyUtil = require("./copy")
const fs = require('fs')
// const exec = require('child_process').exec

class Processor {

    constructor(dir) {
        dir = dir || (process.cwd() || __dirname)

        while (dir.indexOf('\\') > -1) {
            dir = dir.replace('\\', '/')
        }

        if (dir.endsWith('/')) {
            dir = dir.substr(0, dir.length - 1)
        }

        this.dir = dir
    }

    loadConfig() {
        try {
            let json = fs.readFileSync(this.configFile)
            return JSON.parse(json)
        }
        catch (e) { }
        return null
    }
    err(msg, action) {
        console.log(`>${msg}\n`.red)
        if (action) {
            action()
        }
    }
    //初始化项目
    init() {

        const config = getConfig(this.dir)
        const me = this
        const readline = require('readline')
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: '> '
        })


        let actions;
        actions = {
            end: () => {
                console.log('Your settings:', config)

                config.save()
                //copy app
                copyUtil.copyDir(__dirname + '/../app', me.dir)
                try{
                    fs.mkdirSync(config.map(config.soruceDir))
                }
                catch(e){}
                try{
                    copyUtil.copyFile(__dirname + '/../templates/index.otpl',config.map(config.soruceDir,'index.otpl'))
                }
                catch(e){}

                console.log('Project ' + config.name + ' initialized!!!');
                process.exit(0);
            },
            name: () => {
                rl.question(`Your project name(${config.name})：`, (answer) => {
                    answer = (answer || config.name).trim()
                    if (!answer) {
                        return me.err('Project name cannot be empty', this)
                    }
                    if (!/\w+/.test(answer)) {
                        return me.err('Project name should only consist of 0~9, a~z, A~Z, _, .', this)
                    }
                    config.name = answer
                    actions.soruceDir()
                })
            },
            soruceDir: () => {
                rl.question(`Your OTPL source path(${config.soruceDir})：`, (answer) => {
                    answer = (answer || config.soruceDir).trim()
                    if (answer) {
                        config.soruceDir = answer; //验证路径
                    }
                    // console.log(`>${config.soruceDir}\n`.green)
                    actions.targetDir()
                })
            },
            targetDir: () => {
                rl.question(`Your OTIL path(compile path)(${config.targetDir})：`, (answer) => {
                    answer = (answer || config.targetDir).trim()
                    if (answer) {
                        config.targetDir = answer; //验证路径
                    }
                    // console.log(`>${config.targetDir}\n`.green)
                    actions.useDevServer()
                })
            },
            useDevServer: () => {
                rl.question(`Use dev server(${config.useDevServer}),y/n：`, (answer) => {
                    answer = (answer || '').trim()
                    if (answer == 'y' || answer == 'yes' || answer == 't' || answer == 'true') {
                        config.useDevServer = true;
                    }
                    else if (answer == 'n' || answer == 'no' || answer == 'f' || answer == 'false') {
                        config.useDevServer = false;
                    }
                    // console.log(`>${config.useDevServer}\n`.green)
                    if (config.useDevServer) {
                        actions.devServerPort()
                    }
                    else {
                        actions.end()
                    }
                })
            },
            devServerPort: () => {
                let port = config.devServerPort || 8080
                rl.question(`Dev server port(${port})：`, (answer) => {
                    answer = (answer || '').trim()
                    let np = parseInt(answer)
                    if (!isNaN(np)) {
                        port = np
                    }
                    if (port > 0 && port < 10000) {
                        config.devServerPort = port
                    }
                    else {
                        return me.err(`端口必须位于0-1000之间，${port}\n`, this)
                    }
                    // console.log(`>${config.devServerPort}\n`.green)
                    actions.end()
                })
            }
        }

        actions.name()


    }

    make() {
        const config = require("./config")(this.dir) //TODO
        require('./gulpfile')(this.dir, config)
    }
    serve() {
        const config = require("./config")(this.dir) //TODO
        require('./gulpfile')(this.dir, config)
    }
}

module.exports = function (dir) {
    return new Processor(dir)
}
