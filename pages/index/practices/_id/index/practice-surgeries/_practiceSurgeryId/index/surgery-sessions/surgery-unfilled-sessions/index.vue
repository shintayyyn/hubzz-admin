<template>
  <div>
    <PracticeUnfilledSessions :practice="practice" :practiceSurgery="practiceSurgery" />
  </div>
</template>

<script>
import PracticeUnfilledSessions from '@/components/Practices/Sessions/PracticeUnfilledSessions'

export default {
  components:{
    PracticeUnfilledSessions
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
