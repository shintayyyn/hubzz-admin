<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
    <div style="width: calc(100%);" class="flex-1 flex flex-col self-end bg-trout overflow-auto">
     <!--^Removed the ff code: style="width: calc(100% - 70px);" -->
      <!-- HEADER -->
      <div class="flex text-sm text-white py-2 px-6">
        <nuxt-link
          :to="{path:`/locums/${locumUser.id}/locum-compliance`}"
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
          @click.prevent="toPutLocumDetailComplianceDocs(specificLocumComplianceDocument.id,toPutLocumDetailCompliance,specificLocumComplianceDocument.expired_at)"
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
          <a class="text-white no-underline" v-bind:href="specificLocumComplianceDocument.file ? specificLocumComplianceDocument.file.url:null">
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
            <p class="text-white">{{specificLocumComplianceDocument.compliance_document ? specificLocumComplianceDocument.compliance_document.name: null}}</p>
            <p class="mt-5 mr-20">Locum</p>
            <p class="text-white">{{locumUser.personal_detail ? locumUser.personal_detail.name: null}}</p>
            <p class="mt-5 mr-20">File last uploaded</p>
            <p class="text-white">{{specificLocumComplianceDocument.file ? $moment(specificLocumComplianceDocument.file.created_at).format('DD/MM/YYYY HH:mm:ss') : null}}</p>
            <p class="mt-5 mr-20">Mobile phone number</p>
            <p class="text-white">{{locumUser.contact_detail ? locumUser.contact_detail.mobile_number : null}}</p>
            <div class="mt-5 mr-20 ">
              <p class="text-white">Expired At</p>
              <p>{{toPutLocumDetailCompliance.expired_at}}</p> <!--SHOULD BE A DATE NOT DATETIME-->
                <input
                    type="date"
                    class="date-picker hasDatepicker valid"
                    name="expiryDate"
                    disable-min-date
                    aria-invalid="false"
                    v-model='toPutLocumDetailCompliance.expired_at'
                  >
            </div>
            <p class="mt-5 mr-20">Status</p>
                <!-- <select
                    class="outline-none border-2 border-transparent text-sm text-black pr-6"
                    id="grid-state"
                    v-model="toPutLocumDetailCompliance.status"
                  >
                    <option>Approved</option>
                    <option>Rejected</option>
                </select> -->

                <button
                  class="inline-flex text-white text-sm m-2 p-2 border border-white rounded-full hover:bg-green-light"
                  :class="`${toPutLocumDetailCompliance.status === 'Approved' || toPutLocumDetailCompliance.status === 'Expiring'  ? 'bg-green border-green text-white px-4 hover:bg-green-light' : 'bg-transparent px-4 hover:bg-green-light'}`"
                  @click.prevent="setStatusData('Approved')"
                >Approved</button>
                <button
                  class="inline-flex text-white text-sm m-2 p-2 border border-white rounded-full hover:bg-orange-light"
                  :class="`${toPutLocumDetailCompliance.status === 'Rejected' || toPutLocumDetailCompliance.status === 'Expired'  ? 'bg-orange border-orange text-white px-4 hover:bg-orange-light ' : 'bg-transparent px-4 hover:bg-orange-light'}`"
                  @click.prevent="setStatusData('Rejected')"
                >Rejected</button>

            <p class="mt-5 mr-20">Note to Locum</p>
                <textarea 
                  v-model="toPutLocumDetailCompliance.note" 
                  placeholder="Type Here" 
                  class="text-grey-lightest flex-1 py-2 px-4 bg-transparent overflow-auto resize border-b focus:border-orange" 
                  name="complianceNote"
                  v-if="notesAreVisible">Type Here
                </textarea>
          </div>
          <div class="flex text-grey m-2">
            <p class="mr-20">File</p>
             <embed
              width=800px
              height=600px
              :src="specificLocumComplianceDocument.file ? specificLocumComplianceDocument.file.url:null"
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
      specificLocumComplianceDocument:null,
      toPutLocumDetailCompliance:{},
      notesAreVisible:true,
      
    };
  },

  async asyncData({ app, route }) {
    try {
      //File ID route
      //from file ID route, find first in compliance documents route. else, find in mandatory trainings route

      let response = await app.$axios.get(`/api/v1/admin/locum-detail-compliance-documents/${route.params.complianceDocId}`)
      const specificLocumComplianceDocument = response.data.data.locum_detail_compliance_document
      response = await app.$axios.get(`/api/v1/admin/locum-users/${specificLocumComplianceDocument.locum_detail.user.id}`)
      const locumUser = response.data.data.user

      return{
        locumUser,
        specificLocumComplianceDocument,
        toPutLocumDetailCompliance:{
          status:specificLocumComplianceDocument && specificLocumComplianceDocument.status == 'Expiring' ? 'Approved':specificLocumComplianceDocument.status,
          expired_at:specificLocumComplianceDocument ? app.$moment(specificLocumComplianceDocument.expired_at).format('YYYY-MM-DD'):null,
          note:specificLocumComplianceDocument ? specificLocumComplianceDocument.note:null
        }
      }

    }catch (err) {
      console.log("index practices index create asyncData err", err);
    }
  },

  computed:{
    
  },
  
  methods:{
    setStatusData(incomingStatus){
      if(this.toPutLocumDetailCompliance.status === 'Approved' && incomingStatus === 'Approved' || this.toPutLocumDetailCompliance.status === 'Expiring' && incomingStatus === 'Approved'){

        this.toPutLocumDetailCompliance.status = ''
        this.notesAreVisible = false
        console.log('status is pending1')
        console.log(this.toPutLocumDetailCompliance)

      }else if(this.toPutLocumDetailCompliance.status === 'Approved' && incomingStatus === 'Rejected' || this.toPutLocumDetailCompliance.status === 'Expiring' && incomingStatus === 'Rejected'){
        
        this.toPutLocumDetailCompliance.status = 'Rejected'
        this.notesAreVisible = true
        this.toPutLocumDetailCompliance.expired_at = null
        console.log('status is rejected2')
         console.log(this.toPutLocumDetailCompliance)

      }else if(this.toPutLocumDetailCompliance.status === 'Rejected' && incomingStatus === 'Rejected' || this.toPutLocumDetailCompliance.status === 'Expired' && incomingStatus === 'Rejected'){
        
        this.toPutLocumDetailCompliance.status = ''
        this.notesAreVisible = true
        this.toPutLocumDetailCompliance.expired_at = null
        console.log('status is pending3')
         console.log(this.toPutLocumDetailCompliance)

      }else if(this.toPutLocumDetailCompliance.status === 'Rejected' && incomingStatus === 'Approved' || this.toPutLocumDetailCompliance.status === 'Expired' && incomingStatus === 'Approved'){
         
        this.toPutLocumDetailCompliance.status = 'Approved'
        this.notesAreVisible = false
        console.log('status is approved4')
        console.log(this.toPutLocumDetailCompliance)

      }else if(this.toPutLocumDetailCompliance.status === 'Pending' || this.toPutLocumDetailCompliance.status === ''  && incomingStatus === 'Approved'){
        
        this.toPutLocumDetailCompliance.status = incomingStatus
        this.notesAreVisible = false
        console.log('status is approved5')
        console.log(this.toPutLocumDetailCompliance)

      }else if(this.toPutLocumDetailCompliance.status === 'Pending' || this.toPutLocumDetailCompliance.status === '' && incomingStatus === 'Rejected'){
        this.toPutLocumDetailCompliance.status = incomingStatus
        this.notesAreVisible = true
        this.toPutLocumDetailCompliance.expired_at = null
        console.log('status is rejected6')
        console.log(this.toPutLocumDetailCompliance)
      }
        
        
    },

    async toPutLocumDetailComplianceDocs(locumDocID,toPutLocumDetailCompliance){
      try{
        await this.$axios.put('/api/v1/admin/locum-detail-compliance-documents/'+locumDocID,{
          status:toPutLocumDetailCompliance.status == "Expiring" ? "Approved" : toPutLocumDetailCompliance.status,
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
