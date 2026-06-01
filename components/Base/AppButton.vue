<template>
  <nuxt-link
    v-if="nuxtLink"
    :to="nuxtLink"
    class="default-btn rounded-md px-2 focus:outline-none transition-hover text-sm "
    :class="nuxtLinkClasses"
    :style="inStyle"
    :draggable="draggable"
  >
    <p :class="labelClasses">
      <svgicon v-if="icon" :name="icon" :width="resolvedIconWidth" class="fill-current" :style="iconStyle" />
      <span :class="icon ? 'hidden md:block mx-2' : 'mx-2'">{{ label }}</span>
    </p>
    <span v-if="badge" class="ml-2 md:ml-6 bg-red-600 font-bold text-xs text-white px-1 h-5 flex items-center justify-center">
      {{ badgeLabel }}
    </span>
  </nuxt-link>
  <button
    v-else
    :disabled="disabled"
    class="default-btn rounded-md px-2 focus:outline-none transition-hover text-sm "
    :class="buttonClasses"
    :style="inStyle"
    @click.prevent="$emit('click')"
  >
    <p :class="labelClasses">
      <svgicon v-if="icon" :name="icon" :width="resolvedIconWidth" class="fill-current" :style="iconStyle" />
      <span :class="icon ? 'hidden md:block mx-2' : 'mx-2'">{{ label }}</span>
    </p>

    <span v-if="badge" class="ml-2 md:ml-6 bg-red-600 font-bold text-xs text-white px-1 h-5 flex items-center justify-center">
      {{ badgeLabel }}
    </span>
  </button>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Save'
    },

    rotate: {
      type: [Number, String]
    },

    icon: {
      type: String
    },

    iconWidth: {
      type: String
    },

    badge: {
      type: [String, Number]
    },

    labelClass: {
      type: String,
      default: null
    },

    inClass: {
      type: String,
      default: null
    },

    inStyle: {
      type: String,
      default: null
    },

    disabled: {
      type: Boolean,
      default: false
    },

    customTheme: {
      type: [String, Array],
      default: null
    },

    nuxtLink: {
      type: [String, Array, Object],
      default: () => null
    },

    draggable: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    sharedClasses() {
      return [
        this.inClass,
        this.customTheme ? this.customTheme : 'button bg-sunglow hover:bg-sunglow-dark py-1',
        this.badge && this.icon ? 'flex items-center justify-between' : '',
        this.icon ? 'flex items-center' : ''
      ]
    },
    nuxtLinkClasses() {
      return [this.disabled ? 'disabled-button py-1' : '', ...this.sharedClasses]
    },
    buttonClasses() {
      return [this.disabled ? 'disabled-button' : '', ...this.sharedClasses]
    },
    labelClasses() {
      return [this.icon ? 'flex items-center' : 'text-center', this.labelClass]
    },
    resolvedIconWidth() {
      return this.iconWidth ? this.iconWidth : '14'
    },
    iconStyle() {
      return this.rotate ? `transform: rotate(${this.rotate}deg)` : ''
    },
    badgeLabel() {
      return this.badge > 99 ? '99+' : this.badge
    }
  }
}
</script>

<style>
.bg-warning {
  background: #f9a423;
}

.bg-info {
  background: #16e3c8;
}

.bg-info:hover,
.bg-info:focus {
  background: #0fbea7;
}

.bg-warning:hover,
.bg-warning:focus {
  background: #eb9a1f;
}

.default-btn {
  border-radius: 6px;
}

button:focus {
  outline: none;
}

.default-btn:hover {
  transform: translate(1px, 1px);
}

.default-btn:active {
  transform: translate(2px, 2px);
}

.disabled-button {
  color: #9e9e9e;
  background: #ddd;
  cursor: not-allowed;
}

.disabled-button:hover {
  transform: translate(0, 0);
  background: #ddd;
}
</style>
