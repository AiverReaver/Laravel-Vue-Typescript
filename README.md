# Laravel-Vue-Typescript
This quick start guide will teach you how to get Laravel TypeScript and Vue working together. This guide is flexible enough that any steps here can be used to integrate TypeScript into an existing Laravel project. Sepecfically Laravel 5.7 .

Laravel 5.7 uses Laravel-mix which down the line uses webpack 3 . Which is not what we want for typescript to work in laravel project.

# Initialize your project

Let's create a new Project.

First make sure you have composer and laravel installed

```sh
laravel new Laravel-Vue-Typecript 
```
Open the project in your any favraite code editor.

Open the `package.json` and add these packages to devdependencies
```json
{
   "devDependencies": {
        "auto-loader": "^0.2.0",
        "autoprefixer": "^9.4.1",
        "axios": "^0.18",
        "bootstrap": "^4.0.0",
        "lodash": "^4.17.5",
        "popper.js": "^1.12",
        "jquery": "^3.2",
        "cross-env": "^5.1",
        "css-loader": "^1.0.1",
        "mini-css-extract-plugin": "^0.4.5",
        "node-sass": "^4.10.0",
        "optimize-css-assets-webpack-plugin": "^5.0.1",
        "postcss-loader": "^3.0.0",
        "sass-loader": "^7.1.0",
        "ts-loader": "^5.3.1",
        "typescript": "^3.2.1",
        "uglifyjs-webpack-plugin": "^2.0.1",
        "vue": "^2.5.17",
        "vue-class-component": "^6.3.2",
        "vue-property-decorator": "^7.2.0",
        "webpack": "^4.26.1",
        "webpack-cli": "^3.1.2",
        "vue-loader": "^15.4.2",
        "vue-template-compiler": "^2.5.17"
    }
}
```
Now install these npm packages with
```shell
npm install
```

# Add Typescript Support

Then rename these files

```txt
Laravel-Vue-Typecript/
├─ resources/js/app.js => resources/js/app.ts
└─ resources/js/bootstrap.js => resources/js/bootstrap.ts
```
Now Change the Code in `app.ts`, `bootstrap.ts` and `resources/js/components/ExampleComponent.vue`
```ts
// app.ts
import "./bootstrap"
import Vue from "vue"
import ExampleComponent from "./components/ExampleComponent.vue"

Vue.component('example', ExampleComponent)

new Vue({
    el: '#app'
})
```
```ts
// bootstrap.ts
import axios from 'axios';
import * as _ from 'lodash';
import jQuery from 'jquery';
import * as Popper from 'popper.js';
import 'bootstrap';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';


let token : HTMLMetaElement | null = document.head!.querySelector('meta[name="csrf-token"]');

if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}
```
```ts
// resources/js/components/ExampleComponent.vue
<template>
    <h1>This is an example component</h1>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component"
@Component
export default class ExampleComponent extends Vue {
    mounted() : void {
        console.log("hello");
    }
}
</script>
```
Create `typings.d.ts` file inside `resources/js` and add these lines.
```ts
declare module '*.vue' {
    import Vue from 'vue'
    export default Vue
}

declare module 'jquery';

declare module 'lodash';
```


Now Create `tsconfig.json`, `webpack.config.js` and `postcss.config.js` in the root of your project and these lines of code to them respectivly

`tsconfig.json` 
```json
{
    "compilerOptions": {
        "target": "es5",
        "strict": true,
        "module": "es2015",
        "moduleResolution": "node",
        "experimentalDecorators": true,
        "skipLibCheck": true
    },
    "include": [
        "resources/js/**/*"
    ],
    "exclude": [
        "node_modules",
        "vendor"
    ]
}
```

`webpack.config.js`
```js
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');


let env = process.env.NODE_ENV
let isDev = env === 'development'

const WEBPACK_CONFIG = {
    mode: env,
    entry: {
        app: ['./resources/js/app.ts', './resources/sass/app.scss'],
    },
    output: {
        publicPath: './public',
        path: path.resolve(__dirname, 'public'),
        filename: 'js/[name].js',
        chunkFilename: 'js/chunks/app.js'

    },
    module: {
        rules: [{
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: { appendTsSuffixTo: [/\.vue$/] },
                exclude: /node_modules/,
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ],
                exclude: /node_modules/,
            }
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
        new VueLoaderPlugin(),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    autoprefixer()
                ]
            }
        })

    ],
    resolve: {
        extensions: ['.js', '.jsx', '.vue', '.ts', '.tsx'],
        alias: {
            vue$: 'vue/dist/vue.esm.js',
        },
    },
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    }


}

if (!isDev) {
    WEBPACK_CONFIG.optimization = {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    }

    WEBPACK_CONFIG.plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        })

    )
}

module.exports = WEBPACK_CONFIG
```
`postcss.config.js`
```js
module.exports = {
    plugins: {
        'autoprefixer': {}
    }
}
```

Now finally change the "scripts" in `package.json` 
```json
"scripts": {
        "dev": "npm run development",
        "development": "cross-env NODE_ENV=development node_modules/webpack/bin/webpack.js --progress --hide-modules --config=webpack.config.js",
        "watch": "npm run development -- --watch",
        "watch-poll": "npm run watch -- --watch-poll",
        "prod": "npm run production",
        "production": "cross-env NODE_ENV=production node_modules/webpack/bin/webpack.js --no-progress --hide-modules --config=webpack.config.js"
    },

```
# Finally build the project
and run the npm scripts by 
```shell
npm run dev // To build the Project
npm run watch // To build and watch for files changes and build automagically
npm run prod // for production
```

# Special thanks to
This git repo is made possible by some online tutorial
[teej](https://tj.ie/upgrading-to-webpack-4/).
[Titas Gailius](https://medium.com/@titasgailius/initial-laravel-setup-with-vuejs-vue-router-vuex-in-typescript-305f7fe9d62b).
[sebastiandedeyne](https://sebastiandedeyne.com/typescript-with-laravel-mix/).







