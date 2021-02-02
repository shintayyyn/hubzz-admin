<template>
  <div>
    <PracticeAllocatedSessions :practice="practice" :practiceSurgery="practiceSurgery" />
  </div>
</template>

<script>
import PracticeAllocatedSessions from '@/components/Practices/Sessions/PracticeAllocatedSessions'

export default {
  components:{
    PracticeAllocatedSessions
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
