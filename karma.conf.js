var browsers = ['Chrome', 'Firefox'];

if (process.platform === 'win32')
    browsers.push('IE');

module.exports = function (config) {
    config.set({
        browsers:   browsers,
        frameworks: ['mocha'],
        files:      [
            'node_modules/angular/angular.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/chai/chai.js',
            'src/ng-xslt.js',
            'test/config.js',
            'test/unit/*.js'
        ]
    });
};