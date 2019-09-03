<template>
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout overflow-auto">
     <!--^Removed the ff code: style="width: calc(100% - 70px);" -->
      <!-- HEADER -->
      <div class="flex text-sm text-white py-6 px-6">
        <nuxt-link
          :to="{path:`/practices/${practice.id}/practice-documents`,query}"
          class="text-white hover:text-yellow-dark p-1 mr-4"
        >
          <svgicon
            name="arrow-left-solid"
            height="32"
            width="32"
            class="hover:text-yellow-dark fill-current"
          />
        </nuxt-link>

        <div class="text-white hover:text-black hover:bg-yellow-dark rounded-lg inline-flex p-2">
          <a
            @click.prevent="downloadItem(practiceDoc.file.url, practiceDoc.file.filename)" 
            class="inline-flex items-center text-white hover:text-black hover:bg-yellow-dark rounded-lg mr-4">
             <svgicon
              name="cloud-download"
              width="21"
              height="21"
              color="transparent white"
              hover ="transparent black"
            ></svgicon>
            <span class="mx-1 mt-1">Download</span>
          </a>
         
        </div>
      </div>
      <!-- HEADER -->
      <!-- BODY -->
      <div class="shadow-lg rounded-lg bg-waterloo mx-6 mt-10 p-4">
        <div class="w-full inline-flex flex-wrap md:flex-no-wrap md:flex-row flex-col-reverse text-sm">
          <div class="text-grey m-2">
            <p class="mr-20">Title</p>
            <p class="text-white">{{practiceDoc.practice_document_type ? practiceDoc.practice_document_type.name: null}}</p>
            <p class="mt-5 mr-20">Practice</p>
            <p class="text-white underline">{{practiceDoc.practice ? practiceDoc.practice.surgery.name: null}}</p>
            <p class="mt-5 mr-20">File last uploaded</p>
            <p class="text-white underline">{{practiceDoc.file ? $moment(practiceDoc.file.created_at).format('DD/MM/YYYY HH:mm:ss') : null}}</p>
          </div>
          <div class="flex flex-col text-grey md:m-2">
            <p class="md:mr-20">File</p>
             <embed class="w-full my-2" style="max-width: 800px"
              :src="practiceDoc.file ? practiceDoc.file.url:null"
              >
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

    computed:{
        
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
              this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
              console.log('download file error',err)
            });
        },  
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