<template>
  <div>
    <div class="mt-5">
      <transition name="fade" mode="out-in">
        <div v-if="practiceParent">
          <form class="flex flex-col bg-waterloo p-2 md:px-4 shadow rounded-lg sm:w-full lg:w-2/3">
            <div class="flex flex-wrap">
              <div class="w-full">
                <div class="text-gray-300 text-sm p-2">
                  <p class="flex">Practice Name</p>
                  <p class="flex items-center text-white text-sm p-2 font-semibold">
                  {{practiceParent.surgery ? practiceParent.surgery.name : null}} 
                  </p>
                  <p class="flex">Practice Code</p>
                  <p class="flex text-white text-sm p-2 font-semibold">{{practiceParent.surgery ? practiceParent.surgery.code : null}}</p>
                  <p class="flex">Address</p>
                  <p class="flex text-white text-sm p-2 font-semibold">
                  {{practiceParent.surgery.address ? practiceParent.surgery.address.line_1 : null}} <br>
                  {{practiceParent.surgery.address ? practiceParent.surgery.address.line_2 : null}} <br>
                  {{practiceParent.surgery.address ? practiceParent.surgery.address.line_3 : null}} <br>
                  </p>
                  <p class="flex">CCG</p>
                  <p class="flex text-white text-sm p-2 font-semibold">{{practiceParent.surgery.clinical_commissioning_group ? practiceParent.surgery.clinical_commissioning_group.name:null}}</p>
                  
                  <p class="flex">Practice Types</p>
                  <div v-if="practiceParent.practice_types.length > 0">
                  <p class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-500"
                      v-for="practiceType in practiceParent.practice_types"
                      :key="practiceType.id + '-name'">
                      {{practiceType ? practiceType.name:null}}
                  </p>
                  </div>
                  <div v-else>
                  <p class="flex text-white text-sm p-2 font-semibold">Not set</p>
                  </div>
              
                  <div v-if="practiceParent.gp_compliance_documents.length > 0">
                  <p class="flex">Compliance Requirements for GPs:</p>
                  <div class="text-white text-sm m-1 font-semibold" v-for="(gpComplianceDocs,index) in practiceParent.gp_compliance_documents"
                      :key="`${index}-${gpComplianceDocs.name}`"
                      >
                      <span >{{gpComplianceDocs ? gpComplianceDocs.name:"(none)"}}</span> 
                  </div>
                  </div>
                  <div v-if="practiceParent.others_compliance_documents.length > 0">
                  <p class>For Nurses, et al:</p>
                  <div class="text-white text-sm m-1 font-semibold" v-for="(othersComplianceDocs, index) in practiceParent.others_compliance_documents"
                      :key="`${index}-${othersComplianceDocs.name}`"
                      >
                      <span >{{othersComplianceDocs ? othersComplianceDocs.name:"(none)"}}</span> 
                  </div>
                  </div>
                  <div v-if="practiceParent.mandatory_trainings.length > 0">
                  <p class="flex">Mandatory Trainings</p>
                  <div class="text-white text-sm m-1 font-semibold" v-for="(mandatoryTrainings, index) in practiceParent.mandatory_trainings"
                      :key="`${index}-${mandatoryTrainings.name}`"
                      >
                      <span >{{mandatoryTrainings ? mandatoryTrainings.name:"(none)"}}</span> 
                  </div>
                  </div>
                  
                  <div v-if="!practiceParent.gp_compliance_documents.length > 0 || !practiceParent.others_compliance_documents.length > 0  || !practiceParent.mandatory_trainings.length > 0">
                  <p class="flex text-white text-base py-2 font-semibold">Compliance Documents is not yet set up by the Practice Hub yet.</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div v-if="!practiceParent && practiceHub">
          <form class="flex flex-col bg-waterloo py-2 px-4 text-white text-sm shadow rounded-lg sm:w-full lg:w-2/3">
            <div class="m-4">
              <div class="inline-flex text-lg">
                <div class="flex">
                  <svgicon name="alert" width="48" height="48" color="white"/>
                </div>
                <div class="flex">
                  <p v-if="practiceHub.parent_surgery" class="mt-4">This surgery is not yet a registered practice in HUBZZ.</p>
                  <p v-else>This practice has no Hub yet.</p>
                </div>
              </div>
            </div>
            <div v-if="practiceHub.parent_surgery" class="text-gray-300 text-sm m-4">
              <p class="font-semibold">Surgery Name</p>
              <p class="m-2">{{practiceHub.parent_surgery ? practiceHub.parent_surgery.name : ''}}</p>
              <p class="font-semibold">Surgery Code</p>
              <p class="m-2">{{practiceHub.parent_surgery ? practiceHub.parent_surgery.code : ''}}</p>
            </div>
          </form>
        </div>
      </transition>
    </div>
    <nuxt-child/>
  </div>
</template>
<script>
import PracticeHub from '@/components/Practices/PracticeHub'
export default {
    middleware: 'changedPracticeType',
    components:{
      PracticeHub
    },
    data(){
      return{
        // practice:'',
        // practiceHub:'',
        // practiceParent:''
      }
    },
    computed:{
      practice(){
        return this.$store.state.practices.practice
      },
      practiceHub(){
        return this.$store.state.practices.practiceHub
      },
      practiceParent(){
        return this.$store.state.practices.practiceParent
      }
    },
    async asyncData({ app, store, route, error }){
      try{
        //Practice Hub is the Practice's data as the Hub
        //Practice Parent is the Practice's data as a Specific Practice
        let response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}`)
        const practice = response.data.practice
        
        response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}/parent-surgery`)
        const practiceHub = response.data.practice

        let practiceParent = ''
        console.log('practice hub', practiceHub)
        if (practiceHub.parent_practice) {
            response = await app.$axios.$get(`/api/v1/admin/practices/${practiceHub.parent_practice.id}`)
            practiceParent = response.data.practice
            console.log('parent', practiceParent)
            await store.commit('practices/SET_PRACTICE_PARENT',practiceParent) 
        }

        await store.commit('practices/SET_PRACTICE_PARENT',practiceParent) 
        await store.commit('practices/SET_SPECIFIC_PRACTICE',practice)
        await store.commit('practices/SET_PRACTICE_HUB',practiceHub)
      
        // return{
        //     practice,
        //     practiceHub,
        //     practiceParent,
        // }
      }catch(err){
        error({statusCode: 404})
        store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
        console.log('get parent practice error!!',err)
      }
    }
    
}
</script>
<style>
</style>