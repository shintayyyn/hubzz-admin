<template>
  <div class="error-container">
    <div class="m-32 mt-32">
      <div>
        <img src="~/assets/images/hubzz-logo.png">
      </div>
      
      <h1 v-if="error.statusCode === 404">Page not found.</h1>
      <h1 v-if="error.statusCode === 401">You are not authorized to view this page.</h1>
      <nuxt-link class="text-white no-underline " to="/">Home page</nuxt-link>
    </div>

    <!-- <h1 v-else>{{error.message}}</h1> -->

  </div>
</template>

<script>
export default {
  props: ['error'],
  layout: 'auth',
}
</script>
<style scoped>
body{
  background-image:"~/assets/images/hubbz-bg.png"
}
.error-container {
  color:white;
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  max-width: 600px;
  height: 500px;
  padding: 1px;
}
</style>
