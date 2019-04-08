<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
    <div
      style="width: calc(100% - 140px);"
      class="flex-1 flex flex-col self-end bg-trout shadow-lg"
    >
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link to="/practices/_id/" class="text-white p-1">
          <svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
        </nuxt-link>
      </div>
      <div class="text-white">
        <p>hellowww</p>
      </div>
    </div>
    <nuxt-child/>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>

