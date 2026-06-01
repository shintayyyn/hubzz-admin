<template>
  <div>
    <JobsLists :practice="practice" :status="['Withdrawn']" :jobDenom="'Job Parts'" />
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
