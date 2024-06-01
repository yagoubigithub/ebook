import {merge} from "webpack-merge"
import base from "./webpack.config.mjs";

const config = merge(base, {
    mode: "production",
    devtool: false,
    optimization: {
        minimize: true
    }
});

export default config;