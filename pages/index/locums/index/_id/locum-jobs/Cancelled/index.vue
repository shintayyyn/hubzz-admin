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
                            class="hover:bg-grey rounded-lg p-3 text-white text-sm"
                            :to="{path:`/locums/${locumUser.id}`,query: $route.query}">
                            <strong>Profile</strong>
                            </nuxt-link>
                        </div>
                    </div>
                    <div class="my-1 px-1">
                        <div class="my-2 rounded-lg">
                            <nuxt-link
                            class="bg-grey-dark hover:bg-grey rounded-lg p-3 text-white text-sm"
                            :to="{path:`/locums/${locumUser.id}/locum-jobs`,query: $route.query}">
                            <strong>Jobs</strong>
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
                                class="hover:bg-grey rounded-lg p-3 text-white text-sm"
                                :to="{path:`/locums/${locumUser.id}/locum-jobs/Current`,query: $route.query}">
                                <strong>Current</strong>
                                </nuxt-link>
                            </div>
                        </div>
                        <div class="my-1 px-1">
                            <div class="my-2 rounded-lg">
                                <nuxt-link
                                class="hover:bg-grey rounded-lg p-3 text-white text-sm"
                                :to="{path:`/locums/${locumUser.id}/locum-jobs/available`,query: $route.query}">
                                <strong>Available</strong>
                                </nuxt-link>
                            </div>
                        </div>
                         <div class="my-1 px-1">
                            <div class="my-2 rounded-lg">
                                <nuxt-link
                                class="hover:bg-grey rounded-lg p-3 text-white text-sm"
                                :to="{path:`/locums/${locumUser.id}/locum-jobs/matched`,query: $route.query}">
                                <strong>Matched</strong>
                                </nuxt-link>
                            </div>
                        </div>
                        <div class="my-1 px-1">
                            <div class="my-2 rounded-lg">
                                <nuxt-link
                                class="hover:bg-grey rounded-lg p-3 text-white text-sm"
                                :to="{path:`/locums/${locumUser.id}/locum-jobs/applied`,query: $route.query}">
                                <strong>Applied</strong>
                                </nuxt-link>
                            </div>
                        </div>
                         <div class="my-1 px-1">
                            <div class="my-2 rounded-lg">
                                <nuxt-link
                                class="bg-grey-dark hover:bg-grey rounded-lg p-3 text-white text-sm"
                                :to="{path:`/locums/${locumUser.id}/locum-jobs/cancelled`,query: $route.query}">
                                <strong>Cancelled</strong>
                                </nuxt-link>
                            </div>
                        </div>
                        <div class="my-1 px-1">
                            <div class="my-2 rounded-lg">
                                <nuxt-link
                                class="hover:bg-grey rounded-lg p-3 text-white text-sm"
                                :to="{path:`/locums/${locumUser.id}/locum-jobs/unsuccessful`,query: $route.query}">
                                <strong>Unsuccessful</strong>
                                </nuxt-link>
                            </div>
                        </div>

                        <div class="my-1 px-1">
                            <div class="my-2 rounded-lg">
                                <nuxt-link
                                class="hover:bg-grey rounded-lg p-3 text-white text-sm"
                                :to="{path:`/locums/${locumUser.id}/locum-jobs/declined`,query: $route.query}">
                                <strong>Declined</strong>
                                </nuxt-link>
                            </div>
                        </div>

                        <div class="my-1 px-1">
                            <div class="my-2 rounded-lg">
                                <nuxt-link
                                class="hover:bg-grey rounded-lg p-3 text-white text-sm"
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
                        v-for="(locumUserCancelledJob, index) in locumUserCancelledJobs"
                        :key="`locumUserCancelledJob-${index}`"
                        :to="`/locums/${locumUser.id}/locum-jobs/view-job/${locumUserCancelledJob.id}`"
                        class="flex no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light mt-2"
                        >
                            <div style="width: 20%;">
                                <div class="flex text-white text-sm p-4">
                                    <span>{{ locumUserCancelledJob.job_number }}</span>
                                </div>
                            </div>
                            <div style="width: 15%;">
                                <div class="flex text-white text-sm p-4">
                                    <span>{{ locumUserCancelledJob.platform_job.practice.surgery.name }}</span>
                                </div>
                            </div>
                            <div style="width: 15%;">
                                <div class="flex text-white text-sm p-4">
                                    <span>{{ locumUserCancelledJob.platform_job.appointed_to_locum.user.locum_detail.profession.name }}</span>
                                </div>
                            </div>
                            <div style="width: 16%;">
                                <div class="flex text-white text-sm p-4">
                                    <span>{{ locumUserCancelledJob.platform_job.date_start }}</span>
                                </div>
                            </div>
                            <div style="width: 16%;">
                                <div class="flex text-white text-sm p-4">
                                    <span>{{ locumUserCancelledJob.platform_job.date_end }}</span>
                                </div>
                            </div>
                            <div style="width: 16%;">
                                <div class="flex text-white text-sm p-4">
                                    <span>{{ locumUserCancelledJob.platform_job.date_created }}</span>
                                </div>
                            </div>
                        </nuxt-link>
                        <!-- BODY -->
                    </div>
                </div>
            </div>
             <!-- PAGINATION -->
            <div v-if="pageCount > 1">
                <button class="p-2 m-1 rounded-lg border text-sm text-white hover:bg-waterloo-light" @click="goToPage(activePage - 1)">Prev</button>
                <button class="p-2 m-1 rounded-lg border text-sm text-white hover:bg-waterloo-light" :class="`${activePage === page ? 'bg-waterloo' : ''}`" v-for="page in pageCount" :key="`page-${page}`" v-if="showPage(page)" @click="goToPage(page)">{{ page }}</button>
                <button class="p-2 m-1 rounded-lg border text-sm text-white hover:bg-waterloo-light" @click="goToPage(activePage + 1)">Next</button>																									<!-- ^ Removed the FF. code in this area: v-if="showPage(page) TAKE A NOTE OF THIS"-->
            </div>
            <!-- PAGINATION -->
            
            <nuxt-child/>
		</div>
	</div>
</template>

<script>
export default{
    transition: "subpage",

    watchQuery: [
	'page',
	],

    async asyncData({ app, route }) {
    try {
        let {
        page = 1,
        search = ''
        } = route.query
        page = parseInt(page)
        const limit = 10
        const offset = page * limit - limit
        const order_by = 'created_at:desc'
        const params = { limit, offset, order_by }
        
        let response = await app.$axios.get(`/api/v1/admin/locum-users/${route.params.id}`, {params})
        const locumUser = response.data.data.user

        response = await app.$axios.get(`api/v1/admin/jobs?locum_detail_id=${locumUser.locum_detail.id}&locum_status=Cancelled`)
        const locumUserCancelledJobs = response.data.data.jobs

        response = await app.$axios.get(`api/v1/admin/jobs?locum_detail_id=${locumUser.locum_detail.id}&locum_status=Cancelled`)
        const itemCount = response.data.data.count

        console.log(locumUserCancelledJobs)

        return{
        loading: false,
        itemsPerPage: limit,
        itemCount,
        activePage: page,
        locumUser,
        locumUserCancelledJobs
        
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
            locumUserCancelledJobs:[]
        }
    },
    computed: {
  		pageCount() {
  			return Math.ceil(this.itemCount / this.itemsPerPage)
  		},

	    showPage() {
	      return page => {
	        if (page === 1) {
	          return true
	        }

	        if (page === this.pageCount) {
	          return true
	        }

	        if (page === this.activePage) {
	          return true
	        }

	        if (page === this.activePage + 1) {
	          return true
	        }

	        if (page === this.activePage - 1) {
	          return true
	        }

	        if (this.activePage === 1 && page < 5) {
	          return true
	        }

	        if (this.activePage === this.pageCount && page > this.pageCount - 4) {
	          return true
	        }

	        if (this.activePage === 2 && page === 4) {
	          return true
	        }

	        if (this.activePage === this.pageCount - 1 && page === this.pageCount - 3) {
	          return true
	        }

	        return false
	      }
	    }
    },

    methods: {
  		goToPage(page) {
  			if (page < 1) {
  				return
  			}

  			if (page > this.pageCount) {
  				return
  			}

  			const query = {
  				...this.$router.query,
  				page
  			}

  			if (page === 1) {
  				delete query.page
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