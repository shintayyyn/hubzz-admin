<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
    <div style="width: calc(100%);" class="flex-1 flex flex-col self-end bg-trout overflow-auto">
     <!--^Removed the ff code: style="width: calc(100% - 70px);" -->
      <!-- HEADER -->
      <div class="flex text-sm text-white py-2 px-6">
        <nuxt-link
          :to="{path:`/compliances/${locumUser.id}`}"
          class="text-white hover:text-yellow-dark p-1 mr-4"
        >
          <svgicon
            name="arrow-left-solid"
            height="22"
            width="22"
            class="hover:text-yellow-dark fill-current"
          />
        </nuxt-link>
        <button class="text-white hover:text-black hover:bg-yellow-dark rounded-lg inline-flex p-2 mr-4"
          
        >
          <svgicon
          name="save-icon"
          width="21"
          height="21"
          color="transparent white"
          hover:color="transparent black"
        ></svgicon>
         <span>Save</span>
        </button>
        <div class="text-white hover:text-black hover:bg-yellow-dark rounded-lg inline-flex p-2">
          <a class="text-white" v-bind:href="locumMandatoryTrainings.file ? locumMandatoryTrainings.file.url:null">
             <svgicon
              name="cloud-download"
              width="21"
              height="21"
              color="transparent white"
              hover ="transparent black"
            ></svgicon>
            <span>Download</span>
          </a>
         
        </div>
      </div>
      <!-- HEADER -->
      <!-- BODY -->
      <div class="flex-col shadow-lg rounded-lg bg-waterloo mx-6 mt-10">
        <div class="inline-flex text-sm m-4">
          <div class="text-grey m-2">
            <p class="mr-20">Title</p>
            <p class="text-white">{{specificMandatoryTraining[0].mandatory_training ? specificMandatoryTraining[0].mandatory_training.name: null}}</p>
            <p class="mt-5 mr-20">Locum</p>
            <p class="text-white underline">{{locumUser.personal_detail ? locumUser.personal_detail.name: null}}</p>
            <p class="mt-5 mr-20">File last uploaded</p>
            <p class="text-white underline">{{specificMandatoryTraining[0] && specificMandatoryTraining[0].file ? $moment(specificMandatoryTraining[0].file.created_at).format('DD/MM/YYYY HH:mm:ss') : null}}</p>
            <p class="mt-5 mr-20">Mobile phone number</p>
            <p class="text-white">{{locumUser.contact_detail ? locumUser.contact_detail.mobile_number : null}}</p>
            <div class="mt-5 mr-20">
              <label for="expiryDate">Expiry date</label>
              <input
                type="date"
                class="date-picker hasDatepicker valid"
                name="expiryDate"
                disable-min-date
                value
                placeholder="dd/mm/yyyy"
                id="dp1554355291222"
                aria-invalid="false"
                v-model="toPutLocumDetailCompliance.expired_at"
              >
            </div>
            <p class="mt-5 mr-20">Status</p>
              <!-- <div class="flex flex-wrap overflow-hidden">
                <div class="w-1/2 overflow-hidden">
                  <button v-on:click="value='Approved'" class='inline-flex text-white text-sm mt-2 py-2 p-3 border border-white rounded-full focus:bg-green focus:border-green'>Approved</button>
                </div>
                <div class="w-1/2 overflow-hidden">
                  <button class='inline-flex text-white text-sm mt-2 py-2 p-3 border border-white rounded-full focus:bg-yellow focus:border-yellow focus:text-black'>Denied</button>
                </div>
              </div> -->
                <select
                    class="outline-none border-2 border-transparent text-sm text-black pr-6"
                    id="grid-state"
                    v-model="toPutLocumDetailCompliance.status"
                  >
                    <option>Approved</option>
                    <option>Rejected</option>
                </select>
            <p class="mt-5 mr-20">Note to Locum</p>
                <textarea v-model="toPutLocumDetailCompliance.note" 
                  placeholder="Type Here" 
                  class="text-grey-lightest flex-1 py-2 px-4 bg-transparent overflow-auto resize border-b focus:border-orange" 
                  name="complianceNote">Type Here
                </textarea>
          </div>
          <div class="flex text-grey m-2">
            <p class="mr-20">File</p>
             <embed
              width=800px
              height=600px
              :src="specificMandatoryTraining[0] && specificMandatoryTraining[0].file ? specificMandatoryTraining[0].file.url:null"
              >
          </div>
       
        </div>
      </div>
      <!-- BODY -->
    </div>
  </div>
</template>

<script>
export default {
  transition: "subpage",

  data() {
    return {
      locumUser:null,
      locumMandatoryTrainings:[],
      specificMandatoryTraining:[],
      toPutLocumDetailCompliance:{
        status:'',
        expired_at:'',
        note:''
      }
    };
  },

  async asyncData({ app, route }) {
    try {

      let response = await app.$axios.get(`/api/v1/admin/locum-users/${route.params.id}`)
      const locumUser = response.data.data.user
      const locumMandatoryTrainings = response.data.data.user.locum_detail.mandatory_trainings
      
      const specificMandatoryTraining = locumMandatoryTrainings.filter((userMandatoryTraining)=>{
        return userMandatoryTraining.id == route.params.mandatoryTrainingId
      })

      console.log(specificMandatoryTraining[0])
      return{
        locumUser,
        locumMandatoryTrainings,
        specificMandatoryTraining
      }

    } catch (err) {
      console.log("index practices index create asyncData err", err);
    }
  },
  
  
  methods:{
    async toPutLocumDetailComplianceDocs(locumDocID,toPutLocumDetailCompliance){
      try{
        const response = this.$axios.put('/api/v1/admin/locum-detail-compliance-documents/'+locumDocID,{
          status:toPutLocumDetailCompliance.status,
          expired_at:toPutLocumDetailCompliance.expired_at,
          note:toPutLocumDetailCompliance.note
        })
        alert('Saved')
      }catch(err){
        console.log("index put locum detail compliance documents error");
        alert('Something went wrong!')
      }
    }
  }

};
</script>
