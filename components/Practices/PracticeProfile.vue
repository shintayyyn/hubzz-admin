<template>
  <div class="flex flex-col rounded-lg">
    <div>
      <form class="flex flex-col bg-waterloo py-2 px-4 shadow rounded-lg sm:w-full lg:max-w-2xl">
        <div class="flex flex-wrap">
          <!-- VIEW PRIMARY INFORMATION -->
          <div class="w-full md:w-1/2 text-gray-300 text-sm p-2">
            <p class="flex">Practice Name</p>
            <p class="flex flex-wrap items-center text-white text-sm p-2 font-semibold">
              <span class="mr-2">{{practice.surgery ? practice.surgery.name : null}}</span>
              <span
              class="py-2 px-4 text-sm text-white rounded-lg shadow font-extrabold"
              :class="practiceTypeStyle(practice.type)">{{practice.type}}</span>
            </p>
            
            <p class="flex">Practice Code</p>
            <p class="flex text-white text-sm p-2 font-semibold">{{practice.surgery ? practice.surgery.code : null}}</p>
            <p class="flex">Address</p>
            <p class="flex flex-col text-white text-sm p-2 font-semibold">
              <span v-if="practice.surgery.address && practice.surgery.address.line_1">{{practice.surgery.address ? practice.surgery.address.line_1 : null}}</span>
              <span v-if="practice.surgery.address && practice.surgery.address.line_2">{{practice.surgery.address ? practice.surgery.address.line_2 : null}}</span>
              <span v-if="practice.surgery.address && practice.surgery.address.line_3">{{practice.surgery.address ? practice.surgery.address.line_3 : null}}</span>
            </p>
            <p class="flex">CCG</p>
            <p class="flex text-white text-sm p-2 font-semibold">{{practice.surgery.clinical_commissioning_group ? practice.surgery.clinical_commissioning_group.name:null}}</p>
            
            <p class="flex">Practice Types</p>
            <div v-if="practice.practice_types.length > 0">
              <p class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-500"
                v-for="practiceType in practice.practice_types"
                  :key="practiceType.id + '-name'">
                  {{practiceType ? practiceType.name:null}}
              </p>
            </div>
            <div v-else>
              <p class="flex text-white text-sm p-2 font-semibold">Not set</p>
            </div>
            <div v-if="practice.gp_compliance_documents.length > 0">
              <p class="flex">Compliance Requirements for GPs:</p>
              <div class="text-white text-sm m-1 font-semibold" v-for="(gpComplianceDocs,index) in practice.gp_compliance_documents"
                :key="`${index}-${gpComplianceDocs.name}`"
                >
                  <span >{{gpComplianceDocs ? gpComplianceDocs.name:"(none)"}}</span> 
              </div>
            </div>
            <div v-if="practice.others_compliance_documents.length > 0">
              <p class>For Nurses, et al:</p>
              <div class="text-white text-sm m-1 font-semibold" v-for="(othersComplianceDocs, index) in practice.others_compliance_documents"
                :key="`${index}-${othersComplianceDocs.name}`"
                >
                  <span >{{othersComplianceDocs ? othersComplianceDocs.name:"(none)"}}</span> 
              </div>
            </div>
            <div v-if="practice.mandatory_trainings.length > 0">
              <p class="flex">Mandatory Trainings</p>
              <div class="text-white text-sm m-1 font-semibold" v-for="(mandatoryTrainings, index) in practice.mandatory_trainings"
                :key="`${index}-${mandatoryTrainings.name}`"
                >
                  <span >{{mandatoryTrainings ? mandatoryTrainings.name:"(none)"}}</span> 
              </div>
            </div>
            <div v-if="!practice.gp_compliance_documents.length > 0 || !practice.others_compliance_documents.length > 0  || !practice.mandatory_trainings.length > 0">
              <p class="flex text-white text-base py-2 font-semibold">Compliance Documents is not yet set up by the Practice yet.</p>
            </div>
          </div>
          <!-- VIEW / EDIT OTHER INFORMATION -->
          <div class="w-full text-sm text-white md:w-1/2 ">
            <div class="m-2">
              <span class="font-semibold text-lg">Other Information</span>
              <span class="m-1 py-2 px-4 bg-sunglow text-black font-semibold rounded-lg cursor-pointer" v-if="toEdit == false && authAdminPermissions.includes('Edit Practice Other Information')" @click="toEdit=true">Edit</span>
              <span class="m-1 py-2 px-4 bg-sunglow text-black font-semibold rounded-lg cursor-pointer" v-if="toEdit == true && authAdminPermissions.includes('Edit Practice Other Information')" @click="toEdit=false">Cancel Editing</span>
            </div>

            <div v-if="toEdit == false" class="border-b border-white">
              <p class="flex text-gray-300 p-2">Phone Number</p>
              <p class="flex mx-4 font-semibold">{{practice && practice.phone_number ? practice.phone_number : 'N/A'}}</p>
              <p class="flex text-gray-300 p-2">Full name to report to</p>
              <p class="flex mx-4 font-semibold">{{practice && practice.report_to ? practice.report_to : 'N/A'}}</p>
              <p class="flex text-gray-300 p-2">Extra information (Parking restrictions, transport links, etc.)</p>
              <p class="flex mx-4 font-semibold">{{practice && practice.extra_information ? practice.extra_information : 'N/A'}}</p>
              <div class="my-4 flex items-center">
                <span class="text-gray-300 p-2">Status: </span>
                <span class="text-white p-2 rounded-lg font-semibold" :class="practice.status == 'Active' ? 'bg-green-500' : 'bg-red-500'">{{practice.status}}</span>
                <span class="tool" data-tip="Practice Status is automatically set to 'Active' once Practice Verification Process is done." tabindex="1">
                  <svgicon
                  name="info"
                  width="21"
                  height="21"
                  color="white transparent black"
                  class="-mb-1 ml-2" 
                  ></svgicon>
                </span>
              </div>
              <span class="text-gray-300 p-2">Active Until</span>
              <p class="flex m-4 font-semibold">{{practice && practice.actived_until ? practice.actived_until : 'N/A'}}</p>
            </div>

            <div v-if="toEdit == true && authAdminPermissions.includes('Edit Practice Other Information')" class="border-b-4 border-white">
              <p class="flex text-gray-300 p-2">Phone Number</p>
              <input
                class="appearance-none text-white bg-transparent border-b w-full mr-3 py-1 px-2 leading-tight focus:outline-none focus:border-yellow"
                type="text"
                aria-label="phonenumber"
                v-model="toPutPractice.phone_number"
              >
              <p class="flex text-gray-300 p-2">Full name to report to</p>
              <input
                class="appearance-none text-white bg-transparent border-b w-full mr-3 py-1 px-2 leading-tight focus:outline-none focus:border-yellow"
                type="text"
                aria-label="fullName"
                v-model='toPutPractice.report_to'
              >
              <p
                class="flex text-gray-300 p-2"
              >Extra information (Parking restrictions, transport links, etc.)</p>
              <textarea  
                placeholder="Type Here" 
                class="text-gray-300 w-full bg-transparent overflow-y-auto resize-none border-b focus:border-yellow-500 focus:outline-none" 
                name="practiceNote"
                v-model='toPutPractice.extra_information'>
              </textarea>
              <div class="flex items-center">
                <span class="text-gray-300 p-2">Status: </span>
                <select
                  class="mx-2 m-1 outline-none border-2 border-transparent text-black pr-6"
                  v-model='toPutPractice.status'
                >
                  <option>Active</option>
                  <option>Suspended</option>
                  <option>Deactivated</option>
                </select>
                <span class="tool" data-tip="Practice Status cannot be set to 'Active' until the Practice is Verified at least verified once since it was created." tabindex="1">
                  <svgicon
                  name="info"
                  width="21"
                  height="21"
                  color="white transparent black"
                  ></svgicon>
                </span>
              </div>
              
              <div class="my-2">
                <span class="text-gray-300 p-2">Active Until</span>
                  <input
                    type="date"
                    class="date-picker hasDatepicker valid text-black"
                    name="expiryDate"
                    disable-min-date
                    placeholder="dd/mm/yyyy"
                    aria-invalid="false"
                    v-model='toPutPractice.actived_until'
                  >
              </div>
              
              <button
                class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-black font-semibold rounded-lg shadow float:right"
                @click.prevent="toPutPracticeInfo(practice.id,toPutPractice)"
              >Save</button>
            </div>

            <div v-if="toEdit == true && authAdminPermissions.includes('Change Practice Type')">
              <p class="flex text-gray-300 text-base font-bold mt-4">Change Practice Type</p>
              <select
                class="outline-none border-2 border-transparent text-black pr-6"
                v-model='toPutPracticeType.type'
              >
                <option>Hub</option>
                <option>Spoke</option>
                <option>Stand Alone</option>
              </select>
              <button
                class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-black font-semibold rounded-lg shadow float:right"
                @click.prevent="toChangePracticeType(practice.id,toPutPracticeType)"
              >Change</button>
            </div>
            
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  props:['practice'],
  data(){
    return{
      practiceParent:'',
      toPutPractice:{
        phone_number:this.practice.phone_number,
        report_to:this.practice.report_to,
        extra_information:this.practice.extra_information,
        status:this.practice.status,
        actived_until:this.practice.actived_until
      },
      toEdit:false,
      toPutPracticeType:{
        type:this.practice.type
      },
    }
  },
  computed: {
    authAdminPermissions() {
      return this.$store.getters["auth/permissions"]
    }
  },
  async created(){
    if(this.practice.type == 'Spoke'){
      Promise.all([
        this.$axios.$get(`/api/v1/admin/practices/${this.practice.id}/parent-surgery`).then(res=>{
          this.practiceParent = res.data.practice.parent_surgery
        })
      ]).then(()=>{
        console.log('get parent')
      })
    }
  },

  methods:{
    getQuery(){
      const query = {
        ...this.$route.query
      }
      const offset = parseInt(query.page)*8 - 8
      return offset
    },
    getPractices(){
      this.$store.dispatch("practices/fetchPractices",{
        limit:8,
        order_by:'created_at:desc',
        offset:this.getQuery()
      })
    },
    getPractice(){
      this.$store.dispatch("practices/fetchSpecificPractice",{
        id:this.practice.id
      })
    },
    async toPutPracticeInfo(practiceID,toPutPractice){
      try{
          const response = await this.$axios.put(`/api/v1/admin/practices/${practiceID}`,{
            phone_number:toPutPractice.phone_number,
            report_to:toPutPractice.report_to,
            extra_information:toPutPractice.extra_information,
            status:toPutPractice.status,
            actived_until:toPutPractice.actived_until
          })
          // this.practice.phone_number = response.data.data.practice.phone_number
          // this.practice.report_to = response.data.data.practice.report_to,
          // this.practice.extra_information = response.data.data.extra_information,
          // this.practice.status = response.data.data.practice.status,
          // this.practice.actived_until = response.data.data.practice.actived_until
          
          await this.getPractices()
          this.toEdit = false  
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved' })
          
      }catch(err){
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
          console.log("put locum profile info error",err);
      }

    },
    async toChangePracticeType(practiceID,toPutPracticeType){
      try{
        const response = await this.$axios.put(`/api/v1/admin/practices/${practiceID}/practice-type`,{
          type:toPutPracticeType.type
        })
        await this.getPractices()
        await this.getPractice()
        this.$store.commit('SET_NOTIFICATION',{enabled:true, status:'success',text:'Saved'})
      }catch(err){
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
        console.log('change practice type error!',err)
      }
    },

    practiceTypeStyle(type){
      switch(type){
        case 'Stand Alone':
          return 'bg-indigo-500 text-white lg:px-4 sm:px-2'
          break;
        case 'Hub':
          return 'bg-red-500 text-white lg:px-8 sm:px-2'
          break;
        case 'Spoke':
          return 'bg-blue-500 text-white lg:px-8 sm:px-2'
          break;
        default:
          return
      }
    },   
  }
}
</script>
<style>

</style>
