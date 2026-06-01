<template>
  <transition name="fade" mode="out-in">
    <div v-if="loading" :class="['loading-shield flex flex-col items-center justify-center shadow-md text-gray-500', inClass]">
      <svgicon v-if="spinner" name="loader" class="fill-current" width="60" height="60" />
      <h1 v-if="message" class="loader-message inset-0">
        {{ message }}
      </h1>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    message: {
      type: String
    },
    spinner: {
      type: Boolean,
      default: true
    },
    inClass: String
  }
}
</script>

<style scoped>
.loading-shield {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 49;
  background-color: #eee;
  box-shadow: 10px 10px 0.1 10px #eee;
  opacity: 0.75;
}
.loader-message {
  position: -webkit-sticky;
  position: sticky;
  color: black;
  text-align: center;
  z-index: 50;
}
.loader-message:after {
  content: ' .';
  animation: dots 1s steps(5, end) infinite;
}

@keyframes dots {
  0%,
  20% {
    color: rgba(0, 0, 0, 0);
    text-shadow: 0.25em 0 0 rgba(0, 0, 0, 0), 0.5em 0 0 rgba(0, 0, 0, 0);
  }
  40% {
    color: white;
    text-shadow: 0.25em 0 0 rgba(0, 0, 0, 0), 0.5em 0 0 rgba(0, 0, 0, 0);
  }
  60% {
    text-shadow: 0.25em 0 0 white, 0.5em 0 0 rgba(0, 0, 0, 0);
  }
  80%,
  100% {
    text-shadow: 0.25em 0 0 white, 0.5em 0 0 white;
  }
}
</style>
