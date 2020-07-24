<template>
  <div>
    <PracticeCompletedSessionsParts :practice="practice" :practiceSurgery="practiceSurgery" />
  </div>
</template>
<script>
import PracticeCompletedSessionsParts from '@/components/Practices/Sessions/PracticeCompletedSessionsParts'
export default {
  components:{
    PracticeCompletedSessionsParts
  },

  props: {
    practice: {
      type: Object,
      default: () => null,
    },

    practiceSurgery: {
      type: Object,
      default: () => null,
    },
  },
}
</script>
