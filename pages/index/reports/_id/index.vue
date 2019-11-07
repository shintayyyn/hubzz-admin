<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">
    <ReportModal/>
  </div>
</template>
<script>
import ReportModal from '@/components/Reports/ReportModal'
export default {
  components:{
    ReportModal
  },
  data(){
    return{

    }
  }
  
}
</script>
<style>
.report-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.report-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px yellow;
  transition: all 0.3s ease-in-out;
  background-color:#505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .report-modal {
    width: 80%;
  }
}
</style>