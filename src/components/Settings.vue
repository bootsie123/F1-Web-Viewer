<template>
  <div class="container">
    <h2 class="subtitle has-text-centered">Settings</h2>
    <BaseNumberInput label="Layout Columns" placeholder="12" type="number" :min="1" v-model.number="layoutColumns" />
    <BaseNumberInput
      label="Layout Row Height (pixels)"
      placeholder="150"
      type="number"
      :min="1"
      v-model.number="layoutRowHeight"
    />
    <h2 class="subtitle has-text-centered">Layouts</h2>
    <LayoutItem
      v-for="(layout, i) in layouts"
      :key="i"
      :layout="layout"
      :active="layout.active"
      @selected="setActiveLayout(layout.id)"
      @delete="deleteLayout(i)"
      @save="saveLayout(layout)"
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
  import BaseNumberInput from "@/components/BaseNumberInput";

  export default {
    name: "Settings",
    components: {
      LayoutItem,
      BaseIconButton,
      BaseNumberInput
    },
    data() {
      return {
        newLayoutName: ""
      };
    },
    computed: {
      layoutColumns: {
        get() {
          return this.$store.getters.layoutColumns;
        },
        set(val) {
          this.setLayoutColumns(val);
        }
      },
      layoutRowHeight: {
        get() {
          return this.$store.getters.layoutRowHeight;
        },
        set(val) {
          this.setLayoutRowHeight(val);
        }
      },
      ...mapGetters(["layout", "layouts"])
    },
    methods: {
      newLayout() {
        const id = uuidv4();

        this.addToLayouts([
          {
            id,
            name: this.newLayoutName,
            columns: this.layoutColumns,
            rowHeight: this.layoutRowHeight,
            layout: this.layout
          }
        ]);

        this.setActiveLayout(id);

        this.newLayoutName = "";
      },
      saveLayout(layout) {
        layout.layout = this.layout;

        layout.columns = this.layoutColumns;
        layout.rowHeight = this.layoutRowHeight;

        this.updateLayouts(this.layouts);
      },
      deleteLayout(i) {
        this.layouts.splice(i, 1);

        this.updateLayouts(this.layouts);
      },
      ...mapActions(["addToLayouts", "setActiveLayout"]),
      ...mapMutations(["updateLayouts", "setLayoutColumns", "setLayoutRowHeight"])
    }
  };
</script>

<style lang="scss" scoped>
  .container {
    padding: 1em;
    padding-bottom: 2.5em;
  }

  .subtitle:nth-of-type(2) {
    margin-top: 1.5rem;
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
