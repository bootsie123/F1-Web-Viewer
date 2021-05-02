<template>
  <div class="pullout" :class="{ expand: expanded }">
    <BaseIconButton
      class="pulloutToggle"
      icon="ri-arrow-right-s-line"
      iconToggle="ri-arrow-left-s-line"
      toggle
      round
      @click="togglePullout"
    />
    <div class="pulloutContainer container">
      <slot />
    </div>
  </div>
</template>

<script>
  import BaseIconButton from "@/components/BaseIconButton";

  export default {
    name: "SlidePanel",
    components: {
      BaseIconButton
    },
    data() {
      return {
        expanded: true
      };
    },
    methods: {
      togglePullout() {
        this.expanded = !this.expanded;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .title {
    font-size: 1.25em;
    text-align: center;
    color: #979797ff;
  }

  .subtitle {
    margin-top: 1em;
    color: #b5b5b5;
    font-size: 1em;
    font-weight: lighter;
  }

  .error {
    color: #ff2d57;
  }

  .pullout {
    position: fixed;
    display: flex;
    height: 100%;
    min-width: 485px;
    max-width: 500px;
    top: 0;
    right: 0;
    align-items: center;
    justify-content: flex-end;
    transition: all 0.8s ease;
    -webkit-animation: all 0.8s ease;
    transform: translateX(100%);
    -webkit-transform: translateX(100%);
    -ms-transform: translateX(100%);
    z-index: 100;
  }

  .pullout.expand {
    transform: translateX(0%);
    -webkit-transform: translateX(0%);
    -ms-transform: translateX(0%);
  }

  .pulloutToggle {
    position: absolute;
    top: 50%;
    left: -2em;
    min-width: 24px;
    box-shadow: 0 0 10px 0px #8a8a8a57;
    background-color: #fff;
    z-index: 105;
  }

  .pulloutToggle:hover {
    background-color: #f1f1f1;
  }

  .pulloutContainer {
    position: relative;
    height: 100%;
    width: 25vw;
    padding: 1em;
    overflow: auto;
    background-color: #fff;
    box-shadow: 0 0 20px 0px #8a8a8a2b;
  }

  @media all and (display-mode: fullscreen) {
    .pullout {
      display: none;
    }
  }

  @media screen and (max-width: 768px) {
    .pullout {
      min-width: 300px;
    }
  }
</style>
