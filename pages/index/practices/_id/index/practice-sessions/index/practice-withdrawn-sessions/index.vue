<template>
  <div>
    <PracticeWithdrawnSessionsParts :practice="practice" />
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
  },
}
</script>
