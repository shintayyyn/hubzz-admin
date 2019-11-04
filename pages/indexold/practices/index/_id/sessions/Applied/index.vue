<template>
	<div class="absolute top-0 bottom-0 right-0 left-0 flex flex-col">
		<div class="page-overlap flex-1 flex flex-col self-end bg-trout shadow-lg">
		
		<!-- HEADER -->
		<div class="flex justify-between text-sm text-white py-2 px-6">
			<nuxt-link :to="{path:`/practices`,query: $route.query }" class="text-white p-1">
			<svgicon name="arrow-left-solid" height="32" width="32" class="text-white hover:text-sunglow fill-current"/>
			</nuxt-link>
		</div>
      <!-- DEFAULT TABS -->
      <div class="flex flex-col rounded-lg pl-6 mt-2 " >
        <div class="w-full">
          <div class="flex flex-wrap -mx-1">
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-gray rounded-lg p-3 text-white text-sm no-underline"
                  :to="{path:`/practices/${specificPractice.id}`,query: $route.query}">
                  <strong>Practice</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-gray rounded-lg p-3 text-white text-sm no-underline"
                  v-if="!specificPractice.practice_parent"
                  :to="{path:`/practices/${specificPractice.id}/surgeries`,query: $route.query}">
                  <strong>Surgeries</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="bg-gray-dark hover:bg-gray rounded-lg p-3 text-white text-sm no-underline"
                  :to="{path:`/practices/${specificPractice.id}/sessions/available`,query: $route.query}">
                  <strong>Sessions</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-gray rounded-lg p-3 text-white text-sm no-underline"
                  :to="{path:`/practices/${specificPractice.id}/users`,query: $route.query}">
                  <strong>Users</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="hover:bg-gray rounded-lg p-3 text-white text-sm no-underline"
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
      </div>
      <!--DEFAULT TABS END HERE-->

       <!--INTERNAL TABS-->
      <div class="flex flex-col rounded-lg p-6 sm:p-6">
        <div class="flex flex-wrap -mx-1">
          <div class="my-1 px-1">
            <nuxt-link
              class="hover:bg-gray-darker rounded-lg py-3 px-4 text-white text-sm no-underline"
              :to="{path:`/practices/${specificPractice.id}/sessions/available`,query:$route.query}"
            >
              <strong>Available</strong>
            </nuxt-link>
          </div>
          <div class="my-1 px-1">
            <nuxt-link
              class="bg-gray-dark hover:bg-gray-darker rounded-lg py-3 px-4 text-white text-sm no-underline"
              :to="{path:`/practices/${specificPractice.id}/sessions/applied`,query:$route.query}"
            >
              <strong>Applied</strong>
            </nuxt-link>
          </div>
          <div class="my-1 px-1 overflow-</b-tabs>hidden">
            <nuxt-link
              class="hover:bg-gray-darker rounded-lg py-3 px-4 text-white text-sm no-underline"
              :to="{path:`/practices/${specificPractice.id}/sessions/current`,query:$route.query}"
            >
              <strong>Current</strong>
            </nuxt-link>
          </div>
          <div s class="my-1 px-1">
            <nuxt-link
              class="hover:bg-gray-darker rounded-lg py-3 px-4 text-white text-sm no-underline"
              :to="{path:`/practices/${specificPractice.id}/sessions/completed`,query:$route.query}"
            >
              <strong>Completed</strong>
            </nuxt-link>
          </div>
          <div class="my-1 px-1">
            <nuxt-link
              class="hover:bg-gray-darker rounded-lg py-3 px-4 text-white text-sm no-underline"
              :to="{path:`/practices/${specificPractice.id}/sessions/unfilled`,query:$route.query}"
            >
              <strong>Unfilled</strong>
            </nuxt-link>
          </div>
          <div class="my-1 px-1">
            <nuxt-link
              class="hover:bg-gray-darker rounded-lg py-3 px-4 text-white text-sm no-underline"
              :to="{path:`/practices/${specificPractice.id}/sessions/cancelled`,query:$route.query}"
            >
              <strong>Cancelled</strong>
            </nuxt-link>
          </div>
          <div class="my-1 px-1">
            <nuxt-link
              class="hover:bg-gray-darker rounded-lg py-3 px-4 text-white text-sm no-underline"
              :to="{path:`/practices/${specificPractice.id}/sessions/declined`,query:$route.query}"
            >
              <strong>Declined</strong>
            </nuxt-link>
          </div>
        </div>
      </div>
      <!--INTERNAL TABS END HERE-->

       <!-- TABLE -->
      <div class="mx-6">
          <div class="flex flex-col">
             <!-- HEADER -->
            <div class="flex my-2">
                <div style="width: 20%;">
                    <div class="flex text-white text-sm p-4">
                    <strong>Job number</strong>
                    </div>
                </div>
                <div style="width: 15%;">
                    <div class="flex text-white text-sm p-4">
                    <strong>Practice / Surgery</strong>
                    </div>
                </div>
                <div style="width: 15%;">
                    <div class="flex text-white text-sm p-4">
                    <strong>Title</strong>
                    </div>
                </div>
                <div style="width: 16%;">
                    <div class="flex text-white text-sm p-4">
                    <strong>From</strong>
                    </div>
                </div>
                <div style="width: 16%;">
                    <div class="flex text-white text-sm p-4">
                    <strong>To</strong>
                    </div>
                </div>
                <div style="width: 16%;">
                    <div class="flex text-white text-sm p-4">
                    <strong>Created</strong>
                    </div>
                </div>
            </div>
            <!-- HEADER -->

              <!-- BODY -->
              <nuxt-link
              v-for="(practiceAppliedJob, index) in practiceAppliedJobs"
              :key="`practiceAppliedJob-${index}`"
              :to="`/practices/${specificPractice.id}/sessions/view-job/${practiceAppliedJob.id}`"
              class="flex no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light mt-2"
              >
                  <div style="width: 20%;">
                      <div class="flex text-white text-sm p-4">
                          <span>{{ practiceAppliedJob.job_number }}</span>
                      </div>
                  </div>
                  <div style="width: 15%;">
                      <div class="flex text-white text-sm p-4">
                          <span>{{ practiceAppliedJob.platform_job.practice.surgery.name }}</span>
                      </div>
                  </div>
                  <div style="width: 15%;">
                    <div class="flex text-white text-sm p-4">
                        <span>{{ practiceAppliedJob.title }}</span>
                    </div>
                  </div>
                  <div style="width: 16%;">
                      <div class="flex text-white text-sm p-4">
                          <span>{{ practiceAppliedJob.date_start }}</span>
                      </div>
                  </div>
                  <div style="width: 16%;">
                      <div class="flex text-white text-sm p-4">
                          <span>{{ practiceAppliedJob.date_end }}</span>
                      </div>
                  </div>
                  <div style="width: 16%;">
                    <div class="flex text-white text-sm p-4">
                        <span>{{ practiceAppliedJob.platform_job.date_created }}</span>
                    </div>
                  </div>
               
              </nuxt-link>
              <!-- BODY -->
          </div>
      </div>
      <!--TABLE ENDS HERE-->
      <!-- PAGINATION -->
      <div v-if="practiceJobPageCount > 1">
        <button class="p-2 m-1 rounded-lg border text-sm text-white hover:bg-waterloo-light" @click="goToPage(activePage - 1)">Prev</button>
        <button class="p-2 m-1 rounded-lg border text-sm text-white hover:bg-waterloo-light" :class="`${activePage === practiceJobPage ? 'bg-waterloo' : ''}`" v-for="practiceJobPage in practiceJobPageCount" :key="`practiceJobPage-${practiceJobPage}`" v-if="showPage(practiceJobPage)" @click="goToPage(practiceJobPage)">{{ practiceJobPage }}</button>
        <button class="p-2 m-1 rounded-lg border text-sm text-white hover:bg-waterloo-light" @click="goToPage(activePage + 1)">Next</button>																									<!-- ^ Removed the FF. code in this area: v-if="showPage(practiceJobPage) TAKE A NOTE OF THIS"-->
      </div>
      <!-- PAGINATION -->  
		</div>
		<nuxt-child/>
	</div>
</template>

<script>
export default{
	transition: "subpracticeJobPage",
  watchQuery: [
	'practiceJobPage',
	],


  async asyncData({ app, route }) {
    try {
      let {
        practiceJobPage = 1,
        search = ''
      } = route.query
      practiceJobPage = parseInt(practiceJobPage)
      const limit = 10
      const offset = practiceJobPage * limit - limit
      const order_by = 'created_at:desc'
      const params = { limit, offset, order_by }

      let response = await app.$axios.get(`/api/v1/admin/practices/${route.params.id}`,{ params })
      const specificPractice = response.data.data.practice
      const surgeries = response.data.data.practice.surgery

      response = await app.$axios.get(`/api/v1/admin/jobs?practice_id=${route.params.id}&status=Applied`,{ params })
      const practiceAppliedJobs = response.data.data.jobs
      
      response = await app.$axios.get(`/api/v1/admin/jobs/count?practice_id${route.params.id}&status=Applied`,{ params })
      const itemCount = response.data.data.count

      console.log(practiceAppliedJobs)

      return{
        loading: false,
        itemsPerPage: limit,
        itemCount,
        activePage: practiceJobPage,
        specificPractice,
        practiceAppliedJobs
        
      }
    } catch (err) {
      console.log("index practices index _id index asyncData err", err);
    }
  },

  data() {
    return {
      loading: false,
      itemsPerPage: 10,
      itemCount: 0,
      activePage: 1,
      specificPractice:[],
      practiceAppliedJobs:[]
    };
  },

  computed: {
  		practiceJobPageCount() {
  			return Math.ceil(this.itemCount / this.itemsPerPage)
  		},

	    showPage() {
	      return practiceJobPage => {
	        if (practiceJobPage === 1) {
	          return true
	        }

	        if (practiceJobPage === this.practiceJobPageCount) {
	          return true
	        }

	        if (practiceJobPage === this.activePage) {
	          return true
	        }

	        if (practiceJobPage === this.activePage + 1) {
	          return true
	        }

	        if (practiceJobPage === this.activePage - 1) {
	          return true
	        }

	        if (this.activePage === 1 && practiceJobPage < 5) {
	          return true
	        }

	        if (this.activePage === this.practiceJobPageCount && practiceJobPage > this.practiceJobPageCount - 4) {
	          return true
	        }

	        if (this.activePage === 2 && practiceJobPage === 4) {
	          return true
	        }

	        if (this.activePage === this.practiceJobPageCount - 1 && practiceJobPage === this.practiceJobPageCount - 3) {
	          return true
	        }

	        return false
	      }
	    }
    },

    methods: {
  		goToPage(practiceJobPage) {
  			if (practiceJobPage < 1) {
  				return
  			}

  			if (practiceJobPage > this.practiceJobPageCount) {
  				return
  			}

  			const query = {
  				...this.$router.query,
  				practiceJobPage
  			}

  			if (practiceJobPage === 1) {
  				delete query.practiceJobPage
  			}

	      if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
	        this.loading = true
	      }

	      this.$router.push({ query })
      },
    }
}
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