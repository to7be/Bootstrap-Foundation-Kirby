const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');


const extractSass = new ExtractTextPlugin({
    filename: "bundle.css",
    disable: process.env.NODE_ENV === "development"
});

var config = {
	entry: './src/js/app.js',
	output: {
		publicPath: '/assets/',
		path: path.resolve(__dirname, 'cms/assets/js'),
		filename: "bundle.js"
	},
	/*resolve: {
		alias: {
			jquery: '../../bower_components/jquery/dist/jquery.min.js',
			readmore: '../../node_modules/readmore-js/readmore.min.js',
			fastclick: '../../node_modules/fastclick/lib/fastclick.js',
        	foundation: '../../bower_components/foundation-sites/dist/js/foundation.js'
		}
	},*/
	module: {
		rules: [
			/*{
				test: /\.(js)$/,
				include: path.resolve(__dirname, "src/js"),
				use: {
					loader: 'babel-loader',
					options: { presets: ['env', 'react', 'stage-2'] }
				} 
			},*/


			// SASS Files
			{
				test: /\.scss$/,
				exclude: [/node_modules/], // sassLoader will include node_modules explicitly
				use: ExtractTextPlugin.extract({
					use: [
						{
		                    loader: "css-loader",
		                     options: {
		                    	sourceMap: "true",
		                    }
		                },
		                {
		                	loader: "postcss-loader",
		                	 options: {
		                    	sourceMap: "true"
		                    }
		                },
		                {
		                    loader: "sass-loader",
		                    options: {
		                    	includePaths: ["node_modules/foundation-sites/scss"],
		                    	sourceMap: "true",
		                    	outputStyle: "expanded"
		                    }
		                }
					],
	                // use style-loader in development
	                fallback: "style-loader"
				})
			},

			// General Image-Loading
			{
				test: /\.(jpg|png|svg)$/,
				exclude: [/node_modules/],
				use: {
					loader: 'url-loader',
					options: {
						limit: 8000,
						// file-loader's params if > limit 
						name: '[path][name].[ext]',
						outputPath: 'images/generated/'
					}
				}
			},
			// Font-Awesome Configuration
			/*{
		        test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
		        include: path.resolve(__dirname, "node_modules/font-awesome"),
		        use: {
		        	loader: 'url-loader'
		        }
		    }*/
		]
	},
	/*devServer: {
		historyApiFallback: true, // Fixes problem with unknown URIs when using React's BrowserRouter
		contentBase: "src/cms/assets/js"
	},*/
	plugins: [
		new ExtractTextPlugin({
			// filename takes function which sets a new relative filename
			filename:  (getPath) => {
				return getPath('css/bundle.css').replace('css/', '../css/');
			},
			disable: true
		}),
		new BrowserSyncPlugin({
			// browse to http://localhost:3000/ during development,
			// ./public directory is being served
			host: 'localhost',
			port: 3000,
			//server: { baseDir: ['site'] },
			proxy: 'http://localhost/dognyou/cms'
		})
	]
}

// if run in production mode
if (process.env.NODE_ENV === 'production') {
	// enabling ExtractTextPlugin
	// Accessing the first item of plugin-array
	config.plugins[0].options.disable = false;

	// add plugin Uglify
	config.plugins.push(
		new UglifyJSPlugin({
			uglifyOptions: {
			 	ie8: false,
			 	ecma: 8,
			 	output: {
					comments: false,
					beautify: false
				},
				compress: true
			}
		})
	)

}


module.exports = config;
