<template>
  <div>
    <PracticeApprovedSessionsParts :practice="practice" :practiceSurgery="practiceSurgery" />
  </div>
</template>

<script>
import PracticeApprovedSessionsParts from '@/components/Practices/Sessions/PracticeApprovedSessionsParts'

export default {
  components:{
    PracticeApprovedSessionsParts
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
