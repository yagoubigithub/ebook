
import HtmlWebpackPlugin from "html-webpack-plugin";
import path  from "path";
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const config = {
    
    entry: "./app/src/index.jsx",
    output: {
        path: path.resolve(__dirname, "app/dist"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            // loads .js/jsx/json files
            {
                test: /\.jsx?$/,
                include: [path.resolve(__dirname, "app/src")],
                loader: "babel-loader",
                resolve: {
                    extensions: [".js", ".jsx", ".json"]
                }
            },
            {
                // loads .html files
                test: /\.(html)$/,
                include: [path.resolve(__dirname, "app/src")],
                use: {
                    loader: "html-loader"
                }
            },

            {
                // loads .css files
                test: /\.css$/,

                include: [path.resolve(__dirname, "app/src")],
                use: [
                    "style-loader",
                    "css-loader"]
            }

            ,
            //scss
            {
                test: /\.s[ac]ss$/i,
                include: [path.resolve(__dirname, "app/src")],
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "app/src/index.html"),
            filename: "index.html"
        })
    ]
};

export default config;