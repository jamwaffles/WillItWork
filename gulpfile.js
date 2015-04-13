var gulp = require('gulp')
var path = require('path')

var gutil = require('gulp-util')
var del = require('del')
var less = require('gulp-less')
var browserify = require('browserify')
var watchify = require('watchify')
var uglify = require('gulp-uglify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var autoprefixer = require('gulp-autoprefixer')
var babelify = require('babelify')
var sourcemaps = require('gulp-sourcemaps')
var concat = require('gulp-concat')

require('gulp-help')(gulp)

var paths = {
	js: 'public/js',
	css: 'public/css',
	fonts: 'public/fonts',
	images: 'public/img'
}

var files = {
	js: 'main.js'
}

var isProduction = [ 'production', 'deploy' ].indexOf(process.env.NODE_ENV) > -1

function lessCompile(opts) {
	if(!opts) {
		opts = {}
	}

	// Compile styles to CSS
	return gulp.src('less/style.less')
		.pipe(!isProduction ? sourcemaps.init({ loadMaps: true }) : gutil.noop())
		.pipe(concat('style.css'))
		.pipe(less(opts))
		.pipe(autoprefixer({ cascade: false, browsers: 'last 2 versions' }))
		.pipe(!isProduction ? sourcemaps.write() : gutil.noop())
		.on('error', function(err) {
			gutil.log(gutil.colors.yellow(err.filename), gutil.colors.cyan('Line ' + err.lineNumber + ':' + err.column))
			gutil.log(gutil.colors.red(err.message))
			err.stack && gutil.log("\n", gutil.colors.gray(err.stack))

			isProduction && process.exit(1)
		})
		.pipe(gulp.dest(paths.css))
}

function writeBundle(b, fileName) {
	return b.bundle()
		.on('error', function(err) {
			gutil.log(gutil.colors.red(err.message))

			isProduction && process.exit(1)
		})
		.pipe(source(fileName))
		.pipe(isProduction ? buffer() : gutil.noop())
		.pipe(isProduction ? uglify() : gutil.noop())

		.pipe(gulp.dest(paths.js))
}

function bundleCompile(options) {
	var b = browserify({
		cache: {},
		packageCache: {},
		fullPaths: !isProduction,
		extensions: [ '.jsx' ],
		debug: !isProduction,
		noParse: [ 'q', 'lodash', 'backbone' ]
	})

	b.transform(babelify)

	if(options.watch) {
		b = watchify(b)

		b.on('update', function() {
			writeBundle(b, files.js)
		})
		.on('log', function(msg) {
			gutil.log(gutil.colors.green("Bundle complete:", msg))
		})
	}

	b.add('./app/browser.js')

	return writeBundle(b, files.js)
}

gulp.task('browserify', "Run the app JS through browserify so it can be used on the client", function() {
	return bundleCompile({ watch: false })
})

gulp.task('watchify', "Watch any JS/JSX files for changes and automatically rebundle them", function() {
	return bundleCompile({ watch: true })
})

gulp.task('default', "Default build task. Creates everything needed to run the app", [ 'less', 'browserify' ])

gulp.task('less', "Compile LESS files into CSS, copy images and fonts to public/", [ /*'copy-images'*/, 'copy-fonts' ], function() {
	var opts = {}

	if(isProduction) {
		opts = {
			compress: true,
			cleancss: true,
			optimization: 0
		}
	}

	return lessCompile(opts)
})

gulp.task('watch', "Run various watch commands to automatically rebuild when files change", [ 'less', /*'copy-images'*/, 'watchify' ], function() {
	gulp.watch('less/**/*.less', [ 'less' ])
	gulp.watch('images/**/*', [ 'copy-images' ])
})

gulp.task('copy-fonts', "Copy fonts to their dist folder", function() {
	gulp.src('node_modules/font-awesome/fonts/*', { base: 'node_modules/font-awesome/fonts' }).pipe(gulp.dest(paths.fonts))
})

// gulp.task(/*'copy-images'*/, "Copy images to their dist folder", function() {
// 	return gulp.src('images/**/*.{jpg,png,gif,svg,ico}').pipe(gulp.dest('public/img'))
// })

gulp.task('build-assets', "Build folder of static assets", [ /*'copy-images'*/, 'browserify', 'less' ])