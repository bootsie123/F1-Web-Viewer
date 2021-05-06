<template>
  <div class="container settings">
    <h2 class="subtitle has-text-centered">Layouts</h2>
    <LayoutItem
      v-for="(layout, i) in layouts"
      :key="i"
      :layout="layout"
      :active="layout.active"
      @selected="setActiveLayout(layout.id)"
      @delete="deleteLayout(i)"
    />
    <div class="field has-addons">
      <div class="control is-expanded">
        <input class="input" type="text" v-model="newLayoutName" placeholder="Layout name" />
      </div>
      <div class="control">
        <div class="button">
          <BaseIconButton @click="newLayout" icon="ri-add-line" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { v4 as uuidv4 } from "uuid";
  import { mapGetters, mapActions, mapMutations } from "vuex";

  import LayoutItem from "@/components/LayoutItem";

  import BaseIconButton from "@/components/BaseIconButton";

  export default {
    name: "LayoutManager",
    components: {
      LayoutItem,
      BaseIconButton
    },
    data() {
      return {
        newLayoutName: ""
      };
    },
    computed: {
      ...mapGetters(["layout", "layouts"])
    },
    methods: {
      newLayout() {
        const id = uuidv4();

        this.addToLayouts([
          {
            id,
            name: this.newLayoutName,
            layout: this.layout
          }
        ]);

        this.setActiveLayout(id);
      },
      deleteLayout(i) {
        this.layouts.splice(i, 1);

        this.updateLayouts(this.layouts);
      },
      ...mapActions(["addToLayouts", "setActiveLayout"]),
      ...mapMutations(["updateLayouts"])
    }
  };
</script>

<style lang="scss" scoped>
  .settings {
    padding: 1em;
    padding-bottom: 2.5em;
  }

  .input,
  .button {
    border-radius: 0;
    border: none;
    box-shadow: none;
  }

  .input,
  .button {
    border-bottom: 1px solid #dbdbdb;
  }

  .input:focus,
  .input:active {
    box-shadow: none;
  }

  .input:focus {
    border-bottom: 1px solid #b5b5b5;
  }
</style>
