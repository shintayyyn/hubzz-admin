<template>
  <div>
    <PracticeOngoingSessionsParts :practice="practice" :practiceSurgery="practiceSurgery" />
  </div>
</template>

<script>
import PracticeOngoingSessionsParts from '@/components/Practices/Sessions/PracticeOngoingSessionsParts'

export default {
  components:{
    PracticeOngoingSessionsParts
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
