<template>
  <div class="flex-1 flex flex-col overflow-hidden py-2 px-6">
    <div class="text-4xl text-white">Dashboard</div>
    <div class="text-sm font-hairline text-white">Work in progress</div>
    <div class="flex flex-wrap text-white -mx-1 sm:-mx-2">
        <!------------------------------ Column 1 -------------------------------->
        <div class="my-1 p-3 md:w-1/3 w-full">
            <div class='m-3'>
                Locums
            </div>
            <div class="overflow-y-auto overflow-x-hidden px-2" style="max-height: 500px;">
                <nuxt-link
                v-for="(item,index) in locumDocsAlert" 
                :key="`item-${index}`" 
                :to="{path:`/locums/${item.locum_detail.user.id}/locum-compliance/${item.compliance_document.id}`}"
                class="inline-block w-full p-3 mb-2 shadow-md text-white bg-waterloo hover:bg-waterloo-light rounded-lg ">
                    <div class="font-hairline">
                        {{$moment(item.uploaded_at).format('MMMM DD, YYYY | HH:mm')}}
                    </div>
                    <div class="w-full flex flex-col sm:my-1 sm:px-1">
                        <span>Locum </span>
                        <span class="font-bold">{{item.locum_detail.user.personal_detail.name}}</span>
                        <span>Uploaded Compliance Document</span>
                        <span class="font-bold">{{item.compliance_document.name}}</span>
                    </div>
                </nuxt-link>
            </div>
            <div class='m-3'>
                Activity Log
            </div>
            <div class="p-2 m-3 shadow-md bg-waterloo hover:bg-waterloo-light rounded-lg ">
                <div class="flex flex-wrap overflow-hidden sm:-mx-1">
                    <div class="w-full overflow-hidden sm:my-1 sm:px-1">
                        <p class="text-white text-center">Work In Progress.</p>
                    </div>
                </div>
            </div>
        </div>
        <!------------------------------ Column 2 ------------------------------>
        <div class="my-1 p-3 md:w-1/3 w-full overflow-hidden sm:my-2 sm:px-2">
            <div class='m-3'>
                Practices
            </div> 
            <div class="border-b border-white">
                <div class="p-2 m-3 shadow-md bg-waterloo hover:bg-waterloo-light rounded-lg">
                    <div class="flex flex-wrap overflow-hidden sm:-mx-1">
                        <div class="w-full overflow-hidden sm:my-1 sm:px-1">
                            <p class="text-white text-center">Work In Progress </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class='m-3'>
                Activity Log
            </div>
            <div class="p-2 m-3 shadow-md bg-waterloo hover:bg-waterloo-light rounded-lg ">
                
                <div class="flex flex-wrap overflow-hidden sm:-mx-1">
                    <div class="w-full overflow-hidden sm:my-1 sm:px-1">
                        <p class="text-white text-center">Work In Progress.</p>
                    </div>
                </div>
            </div>
        </div>
        <!------------------------------ Column 3 ----------------------------->
        <div class="my-1 p-3 md:w-1/3 w-full overflow-hidden sm:my-2 sm:px-2">
            <div class='m-3'>
                Billings
            </div>
            <div class="border-b border-white ">
                <div class="p-2 m-3 shadow-md bg-waterloo hover:bg-waterloo-light rounded-lg ">
                    
                    <div class="flex flex-wrap overflow-hidden sm:-mx-1">
                        <div class="w-full overflow-hidden sm:my-1 sm:px-1">
                            <p class="text-white text-center">Work In Progress.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class='m-3'>
                Activity Log
            </div>
            <div class="p-2 m-3 shadow-md bg-waterloo hover:bg-waterloo-light rounded-lg ">
                
                <div class="flex flex-wrap overflow-hidden sm:-mx-1">
                    <div class="w-full overflow-hidden sm:my-1 sm:px-1">
                        <p class="text-white text-center">Work In Progress.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
    data() {
        return{
        }
    },
    computed:{
      locumDocsAlert(){
          return this.$store.state.locums.locumDocAlert
      }
    },
    async asyncData({app, store, route}){
      try{
        let response = await app.$axios.$get(`/api/v1/admin/locum-detail-compliance-documents`)
        const locumDocAlert = response.data.locum_detail_compliance_documents

        await store.commit('locums/SET_LOCUM_DOC_ALERT', locumDocAlert)
      }catch(err){
        store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
        console.log('Get locums error!', err)
      }
    }
}
</script>
