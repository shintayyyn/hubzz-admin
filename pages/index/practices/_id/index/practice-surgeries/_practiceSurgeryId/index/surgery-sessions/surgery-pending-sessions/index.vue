<template>
  <div>
    <PracticePendingSessions :practice="practice" :practiceSurgery="practiceSurgery" />
  </div>
</template>

<script>
import PracticePendingSessions from '@/components/Practices/Sessions/PracticePendingSessions'

export default {
  components:{
    PracticePendingSessions
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
