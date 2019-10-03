<template>
  <div class="absolute top-0 bottom-0 right-0 left-0 flex flex-col">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout overflow-auto">
    <!--^Removed the ff code: style="width: calc(100% - 70px);" -->
    <!-- HEADER -->
    <div class="flex items-center text-sm text-white py-2 px-6">
      <nuxt-link
        :to="{path:`/locums/${locumUser.id}/locum-compliance`}"
        class="text-white hover:text-yellow-500 p-1 mr-4"
      >
        <svgicon
          name="arrow-left-solid"
          height="22"
          width="22"
          class="hover:text-yellow-500 fill-current"
        />
        </nuxt-link>
        <button class="inline-flex items-center text-white hover:text-black hover:bg-yellow-500 rounded-lg p-2 mr-4"
         @click.prevent="toPutLocumMandatoryTrainingDocs(locumUser.id,toPutLocumMandatoryTraining.status)">
          <svgicon
            name="save-icon"
            width="21"
            height="21"
            color="transparent white"
            hover:color="transparent black"
          ></svgicon> 
        <span class="px-1">Save</span> <!--ASK JC/ARVI ABOUT THIS. DOES MANDATORY TRAINING EXPIRE etc. etc.?-->
        </button>
        <div class="text-white hover:text-black hover:bg-yellow-500 rounded-lg inline-flex p-2">
          <a
            @click.prevent="downloadItem(specificMandatoryTraining[0].file.url,specificMandatoryTraining[0].file.filename)" 
            class="inline-flex items-center text-white no-underline" v-bind:href="locumMandatoryTrainings.file ? locumMandatoryTrainings.file.url:null">
            <svgicon
              name="cloud-download"
              width="21"
              height="21"
              color="transparent white"
              hover ="transparent black"
            ></svgicon>
            <span class="px-1">Download</span>
          </a>
        </div>
      </div>
      <!-- HEADER -->
      <!-- BODY -->
      <div class="shadow-lg rounded-lg bg-waterloo mx-6 mt-10 p-4">
        <div class="w-full inline-flex flex-wrap md:flex-no-wrap md:flex-row flex-col-reverse text-sm">
          <div class="text-gray m-2 md:w-1/3">
            <p class="mr-20">Title</p>
            <p class="text-white">{{specificMandatoryTraining[0].mandatory_training ? specificMandatoryTraining[0].mandatory_training.name: null}}</p>
            <p class="mt-5 mr-20">Locum</p>
            <p class="text-white">{{locumUser.personal_detail ? locumUser.personal_detail.name: null}}</p>
            <p class="mt-5 mr-20">File last uploaded</p>
            <p class="text-white">{{specificMandatoryTraining[0] && specificMandatoryTraining[0].file ? $moment(specificMandatoryTraining[0].file.created_at).format('DD/MM/YYYY HH:mm:ss') : null}}</p>
            <p class="mt-5 mr-20">Mobile phone number</p>
            <p class="text-white">{{locumUser.contact_detail ? locumUser.contact_detail.mobile_number : null}}</p>
            <div class="mt-5 mr-20">
              <label for="expiryDate">Expiry date</label>
              <input
                type="date"
                class="date-picker hasDatepicker valid"
                name="expiryDate"
                disable-min-date
                placeholder="dd/mm/yyyy"
                aria-invalid="false"
                v-model="toPutLocumMandatoryTraining.expired_at"
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
                    v-model="toPutLocumMandatoryTraining.status"
                  >
                    <option>Approved</option>
                    <option>Rejected</option>
                </select>
            <p class="mt-5 mr-20">Note to Locum</p>
                <textarea v-model="toPutLocumMandatoryTraining.note" 
                  placeholder="Type Here" 
                  class="text-gray-lightest flex-1 py-2 px-4 bg-transparent overflow-auto resize border-b focus:border-orange" 
                  name="complianceNote">Type Here
                </textarea>
          </div>
          <div class="flex flex-col text-gray md:m-2">
            <p class="mr-20">File</p>
              <embed
              class="w-full my-2" style="max-width: 800px"
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
      toPutLocumMandatoryTraining:{}
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
        specificMandatoryTraining,
        toPutLocumMandatoryTraining:{
          status:specificMandatoryTraining ? specificMandatoryTraining.status:null,
          expired_at:specificMandatoryTraining ? specificMandatoryTraining.expired_at:null,
          note:specificMandatoryTraining ? specificMandatoryTraining.note:null
        }
      }

    } catch (err) {
      console.log("index practices index create asyncData err", err);
    }
  },
  
  
  methods:{

    downloadItem (fileUrl, fileFilename) {
      const axios = require('axios');
      axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'blob', // important
    }).then(response => {
      console.log(response)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileFilename);
      document.body.appendChild(link);
      link.click();
      console.log(fileUrl)
      });
    },

    async toPutLocumMandatoryTrainingDocs(locumDocID,toPutLocumMandatoryTraining){
      try{
        await this.$axios.put('/api/v1/admin/locum-detail-compliance-documents/'+locumDocID,{
          status:toPutLocumMandatoryTraining.status,
          expired_at:toPutLocumMandatoryTraining.expired_at,
          note:toPutLocumMandatoryTraining.note
        })
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'alert', text: 'Saved' })
      }catch(err){
        console.log("index put locum detail compliance documents error");
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
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
  .page-overlap{
    min-width: 100%;
  }
  @media screen and (min-width: 768px){
    .page-overlap{
    min-width: calc(100% - 70px);
    }
  }

  @media screen and (min-width: 1200px) {
    .page-overlap{
      min-width: calc(100% - 200px);
    }
  }
</style>