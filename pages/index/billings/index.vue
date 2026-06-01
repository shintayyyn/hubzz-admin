<template>
  <div>
    <nuxt-child />
  </div>
</template>
<script>
export default {}
</script>
<style>
.billing-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
  cursor: pointer;
}
.billing-modal {
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
  .billing-modal {
    width: 80%;
  }
}
.md\:table-cell:first-child {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
.md\:table-cell:last-child {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>
