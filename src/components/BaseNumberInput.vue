<template>
  <div :class="{ field: isField }">
    <label v-if="label" class="label">
      {{ label }}
    </label>
    <div
      class="control"
      :class="{
        'has-icons-left': icon
      }"
    >
      <input
        class="input"
        :value="value"
        :name="name"
        @input="$emit('input', $event.target.value)"
        type="number"
        :placeholder="placeholder"
        :max="max"
        :min="min"
        :step="step"
      />
      <span v-if="icon" class="icon is-left">
        <i :class="icon" />
      </span>
    </div>
  </div>
</template>

<script>
  import inputValidator from "@/mixins/inputValidator";

  export default {
    name: "BaseFormInput",
    mixins: [inputValidator],
    props: {
      label: String,
      FontOptions: String,
      placeholder: String,
      icon: String,
      max: Number,
      min: Number,
      step: Number,
      name: String,
      required: Boolean,
      value: [String, Number],
      isField: {
        type: Boolean,
        default: true
      }
    }
  };
</script>

<style lang="scss" scoped>
  .field {
    margin-top: 1.5em !important;
  }

  .label {
    font-weight: 500 !important;
  }
</style>
