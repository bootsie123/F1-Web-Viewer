const info = require("./package.json");

process.env.VUE_APP_VERSION = info.version;
process.env.VUE_APP_HOMEPAGE = info.homepage;

module.exports = {
  devServer: {
    proxy: "http://localhost:" + (process.env.PORT || 3000)
  },
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
  },
  pluginOptions: {
    electronBuilder: {
      outputDir: "./dist/electron",
      nodeIntegration: true,
      builderOptions: {
        appId: "app.netlify.f1webviewer",
        productName: "F1 Web Viewer",
        publish: ["github"],
        win: {
          target: ["nsis"]
        },
        mac: {
          category: "public.app-category.sports",
          target: ["dmg"]
        },
        linux: {
          category: "AudioVideo",
          target: ["AppImage"]
        },
        directories: {
          buildResources: "build"
        }
      }
    }
  },
  transpileDependencies: ["vue-grid-layout"]
};
