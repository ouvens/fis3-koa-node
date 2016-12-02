// var name = 'fis3';
// fis.project.setProjectRoot('src');
// fis.processCWD = fis.project.getProjectPath()


/**
 * 前端调试： fis3 release dev -wL
 * 前端发布： fis3 release dist
 * 后端调试： fis3 release server -wL
 * 后端发布： fis3 release deploy
 * app: 	  fis3 release app
 * app发布：  fis3 release publish
 */

var devDist = './dev';
var dist = './dist';
var serverDev = './server/dev';
var serverDist = './server/pages';
var appDist = './client/www';

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
	'client/**',
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
		// release: '$1/$2.tpl', // 发布的后的文件名，避免和同目录下的 js 冲突
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
	// 公共组件id匹配, component级别内容压缩并转es6
	// parser: fis.plugin('babel')
	.match(/^\/(component|asyncComponent)\/.+\/(.+)\/main\.js$/i, {
		isMod: true,
		id: '$2',
		parser: fis.plugin('babel'),
		optimizer: fis.plugin('uglify-js')
	})
	// page级别内容压缩并转es6
	.match('pages/**.js', {
		isMod: true,
		packTo: '$0',
		parser: fis.plugin('babel'),
		optimizer: fis.plugin('uglify-js')
	})
	// 进行服务端目录下react模板静态输出内容
	.match(/^\/(component|asyncComponent)\/.+\/(.+)\/main\.jsx$/i, {
		rExt: 'jsx',
		isMod: false,
		id: '$1',
		parser: fis.plugin('react')
	})
	.match('**.{scss,sass}', {
		rExt: '.css',
		parser: fis.plugin('node-sass', {
			include_paths: ['libs', 'pages']
		})
	})
	// 异步CSS处理
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
	}).match('::package', { //smart 打包
		prepackager: fis.plugin('csswrapper'),
		packager: [fis.plugin('smart', {
			autoPack: true,
			output: 'pkg/${id}.min.js',
			jsAllInOne: false,
			// 不打包的模块
			ignore: []
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
		// optimizer: fis.plugin('uglify-js'),
		deploy: fis.plugin('local-deliver', {
			to: serverDev
		})
	})
	.match('/{pkg,libs,component,asyncComponent}/**.jsx', {
		deploy: fis.plugin('local-deliver', {
			to: serverDev
		})
	})
	.match('**.{css,scss,sass}', {
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
		parser: fis.plugin('babel'),
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
	.match('/{pkg,libs,component,asyncComponent}/**.js', {
		// parser: fis.plugin('babel'),
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
	.match('/{pkg,libs,component,asyncComponent}/**.js', {
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


/**
 * 前端App开发
 */
fis.media('app')
	.match('/pages/*.html', {
		deploy: fis.plugin('local-deliver', {
			to: devDist
		})
	})
	.match('/{pkg,libs,component,asyncComponent}/**.js', {
		url: '/android_asset/www$0',
		deploy: fis.plugin('local-deliver', {
			to: devDist
		})
	})
	.match('/pkg/pages/*/**.{css,scss,sass}', {
		// release: '/static/$0',
		url: '/android_asset/www$0',
		optimizer: fis.plugin('clean-css'),
		deploy: fis.plugin('local-deliver', {
			to: devDist
		})
	})
	.match('::image', {
		url: '/android_asset/www$0',
		deploy: fis.plugin('local-deliver', {
			to: devDist
		})
	})
	.match('**.{ttf, eot, tpl, png}', {
		url: '/android_asset/www$0',
		deploy: fis.plugin('local-deliver', {
			to: devDist
		})
	})
	.match('**.json', {
		url: '/android_asset/www$0',
		deploy: fis.plugin('local-deliver', {
			to: devDist
		})
	});

/**
 * 前端App
 * 
 */
fis.media('publish')
	.match('/pages/*.html', {
		deploy: fis.plugin('local-deliver', {
			to: appDist
		})
	})
	.match('/{pkg,libs,component,asyncComponent}/**.js', {
		// parser: fis.plugin('babel'),
		url: '/android_asset/www$0',
		optimizer: fis.plugin('uglify-js'),
		deploy: fis.plugin('local-deliver', {
			to: appDist
		})
	})
	.match('/pkg/pages/*/**.{css,scss,sass}', {
		url: '/android_asset/www$0',
		useHash: true,
		useSprite: true,
		optimizer: fis.plugin('clean-css'),
		deploy: fis.plugin('local-deliver', {
			to: appDist
		})
	})
	.match('::image', {
		useHash: true,
		url: '/android_asset/www$0',
		deploy: fis.plugin('local-deliver', {
			to: appDist
		})
	})
	.match('**.png', {
		useHash: true,
		url: '/android_asset/www$0',
		optimizer: fis.plugin('png-compressor'),
		deploy: fis.plugin('local-deliver', {
			to: appDist
		})
	})
	.match('**.{ttf, eot}', {
		useHash: true,
		url: '/android_asset/www$0',
		deploy: fis.plugin('local-deliver', {
			to: appDist
		})
	})
	.match('**.json', {
		url: '/android_asset/www$0',
		deploy: fis.plugin('local-deliver', {
			to: appDist
		})
	});