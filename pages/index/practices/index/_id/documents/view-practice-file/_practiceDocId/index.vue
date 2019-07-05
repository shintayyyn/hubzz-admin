<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
    <div style="width: calc(100%);" class="flex-1 flex flex-col self-end bg-trout overflow-auto">
     <!--^Removed the ff code: style="width: calc(100% - 70px);" -->
      <!-- HEADER -->
      <div class="flex text-sm text-white py-2 px-6">
        <nuxt-link
          :to="{path:`/practices/${specificPractice.id}/documents`}"
          class="text-white hover:text-yellow-dark p-1 mr-4"
        >
          <svgicon
            name="arrow-left-solid"
            height="22"
            width="22"
            class="hover:text-yellow-dark fill-current"
          />
        </nuxt-link>
        <!-- <button class="text-white hover:text-black hover:bg-yellow-dark rounded-lg inline-flex p-2 mr-4"
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
        </button> -->

        <div class="text-white hover:text-black hover:bg-yellow-dark rounded-lg inline-flex p-2">
          <a class="text-white" v-bind:href="specificPracticeDocument.file ? specificPracticeDocument.file.url:null">
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
            <p class="text-white">{{specificPracticeDocument.practice_document_type ? specificPracticeDocument.practice_document_type.name: null}}</p>
            <p class="mt-5 mr-20">Practice</p>
            <p class="text-white underline">{{specificPracticeDocument.practice ? specificPracticeDocument.practice.surgery.name: null}}</p>
            <p class="mt-5 mr-20">File last uploaded</p>
            <p class="text-white underline">{{specificPracticeDocument.file ? $moment(specificPracticeDocument.file.created_at).format('DD/MM/YYYY HH:mm:ss') : null}}</p>
          </div>
          <div class="flex text-grey m-2">
            <p class="mr-20">File</p>
             <embed
              width=800px
              height=600px
              :src="specificPracticeDocument.file ? specificPracticeDocument.file.url:null"
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
      specificPracticeDocument:null,
      specificPractice:null,
      toPutLocumDetailCompliance:{}
      
    };
  },

  async asyncData({ app, route }) {
    try {
      //File ID route
      //from file ID route, find first in compliance documents route. else, find in mandatory trainings route
      console.log(route.params.practiceDocId)
      let response = await app.$axios.get(`/api/v1/admin/practice-documents/${route.params.practiceDocId}`)
      const specificPracticeDocument = response.data.data.practice_document
      const specificPractice = specificPracticeDocument.practice
      console.log(specificPractice.id)
      // const specificLocumComplianceDocument = response.data.data.locum_detail_compliance_document
      // response = await app.$axios.get(`/api/v1/admin/locum-users/${specificLocumComplianceDocument.locum_detail.user.id}`)
      // const locumUser = response.data.data.user

      return{
        specificPractice,
        specificPracticeDocument,
        // toPutLocumDetailCompliance:{
        //   status:specificLocumComplianceDocument ? specificLocumComplianceDocument.status:null,
        //   expired_at:specificLocumComplianceDocument ? specificLocumComplianceDocument.expired_at:null,
        //   note:specificLocumComplianceDocument ? specificLocumComplianceDocument.note:null
        // }
      }

    }catch (err) {
      console.log("index practices index create asyncData err", err);
    }
  },

  computed:{
    
  },
  
  methods:{
    //  async toPutLocumDetailComplianceDocs(locumDocID,toPutLocumDetailCompliance){
    //   try{
    //     this.$axios.put('/api/v1/admin/locum-detail-compliance-documents/'+locumDocID,{
    //       status:toPutLocumDetailCompliance.status == "Expiring" ? "Approved" : toPutLocumDetailCompliance.status,
    //       expired_at:toPutLocumDetailCompliance.expired_at,
    //       note:toPutLocumDetailCompliance.note
    //     })
    //     alert('Saved')
    //   }catch(err){
    //     console.log("index put locum detail compliance documents error");
    //     alert('Something went wrong!')
    //   }
    // }
  }
};
</script>
