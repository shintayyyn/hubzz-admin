<template>
	<div class="fixed lg:absolute pin-t pin-b pin-r pin-l flex flex-col overflow-y-auto overflow-x-hidden">
		<div style="width: calc(100%);" class="flex-1 flex flex-col self-end bg-trout shadow-lg">
      <!-- HEADER -->
      <div class="flex justify-between text-sm text-white py-2 px-2 md:px-6">
        <nuxt-link :to="{path:`/practices`,query: $route.query }" class="text-white p-1">
        <svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
        </nuxt-link>
      </div>
      <!-- DEFAULT TABS -->
      <div class="flex justify-center md:justify-start px-2 md:px-6 my-2">
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
                  v-if="!specificPractice.practice_parent"
                  :to="{path:`/practices/${specificPractice.id}/surgeries`,query: $route.query}">
                  <strong>Surgeries</strong>
                </nuxt-link>
              </div>
            </div>
            <div class="my-1 px-1">
              <div class="my-2 rounded-lg">
                <nuxt-link
                  class="bg-grey-dark hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
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
                  class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
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
      <!--DEFAULT TABS END HERE-->
      <!--INTERNAL TABS-->
      <!-- <button class="block md:hidden w-10 mx-4 focus:outline-none cursor-pointer" @click="toggleSubMenu">
        <img src="~/assets/images/hbg.png">
      </button> -->
      <div class="flex justify-center md:justify-start px-2 md:px-6 my-2">
        <div class="flex flex-wrap -mx-1">
          <div class="md:my-1 bg-grey-dark hover:bg-grey-darker rounded-lg p-4 mx-1">
            <nuxt-link
              class="text-white md:text-white text-sm no-underline"
              :to="{path:`/practices/${specificPractice.id}/sessions/available`,query:$route.query}">
              <strong>Available</strong>
            </nuxt-link>
          </div>
          <div class="md:my-1 hover:bg-grey-darker rounded-lg p-4 mx-1">
            <nuxt-link
              class="text-white text-sm no-underline"
              :to="{path:`/practices/${specificPractice.id}/sessions/applied`,query:$route.query}">
              <strong>Applied</strong>
            </nuxt-link>
          </div>
          <div class="md:my-1 hover:bg-grey-darker rounded-lg p-4 mx-1 overflow-</b-tabs>hidden">
            <nuxt-link
              class="text-white text-sm no-underline"
              :to="{path:`/practices/${specificPractice.id}/sessions/current`,query:$route.query}"
            >
              <strong>Current</strong>
            </nuxt-link>
          </div>
          <div s class="md:my-1 hover:bg-grey-darker rounded-lg p-4 mx-1">
            <nuxt-link
              class="text-white text-sm no-underline"
              :to="{path:`/practices/${specificPractice.id}/sessions/completed`,query:$route.query}">
              <strong>Completed</strong>
            </nuxt-link>
          </div>
          <div class="md:my-1 hover:bg-grey-darker rounded-lg p-4 mx-1">
            <nuxt-link
              class="text-white text-sm no-underline"
              :to="{path:`/practices/${specificPractice.id}/sessions/unfilled`,query:$route.query}">
              <strong>Unfilled</strong>
            </nuxt-link>
          </div>
          <div class="md:my-1 hover:bg-grey-darker rounded-lg p-4 mx-1">
            <nuxt-link
              class="text-white text-sm no-underline"
              :to="{path:`/practices/${specificPractice.id}/sessions/cancelled`,query:$route.query}">
              <strong>Cancelled</strong>
            </nuxt-link>
          </div>
          <div class="md:my-1 hover:bg-grey-darker rounded-lg p-4 mx-1">
            <nuxt-link
              class="text-white text-sm no-underline"
              :to="{path:`/practices/${specificPractice.id}/sessions/declined`,query:$route.query}">
              <strong>Declined</strong>
            </nuxt-link>
          </div>
        </div>
      </div>
    <!--INTERNAL TABS END HERE--> 
    <!-- TABLE -->
    <div class="table border-separate overflow-auto mx-6" style="border-spacing: 0 10px;"> 
      <!-- HEADER -->
      <div class="hidden md:table-row font-bold text-white text-sm py-4"> 
        <div class="table-cell p-2 align-middle">Job number</div> 
        <div class="table-cell p-2 align-middle">Practice / Surgery</div>
        <div class="table-cell p-2 align-middle">Title</div>
        <div class="table-cell p-2 align-middle">From</div>
        <div class="table-cell p-2 align-middle">To</div>
        <div class="table-cell p-2 align-middle">Created</div>
      </div>
      <!-- END HEADER -->
      <!-- BODY -->
      <nuxt-link 
      v-for="(practiceAvailableJob, index) in practiceAvailableJobs"
      :key="`practiceAvailableJob-${index}`"
      :to="`/practices/${specificPractice.id}/sessions/view-job/${practiceAvailableJob.id}`"
      class="flex flex-col sm:flex-row sm:flex-wrap justify-between px-2 py-2 my-2 border-l-8 border-sunglow md:border-l-0 md:table-row text-white no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light" 
      draggable="false"
      >
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
        <strong class="text-sm uppercase md:hidden">Job number</strong>
          <span class="whitespace-no-wrap">{{ practiceAvailableJob.job_number }}</span>
        </div>
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
          <strong class="text-sm uppercase md:hidden">Practice / Surgery</strong>
          <span class="break-word">{{ practiceAvailableJob.platform_job.practice.surgery.name }}</span>
        </div>
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
          <strong class="text-sm uppercase md:hidden">Title</strong>
          <span class="break-all">{{ practiceAvailableJob.platform_job.title }}</span>
        </div>
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
          <strong class="text-sm uppercase md:hidden">From</strong>
          <span class="break-all">{{ practiceAvailableJob.platform_job.date_created }}</span>
        </div>
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
          <strong class="text-sm uppercase md:hidden">To</strong>
          <span class="break-all">{{ practiceAvailableJob.platform_job.date_start }}</span>
        </div>
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell pl-1 pr-4 py-2 md:py-4 align-middle">
          <strong class="text-sm uppercase md:hidden">Created</strong>
          <span class="break-all">{{ practiceAvailableJob.platform_job.date_end }}</span>
        </div>
      </nuxt-link>
      
    </div>
    <!-- END TABLE -->
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

      response = await app.$axios.get(`/api/v1/admin/jobs?practice_id=${route.params.id}&status=Available`,{ params })
      const practiceAvailableJobs = response.data.data.jobs
      
      response = await app.$axios.get(`/api/v1/admin/jobs/count?practice_id${route.params.id}&status=Available`,{ params })
      const itemCount = response.data.data.count

      console.log(itemCount)

      return{
        loading: false,
        itemsPerPage: limit,
        itemCount,
        activePage: practiceJobPage,
        specificPractice,
        practiceAvailableJobs
        
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
      practiceAvailableJobs:[],
      subMenuOpen: true
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
      toggleSubMenu(){
        this.subMenuOpen = !this.subMenuOpen
      },
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
.md\:table-cell:first-child{
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
}
.md\:table-cell:last-child{
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
}
</style>