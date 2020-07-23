<template>
  <div>
    <PracticeCancelledSessionsParts :practice="practice" />
  </div>
</template>

<script>
import PracticeCancelledSessionsParts from '@/components/Practices/Sessions/PracticeCancelledSessionsParts'

export default {
  components:{
    PracticeCancelledSessionsParts
  },

  props: {
    practice: {
      type: Object,
      default: () => null,
    },
  },
}
</script>
