//路由参考：https://github.com/alexmingoia/koa-router
module.exports = function ($, app,reload) {

    $.get('/', function* (next) {
        //TODO: 业务
        console.log('hello=============')
        //this.body='gggdd'
        yield this.otpl('index',{});
    });

    $.get('/test', function* (next) {
        //TODO: 业务
        this.body='test'
    });



}