<template>
  <div class="level is-mobile">
    <div class="level-left">
      <div class="level-item">
        <BaseIconButton class="gitHub" @click="openGitHub" icon="ri-github-fill" />
      </div>
    </div>
    <div class="level-right">
      <div class="level-item">
        <div class="version">Version {{ version }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import BaseIconButton from "@/components/BaseIconButton";

  export default {
    name: "Info",
    components: {
      BaseIconButton
    },
    data() {
      return {
        version: process.env.VUE_APP_VERSION
      };
    },
    methods: {
      openGitHub() {
        window.open(process.env.VUE_APP_HOMEPAGE, "_blank");
      }
    }
  };
</script>

<style lang="scss" scoped>
  .level {
    position: absolute;
    width: 100%;
    bottom: 0;
  }

  .version {
    font-weight: 100;
  }

  .gitHub {
    font-size: 2em;
  }

  .gitHub:hover {
    opacity: 0.5;
  }
</style>
