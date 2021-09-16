<template>
  <div class="field" :class="{ 'is-horizontal': horizontal }">
    <div v-if="label" :class="[horizontal ? 'field-label' : '', 'is-normal']">
      <label class="label">{{ label }}</label>
    </div>
    <div class="field-body">
      <div class="field">
        <div class="select is-fullwidth" :class="{ 'is-loading': loading }">
          <select :value="value" @input="$emit('input', $event.target.value)" :disabled="disabled">
            <option
              v-for="(option, i) in options"
              :key="i"
              :value="option.value"
              :disabled="option.disabled"
              :selected="option.selected"
            >
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "BaseDropdown",
    props: {
      value: String,
      label: String,
      loading: Boolean,
      disabled: Boolean,
      horizontal: Boolean,
      options: {
        type: Array,
        required: true
      }
    }
  };
</script>

<style lang="scss" scoped></style>
