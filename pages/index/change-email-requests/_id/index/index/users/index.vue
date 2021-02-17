<template>
  <div>
  </div>
</template>

<script>
export default {
  watch: {
    $route (value) {
      console.log('banana')
      if (value.name === 'index-change-email-requests-id-index-index-users') {
        this.$router.push(`/change-email-requests/${this.$route.params.id}`)
      }
    }
  },
  created () {
    if (this.$route.name === 'index-change-email-requests-id-index-index-users') {
      this.$router.push(`/change-email-requests/${this.$route.params.id}`)
    }
  }

}
</script>

<style>

</style>