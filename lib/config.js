const fs = require('fs')
const path = require('path')
class Config {

    constructor(dir) {
        this.file = path.join(dir, 'otplrc.json')
        let config = {}
        try {
            config = JSON.parse(fs.readFileSync(this.file))
            this.isLoaded = true   //适用于某些需要检测是否是通过配置文件载入的
        } catch (e) {
            // console.log(e)
        }

        while (dir.indexOf('\\') > -1) {
            dir = dir.replace('\\', '/')
        }
        if (dir.endsWith('/')) {
            dir = dir.substr(0, dir.length - 1)
        }

        if (!config.name || config.name == '') {
            let last = dir.lastIndexOf('/')
            if (last > -1) {
                config.name = dir.substr(last + 1)
            }
            else {
                config.name = ''
            }
        }

        this.name = config.name
        this.description = config.description || ''
        this.soruceDir = config.soruceDir || './views'
        this.targetDir = config.targetDir || './bin/otil'
        this.useDevServer = config.useDevServer || true
        this.devServerPort = config.devServerPort || 8080

        this.dir = dir
    }

    save(cb) {

        let config = {
            name: this.name,
            description: this.description,
            soruceDir: this.soruceDir,
            targetDir: this.targetDir,
            useDevServer: this.useDevServer,
            devServerPort: this.devServerPort
        }

        fs.writeFileSync(this.file, JSON.stringify(config, null, 4))
    }

    map(name, n2, n3, n4) {
        return path.join(this.dir, name, n2 || '', n3 || '', n4 || '')
    }

}

module.exports = function (dir) {
    return new Config(dir)
}