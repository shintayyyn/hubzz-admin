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
                <span>{{ document.practiceSpecificDoc ? document.practiceSpecificDoc.file.size + " Bytes":null }}</span>
              </div>
            </div>
            <div style="width: 20%;">
              <div class="flex text-white text-sm p-4">
                <span>{{ document.practiceSpecificDoc ? document.practiceSpecificDoc.created_at:null}}</span>
              </div>
            </div>
            <div style="width:25%;">
              <div class="flex text-white text-sm p-4">
                <a>
                  <svgicon
                    name="cloud-upload"
                    width="21"
                    height="21"
                    color="transparent white"
                  ></svgicon> 
                  Upload
                </a>
              </div>
            </div>
          </div>
        </div>
		

        <span class="text-white ">Documents Tab</span>
		</div>


		<nuxt-child/>

	</div>
</template>

<script>
export default{
	  transition: "subpage",

  data() {
    return {
      specificPractice:[],
      specificPracticeDocumentTypes:[]
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

      console.log(practiceDocTypes)
      console.log(practiceDocs)

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
}
</script>

<style>

</style>