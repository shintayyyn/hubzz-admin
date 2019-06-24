<template>
	<div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
		<div style="width: calc(100%);" class="flex-1 flex flex-col self-end bg-trout shadow-lg">
		
		<!-- HEADER -->
		<div class="flex justify-between text-sm text-white py-2 px-6">
			<nuxt-link :to="{path:`/practices`,query: $route.query }" class="text-white p-1">
			<svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
			</nuxt-link>
		</div>
    <!--EXTERNAL TABS-->
      <div class="flex flex-col rounded-lg pl-6 mt-2 " >
          <div class="flex flex-wrap -mx-1 ">
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-yellow rounded-lg p-3 text-white text-xs"
                  :to="{path:`/practices/${specificPractice.id}`,query: $route.query}">
                  <strong>Practice</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-yellow rounded-lg p-3 text-white text-xs"
                  :to="{path:`/practices/${specificPractice.id}/surgeries`,query: $route.query}">
                  <strong>Surgeries</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                  <nuxt-link
                    class="bg-grey-dark hover:bg-yellow rounded-lg p-3 text-white text-xs"
                    :to="{path:`/practices/${specificPractice.id}/sessions`,query: $route.query}">
                    <strong>Sessions</strong>
                  </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-yellow rounded-lg p-3 text-white text-xs"
                  :to="{path:`/practices/${specificPractice.id}/users`,query: $route.query}">
                  <strong>Users</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-yellow rounded-lg p-3 text-white text-xs"
                  :to="{path:`/practices/${specificPractice.id}/documents`,query: $route.query}">
                  <strong>Documents</strong>
                </nuxt-link>
              </div>
            </div>
          </div>
      </div>
      <!--EXTERNAL TABS END HERE-->
       <!--INTERNAL TABS-->
      <div class="flex flex-col rounded-lg p-6 sm:p-6">
        <div class="flex flex-wrap -mx-1">
          <div class="my-1 px-1">
            <nuxt-link
              class="bg-grey-dark hover:bg-grey-darker rounded-lg py-3 px-4 text-white text-xs"
              :to="{path:`/practices/${specificPractice.id}/sessions/available`,query:$route.query}"
            >
              <strong>Available</strong>
            </nuxt-link>
          </div>
          <div class="my-1 px-1">
            <nuxt-link
              class="hover:bg-grey-darker rounded-lg py-3 px-4 text-white text-xs"
              :to="{path:`/practices/${specificPractice.id}/sessions/applied`,query:$route.query}"
            >
              <strong>Applied</strong>
            </nuxt-link>
          </div>
          <div class="my-1 px-1 overflow-</b-tabs>hidden">
            <nuxt-link
              class="hover:bg-grey-darker rounded-lg py-3 px-4 text-white text-xs"
              :to="{path:`/practices/${specificPractice.id}/sessions/current`,query:$route.query}"
            >
              <strong>Current</strong>
            </nuxt-link>
          </div>
          <div s class="my-1 px-1">
            <nuxt-link
              class="hover:bg-grey-darker rounded-lg py-3 px-4 text-white text-xs"
              :to="{path:`/practices/${specificPractice.id}/sessions/completed`,query:$route.query}"
            >
              <strong>Completed</strong>
            </nuxt-link>
          </div>
          <div class="my-1 px-1">
            <nuxt-link
              class="hover:bg-grey-darker rounded-lg py-3 px-4 text-white text-xs"
              :to="{path:`/practices/${specificPractice.id}/sessions/unfilled`,query:$route.query}"
            >
              <strong>Unfilled</strong>
            </nuxt-link>
          </div>
          <div class="my-1 px-1">
            <nuxt-link
              class="hover:bg-grey-darker rounded-lg py-3 px-4 text-white text-xs"
              :to="{path:`/practices/${specificPractice.id}/sessions/cancelled`,query:$route.query}"
            >
              <strong>Cancelled</strong>
            </nuxt-link>
          </div>
          <div class="my-1 px-1">
            <nuxt-link
              class="hover:bg-grey-darker rounded-lg py-3 px-4 text-white text-xs"
              :to="{path:`/practices/${specificPractice.id}/sessions/declined`,query:$route.query}"
            >
              <strong>Declined</strong>
            </nuxt-link>
          </div>
        </div>
      </div>
      <!--INTERNAL TABS END HERE-->
      <span class="text-white ">Available Tab</span>
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
    };
  },

  async asyncData({ app, route }) {
    try {
      let response = await app.$axios.get(`/api/v1/admin/practices/${route.params.id}`)
      const specificPractice = response.data.data.practice
      const surgeries = response.data.data.practice.surgery

      console.log(surgeries)

      return{
        specificPractice,
        surgeries
      }
    } catch (err) {
      console.log("index practices index _id index asyncData err", err);
    }
  },
}
</script>

<style>

</style>