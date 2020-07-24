<template>
  <div>
    <PracticeAppliedSessions :practice="practice" :practiceSurgery="practiceSurgery" />
  </div>
</template>

<script>
import PracticeAppliedSessions from '@/components/Practices/Sessions/PracticeAppliedSessions'

export default {
  components:{
    PracticeAppliedSessions
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
