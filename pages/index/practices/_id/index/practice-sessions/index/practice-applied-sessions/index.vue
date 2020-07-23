<template>
  <div>
    <PracticeAppliedSessions :practice="practice" />
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
  },
}
</script>
