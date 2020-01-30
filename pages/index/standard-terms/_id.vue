<template>
  <div class="practice-modal p-4 md:p-8 shadow-lg">
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

<!-- <style>
.card {
  min-width: 100px;
  height: 250px;
  box-sizing: content-box;
}
.practice-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.practice-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #ffc72c;
  transition: all 0.3s ease-in-out;
  background-color: #505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .practice-modal {
    width: 80%;
  }
}
</style> -->
