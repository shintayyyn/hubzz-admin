<template>
  <div>
    <div class="flex justify-between text-sm text-white py-4 px-4">
      <div @click="$emit('close')" class="cursor-pointer">
        <svgicon
          name="arrow-left-solid"
          height="32"
          width="32"
          class="text-white hover:text-sunglow fill-current"
        />
      </div>
    </div>
    <div class="p-2 mx-4 text-white">
      <div> Hub Requested Termination for This Spoke </div> 
      <div>{{$moment(childSurgery ? childSurgery.termination_requested_at :null).format('MMM D, YYYY | HH:MM:ss')}}</div>
      <div>{{ childSurgery ? childSurgery.surgery.name :null }}</div>
      <div>{{ childSurgery ? childSurgery.surgery.code :null }}</div>
      <div>{{ childSurgery ? childSurgery.surgery.practice.id: null }}</div>
      <div>{{ childSurgery ? childSurgery.surgery.practice.phone_number: null }}</div>
      <div>{{ childSurgery ? childSurgery.surgery.practice.report_to: null }}</div>
      <div>{{ childSurgery ? childSurgery.surgery.practice.email: null }}</div>
      <div class="rounded-lg m-2 p-2 bg-charade">
        Note from Practice Hub: 
        <div class="m-2 ">{{childSurgery ? childSurgery.note:null}}</div>
      </div>
      <div class="flex justify-center my-4 cursor-pointer">
        <div class="flex-1 p-2 ml-1 rounded-lg bg-red-600" @click="toDeleteSurgery(childSurgery.id)">Delete Entire Surgery</div>
        <div class="flex-1 p-2 ml-1 rounded-lg bg-yellow-600" @click="toDeleteParent(childSurgery.practice_id)">Terminate from Parent</div>
        <div class="flex-1 p-2 ml-1 rounded-lg bg-green-600" @click="toRejectRequest(childSurgery.id)">Reject Termination Request</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:['practice','childSurgery'],

  data(){
    return{
      // childSurgery: null
    }
  },

  created(){
  },
  
  methods:{
    async toDeleteSurgery(){
      await this.$axios.delete(`/api/v1/admin/practices/${this.practice.id}/practice-surgeries/${this.childSurgery.id}`).then(res => {
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Spoke is terminated and Invitation is Successfully Deleted' })
        this.getPracticeSpokes(this.practice.id)
        this.$emit('close')
      }).catch(err => {
        console.log('delete children error!!!!',err)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
      })
    },
    async toDeleteParent(childPracId){
      await this.$axios.delete(`/api/v1/admin/practices/${this.practice.id}/parent-surgery`,{
        practice_id: childPracId
      }).then( res => {
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Spoke is Successfully Terminated' })
        this.getPracticeSpokes(this.practice.id)
        this.$emit('close')
      }).catch(err => {
        console.log('remove parent error!!!!',err)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
      })
    },
    async toRejectRequest(childId) {
      await this.$axios.put(`/api/v1/admin/practices/${this.practice.id}/practice-surgeries/${childId}/reject-termination-request`)
      .then( res => {
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Request is Successfully Rejected' })
        this.getPracticeSpokes(this.practice.id)
        this.$emit('close')
      }).catch(err => {
        console.log('reject request error!',err)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
      })
    },
    getPracticeSpokes(practiceId) {
      this.$store.dispatch("practices/fetchSpokes", {
        practice_id: practiceId
      });
    },
  }
  
}
</script>

<style>
</style>