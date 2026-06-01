<template>
  <div>
    <JobsLists :practice="practice" :status="['Ongoing']" :jobDenom="'Job Parts'" />
  </div>
</template>

<script>
import JobsLists from '@/components/JobsLists'

export default {
  components: {
    JobsLists
  },

  props: {
    practice: {
      type: Object,
      default: () => null
    }
  }
}
</script>
