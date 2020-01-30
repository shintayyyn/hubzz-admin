<template>
  <div style="transition: all 0.3s ease-in-out;" class="fixed top-0 right-0 mr-0 w-full h-full overflow-auto border-l-2 border-sunglow z-512 bg-trout xl:w-4/5 p-4 md:p-8 shadow-lg">
    <nuxt-link :to="{ path:'/standard-terms', query: $route.query }">
      <div class="mb-4">
        <svgicon
          name="arrow-left-solid"
          height="32"
          width="32"
          class="cursor-pointer text-white hover:text-sunglow fill-current"
        />
      </div>
    </nuxt-link>

  </div>
</template>

<script>
  export default {

  }
</script>
