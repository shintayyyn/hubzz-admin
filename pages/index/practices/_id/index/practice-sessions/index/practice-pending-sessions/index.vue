<template>
  <div>
    <JobsLists
      :practice="practice"
      :status="['Ongoing']"
      :jobDenom="'Jobs'"
    />
  </div>
</template>

<script>
import JobsLists from '@/components/JobsLists'

export default {
  components:{
    JobsLists
  },

  props: {
    practice: {
      type: Object,
      default: () => null,
    },
  },
}
</script>
