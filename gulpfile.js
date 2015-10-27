"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var header = require("gulp-header");
var preprocess = require("gulp-preprocess");
var rename = require("gulp-rename");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var spritesmith = require("gulp.spritesmith");
var moment = require("moment");
var now = moment().format("YYYY/MM/DD/HH:mm:ss");

 
gulp.task("sass", function () {
  gulp.src("./sass/**/*.scss")
    .pipe(sass({outputStyle:"compressed"}).on("error", sass.logError))
    .pipe(header("/*-- ${date} --*/@charset \"utf-8\";",{date:now,author:"hulei"}))
    .pipe(rename({extname:".min.css",dirname:"./"}))
    .pipe(gulp.dest("./dist/css"));
});

gulp.task('sprite', function() {
  var spriteData = gulp.src('./icons/*.*') // source path of the sprite images
      .pipe(spritesmith({
        imgName: 'icons.png',
        cssName: '_icons.scss',
        padding: 5
      }));

  spriteData.img.pipe(gulp.dest('./dist/css/imgs/')); // output path for the sprite
  spriteData.css.pipe(gulp.dest('./sass/')); // output path for the CSS
});

gulp.task("concat", function () {
  gulp.src(["./src/vendors/jquery/jquery.js","./src/vendors/jquery-cycle2/build/jquery.cycle2.js","./src/components/jquery.select.js"])
    .pipe(concat('edi.min.js'))
    .pipe(uglify())
    .pipe(header("/*-- ${date} jquery,jquery-cycle2,jquery-select --*/",{date:now,author:"hulei"}))
    .pipe(gulp.dest("./dist/js"));
});

gulp.task("html", function() {
  gulp.src("./*.html")
    .pipe(preprocess({context: { NODE_ENV: 'over', DEBUG: true}}))
    .pipe(gulp.dest("./dist"));
});

gulp.task("all", ["sass", "html","sprite"]);

gulp.task("sass:watch", function () {
  gulp.watch("./sass/**/*.scss", ["sass"]);
});

gulp.task("all:watch", function(){
	gulp.watch("./sass/**/*.scss", ["sass"]);
	gulp.watch("./*.html", ["html"]);
});
