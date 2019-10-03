<template>
	<div class="absolute top-0 bottom-0 right-0 left-0 flex flex-col">
		<div class="page-overlap flex-1 flex flex-col self-end bg-trout shadow-lg">
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
                  class="hover:bg-gray rounded-lg p-3 text-white text-sm"
                  :to="{path:`/practices/${specificPractice.id}`,query: $route.query}">
                  <strong>Practice</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-gray rounded-lg p-3 text-white text-sm"
                  :to="{path:`/practices/${specificPractice.id}/surgeries`,query: $route.query}">
                  <strong>Surgeries</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                  <nuxt-link
                    class="bg-gray-dark hover:bg-gray rounded-lg p-3 text-white text-sm"
                    :to="{path:`/practices/${specificPractice.id}/sessions`,query: $route.query}">
                    <strong>Sessions</strong>
                  </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-gray rounded-lg p-3 text-white text-sm"
                  :to="{path:`/practices/${specificPractice.id}/users`,query: $route.query}">
                  <strong>Users</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-gray rounded-lg p-3 text-white text-sm"
                  :to="{path:`/practices/${specificPractice.id}/documents`,query: $route.query}">
                  <strong>Documents</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-gray rounded-lg p-3 text-white text-sm no-underline"
                  :to="{path:`/practices/${specificPractice.id}/rates`,query: $route.query}">
                  <strong>Rates</strong>
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
              class="bg-gray-dark hover:bg-gray-darker rounded-lg py-3 px-4 text-white text-sm"
              :to="{path:`/practices/${specificPractice.id}/sessions/available`,query:$route.query}"
            >
              <strong>Available</strong>
            </nuxt-link>
          </div>
          <div class="my-1 px-1">
            <nuxt-link
              class="bg-gray-dark hover:bg-gray-darker rounded-lg py-3 px-4 text-white text-sm"
              :to="{path:`/practices/${specificPractice.id}/sessions/applied`,query:$route.query}"
            >
              <strong>Applied</strong>
            </nuxt-link>
          </div>
          <div class="my-1 px-1 overflow-</b-tabs>hidden">
            <nuxt-link
              class="bg-gray-dark hover:bg-gray-darker rounded-lg py-3 px-4 text-white text-sm"
              :to="{path:`/practices/${specificPractice.id}/sessions/current`,query:$route.query}"
            >
              <strong>Current</strong>
            </nuxt-link>
          </div>
          <div s class="my-1 px-1">
            <nuxt-link
              class="bg-gray-dark hover:bg-gray-darker rounded-lg py-3 px-4 text-white text-sm"
              :to="{path:`/practices/${specificPractice.id}/sessions/completed`,query:$route.query}"
            >
              <strong>Completed</strong>
            </nuxt-link>
          </div>
          <div class="my-1 px-1">
            <nuxt-link
              class="bg-gray-dark hover:bg-gray-darker rounded-lg py-3 px-4 text-white text-sm"
              :to="{path:`/practices/${specificPractice.id}/sessions/unfilled`,query:$route.query}"
            >
              <strong>Unfilled</strong>
            </nuxt-link>
          </div>
          <div class="my-1 px-1">
            <nuxt-link
              class="bg-gray-dark hover:bg-gray-darker rounded-lg py-3 px-4 text-white text-sm"
              :to="{path:`/practices/${specificPractice.id}/sessions/cancelled`,query:$route.query}"
            >
              <strong>Cancelled</strong>
            </nuxt-link>
          </div>
          <div class="my-1 px-1">
            <nuxt-link
              class="bg-gray-dark hover:bg-gray-darker rounded-lg py-3 px-4 text-white text-sm"
              :to="{path:`/practices/${specificPractice.id}/sessions/declined`,query:$route.query}"
            >
              <strong>Declined</strong>
            </nuxt-link>
          </div>
        </div>
      </div>
      <!--INTERNAL TABS END HERE-->
      <span class="text-white ">Sessions Tab</span>
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
.page-overlap{
    width: calc(100% - 70px);
  }

  @media screen and (min-width: 1200px) {
    .page-overlap{
      width: calc(100% - 200px);
    }
  }
</style>