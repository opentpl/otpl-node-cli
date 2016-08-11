const fs = require('fs')
const normal = (src) => {
    while (src.indexOf('\\') > -1) {
        src = src.replace('\\', '/')
    }
    return src
}
module.exports = function (soruceDir,otpl,cb) {
    fs.watch(soruceDir, {
        persistent: true,
        recursive: true
    }, (eventType, filename) => {
        // console.log(`event type is: ${eventType}`);
        if (filename) {
            // console.log(`${eventType} : ${filename}`);
            filename = normal(filename)
            // console.log(`${eventType} : ${filename}`);
            otpl.compile(filename, (err, target) => {
                if (err) {
                    console.log('编译失败：'.red, err)
                    fs.unlink(target, function (err) {

                    })
                }
                else {
                    console.log(`编译成功：${filename}`)
                }
                cb(null)
            })
        }
    });
}

