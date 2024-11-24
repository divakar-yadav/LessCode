const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');  // Node.js polyfill for Webpack

module.exports = {
    mode: 'development',  // Set mode to development
    target: 'electron-renderer',  // Target Electron's renderer process
    entry: './src/index.js',  // Entry point for the application
    output: {
        path: path.resolve(__dirname, 'build'),  // Output path for the bundled files
        filename: 'bundle.js'  // Output bundle name
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,  // Transpile JS and JSX files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']  // Babel presets for modern JS and React
                    }
                }
            },
            {
                test: /\.css$/,  // Process CSS files
                use: ['style-loader', 'css-loader']  // Inject CSS into HTML
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,  // Handle image files
                type: 'asset/resource'
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,  // Handle font files
                type: 'asset/resource'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'  // Template for generating the final HTML file
        }),
        new NodePolyfillPlugin()  // Add polyfills for Node.js modules like `path`, `fs`, etc.
    ],
    resolve: {
        extensions: ['.js', '.jsx'],  // Resolve both JS and JSX file extensions
        fallback: {
            fs: false,  // These modules are Node.js-specific and should not be bundled for the browser
            path: require.resolve('path-browserify'),
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            buffer: require.resolve('buffer/')
        }
    },
    externals: {
        electron: 'require("electron")'  // Don't bundle Electron's native modules
    },
    devtool: 'inline-source-map',  // Enable source maps for better debugging
    devServer: {
        static: path.resolve(__dirname, 'public'),  // Serve static files from the public directory
        compress: true,
        port: 8080,  // Development server runs on port 8080
        hot: true  // Enable hot module replacement for development
    }
};
