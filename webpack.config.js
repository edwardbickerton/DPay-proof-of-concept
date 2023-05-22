const path = require('path');

module.exports = {
    entry: './Front End/forPackage.js',
    output: {
        filename: 'webPackageBundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
