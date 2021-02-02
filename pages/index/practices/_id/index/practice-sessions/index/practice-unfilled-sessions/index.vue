<template>
  <div>
    <PracticeUnfilledSessions :practice="practice" />
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
  },
}
</script>
