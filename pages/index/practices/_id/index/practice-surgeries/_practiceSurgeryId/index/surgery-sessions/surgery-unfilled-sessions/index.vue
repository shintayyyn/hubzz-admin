<template>
  <div>
    <JobsLists
      :practiceSurgery="practiceSurgery"
      :status="['Unfilled',]"
      :jobDenom="'Jobs'"
    />
  </div>
</template>

<script>
import JobsLists from '@/components/JobsLists'
export default {
  components:{
    JobsLists,
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
