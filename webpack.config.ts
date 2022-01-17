import { Configuration } from 'webpack'
import { resolve } from 'path'

const config: Configuration = {

    mode: 'none',
    entry: {
        'nodeHelloLambda': './services/node-lambda/hello.ts'
    },
    target: 'node',
    module: {
        rules:[
            {
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        // pass special tsconfig file
                        configFile: "tsconfig.webpack.json"
                    }
                }
            }
        ]
    },
    
    resolve:{
        extensions: ['.ts', '.js']
    },

    // the lambda runs on nodeJs and makes use of aws-sdk. Since aws-sdk is big and it is already installed in the AWS deployment env, 
    // we can remove it from the bundle
    externals: {
        'aws-sdk': 'aws-sdk'
    },

    output: {
        libraryTarget: 'commonjs2',
        path: resolve(__dirname, 'build'),
        filename: '[name]/[name].js'
    }
}

export default config;