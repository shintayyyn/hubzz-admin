<template>
	<div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
		<div style="width: calc(100%);" class="flex-1 flex flex-col self-end bg-trout shadow-lg">

            <!-- HEADER -->
            <div class="flex justify-between text-sm text-white py-2 px-6">
                <nuxt-link :to="{path:`/locums/${locumUser.id}`,query: $route.query }" class="text-white p-1">
                <svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
                </nuxt-link>
            </div>

            <div class="mx-6">

                <div class="flex flex-wrap">
                    <div class="my-1 px-1">
                        <div class="my-2 rounded-lg">
                            <nuxt-link
                            class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                            :to="{path:`/locums/${locumUser.id}`,query: $route.query}">
                            <strong>Profile</strong>
                            </nuxt-link>
                        </div>
                    </div>
                    <div class="my-1 px-1">
                        <div class="my-2 rounded-lg">
                            <nuxt-link
                            class="bg-grey-dark hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                            :to="{path:`/locums/${locumUser.id}/locum-jobs`,query: $route.query}">
                            <strong>Jobs</strong>
                            </nuxt-link>
                        </div>
                    </div>
                   <div class="my-1 px-1">
                        <div class="my-2 rounded-lg">
                            <nuxt-link
                            class="border-white rounded-lg p-3 text-white text-sm no-underline"
                            :to="{path:`/locums/${locumUser.id}/locum-compliance/`,query: $route.query}"
                            :event="locumUser.compliance_status==='Empty' ? disabled : 'click'"
                            :class="locumUser.compliance_status==='Empty' ? 'text-grey-dark bg-red m-3 rounded-lg' :'hover:bg-waterloo-light'">
                            <strong>{{locumUser.compliance_status === 'Empty'?'No Compliance Documents Uploaded':'Compliances'}}</strong>
                            </nuxt-link>
                        </div>
                    </div>
                </div>

                <!-- DEFAULT TABS -->
                <div class="flex flex-col rounded-lg mt-2 " >
                    <div class="flex flex-wrap -mx-1">
                        <div class="my-1 px-1">
                            <div class="my-2 rounded-lg">
                                <nuxt-link
                                class=" hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                                :to="{path:`/locums/${locumUser.id}/locum-jobs/Current`,query: $route.query}">
                                <strong>Current</strong>
                                </nuxt-link>
                            </div>
                        </div>
                        <div class="my-1 px-1">
                            <div class="my-2 rounded-lg">
                                <nuxt-link
                                class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                                :to="{path:`/locums/${locumUser.id}/locum-jobs/available`,query: $route.query}">
                                <strong>Available</strong>
                                </nuxt-link>
                            </div>
                        </div>
                         <div class="my-1 px-1">
                            <div class="my-2 rounded-lg">
                                <nuxt-link
                                class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                                :to="{path:`/locums/${locumUser.id}/locum-jobs/matched`,query: $route.query}">
                                <strong>Matched</strong>
                                </nuxt-link>
                            </div>
                        </div>
                        <div class="my-1 px-1">
                            <div class="my-2 rounded-lg">
                                <nuxt-link
                                class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                                :to="{path:`/locums/${locumUser.id}/locum-jobs/applied`,query: $route.query}">
                                <strong>Applied</strong>
                                </nuxt-link>
                            </div>
                        </div>
                         <div class="my-1 px-1">
                            <div class="my-2 rounded-lg">
                                <nuxt-link
                                class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                                :to="{path:`/locums/${locumUser.id}/locum-jobs/cancelled`,query: $route.query}">
                                <strong>Cancelled</strong>
                                </nuxt-link>
                            </div>
                        </div>
                        <div class="my-1 px-1">
                            <div class="my-2 rounded-lg">
                                <nuxt-link
                                class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                                :to="{path:`/locums/${locumUser.id}/locum-jobs/unsuccessful`,query: $route.query}">
                                <strong>Unsuccessful</strong>
                                </nuxt-link>
                            </div>
                        </div>

                        <div class="my-1 px-1">
                            <div class="my-2 rounded-lg">
                                <nuxt-link
                                class="hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                                :to="{path:`/locums/${locumUser.id}/locum-jobs/declined`,query: $route.query}">
                                <strong>Declined</strong>
                                </nuxt-link>
                            </div>
                        </div>

                        <div class="my-1 px-1">
                            <div class="my-2 rounded-lg">
                                <nuxt-link
                                class="bg-grey-dark hover:bg-grey rounded-lg p-3 text-white text-sm no-underline"
                                :to="{path:`/locums/${locumUser.id}/locum-jobs/completed`,query: $route.query}">
                                <strong>Completed</strong>
                                </nuxt-link>
                            </div>
                        </div>
                    </div>

                </div>
                <!--DEFAULT TABS END HERE-->

                <!-- TABLE -->
                <div style="w-full">
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
                        v-for="(locumUserCompletedJob, index) in locumUserCompletedJobs"
                        :key="`locumUserCompletedJob-${index}`"
                        :to="`/locums/${locumUser.id}/locum-jobs/view-locum-job/${locumUserCompletedJob.id}`"
                        class="flex no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light mt-2"
                        >
                            <div style="width: 20%;">
                                <div class="flex text-white text-sm p-4">
                                    <span>{{ locumUserCompletedJob.job_number }}</span>
                                </div>
                            </div>
                            <div style="width: 15%;">
                                <div class="flex text-white text-sm p-4">
                                    <span>{{ locumUserCompletedJob.platform_job.practice.surgery.name }}</span>
                                </div>
                            </div>
                          <div style="width: 15%;">
                                <div class="flex text-white text-sm p-4">
                                    <span>{{ locumUserCompletedJob.title }}</span>
                                </div>
                            </div>
                            <div style="width: 16%;">
                                <div class="flex text-white text-sm p-4">
                                    <span>{{ locumUserCompletedJob.date_start }}</span>
                                </div>
                            </div>
                            <div style="width: 16%;">
                                <div class="flex text-white text-sm p-4">
                                    <span>{{ locumUserCompletedJob.date_end }}</span>
                                </div>
                            </div>
                            <div style="width: 16%;">
                                <div class="flex text-white text-sm p-4">
                                    <span>{{ locumUserCompletedJob.platform_job.date_created }}</span>
                                </div>
                            </div>
                        </nuxt-link>
                        <!-- BODY -->
                    </div>
                </div>
            </div>
            <!-- PAGINATION -->
            <div v-if="locumJobPageCount > 1">
                <button class="p-2 m-1 rounded-lg border text-sm text-white hover:bg-waterloo-light" @click="goToPage(activePage - 1)">Prev</button>
                <button class="p-2 m-1 rounded-lg border text-sm text-white hover:bg-waterloo-light" :class="`${activePage === locumJobPage ? 'bg-waterloo' : ''}`" v-for="locumJobPage in locumJobPageCount" :key="`locumJobPage-${locumJobPage}`" v-if="showPage(locumJobPage)" @click="goToPage(locumJobPage)">{{ locumJobPage }}</button>
                <button class="p-2 m-1 rounded-lg border text-sm text-white hover:bg-waterloo-light" @click="goToPage(activePage + 1)">Next</button>																									<!-- ^ Removed the FF. code in this area: v-if="showPage(locumJobPage) TAKE A NOTE OF THIS"-->
            </div>
            <!-- PAGINATION -->
            <nuxt-child/>
		</div>
	</div>
</template>

<script>
export default{
    transition: "sublocumJobPage",

    watchQuery: [
	'locumJobPage',
	],

    async asyncData({ app, route }) {
    try {
        let {
        locumJobPage = 1,
        search = ''
        } = route.query
        locumJobPage = parseInt(locumJobPage)
        const limit = 10
        const offset = locumJobPage * limit - limit
        const order_by = 'created_at:desc'
        const params = { limit, offset, order_by }
        
        let response = await app.$axios.get(`/api/v1/admin/locum-users/${route.params.id}`, {params})
        const locumUser = response.data.data.user

        response = await app.$axios.get(`api/v1/admin/jobs?locum_detail_id=${locumUser.locum_detail.id}&locum_status=Completed`,{ params })
        const locumUserCompletedJobs = response.data.data.jobs

        response = await app.$axios.get(`api/v1/admin/jobs/count?locum_detail_id=${locumUser.locum_detail.id}&locum_status=Completed`,{ params })
        const itemCount = response.data.data.count

        console.log(locumUserCompletedJobs)

        return{
        loading: false,
        itemsPerPage: limit,
        itemCount,
        activePage: locumJobPage,
        locumUser,
        locumUserCompletedJobs,
        disabled:'true'
        
      }
        } catch (err) {
        console.log("index practices index _id index asyncData err", err);
        }
    },

    data() {
        return{
            loading:false,
            itemsPerPage: 10,
            itemCount: 0,
            activePage: 1,
            locumUser:null,
            locumUserCompletedJobs:[]
        }
    },
    computed: {
  		locumJobPageCount() {
  			return Math.ceil(this.itemCount / this.itemsPerPage)
  		},

	    showPage() {
	      return locumJobPage => {
	        if (locumJobPage === 1) {
	          return true
	        }

	        if (locumJobPage === this.locumJobPageCount) {
	          return true
	        }

	        if (locumJobPage === this.activePage) {
	          return true
	        }

	        if (locumJobPage === this.activePage + 1) {
	          return true
	        }

	        if (locumJobPage === this.activePage - 1) {
	          return true
	        }

	        if (this.activePage === 1 && locumJobPage < 5) {
	          return true
	        }

	        if (this.activePage === this.locumJobPageCount && locumJobPage > this.locumJobPageCount - 4) {
	          return true
	        }

	        if (this.activePage === 2 && locumJobPage === 4) {
	          return true
	        }

	        if (this.activePage === this.locumJobPageCount - 1 && locumJobPage === this.locumJobPageCount - 3) {
	          return true
	        }

	        return false
	      }
	    }
    },

    methods: {
  		goToPage(locumJobPage) {
  			if (locumJobPage < 1) {
  				return
  			}

  			if (locumJobPage > this.locumJobPageCount) {
  				return
  			}

  			const query = {
  				...this.$router.query,
  				locumJobPage
  			}

  			if (locumJobPage === 1) {
  				delete query.locumJobPage
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

</style>