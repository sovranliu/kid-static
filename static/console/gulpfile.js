//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp');
var fileinclude  = require('gulp-file-include');

//定义一个dataTask任务（自定义任务名称）
gulp.task('dataTask', function () {
    gulp.src('index.html') //该任务针对的文件
        .pipe(gulp.dest('')); //将会在src/css下生成index.css
});

gulp.task('fileinclude', function() {
    // 适配page中所有文件夹下的所有html，排除page下的include文件夹中html
    gulp.src(['page/**/*.html','!page/include/**.html'])
        .pipe(fileinclude({
          prefix: '@@',
          basepath: '@file'
        }))
    .pipe(gulp.dest('dist'));
});

gulp.task('default',['dataTask']); //定义默认任务

//gulp.task(name[, deps], fn) 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
//gulp.src(globs[, options]) 执行任务处理的文件  globs：处理的文件路径(字符串或者字符串数组) 
//gulp.dest(path[, options]) 处理完后文件生成路径