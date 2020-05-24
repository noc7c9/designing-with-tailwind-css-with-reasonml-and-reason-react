const path = require('path');
const acorn = require('acorn');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, options) => ({
    entry: './src/Index.bs.js',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'index.js',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { importLoaders: 1 },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                require('tailwindcss'),
                                require('postcss-nested'),
                                require('autoprefixer'),
                            ].concat(
                                options.mode === 'production'
                                    ? [purgecss(), require('cssnano')]
                                    : [],
                            ),
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.css',
            chunkFilename: 'styles.css',
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: 'public', to: '.' }],
        }),
    ],
    devServer: {
        allowedHosts: (process.env.WEBPACK_DEV_SERVER_ALLOWED_HOSTS || '')
            .split(',')
            .map(host => host.trim()),
        contentBase: path.join(__dirname, 'public'),
    },
});

function purgecss(mode) {
    const defaultExtractor = content => {
        // source: https://github.com/tailwindcss/tailwindcss/blob/c2b0407ffdc3d6c3cb3323f79d07f7185026532a/src/lib/purgeUnusedStyles.js#L72

        // Capture as liberally as possible, including things like `h-(screen-1.5)`
        const broad = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];

        // Capture classes within other delimiters like .block(class="w-1/2") in Pug
        const inner =
            content.match(/[^<>"'`\s.(){}\[\]#=%]*[^<>"'`\s.(){}\[\]#=%:]/g) ||
            [];

        return broad.concat(inner);
    };

    // Grab only the tags used in the html file(s)
    const htmlExtractor = content => content.match(/(?<=<)[a-z]+/g) || [];

    const jsExtractor = content => {
        // Parse all strings
        const strings = [];
        for (let token of acorn.tokenizer(content)) {
            if (token.type.label === 'string') {
                strings.push(token.value);
            }
        }

        // And split on whitespace and escaped whitespace
        return strings.flatMap(s => s.split(/\s+|\s*\\[nt]\s*/));
    };

    return require('@fullhuman/postcss-purgecss')({
        content: ['./src/index.html', './src/**/*.js'],
        defaultExtractor,
        extractors: [
            { extensions: ['html'], extractor: htmlExtractor },
            { extensions: ['js'], extractor: jsExtractor },
        ],
    });
}
