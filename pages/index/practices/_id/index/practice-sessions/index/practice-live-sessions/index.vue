<template>
  <div>
    <PracticeLiveSessions :practice="practice" />
  </div>
</template>

<script>
import PracticeLiveSessions from '@/components/Practices/Sessions/PracticeLiveSessions'

export default {
  components:{
    PracticeLiveSessions
  },

  props: {
    practice: {
      type: Object,
      default: () => null,
    },
  },
}
</script>
