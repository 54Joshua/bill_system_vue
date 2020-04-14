module.exports = {
    // 修改的配置
    // 将baseUrl: '/api',改为baseUrl: '/',
    publicPath: './',
    //输出文件目录

    outputDir: 'dist',

    // eslint-loader 是否在保存的时候检查

    lintOnSave: true,

    //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。

    assetsDir: 'static',
    runtimeCompiler: false,
    productionSourceMap: false,

}