// var name = 'fis3';
// fis.project.setProjectRoot('src');
// fis.processCWD = fis.project.getProjectPath()

var devDist = './dev';
var dist = './dist';
var serverDev = './server/dev';
var serverDist = './server/pages';

fis.set('project.md5Connector', '-');
fis.hook('commonjs');

fis.config.set('project.fileType.text', 'jsx'); //*.jsx files are text file. 
fis.config.set('modules.parser.jsx', 'react'); //compile *.jsx with fis-parser-react plugin 
fis.config.set('roadmap.ext.jsx', 'jsx'); //*.jsx are exactly treat as *.js 

/**
 * 配置进行处理的目录或文件
 */
fis.set('project.ignore', [
    'server/**',
    'node_modules/**',
    '.git/**',
    '.svn/**',
    'dev/**',
    'dist/**',
    '**/_*.scss',
    '**.md',
    'fis-conf.js',
    'package.json',
    'MIT-LICENSE'
]);

fis.match('libs/**.min.js', {
        release: false
    })
    .match(/.+\/(.+)\/(.+)\.tpl$/, { // js 模版一律用 .tpl,可以使用[模块名.tpl]作为模板
        isMod: true,
        rExt: 'js',
        id: '$1/$2.tpl',
        release: '$1/$2.tpl', // 发布的后的文件名，避免和同目录下的 js 冲突
        moduleId: '$1/$2.tpl',
        parser: fis.plugin('swig')
    })
    .match(/^\/libs\/.+\/(.+)\.js$/i, {
        packTo: '/libs/$1.js',
        isMod: true,
        id: '$1'
    })
    .match(/libs\/mod\/(mod)\.js$/i, {
        packTo: '/libs/$1.js',
        isMod: false
    })
    // 公共组件id匹配
    .match(/^\/(component|asyncComponent)\/.+\/(.+)\/main\.js$/i, {
        isMod: true,
        id: '$2',
        parser: fis.plugin('react')
    })
    // 进行前端引用输出
    // .match(/^\/(component|asyncComponent)\/.+\/(.+)\/main\.rt$/i, {
    //     isMod: true,
    //     rExt: 'js',
    //     id: '$1/$2.rt',
    //     moduleId: '$1/$2.rt',
    //     release: '$1/$2.rt', // 发布的后的文件名，避免和同目录下的 js 冲突
    //     parser: fis.plugin('react')
    // })
    // 进行服务端目录下输出内容
    .match(/^\/(component|asyncComponent)\/.+\/(.+)\/main\.jsx$/i, {
        rExt: 'jsx',
        isMod: false,
        id: '$1',
        parser: fis.plugin('react')
    })
    .match('pages/**.js', {
        isMod: true
    })
    .match('**.{scss,sass}', {
        parser: fis.plugin('node-sass', {
            include_paths: ['libs', 'pages']
        }),
        rExt: '.css'
    })
    .match(/\/(.+\.async)\.(scss|css)$/, { // 异步 css 包裹
        isMod: false,
        rExt: 'js',
        isCssLike: true,
        id: '$1',
        release: false, // @todo 这里 $1.$2 竟然有 bug ，应该和上面的 tpl 性质一样
        extras: {
            wrapcss: true
        }
    })
    .match('**.{js,tpl}', {
        // domain: 'http://7.url.cn/edu/activity/' + name
    })
    .match('**.{css,scss,sass}', {
        // domain: 'http://7.url.cn/efidu/activity/' + name
    })
    .match('::image', {
        // domain: 'http://7.url.cn/edu/activity/' + name
    })
    .match('::package', { //smart 打包
        prepackager: fis.plugin('csswrapper'),
        packager: [fis.plugin('smart', {
            autoPack: true,
            output: 'pkg/${id}.min.js',
            jsAllInOne: false

        })]
    });

/**
 * 服务端开发
 */
fis.media('server')
    .match('/pages/*.html', {
        deploy: fis.plugin('local-deliver', {
            to: serverDev
        })
    })
    .match('/{pkg,libs,asyncComponent}/**.js', {
        deploy: fis.plugin('local-deliver', {
            to: serverDev
        })
    })
    .match('/{pkg,libs,component,asyncComponent}/**.jsx', {
        deploy: fis.plugin('local-deliver', {
            to: serverDev
        })
    })
    .match('/pkg/pages/*/**.{css,scss,sass}', {
        optimizer: fis.plugin('clean-css'),
        deploy: fis.plugin('local-deliver', {
            to: serverDev
        })
    })
    .match('::image', {
        deploy: fis.plugin('local-deliver', {
            to: serverDev
        })
    })
    .match('**.{ttf, eot, png}', {
        deploy: fis.plugin('local-deliver', {
            to: serverDev
        })
    })
    .match('**.json', {
        deploy: fis.plugin('local-deliver', {
            to: serverDev
        })
    });

/**
 * 服务端部署
 */
fis.media('deploy')
    .match('/pages/*.html', {
        deploy: fis.plugin('local-deliver', {
            to: serverDist
        })
    })
    .match('/{pkg,libs,asyncComponent}/**.js', {
        // parser: fis.plugin('babel'),
        useHash: true,
        optimizer: fis.plugin('uglify-js'),
        deploy: fis.plugin('local-deliver', {
            to: serverDist
        })
    })
    .match('/pkg/pages/*/**.{css,scss,sass}', {
        useHash: true,
        useSprite: true,
        optimizer: fis.plugin('clean-css'),
        deploy: fis.plugin('local-deliver', {
            to: serverDist
        })
    })
    .match('::image', {
        useHash: true,
        deploy: fis.plugin('local-deliver', {
            to: serverDist
        })
    })
    .match('**.png', {
        useHash: true,
        optimizer: fis.plugin('png-compressor'),
        deploy: fis.plugin('local-deliver', {
            to: serverDist
        })
    })
    .match('**.{ttf, eot, tpl}', {
        useHash: true,
        deploy: fis.plugin('local-deliver', {
            to: serverDist
        })
    })
    .match('**.json', {
        deploy: fis.plugin('local-deliver', {
            to: serverDist
        })
    });
/**
 * 前端开发
 */
fis.media('dev')
    .match('/pages/*.html', {
        deploy: fis.plugin('local-deliver', {
            to: devDist
        })
    })
    .match('/{pkg,libs,asyncComponent}/**.js', {
        deploy: fis.plugin('local-deliver', {
            to: devDist
        })
    })
    .match('/pkg/pages/*/**.{css,scss,sass}', {
        optimizer: fis.plugin('clean-css'),
        deploy: fis.plugin('local-deliver', {
            to: devDist
        })
    })
    .match('::image', {
        deploy: fis.plugin('local-deliver', {
            to: devDist
        })
    })
    .match('**.{ttf, eot, tpl, png}', {
        deploy: fis.plugin('local-deliver', {
            to: devDist
        })
    })
    .match('**.json', {
        deploy: fis.plugin('local-deliver', {
            to: devDist
        })
    });

/**
 * 前端发布
 * 
 */
fis.media('dist')
    .match('/pages/*.html', {
        deploy: fis.plugin('local-deliver', {
            to: dist
        })
    })
    .match('/{pkg,libs,asyncComponent}/**.js', {
        parser: fis.plugin('babel'),
        optimizer: fis.plugin('uglify-js'),
        deploy: fis.plugin('local-deliver', {
            to: dist
        })
    })
    .match('/pkg/pages/*/**.{css,scss,sass}', {
        useHash: true,
        useSprite: true,
        optimizer: fis.plugin('clean-css'),
        deploy: fis.plugin('local-deliver', {
            to: dist
        })
    })
    .match('::image', {
        useHash: true,
        deploy: fis.plugin('local-deliver', {
            to: dist
        })
    })
    .match('**.png', {
        useHash: true,
        optimizer: fis.plugin('png-compressor'),
        deploy: fis.plugin('local-deliver', {
            to: dist
        })
    })
    .match('**.{ttf, eot}', {
        useHash: true,
        deploy: fis.plugin('local-deliver', {
            to: dist
        })
    })
    .match('**.json', {
        deploy: fis.plugin('local-deliver', {
            to: dist
        })
    });