<template>
  <div class="layout level" @mouseover="hover = true" @mouseleave="hover = false">
    <div class="level-left">
      <div class="level-item icon">
        <i v-if="active" class="ri-check-fill" />
        <BaseIconButton
          v-else-if="hover"
          icon="ri-check-line"
          iconToggle="ri-check-fill"
          iconHover="ri-check-fill"
          toggle
          @click="$emit('selected')"
        />
      </div>
      <div class="level-item">
        {{ layout.name }}
      </div>
    </div>
    <div class="level-right">
      <div v-if="hover" class="level-item">
        <BaseIconButton icon="ri-save-line" iconHover="ri-save-fill" @click="$emit('save')" />
        <BaseIconButton icon="ri-delete-bin-line" iconHover="ri-delete-bin-fill" @click="$emit('delete')" />
      </div>
    </div>
  </div>
</template>

<script>
  import BaseIconButton from "@/components/BaseIconButton";

  export default {
    name: "LayoutItem",
    components: {
      BaseIconButton
    },
    props: {
      layout: {
        type: Object,
        required: true
      },
      active: Boolean
    },
    data() {
      return {
        hover: false
      };
    }
  };
</script>

<style lang="scss" scoped>
  .layout {
    padding: 0.5em;
    border-bottom: 1px solid #dbdbdb;
  }

  .layout:hover {
    background: #f8f8f8;
    border-color: #b5b5b5;
  }

  /deep/ .ri-check-fill {
    color: black;
  }

  /deep/ .ri-check-line {
    color: #c5c5c5 !important;
  }
</style>
