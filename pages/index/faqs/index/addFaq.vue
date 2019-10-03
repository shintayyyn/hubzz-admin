<template>
    <div class="add-faq-modal shadow-lg">
        <nuxt-child/>
    </div>
</template>
<script>
export default {
    
}
</script>
<style>
.add-faq-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.add-faq-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px orange;
  transition: all 0.3s ease-in-out;
  background-color:#505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .add-faq-modal {
    width: 80%;
  }
}
</style>