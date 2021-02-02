<template>
  <div>
    <PracticeAllocatedSessions :practice="practice" />
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
  },
}
</script>
