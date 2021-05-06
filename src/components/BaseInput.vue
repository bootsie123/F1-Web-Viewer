<template>
  <div :class="{ field: isField }">
    <label v-if="label" class="label">
      {{ label }}
    </label>
    <div
      class="control"
      :class="{
        'has-icons-left': icon,
        'has-icons-right': hasStatusIcon
      }"
    >
      <input
        class="input"
        :class="classes"
        :value="value"
        :name="name"
        @input="$emit('input', $event.target.value)"
        :type="type"
        :placeholder="placeholder"
        :maxlength="maxlength"
      />
      <span v-if="icon" class="icon is-left">
        <i :class="icon" />
      </span>
      <span v-if="hasStatusIcon" class="icon is-right">
        <i
          :class="{
            [successIcon]: valid,
            [failureIcon]: valid === false,
            [warningIcon]: status === 'warning',
            rotateIcon
          }"
        />
      </span>
    </div>
    <p v-if="help || statusMsg" class="help" :class="classes">
      {{ help || statusMsg }}
    </p>
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
      help: String,
      icon: String,
      successIcon: String,
      failureIcon: String,
      warningIcon: String,
      maxlength: Number,
      minlength: Number,
      type: {
        type: String,
        default: "text"
      },
      validator: Function,
      validatorMsg: String,
      name: String,
      required: Boolean,
      value: String,
      isField: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        valid: null,
        status: "none",
        hasInput: false,
        statusMsg: "",
        requiredMsg: `${this.name} field is required`,
        validationFunc: this.validator,
        typeErrorMsg: this.validatorMsg || `${this.name} is invalid`,
        rotateIcon: false
      };
    },
    computed: {
      classes() {
        return {
          "is-success": this.status === "success",
          "is-danger": this.status === "error",
          "is-warning": this.status === "warning"
        };
      },
      hasStatusIcon() {
        return this.successIcon || this.failureIcon || this.warningIcon;
      }
    },
    watch: {
      value(val) {
        this._validateStatus(val);
      }
    },
    methods: {
      setStatus(status, msg = "") {
        if (status === true || status === "success") {
          this.valid = true;
          this.status = "success";
        } else if (status === false || status === "error") {
          this.valid = false;
          this.status = "error";
        } else if (status === "warning") {
          this.status = "warning";
        } else {
          this.valid = null;
          this.status = "none";
        }

        if (msg === null) {
          this.statusMsg = this.requiredMsg;
        } else {
          this.statusMsg = msg;
        }
      },
      validate() {
        this._validateStatus(this.value);
      },
      _validateStatus(val) {
        if (val.length < 1) {
          this.hasInput = false;

          if (this.required) {
            this.setStatus(false, this.requiredMsg);
          } else {
            this.setStatus(null);
          }
        } else {
          this.hasInput = true;

          if (val.length < this.minlength) {
            this.setStatus(false, `${this.name} has a minimum length of ${this.minlength} chars`);
          } else if (this.validationFunc) {
            if (this.validationFunc(val)) {
              this.setStatus(true);
            } else {
              this.setStatus(false, this.typeErrorMsg);
            }
          } else {
            this.setStatus(true);
          }
        }

        this.$emit("validated", val);
      }
    },
    created() {
      switch (this.$props.type) {
        case "email":
          this.validationFunc = this.isValidEmail;
          this.typeErrorMsg = "Email address invalid";

          break;
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

  .rotateIcon {
    animation: rotate 1s linear infinite;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
</style>
