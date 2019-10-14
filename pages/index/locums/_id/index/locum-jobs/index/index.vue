<template>
    <div></div>
</template>
<script>
export default {
  created(){
    this.$router.push({path:`/locums/${this.$route.params.id}/locum-jobs/locum-allocated-jobs`, query: this.$route.query})
  }
}
</script>
<style>
</style>