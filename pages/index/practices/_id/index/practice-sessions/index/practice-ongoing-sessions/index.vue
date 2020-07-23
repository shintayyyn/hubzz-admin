<template>
  <div>
    <PracticeOngoingSessionsParts :practice="practice" />
  </div>
</template>

<script>
import PracticeOngoingSessionsParts from "@/components/Practices/Sessions/PracticeOngoingSessionsParts"

export default {
	components: {
		PracticeOngoingSessionsParts
	},

  props: {
    practice: {
      type: Object,
      default: () => null,
    },
  },
}
</script>
