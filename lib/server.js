
const app = require('koa')()
const router = require('koa-router')()
const reload = "<script async src='/browser-sync/browser-sync-client.2.14.0.js'></script>"
const otpl = require("opentpl")
const ROOT=process.env.ROOT || __dirname
const config = require("./config")(ROOT)
let tried = 0;
let listen;
listen = (port, cb) => {
    app.listen(port, function (err) {
        tried++
        if (err) {
            if (tried > 6000) {
                return cb(err, port)
            }
            return listen(port + 1)
        }
        console.log(`serve on port: ${port}`)
        cb(err, port)
    })
}


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

app.use(require('koa-static')(config.map('/public')))

app.use(function* (next) {
    this.type = 'text/html;charset=UTF-8'
    this.otpl = function* (view, data) {
        let ctx = this
        yield new Promise((resolve, reject) => {
            let callback = function (err, rendered) {
                if (err) {
                    rendered = err.message;
                    rendered=`<html><body>${rendered}</body></html>`
                    console.log('render error:', err)
                }
                ctx.body = rendered
                resolve(rendered)
            }
            otpl.render(view, data, callback)
        })
    }
    yield next
})

require(config.map('routing'))(router, app, reload)
app.use(router.routes()).use(router.allowedMethods())
listen(config.devServerPort, function(){})

// module.exports = (dir, config, otpl, cb) => {
//     app.use(require('koa-static')(dir + '/public'))
//     app.use(function* (next) {
//         this.type = 'text/html;charset=UTF-8'
//         this.otpl = function* (view, data) {
//             let ctx = this
//             yield new Promise((resolve, reject) => {
//                 let callback = function (err, rendered) {
//                     if (err) {
//                         rendered = err.message;
//                         console.log('render error:', err)
//                     }
//                     ctx.body = rendered
//                     resolve(rendered)
//                 }
//                 otpl.render(view, data, callback)
//             })
//         }
//         yield next
//     })

//     //调用用户定义的路径
//     require(dir + '/routing')(router, app, reload)
//     app.use(router.routes()).use(router.allowedMethods())
//     listen(3000, cb)
// }







