<template>
	<div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
		<div style="width: calc(100%);" class="flex-1 flex flex-col self-end bg-trout shadow-lg">
		
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
                  class="hover:bg-grey rounded-lg p-3 text-white text-sm"
                  :to="{path:`/practices/${specificPractice.id}`,query: $route.query}">
                  <strong>Practice</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-grey rounded-lg p-3 text-white text-sm"
                  :to="{path:`/practices/${specificPractice.id}/surgeries`,query: $route.query}">
                  <strong>Surgeries</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-grey rounded-lg p-3 text-white text-sm"
                  :to="{path:`/practices/${specificPractice.id}/sessions/available`,query: $route.query}">
                  <strong>Sessions</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-grey rounded-lg p-3 text-white text-sm"
                  :to="{path:`/practices/${specificPractice.id}/users`,query: $route.query}">
                  <strong>Users</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="bg-grey-dark hover:bg-grey rounded-lg p-3 text-white text-sm"
                  :to="{path:`/practices/${specificPractice.id}/documents`,query: $route.query}">
                  <strong>Documents</strong>
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--DEFAULT TABS END HERE-->
		
		<!--TAB 5-->
        <div class="flex flex-col rounded-lg p-6 sm:p-6">
          <div class="flex flex-col">
            <!-- HEADER -->
            <div class="flex my-2">
              <div style="width: 20%;">
                <div class="flex text-white text-sm p-4">
                  <strong>Title</strong>
                </div>
              </div>
              <div style="width: 20%;">
                <div class="flex text-white text-sm p-4">
                  <strong>File Size</strong>
                </div>
              </div>
              <div style="width: 20%">
                <div class="flex text-white text-sm p-4">
                  <strong>Last Upload Date</strong>
                </div>
              </div>
              <div style="width: 25%">
                <div class="flex text-white text-sm p-4">
                  <strong>Upload New File</strong>
                </div>
              </div>
            </div>
          </div>
          <div
            v-for="(document,index) in specificPracticeDocumentTypes"
            :key="`surgery-${index}`"
            class="flex no-underline rounded-lg bg-waterloo my-2"
          >
            <div style="width: 20%;">
              <div class="flex text-white text-sm p-4">
                <span>{{ document.practiceDocType ? document.practiceDocType.name:null }}</span>
              </div>
            </div>
            <div style="width: 20%;">
              <div class="flex text-white text-sm p-4">
                <span>{{ document.practiceSpecificDoc && document.practiceSpecificDoc.file ? (document.practiceSpecificDoc.file.size / 1048576).toFixed(2) + " Mb":null }}</span>
              </div>
            </div>
            <div style="width: 20%;">
              <div class="flex text-white text-sm p-4">
                <span>{{ document.practiceSpecificDoc ? $moment(document.practiceSpecificDoc.created_at).format('MMM D, YYYY | hh:mm A'):null}}</span>
              </div>
            </div>
             <div style="width:25%;">
              <div class="flex text-white text-sm p-4">
                <label>File
                  <input 
                    type="file" 
                    id="file" 
                    :ref="`file-${document.practiceDocType.id}`" 
                    v-on:change="handleFileUpload(`file-${document.practiceDocType.id}`, document.practiceDocType.id)"/>
                </label>
              </div>
            </div>
            <div style="width:20%;">
              <div class="flex text-white text-sm p-4">
                <button class="bg-green rounded-full p-1 text-white lg:px-8 sm:px-2" v-on:click="submitFile(specificPractice.id, document.practiceDocType.id, document.practiceSpecificDoc)">
                <svgicon
                  name="cloud-upload"
                  width="21"
                  height="21"
                  color="transparent white"
                ></svgicon> 
                <span>{{document.practiceSpecificDoc && document.practiceSpecificDoc.file ? "Update":"Upload"}}</span>
              </button>
              </div>
            </div>
          </div>
        </div>
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
      
      
    };
  },

  async asyncData({ app, route }) {
    try {
      let response = await app.$axios.get(`/api/v1/admin/practices/${route.params.id}`)
      const specificPractice = response.data.data.practice
      const surgeries = response.data.data.practice.surgery
      
      response = await app.$axios.get(`/api/v1/admin/practice-document-types`)
      const practiceDocTypes = response.data.data.practice_document_types

      response = await app.$axios.get(`/api/v1/admin/practice-documents`)
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
    submitFile(practiceID, practiceDocumentID, practiceSpecificDocument){
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
              
              this.$axios.put(`/api/v1/admin/practice-documents/${practiceSpecificDocument.id}`,formData,{
                headers: {
                  'Content-Type': 'multipart/form-data'
                },     
              }).then(function(){
                  alert('SUCCESS!!')
              }).catch(function(){
                console.log('FAILURE!!');
              });
            }else{
              console.log("its nothing")
              formData.append('file', file)
              formData.append('practice_id',practiceID)
              formData.append('practice_document_type_id',practiceDocumentID)
              this.$axios.post( '/api/v1/admin/practice-documents',formData,{
                headers: {
                  'Content-Type': 'multipart/form-data'
                },     
              }).then(function(){
                  alert('SUCCESS!!')
              }).catch(function(){
                console.log('FAILURE!!');
              });
            }
        }else{
          alert('Please choose a file to upload first.')
        }
      }catch(err){
        alert('Something went wrong!')
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

      }
  }
}
</script>

<style>

</style>