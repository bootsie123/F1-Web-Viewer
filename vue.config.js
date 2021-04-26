module.exports = {
  outputDir: "./dist/web",
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
