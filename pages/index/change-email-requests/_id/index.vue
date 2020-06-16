<template>
  <nuxt-child
    :changeEmailRequests="changeEmailRequests"
    :changeEmailRequestStatusColorClass="changeEmailRequestStatusColorClass"
    @changeEmailRequests="(_changeEmailRequests) => $emit('changeEmailRequests', _changeEmailRequests)"
  />
</template>

<script>
  export default {
    props: {
      changeEmailRequests: {
        type: Array,
        required: true,
      },

      changeEmailRequestStatusColorClass: {
        type: Object,
        required: true,
      },
    },
  }
</script>
