<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  import { polyfill } from "mobile-drag-drop";

  export default {
    name: "App",
    created() {
      polyfill();

      window.addEventListener("touchmove", function () {});
    }
  };
</script>

<style lang="scss">
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::-webkit-scrollbar {
    width: 5px;
    background: transparent;
  }

  ::-webkit-scrollbar-track {
    -webkit-border-radius: 10px;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #cccacc;
    -webkit-border-radius: 10px;
    border-radius: 10px;
  }

  @media all and (display-mode: fullscreen) {
    ::-webkit-scrollbar {
      background: black;
    }

    ::-webkit-scrollbar-thumb {
      background-color: #232323;
    }
  }
</style>
