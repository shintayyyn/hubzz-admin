<template>
  <div class="relative inline-block" :style="{ width: `${width}px`, height: `${height}px` }" @click="$emit('input', !value)">
    <input v-model="value" class="hidden" type="checkbox">
    <span class="slider" :class="{ round: rounded }" />
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        default: false,
      },

      rounded: {
        type: Boolean,
        default: true,
      },

      width: {
        type: Number,
        default: 60,
      },

      height: {
        type: Number,
        default: 34,
      },
    }
  }
</script>

<style>
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .2s;
  transition: .2s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .2s;
  transition: .2s;
}

input:checked + .slider {
  background-color: #FFC72C;
}

input:focus + .slider {
  box-shadow: 0 0 1px #FFC72C;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>