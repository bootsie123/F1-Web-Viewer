<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: "App"
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
</style>
