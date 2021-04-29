module.exports = {
  outputDir: "./dist/web",
  devServer: {
    proxy: "http://localhost:3000"
  },
  pages: {
    index: {
      entry: "./src/main.js",
      title: "F1 Web Viewer"
    }
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: "@import '@/assets/main.scss';"
      }
    }
  }
};
