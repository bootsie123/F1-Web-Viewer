<template>
  <div>
    <div class="tabs">
      <div class="insertContainer">
        <slot name="left" />
      </div>
      <ul>
        <li
          v-for="(tab, i) in tabs"
          :key="i"
          :class="{ 'is-active': activeTab.title === tab.title }"
          @click="activeTab = tab"
        >
          <a>
            <span v-if="tab.icon" class="icon">
              <i :class="tab.icon" />
            </span>
            <span>
              {{ tab.title }}
            </span>
          </a>
        </li>
      </ul>
      <div class="insertContainer">
        <slot name="right" />
      </div>
    </div>
    <keep-alive v-if="keepAlive">
      <compontent :is="currentComponent" />
    </keep-alive>
    <compontent v-else :is="currentComponent" />
  </div>
</template>

<script>
  export default {
    name: "BaseTabs",
    props: {
      tabs: {
        type: Array,
        required: true
      },
      keepAlive: Boolean
    },
    data() {
      return {
        activeTab: this.tabs.find(tab => tab.default) || this.tabs[0]
      };
    },
    computed: {
      currentComponent() {
        if (!this.activeTab.component) return;

        return () => import(`@/components/${this.activeTab.component}`);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .insertContainer {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #dbdbdb;
  }
</style>
