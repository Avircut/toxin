const path=require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const fs = require('fs')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const PATHS = {
    src: path.join(__dirname,'../src'),
    dist:path.join(__dirname,'../dist')
}

const PAGES_DIR = path.resolve(__dirname,'src/pug/pages')
const PAGES = fs.readdirSync(PAGES_DIR).filter(filename=>filename.endsWith('.pug'))

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`
const optimization = () => {
    const config ={
        splitChunks:{
            chunks:'all'
        },
    }
    if(isProd) config.minimizer = [
        new CssMinimizerPlugin(),
        new TerserWebpackPlugin()
    ]
    return config
}
module.exports = {
    context: path.resolve(__dirname,'src'),
    entry:{
        main:['@babel/polyfill','./index.js'],
    },
    output:{
        filename: filename('js'),
        path: path.resolve(__dirname,'dist'),
    },
    resolve:{
        extensions:['.js','.json','png'],
        alias:{
            '@':path.resolve(__dirname,'src')
        }
    },
    optimization:optimization(),
    devServer:{
        port:4200,
        hot:false,
        liveReload:true,

    },
    plugins:[
        ...PAGES.map(page => new HtmlWebpackPlugin({
            template:`${PAGES_DIR}/${page}`,
            filename:`./${page.replace(/\.pug/,'.html')}`,
            minify:{
                collapseWhitespace:isProd
            }
        })),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns:[
                {
                    from: path.resolve(__dirname,'src/favicon-32x32.png'),
                    to:path.resolve(__dirname,'dist')
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: filename('css'),
        })

    ],
    module:{
        rules:[
            {
                test:/\.css$/,
                use:[
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options:{},
                    },'css-loader']
            },
            {
                test:/\.(png|svg|jpg|gif)$/,
                type:'asset/resource'
            },
            {
                test:/\.(ttf|woff|woff2|eot)$/,
                type:'asset/resource'
            },
            {
                test:/\.(s[ac]ss)$/,
                use:[MiniCssExtractPlugin.loader,'css-loader','sass-loader']
            },
            {
                test:/\.js$/,
                exclude:/node_modules/,
                use: {
                    loader:'babel-loader',
                    options:{
                        presets:['@babel/preset-env']
                    }
                }
            },
            {
                test:/\.pug$/,
                use:'pug-loader'
            }
        ]
    }
}