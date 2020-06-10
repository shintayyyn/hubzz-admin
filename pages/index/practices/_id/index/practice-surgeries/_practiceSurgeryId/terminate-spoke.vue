<template>
  <transition name="fade" mode="out-in">
    <div
      class="termination-modal h-full flex border-l-4 border-r-4 border-sunglow shadow-lg"
    >
      <TerminateSurgery
        :practice="practice"
        :childSurgery="childSurgery"
      />
    </div>
  </transition>
</template>

<script>
import TerminateSurgery from "@/components/Practices/TerminateSurgery"
export default {
  components: {
		TerminateSurgery,
  },
  data (){
    return {
      practice: '',
      childSurgery: '',
      terminationModal: '',
    }
  },
  async asyncData ({ app, route, store }) {
    try {
      let response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}`)
      const practice = response.data.practice
      response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}/practice-surgeries/${route.params.practiceSurgeryId}`)
      const childSurgery = response.data.practice_surgery

      return{
        practice,
        childSurgery
      }
    } catch (err) {
      store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
      console.log('get practice or practice surgery error', err)
    }
  },
}
</script>

<style>
.termination-modal {
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	border-radius: 25px;
	width: 800px;
	max-width: 95%;
	max-height: 80%;
	overflow: auto;
	transition: all 0.3s ease-in-out;
	background-color: #505561;
	z-index: 512;
}
@media screen and (min-width: 768px) {
	.termination-modal {
		max-height: 60%;
	}
}
</style>