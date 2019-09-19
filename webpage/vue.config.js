module.exports = {

  // https://cli.vuejs.org/zh/config/#vue-config-js

  // 访问网页需要的路由
  publicPath: '/',
  // 配置开发时使用的热加载的静态文件服务器
  devServer: {
    // 服务器端口
    port: 8080,
    // 服务器开启代理，非静态文件请求路由到后端服务器
    proxy: undefined
  },
  // 多页面应用开发
  pages: {
    // 主页
    index: {
      // page 的入口
      entry: 'src/pages/index/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 outputDir 的输出
      filename: 'index.html',
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Index Page',
    },
    // 移动端
    m: {
      entry: 'src/pages/mobile/main.js',
      template: 'public/index.html',
      filename: 'm/index.html',
      title: 'Mobile Page',
    },
    // 管理员
    admin: {
      entry: 'src/pages/admin/main.js',
      template: 'public/index.html',
      filename: 'admin/index.html',
      title: 'Admin Page',
    },
    // 私网
    private: {
      entry: 'src/pages/private/main.js',
      template: 'public/index.html',
      filename: 'private/index.html',
      title: 'Private Page',
    }
  },
  // 构建最终产品网页在此文件夹
  outputDir: '../static/',
  // 构建最终产品时不生成sourceMap,加速构建
  productionSourceMap: false
}