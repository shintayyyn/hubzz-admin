<template>
	<div class="fixed lg:absolute  pin-t pin-b pin-r pin-l flex flex-col overflow-y-auto overflow-x-hidden">
		<div class="page-overlap flex-1 flex flex-col self-end bg-trout shadow-lg">
		
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
                  class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                  :to="{path:`/practices/${specificPractice.id}`,query: $route.query}">
                  <strong>Practice</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                  :to="{path:`/practices/${specificPractice.id}/surgeries`,query: $route.query}">
                  <strong>Surgeries</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                  v-if="!specificPractice.practice_parent"
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
                  class="bg-grey-dark hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
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

    <!-- TABLE RESPONSIVE-->
    <div class="table border-separate overflow-x-auto px-6" style="border-spacing: 0 10px;"> 
      <!-- HEADER -->
      <div class="hidden md:table-row font-bold text-white text-sm py-4"> 
        <div class="table-cell p-2 align-middle">Title</div> 
        <div class="table-cell p-2 align-middle">File Size</div>
        <div class="table-cell p-2 align-middle">Last Upload Date</div>
        <div class="table-cell p-2 align-middle">Upload New File</div>
      </div>
      <!-- END HEADER -->
      <!-- BODY -->
      <div
        v-for="(document,index) in specificPracticeDocumentTypes"
        :key="`surgery-${index}`"
        class="flex flex-col md:flex-row sm:flex-wrap justify-between px-2 py-2 border-l-8 border-yellow-dark md:border-l-0 md:table-row my-2 text-white no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light" 
      >
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">Title</strong>
          <span class="whitespace-no-wrap">{{ document.practiceDocType ? document.practiceDocType.name:null }}</span>
        </div>
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">File Size</strong>
          <span class="break-all">{{ document.practiceSpecificDoc && document.practiceSpecificDoc.file ? (document.practiceSpecificDoc.file.size / 1048576).toFixed(2) + " Mb":null }}</span>
        </div>
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">Last Upload Date</strong>
          <span class="break-all">{{ document.practiceSpecificDoc ? $moment(document.practiceSpecificDoc.created_at).format('MMM D, YYYY | hh:mm A'):null }}</span>
        </div>
        <div class="flex flex-col sm:w-full md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">Upload New File</strong>
          <div class="flex items-center justify-between md:justify-start flex-wrap">
              <div class="flex flex-wrap">
              <div class="flex text-white text-sm w-24">
                <label>File
                  <input 
                  type="file" 
                  id="file" 
                  :ref="`file-${document.practiceDocType.id}`" 
                  v-on:change="handleFileUpload(`file-${document.practiceDocType.id}`, document.practiceDocType.id)"/>
                </label>
              </div>
              <div class="flex text-white text-sm py-2 md:py-0">
                <button class="flex items-center border-white rounded-full p-1 text-white"
                  :event="fileIsUploadable === 'false' ? disabled : 'click'"
                  :class="fileIsUploadable === 'false' ? 'bg-transparent' : 'bg-green px-4'" 
                  v-on:click="submitFile(specificPractice.id, document.practiceDocType.id, document.practiceSpecificDoc)">
                <svgicon
                  name="cloud-upload"
                  width="21"
                  height="21"
                  color="transparent white"
                  ></svgicon> 
                  <span class="px-2">{{document.practiceSpecificDoc && document.practiceSpecificDoc.file ? "Update":"Upload"}}</span>
                </button>
              </div>
              </div>
              <div v-if="document.practiceSpecificDoc" class="flex text-white text-sm py-2 md:py-4 md:px-4">
                <nuxt-link class="bg-blue flex items-center text-center rounded-full text-white no-underline px-4 py-2"
                  :to="{path:`/practices/${specificPractice.id}/documents/view-practice-file/${document.practiceSpecificDoc ? document.practiceSpecificDoc.id: null}`, query: $route.query}">
                  <svgicon
                    name="folder"
                    width="21"
                    height="21"
                    color="white white"
                  ></svgicon> 
                  <span class="px-2">View File</span>
                </nuxt-link>
              </div>
            </div>
        </div>
      </div>
      <!-- END BODY -->
    </div>
    <!-- END TABLE -->
		</div>
		<nuxt-child/>
	</div>
</template>

<script>
export default{
	  transition: "subpage",

  data() {
    return {
      disabled:'true',
      file:'',
      specificPractice:[],
      specificPracticeDocumentTypes:[],
      files: [],
      fileIsUploadable: 'false'
      
      
    };
  },

  async asyncData({ app, route }) {
    try {
      let response = await app.$axios.get(`/api/v1/admin/practices/${route.params.id}`)
      const specificPractice = response.data.data.practice
      const surgeries = response.data.data.practice.surgery
      
      response = await app.$axios.get(`/api/v1/admin/practice-document-types`)
      const practiceDocTypes = response.data.data.practice_document_types

      response = await app.$axios.get(`/api/v1/admin/practice-documents`, {
        params: {
          practice_id: route.params.id
        }
      })
      const practiceDocs = response.data.data.practice_documents

      const specificPracticeDocumentTypes = practiceDocTypes.map((practiceDocType)=>{
        const practiceSpecificDoc = practiceDocs.find((practiceDoc) => {
          return practiceDoc.practice_document_type.id === practiceDocType.id
        })
        return{
          practiceDocType,
          practiceSpecificDoc
        }
      })

      console.log(specificPracticeDocumentTypes)

      return{
        specificPractice,
        surgeries,
        specificPracticeDocumentTypes
      }
    } catch (err) {
      console.log("index practices index _id index asyncData err", err);
    }
  },

  methods:{
    async submitFile(practiceID, practiceDocumentID, practiceSpecificDocument){
      try{
        let formData = new FormData()
        let file = this.files.find(({ id }) => id === practiceDocumentID)
        if (file) {
            file = file.file
            console.log("practice id: "+practiceID+"practice doc id: "+practiceDocumentID)
            console.log(file)
        
            if(practiceSpecificDocument){
              console.log('its something')
              console.log(practiceSpecificDocument)

              formData.append('practice_document_id',practiceID)
              formData.append('file', file)
              
              await this.$axios.put(`/api/v1/admin/practice-documents/${practiceSpecificDocument.id}`,formData,{
                headers: {
                  'Content-Type': 'multipart/form-data'
                },
              }).then(function(){
                  this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Upload Success' })
                  // alert('SUCCESS!!')
                  console.log("nice 1!")

              }).catch(function(){
                console.log('FAILURE!!');
              });

            }else{
              console.log("its nothing 1")
              formData.append('file', file)
              formData.append('practice_id',practiceID)
              formData.append('practice_document_type_id',practiceDocumentID)
              await this.$axios.post( '/api/v1/admin/practice-documents',formData,{
                headers: {
                  'Content-Type': 'multipart/form-data'
                },     
              }).then(function(){
                  this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Success!' })
                  // alert('SUCCESS!!')
                  console.log("nice!")
              }).catch(function(){
                console.log('FAILURE!!');
              });
            }
        }else{
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'alert', text: 'Please choose a file to upload first.' })
          // alert('Please choose a file to upload first.')
        }
      }catch(err){
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'alert', text: 'Something went wrong!' })
        // alert('Something went wrong!')
        console.log("index practices index _id index asyncData err", err);
      }
    },

    handleFileUpload(refName, documentId){
      console.log('qwe', this.$refs[refName][0], refName)

      const el = this.$refs[refName][0]

      console.log('sad', el, el.files)

      if (el.files && el.files.length === 0) {
        return
      }

      const file = el.files[0]

      const fileReader = new FileReader()

      fileReader.addEventListener('load', () => {
        console.log('z', fileReader.result)
      })

      fileReader.readAsDataURL(file)

      const index = this.files.findIndex(({ id }) => id === documentId)

      if (index > -1) {
        this.files.splice(index, 1, {
          id: documentId,
          file
        })
      } else {
        this.files.push({
          id: documentId,
          file
        })
      }
      this.fileIsUploadable = 'true'
    }
  }
}
</script>

<style>
button:focus{
  outline: none;
}
#file{
color: transparent;
}
.page-overlap{
    width: calc(100% - 70px);
  }

  @media screen and (min-width: 1200px) {
    .page-overlap{
      width: calc(100% - 200px);
    }
  }
</style>