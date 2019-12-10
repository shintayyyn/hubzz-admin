<template>
  <div class="issue-hubzz-invoice-modal p-4 md:p-8 shadow-lg">
    <div class="flex items-center text-sm text-white py-2">
      <div @click="goBack()" class="text-white hover:text-sunglow p-1">
        <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current"/>
      </div>
    </div>
  
  </div>
</template>

<script>
export default {
  data(){
    return {

    }
  },
  async asyncData({app, route, store}) {
    try{

    }catch(err){

    }
  },
  methods:{
    goBack(){
      const query = {
        ...this.$route.query
      }
      this.$router.push({path:`/billings/${this.$route.params.id}/practice-invoices`,query})
    },
  }
}
</script>

<style>
.card {
	min-width: 100px;
	height: 250px;
	box-sizing: content-box;
}
.issue-hubzz-invoice-shield {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #333;
	opacity: 0.5;
	z-index: 511;
}
.issue-hubzz-invoice-modal {
	position: fixed;
	top: 0;
	right: 0;
	margin-right: 0%;
	width: 100%;
	height: 100%;
	overflow: auto;
	border-left: solid 2px yellow;
	transition: all 0.3s ease-in-out;
	background-color: #505561;
	z-index: 512;
}
@media screen and (min-width: 1200px) {
	.issue-hubzz-invoice-modal {
		width: 70%;
	}
}
</style>