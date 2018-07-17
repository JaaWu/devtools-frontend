const path = require('path');
const gulp = require('gulp');
const run = require('gulp-run');
const clean = require('gulp-clean');
const runSequence = require('run-sequence');

const getDepSourcePath = name => path.resolve('./dep', name);
const getSourcePath = name => path.resolve(ROOT, './' + name);
const getOutputPath = name => path.resolve(OUT, './' + (name ? name : ''));

const getRealPath = name => (PATH_CONST[name] || []).map(p => getSourcePath(p)).join(" ");

const PATH_CONST = require('./path_const');
const ROOT = path.resolve(__dirname, '../');
const OUT = './output/devtools';
const PROTOCOL_VERSION = '-' + (process.env.PROTOCOL_VERSION || '1.3');
const PROTOCOL_JSON = './protocol' + PROTOCOL_VERSION + '.json';


gulp.task('devtools_frontend_resources', ['copies', 'aria_properties', 'supported_css_properties', 'frontend_protocol_sources']);

gulp.task('copies', () => {
    const devtools_embedder_scripts = getRealPath('devtools_embedder_scripts');
    const devtools_image_files = getRealPath('devtools_image_files');
    const devtools_emulated_devices_images = getRealPath('devtools_emulated_devices_images');

    gulp.src(devtools_embedder_scripts.split(" ")).pipe(gulp.dest(getOutputPath('')));
    gulp.src(devtools_image_files.split(" ")).pipe(gulp.dest(getOutputPath('Images')));
    gulp.src(devtools_emulated_devices_images.split(" ")).pipe(gulp.dest(getOutputPath('emulated_devices')));


});


// gulp.task('patch', () => {
//     gulp.src(path.join(__dirname, 'devtools_source_patch') + '/**').pipe(gulp.dest(getSourcePath('front_end')));
// });

gulp.task('devtools_extension_api', () => {
    const script = getSourcePath('scripts/build/generate_devtools_extension_api.py');
    const input = getSourcePath('front_end/extensions/ExtensionAPI.js');
    const output = getOutputPath('devtools_extension_api.js');
    return run(`python ${script} ${output} ${input} `).exec();

});

gulp.task('supported_css_properties', () => {
    const script = getSourcePath('scripts/build/generate_supported_css.py');
    const input = getDepSourcePath('./CSSProperties.json5');
    const output = getOutputPath('SupportedCSSProperties.js');
    return run(`python ${script} ${input} ${output}`).exec();

});

gulp.task('aria_properties', () => {
    const script = getSourcePath('scripts/build/generate_aria.py');
    const input = getDepSourcePath('./aria_properties.json5');
    const output = getOutputPath('accessibility/ARIAProperties.js');
    gulp.src('').pipe(gulp.dest(getOutputPath('accessibility')));
    return run(`python ${script} ${input} ${output}`).exec();

});


gulp.task('protocol_version', () => {
    const script = getDepSourcePath('ConcatenateProtocols.py');
    const inputs = [
        getDepSourcePath('browser_protocol' + PROTOCOL_VERSION + '.json'),
        getDepSourcePath('js_protocol' + PROTOCOL_VERSION + '.json')
    ];
    let input = inputs.join(' ');
    const output = getOutputPath(PROTOCOL_JSON);
    return run(`python ${script} ${input} ${output}`).exec();
});

gulp.task('frontend_protocol_sources', ['protocol_version'], () => {
    const script = getSourcePath('scripts/build/code_generator_frontend.py');
    const input = getOutputPath(PROTOCOL_JSON);
    const output = getOutputPath();
    return run(`python ${script} ${input} --output_js_dir ${output}`).exec();

});


gulp.task('build', ['devtools_frontend_resources'], () => {
    const script = getSourcePath(process.env.NODE_ENV === 'dev' ?
        'scripts/build/build_debug_applications.py' :
        'scripts/build/build_release_applications.py');


    const devtools_applications = [
        "audits2_worker",
        "devtools_app",
        "formatter_worker",
        "heap_snapshot_worker",
        "inspector",
        "integration_test_runner",
        "js_app",
        "ndb_app",
        "node_app",
        "shell",
        "toolbox",
        "worker_app",
    ].join(' ');


    const input = getSourcePath('front_end');
    const output = getOutputPath();
    return run(`python ${script} ${devtools_applications} --input_path ${input} --output_path ${output}`).exec();

});


gulp.task('clean', () => {
    return gulp.src(getOutputPath(), {force: true}).pipe(clean());
});


gulp.task('default', cb => {
    runSequence('clean', /*'patch',*/ 'build', cb);
});