<template>
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
          <span class="break-all">{{ document.practiceSpecificDoc && document.practiceSpecificDoc.created_at ? $moment(document.practiceSpecificDoc.updated_at ? document.practiceSpecificDoc.updated_at : document.practiceSpecificDoc.created_at).format('MMM D, YYYY | hh:mm A'):null }}</span>
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
                    v-on:change="handleFileUpload(`file-${document.practiceDocType.id}`, document.practiceDocType.id, practice.id, document.practiceDocType.id, document.practiceSpecificDoc)"/>
                  </label>
                </div>
              </div>
              <div v-if="document.practiceSpecificDoc" 
              class="flex text-white text-sm py-2 md:py-4 md:px-4">
                <nuxt-link 
                :to="{path:`/practices/${practice.id}/practice-documents/${document.practiceSpecificDoc ? document.practiceSpecificDoc.id: null}`,query}"
                class="bg-blue flex items-center text-center rounded-full text-white no-underline px-4 py-2">
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
</template>

<script>
export default{
    props:['practice'],
    data() {
        return {
          file:'',
          // specificPracticeDocumentTypes:[],
          files: [],
          practiceDocTypes:[],
          practiceDocs:[],
          query:null
        };
    },
    created(){
      this.query = {
      ...this.$route.query
      },
      this.getData()
    },
    computed:{
      specificPracticeDocumentTypes(){
        return this.$store.state.practices.specificPracticeDocumentTypes
      }
    },

  methods:{
    async getData(){
      try{
        const pracDocTypes = await this.$axios.$get(`/api/v1/admin/practice-document-types`).then(res=>{
            this.practiceDocTypes = res.data.practice_document_types
        }).catch(err=>{
          store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
        })
        console.log("practice doc",this.practiceDocTypes)
        this.practiceDocs = await this.$axios.$get(`/api/v1/admin/practice-documents`,{
            params: {
                practice_id: this.practice.id
            }
        })
        console.log('prac docs',this.practiceDocs.data.practice_documents)

        const specificPracticeDocumentTypes = this.practiceDocTypes.map((practiceDocType)=>{
          const practiceSpecificDoc = this.practiceDocs.data.practice_documents.find((practiceDoc) => {
            return practiceDoc.practice_document_type.id === practiceDocType.id
          })
          return{
            practiceDocType,
            practiceSpecificDoc
          }
        })
        await this.$store.commit('practices/SET_PRACTICE_DOCUMENTS', specificPracticeDocumentTypes)
      }catch(err){
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
      }
    },
    async handleFileUpload(refName, documentId, practiceID, practiceDocumentID, practiceSpecificDocument){
      await console.log("Infos uploaded: \n","refname: ",refName,"docID: ",documentId,"prac id: ",practiceID, "prac docid: ",practiceDocumentID,"prac document: ",practiceSpecificDocument)
      this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'upload', text: 'Uploading' })
      const el = this.$refs[refName][0]
      if (el.files && el.files.length === 0) {
        return
      }
      const file = el.files[0]

      const fileReader = new FileReader()

      // fileReader.addEventListener('load', () => {
      //   console.log('z', fileReader.result)
      // })

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
      
      try{
        let formData = new FormData()
        let file = this.files.find(({ id }) => id === practiceDocumentID)
        if (file) {
            file = file.file
            console.log("practice id: "+practiceID+"practice doc id: "+practiceDocumentID)
            console.log(file)
        
            if(practiceSpecificDocument){
              console.log('File exists: PUT Request (Updates Existing)')
              console.log(practiceSpecificDocument)

              formData.append('practice_document_id',practiceID)
              formData.append('file', file)
              
              const response = await this.$axios.put(`/api/v1/admin/practice-documents/${practiceSpecificDocument.id}`,formData,{
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  },
                }).then(async() => {
                  console.log("practice doc",this.practiceDocTypes)
                  this.practiceDocs = await this.$axios.$get(`/api/v1/admin/practice-documents`,{
                      params: {
                          practice_id: this.practice.id
                      }
                  })
                  console.log('prac docs',this.practiceDocs.data.practice_documents)

                  let specificPracticeDocumentTypes = this.practiceDocTypes.map((practiceDocType)=>{
                    const practiceSpecificDoc = this.practiceDocs.data.practice_documents.find((practiceDoc) => {
                      return practiceDoc.practice_document_type.id === practiceDocType.id
                    })
                    return{
                      practiceDocType,
                      practiceSpecificDoc
                    }
                  })
                  await this.$store.commit('practices/SET_PRACTICE_DOCUMENTS', specificPracticeDocumentTypes)
                  console.log('practice docs',specificPracticeDocumentTypes)
                  this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Upload Success' })
                })
                .catch(err => {
                  this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
                  console.log(err);
                });
            }else{
              console.log('File does not exist: POST Request (Posts new file)')
              formData.append('file', file)
              formData.append('practice_id',practiceID)
              formData.append('practice_document_type_id',practiceDocumentID)

              const response = await this.$axios.post( '/api/v1/admin/practice-documents',formData,{
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  },     
                }).then(async() => {
                  console.log("practice doc",this.practiceDocTypes)
                  this.practiceDocs = await this.$axios.$get(`/api/v1/admin/practice-documents`,{
                      params: {
                          practice_id: this.practice.id
                      }
                  })
                  console.log('prac docs',practiceDocs.data.practice_documents)

                  let specificPracticeDocumentTypes = this.practiceDocTypes.map((practiceDocType)=>{
                    const practiceSpecificDoc = this.practiceDocs.data.practice_documents.find((practiceDoc) => {
                      return practiceDoc.practice_document_type.id === practiceDocType.id
                    })
                    return{
                      practiceDocType,
                      practiceSpecificDoc
                    }
                  })
                  await this.$store.commit('practices/SET_PRACTICE_DOCUMENTS', specificPracticeDocumentTypes)
                  this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Success!' })
                })
                .catch(err => {
                  this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
                  console.log(err);
                });
              }
        }else{
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'alert', text: 'Please choose a file to upload first.' })
        }
      }catch(err){
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
        console.log("index practices index _id index asyncData err", err);
      }
    },
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
.practice-document-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.practice-document-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px orange;
  transition: all 0.3s ease-in-out;
  background-color:#505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .practice-document-modal {
    width: 70%;
  }
}

  
</style>