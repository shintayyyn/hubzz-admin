<template>
  <div class="mt-5">
    <PracticeSurgeries :practice="practice" />

    <nuxt-child :practice="practice" />
  </div>
</template>

<script>
import PracticeSurgeries from '@/components/Practices/PracticeSurgeries'
export default {
  middleware: 'changedPracticeType',

  transition:{
    name:'fade',
    mode:'out-in'
  },

  components:{
    PracticeSurgeries,
  },

  props: {
    practice: {
      type: Object,
      default: () => null,
    },
  },
}
</script>

<style>
  .add-spoke-shield {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #333;
    opacity: 0.5;
    z-index: 511;
  }
</style>
