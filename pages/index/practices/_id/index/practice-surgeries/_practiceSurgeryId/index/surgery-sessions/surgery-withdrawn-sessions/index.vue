<template>
  <div>
    <PracticeWithdrawnSessionsParts :practice="practice" :practiceSurgery="practiceSurgery" />
  </div>
</template>

<script>
import PracticeWithdrawnSessionsParts from '@/components/Practices/Sessions/PracticeWithdrawnSessionsParts'

export default {
  components:{
    PracticeWithdrawnSessionsParts
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
