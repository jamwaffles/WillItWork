var path = require('path');
var koa = require('koa');

var body = require('koa-body')
var serve = require('koa-static')
var favicon = require('koa-favi')
var router = require('koa-router')

// JSX and ES6 transform
require('babel/register')({
	extensions: [ '.js', '.jsx' ]
})

var app = koa();

app.use(body())
app.use(serve(path.resolve(__dirname, '../', 'public')))
app.use(favicon(path.resolve(__dirname, '../', 'public/img/favicon.ico')))
app.use(router(app))

require('./routes')(app)

module.exports = app;
