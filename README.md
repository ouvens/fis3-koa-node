
[![Build Status][build-badge-img]][build-url]
[![NPM version][npm-version-img]][npm-url]
[![NPM downloads per month][npm-downloads-img]][npm-url]
[![Chat on Slack][slack-img]][slack-url]
[![NPM license][npm-license-img]][npm-url]
[![Powered by Redfin][redfin-img]][redfin-url]

# koa + fis3 + swig 前后端同构方案

[架构设计文章](https://ouvens.github.io/frontend-build/2016/04/21/koa-fis3-swig-nodejs-isomorphic.html)

#### 1、需要安装的包
* fis3
* fis3-hook-commonjs
* fis3-postpackager-loader
* fis3-postprocessor-extras_uri
* fis3-packager-smart
* fis-parser-imweb-tpl
* fis-parser-imweb-tplv2
* fis-parser-node-sass
* fis-postprocessor-autoprefixer
* fis-prepackager-csswrapper
* fis3-parser-babel
* fis3-parser-swig
* fis3-packager-smart

#### 2、安装环境插件

注意安装0.12大版本的node，高版本的问题较多，可能报node-sass绑定错误

```
npm install -g fis3 fis3-hook-commonjs fis3-postpackager-loader fis3-postprocessor-extras_uri fis-parser-imweb-tpl fis-parser-imweb-tplv2 fis-postprocessor-autoprefixer fis-prepackager-csswrapper fis3-parser-babel fis-postpackager-iconfont fis3-packager-smart fis3-parser-node-sass fis3-parser-babel fis3-parser-swig fis-prepackager-csswrapper fis3-packager-smart
```

#### 3、前端编译
这里提供了component管理的三种打包方式：


* 在 src 目录下执行如下命令开发调试

```
fis3 server start --root ./dev     //启动调试服务器
fis3 server start --root ./dev --port 80 // 开发目录
fis3 server start --root ./dist --port 80 // 发布目录

fis3 release dev -wL // 前端开发调试，自动watch并刷新
fis3 release dev -c // 前端开发调试，清除缓存重新构建

fis3 release server -wL // 后端开发调试，自动watch并刷新
fis3 release server -c  // 后端开发调试，清除缓存重新构建

fis3 release dist   // 前端打包发布
fis3 release deploy // 后端打包发布

```


#### 4、后端编译

进入server目录

```
npm install
npm test   //调试
npm start
```

#### 5、其它

需要安装启动mongodb
---
启动mongodb [MonoDB](https://www.mongodb.org/)


使用pm2运行
---

`pm2 start pm2.json`




