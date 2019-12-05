<template>
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout overflow-auto">
     <!--^Removed the ff code: style="width: calc(100% - 70px);" -->
      <!-- HEADER -->
      <div class="flex text-sm text-white py-6 px-6">
        <nuxt-link
          :to="{path:`/practices/${practice.id}/practice-documents`,query}"
          class="text-white hover:text-yellow-500 p-1 mr-4"
        >
          <svgicon
            name="arrow-left-solid"
            height="32"
            width="32"
            class="hover:text-yellow-500 fill-current"
          />
        </nuxt-link>

        <div class="text-white hover:text-black hover:bg-yellow-500 rounded-lg inline-flex py-2 px-4 cursor-pointer">
          <a
            @click.prevent="downloadItem(practiceDoc.file.url, practiceDoc.file.filename)" 
            class="inline-flex items-center font-bold text-white rounded-lg">
             <svgicon
              name="cloud-download"
              width="21"
              height="21"
              color="transparent white"
              hover ="transparent black"
            ></svgicon>
            <span class="ml-2">Download</span>
          </a>
         
        </div>
      </div>
      <!-- HEADER -->
      <!-- BODY -->
      <div class="shadow-lg rounded-lg bg-waterloo mx-6 mb-6 p-4">
        <div class="w-full inline-flex flex-wrap md:flex-no-wrap md:flex-row flex-col-reverse text-sm">
          <div class="text-gray-400 m-2">
            <p class="mr-20">Title</p>
            <p class="text-white">{{practiceDoc.practice_document_type ? practiceDoc.practice_document_type.name: null}}</p>
            <p class="mt-5 mr-20">Practice</p>
            <p class="text-white">{{practiceDoc.practice ? practiceDoc.practice.surgery.name: null}}</p>
            <p class="mt-5 mr-20">File last uploaded</p>
            <p class="text-white">{{practiceDoc.file ? $moment(practiceDoc.file.created_at).format('DD/MM/YYYY HH:mm:ss') : null}}</p>
          </div>
          <div class="flex flex-col text-gray-400 md:m-2 lg:w-3/4">
            <p class="md:mr-20 pb-2">File</p>
            <div class="w-full">
              <embed class="object-contain w-full"
              :class="practiceDoc.file.type == 'image' ? 'image object-left-top' : 'object-top document h-full'"
              :src="practiceDoc.file.subtype === 'tiff' || practiceDoc.file.subtype === 'msword' ? convertDoc(practiceDoc.file.url) : practiceDoc.file.url"
              >
            </div>
          </div>
        </div>
      </div>
      <!-- BODY -->
    </div>
</template>

<script>
export default {
    props:['practiceDoc'],
        
    data() {
        return {
            practice:null,
            query:null
        };
    },

    created(){
        this.practice = this.practiceDoc.practice,
        this.query = {
        ...this.$route.query
        }
        console.log(this.practiceDoc)
    },

    computed: {
      authAdminPermissions() {
        return this.$store.getters["auth/permissions"]
      },
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
          }).catch(err=>{
            this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: err.response.data.message })
            console.log('download file error',err)
          });
      },  
      convertDoc(document) {
        return `https://docs.google.com/gview?url=${document}&embedded=true`;
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
  .document {
    width: 100%;
    min-height: 50vh;
  }

  .image {
    min-height: 100%;
    max-height: 100%;
  }

  @media screen and (min-width: 768px) {
    .document {
      min-height: 70vh;
    }

    .image {
      min-height: 60vh;
      max-height: 60vh;
    }
  }
</style>