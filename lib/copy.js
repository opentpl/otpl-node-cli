'use strict'

const fs = require('fs')
const path = require('path')

const copy = (src, dst, cb) => {
    fs.stat(src, (err, stat) => {
        if (err) {
            return cb(err)
        }

        if (stat.isDirectory()) {
            let dir = path.join(dst)
            fs.mkdir(dir, (err) => {
                if (err) {
                    //console.log('ERR:', err) //已经存在异常忽略
                }
                fs.readdir(src, (err, files) => {

                    for (var i in files) {
                        //console.log('============\n', files[i])
                        copy(path.join(src, files[i]), path.join(dir, files[i]), cb)
                    }
                })
            })

        }
        else if (stat.isFile()) {
            let file = dst// path.join(dst, path.basename(src))
            let doCopy = () => {
                let input = fs.createReadStream(src)
                let output = fs.createWriteStream(file)
                input.pipe(output)

                input.on("end", function () {
                    output.end()
                })
                input.on("error", function (err) {
                    console.log("error occur in input")
                })
            }

            fs.stat(file, (err, stat) => {

                if (!err && stat.isFile()) {
                    fs.rename(file, file + '.bak', (err) => { //TODO: 如果备份存在则需要处理？
                        doCopy()
                    })
                }
                else {
                    doCopy()
                }
            })
        }
    })
}

function copyFile(src,dst) {
    let idt = 0;
    while (true) {
        try {
            stat = fs.statSync(dst + (idt == 0 ? '' : '.bak' + idt))
            if (!stat.isFile()) {
                break
            }
            fs.renameSync(dst, dst + (idt == 0 ? '' : '.bak' + idt))
            idt++
        }
        catch (e) { break }
    }

    fs.writeFileSync(dst, fs.readFileSync(src));
}

function copyDir(src, dst) {
    let stat = fs.statSync(src)
    if (stat.isDirectory()) {
        try {
            fs.mkdirSync(dst)
        } catch (e) { }
        let files = fs.readdirSync(src)

        for (var i in files) {
            copyDir(path.join(src, files[i]), path.join(dst, files[i]))
        }
    }
    else if (stat.isFile()) {
        copyFile(src,dst)
    }
}


module.exports.copyDir = copyDir
module.exports.copyFile = copyFile