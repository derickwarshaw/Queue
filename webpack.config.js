module.exports = {
    entry: './queue.js',
    output: {
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                include: __dirname,
                loaders: 'babel-loader',
                query: {
                    presets: ['es2017', 'stage-0']
                }
            }
        ]
    }
};