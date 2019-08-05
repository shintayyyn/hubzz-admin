<template>
  <div class="fixed lg:absolute pin-t pin-b pin-r pin-l flex flex-col">
    <div style="width: calc(100%);" class="flex-1 flex flex-col self-end bg-trout shadow-lg overflow-y-auto">
      <!-- HEADER -->
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link :to="{path:`/practices`,query: $route.query }" class="text-white p-1">
          <svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
        </nuxt-link>
      </div>

      <!-- DEFAULT TABS -->
      <div class="flex flex-col rounded-lg pl-6 mt-2 " >
        <div class="w-full">
          <div class="flex flex-wrap -mx-1">
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="bg-grey-dark hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                  :to="{path:`/practices/${specificPractice.id}`,query: $route.query}">
                  <strong>Practice</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                  v-if="!specificPractice.practice_parent"
                  :to="{path:`/practices/${specificPractice.id}/surgeries`,query: $route.query}">
                  <strong>Surgeries</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                  :to="{path:`/practices/${specificPractice.id}/sessions/available`,query: $route.query}">
                  <strong>Sessions</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                  :to="{path:`/practices/${specificPractice.id}/users`,query: $route.query}">
                  <strong>Users</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                  :to="{path:`/practices/${specificPractice.id}/documents`,query: $route.query}">
                  <strong>Documents</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                  :to="{path:`/practices/${specificPractice.id}/rates`,query: $route.query}">
                  <strong>Rates</strong>
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--DEFAULT TABS END HERE-->

      <div class="flex flex-col rounded-lg p-6 sm:p-6">
        <div>
          <form class="flex flex-col bg-waterloo py-2 px-4 shadow rounded-lg sm:w-full lg:w-2/3">
            <div class="flex flex-wrap">
              <div class="w-1/2 sm:w-full lg:w-1/2 text-grey-light text-sm p-2">
                <p class="flex">Practice Name</p>
                <p class="flex items-center text-white text-sm p-2 font-semibold">
                  {{specificPractice.surgery ? specificPractice.surgery.name : null}} 
                  <span
                  class="py-2 px-4 ml-2 text-sm text-white rounded-lg shadow font-extrabold"
                  :class="`${specificPractice && specificPractice.practice_parent ? 'bg-blue-light' :'bg-red-light' }`">{{specificPractice && specificPractice.practice_parent ? 'SPOKE' : 'HUB'}}</span>
                </p>
                
                <p class="flex">Practice Code</p>
                <p class="flex text-white text-sm p-2 font-semibold">{{specificPractice.surgery ? specificPractice.surgery.code : null}}</p>
                <p class="flex">Address</p>
                <p class="flex text-white text-sm p-2 font-semibold">
                  {{specificPractice.surgery.address ? specificPractice.surgery.address.line_1 : null}} <br>
                  {{specificPractice.surgery.address ? specificPractice.surgery.address.line_2 : null}} <br>
                  {{specificPractice.surgery.address ? specificPractice.surgery.address.line_3 : null}} <br>
                </p>
                <p class="flex">CCG</p>
                <p class="flex text-white text-sm p-2 font-semibold">{{specificPractice.surgery.clinical_commissioning_group ? specificPractice.surgery.clinical_commissioning_group.name:null}}</p>
                
                <div v-if="specificPractice.gp_compliance_documents.length > 0">
                  <p class="flex">Compliance Requirements for GPs:</p>
                  <div class="text-white text-sm m-1 font-semibold" v-for="(gpComplianceDocs,index) in specificPractice.gp_compliance_documents"
                    :key="`${index}-${gpComplianceDocs.name}`"
                    >
                      <span >{{gpComplianceDocs ? gpComplianceDocs.name:"(none)"}}</span> 
                  </div>
                </div>
                <div v-if="specificPractice.others_compliance_documents.length > 0">
                  <p class>For Nurses, et al:</p>
                  <div class="text-white text-sm m-1 font-semibold" v-for="(othersComplianceDocs, index) in specificPractice.others_compliance_documents"
                    :key="`${index}-${othersComplianceDocs.name}`"
                    >
                      <span >{{othersComplianceDocs ? othersComplianceDocs.name:"(none)"}}</span> 
                  </div>
                </div>
                <div v-if="specificPractice.mandatory_trainings.length > 0">
                  <p class="flex">Mandatory Training</p>
                  <div class="text-white text-sm m-1 font-semibold" v-for="(mandatoryTrainings, index) in specificPractice.mandatory_trainings"
                    :key="`${index}-${mandatoryTrainings.name}`"
                    >
                      <span >{{mandatoryTrainings ? mandatoryTrainings.name:"(none)"}}</span> 
                  </div>
                </div>
                  
                
                <div v-if="!specificPractice.gp_compliance_documents.length > 0 || !specificPractice.others_compliance_documents.length > 0  || !specificPractice.mandatory_trainings.length > 0">
                  <p class="flex text-white text-base py-2 font-semibold">Compliance Documents is not yet set up by the Practice yet.</p>
                </div>
                
                <div v-if="specificPractice && specificPractice.practice_parent">
                  <p class="flex m-2 text-base font-bold underline"> HUB info</p>
                  <p class="flex">Practice Name</p>
                  <p class="flex text-grey-light text-sm p-2 font-semibold">{{practiceParent.surgery.name}}</p>
                  <p class="flex">Practice Code</p>
                  <p class="flex text-grey-light text-sm p-2 font-semibold">{{practiceParent.surgery.code}}</p>
                  <p class="flex">Phone Number</p>
                  <p class="flex text-grey-light text-sm p-2 font-semibold">{{practiceParent.phone_number}}</p>
                </div>
              </div>
              <div class="w-1/2 sm:w-full  lg:w-1/2 ">
                <p class="flex text-grey-light text-sm p-2">Phone Number</p>
                <input
                  class="appearance-none bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none focus:border-orange"
                  type="text"
                  aria-label="phonenumber"
                  :placeholder="specificPractice.phone_number"
                  v-model="toPutPractice.phone_number"
                >
                <p class="flex text-grey-light text-sm p-2">Full name to report to</p>
                <input
                  class="appearance-none bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none focus:border-orange"
                  type="text"
                  placeholder
                  aria-label="fullName"
                  v-model='toPutPractice.report_to'
                >
                <p
                  class="flex text-grey-light text-sm p-2"
                >Extra information (Parking restrictions, transport links, etc.)</p>
                 <textarea  
                  placeholder="Type Here" 
                  class="text-grey-lightest text-sm w-full bg-transparent overflow-auto resize border-b focus:border-orange" 
                  name="practiceNote"
                  v-model='toPutPractice.extra_information'>
                </textarea>

                <p class="flex text-grey-light text-sm p-2">Status</p>
                <select
                  class="outline-none border-2 border-transparent text-sm text-black pr-6"
                  v-model='toPutPractice.status'
                >
                  <option>Active</option>
                  <option>Suspended</option>
                  <option>Deactivated</option>
                  <!-- <option>Dormant</option> -->
                </select>
                <p class="flex text-grey-light text-sm p-2">Active Until</p>
                  <input
                    type="date"
                    class="date-picker hasDatepicker valid"
                    name="expiryDate"
                    disable-min-date
                    placeholder="dd/mm/yyyy"
                    aria-invalid="false"
                    v-model='toPutPractice.actived_until'
                  >
                <button
                  class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow float:right"
                  @click.prevent="toPutPracticeInfo(specificPractice.id,toPutPractice)"
                >Save</button>
              </div>
            </div>
          </form>
        </div>
      </div>

    </div>
    <nuxt-child/>
  </div>
</template>

<script>
export default {
  transition: "subpage",

  data() {
    return {
      specificPractice:null,
      practiceParent:null,
      users: [],
      documents: [],
      toPutPractice:{}
    };
  },

  async asyncData({ app, route }) {
    try {
      let response = await app.$axios.get(`/api/v1/admin/practices/${route.params.id}`)
      const specificPractice = response.data.data.practice
      const surgeries = response.data.data.practice.surgery
      const practiceParent = specificPractice.practice_parent
      console.log(surgeries)

      return{
        specificPractice,
        surgeries,
        practiceParent,
        toPutPractice:{
          phone_number:specificPractice.phone_number,
          report_to:specificPractice.report_to,
          email:specificPractice.email,
          extra_information:specificPractice.extra_information,
          status:specificPractice.is_actived ? "Active":"Disabled",
          actived_until:specificPractice.actived_until
        }
      }
    } catch (err) {
      console.log("index practices index _id index asyncData err", err);
    }
  },

  methods: {
    async toPutPracticeInfo(practiceID,toPutPractice){
      try{
        //await finishes the promise. if failed, corresponding funcs will not be executed
        await this.$axios.put(`/api/v1/admin/practices/${practiceID}`,{
          phone_number:toPutPractice.phone_number,
          report_to:toPutPractice.report_to,
          extra_information:toPutPractice.extra_information,
          status:toPutPractice.status,
          actived_until:toPutPractice.actived_until
        })
        // alert('Saved')
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'alert', text: 'Saved' })
        
      }catch(err){
        // alert('Something went wrong!')
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
        console.log("index put locum detail compliance documents error");
      }

    }
  }

};
</script>
<style>
@media(min-width: 450px){

 .right-side-header-content{

  width: calc(100% - 0px);

 }

}
</style>
