<template>
  <span class="icon" :class="{ round }" @mouseover="hover = true" @mouseleave="hover = false" @click="clicked">
    <i :class="classes" />
  </span>
</template>

<script>
  export default {
    name: "BaseIconButton",
    props: {
      icon: {
        type: String,
        required: true
      },
      iconHover: String,
      iconToggle: String,
      iconToggleHover: String,
      toggle: Boolean,
      initValue: Boolean,
      value: Boolean,
      round: Boolean
    },
    data() {
      return {
        hover: false,
        toggled: this.initValue || this.value
      };
    },
    computed: {
      classes() {
        if (this.toggle && this.toggled) {
          return [this.hover ? this.iconToggleHover || this.iconToggle : this.iconToggle];
        } else {
          return [this.hover ? this.iconHover || this.icon : this.icon];
        }
      }
    },
    watch: {
      value(val) {
        this.toggled = val;
      }
    },
    methods: {
      clicked(event) {
        if (this.toggle) {
          this.toggled = !this.toggled;
        }

        this.$emit("click", event.target, this.toggled);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .round {
    border-radius: 50%;
  }

  .icon:hover {
    cursor: pointer;
  }
</style>
