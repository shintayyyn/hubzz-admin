<template>
	<div class="flex-1 flex flex-col py-2 px-6 overflow-auto __custom-scroll" ref="scrollContainer" @scroll="scrollHandler">

		<!-- BUTTON -->
		<div v-if="false">
			<nuxt-link :to="{ path: `/clinical-commissioning-groups/create`, query: $route.query }" class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow">Create</nuxt-link>
		</div>
		<!-- BUTTON -->

		<!-- FILTER -->
		<div class="flex py-2">
			<div class="relative">
				<input class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow bg-waterloo" placeholder="Search for..." v-model="search" @keyup.enter="searchSubmit">
				<button class="p-2 absolute top-0 right-0 bottom-0" @click="search = '', searchSubmit()">
					<svgicon name="times-solid" height="12" width="12" class="text-white fill-current"/>
				</button>
			</div>
			<button class="rounded-lg text-sm text-white p-2 mx-1 hover:text-black hover:bg-yellow-500" @click="searchSubmit">Go</button>
		</div>
		<!-- FILTER -->

		<!-- TABLE -->
		<div class="w-full">
			<div class="flex flex-col">

				<!-- HEADER -->
				<div class="flex mt-2 ">
					<div class="flex w-full md:w-1/2">
						<div class="flex text-white text-sm p-4">
							<strong>Name</strong>
						</div>
					</div>
					<div class="hidden md:flex w-1/4">
						<div class="flex text-white text-sm p-4">
							<strong>Created By</strong>
						</div>
					</div>
					<div class="hidden md:flex w-1/4">
						<div class="flex text-white text-sm p-4">
							<strong>Created At</strong>
						</div>
					</div>
					<div class="hidden lg:flex w-1/4">
						<div class="flex text-white text-sm p-4">
							<strong>Updated By</strong>
						</div>
					</div>
					<div class="hidden lg:flex w-1/4">
						<div class="flex text-white text-sm p-4">
							<strong>Updated At</strong>
						</div>
					</div>
				</div>
				<!-- HEADER -->

				<!-- BODY -->
        <div class="flex flex-col">
          <nuxt-link event="" v-for="(clinicalCommissioningGroup, index) in clinicalCommissioningGroups" :key="`clinicalCommissioningGroup-${index}`" :to="{ path: `/clinical-commissioning-groups/${clinicalCommissioningGroup.id}`, query: $route.query }" class="flex no-underline rounded-lg shadow-lg bg-waterloo my-2"  :class="false ? 'hover:bg-waterloo-light' : ''" draggable="false">
            <div class="flex w-full md:w-1/2">
              <div class="flex text-white text-sm p-4">
                <span>{{ clinicalCommissioningGroup.name }}</span>
              </div>
            </div>
            <div class="hidden md:flex w-1/4">
              <div class="flex text-white text-sm p-4">
                <span>{{ clinicalCommissioningGroup.created_by_user && clinicalCommissioningGroup.created_by_user.personal_detail ? clinicalCommissioningGroup.created_by_user.personal_detail.name : null  }}</span>
              </div>
            </div>
            <div class="hidden md:flex w-1/4">
              <div class="flex text-white text-sm p-4">
                <span>{{ $moment(clinicalCommissioningGroup.created_at).format('MMM D, YYYY | hh:mm A') }}</span>
              </div>
            </div>
            <div class="hidden lg:flex w-1/4">
              <div class="flex text-white text-sm p-4">
                <span>{{ clinicalCommissioningGroup.updated_by_user && clinicalCommissioningGroup.updated_by_user.personal_detail ? clinicalCommissioningGroup.updated_by_user.personal_detail.name : null  }}</span>
              </div>
            </div>
            <div class="hidden lg:flex w-1/4">
              <div class="flex text-white text-sm p-4">
                <span>{{ clinicalCommissioningGroup.updated_at ? $moment(clinicalCommissioningGroup.updated_at).format('MMM D, YYYY | hh:mm A') : null }}</span>
              </div>
            </div>
          </nuxt-link>
        </div>
				<!-- BODY -->

			</div>
		</div>
		<!-- TABLE -->

		<!-- LOADING -->
		<div class="w-full p-12" v-if="loading">
			<span class="text-white">Loading...</span>
		</div>
		<!-- LOADING -->

    <!-- LOADMORE -->
    <!-- <button class="py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow" @click="loadMore">Load More</button> -->
    <!-- LOADMORE -->

		<!-- PAGINATION -->
		<!-- <div v-if="false && pageCount > 1" class="my-1">
			<button class="p-2 m-1 rounded-lg border text-sm text-white hover:bg-waterloo-light" @click="goToPage(activePage - 1)">Prev</button>
			<button class="p-2 m-1 rounded-lg border text-sm text-white hover:bg-waterloo-light" :class="`${activePage === page ? 'bg-waterloo' : ''}`" v-for="page in pageCount" :key="`page-${page}`" v-if="showPage(page)" @click="goToPage(page)">{{ page }}</button>
			<button class="p-2 m-1 rounded-lg border text-sm text-white hover:bg-waterloo-light" @click="goToPage(activePage + 1)">Next</button>
		</div> -->
		<!-- PAGINATION -->

		<nuxt-child/>

	</div>
</template>

<script>
  export default {

	  watchQuery: [
	    'clinical_commissionings_group_page',
	    'clinical_commissioning_groups_search'
	  ],

  	async asyncData({ app, route }) {

  		try {

  			let {
  				clinical_commissionings_group_page = 1,
  				clinical_commissioning_groups_search = '',
  			} = route.query

  			let page = parseInt(clinical_commissionings_group_page)

  			const limit = 10

  			const offset = page * limit - limit

  			const order_by = 'created_at:desc'

  			const params = {
  				limit,
  				offset,
  				order_by
  			}

  			if (clinical_commissioning_groups_search) {

  				params.search = clinical_commissioning_groups_search

  			}

  			const getPracticeTypesCountPromise = app.$axios.get(`/api/v1/admin/clinical-commissioning-groups/count`, {
  				params
  			})

  			const getPracticeTypesPromise = app.$axios.get(`/api/v1/admin/clinical-commissioning-groups`, {
  				params
  			})

  			let response = null

  			response = await getPracticeTypesCountPromise

  			const itemCount = response.data.data.count

  			response = await getPracticeTypesPromise

  			const clinicalCommissioningGroups = response.data.data.clinical_commissioning_groups

  			return {
  				loading: false,
  				itemsPerPage: limit,
  				itemCount,
  				activePage: page,
  				clinicalCommissioningGroups,
  				search: clinical_commissioning_groups_search
  			}

  		} catch (err) {

  			console.log('index clinical-commissioning-groups index asyncData err', err)

  		}

  	},

  	data() {

  		return {
  			loading: false,
  			itemsPerPage: 10,
  			itemCount: 0,
  			activePage: 1,
  			clinicalCommissioningGroups: [],
  			search: ''
  		}

  	},

  	computed: {},

  	methods: {

      loadMore() {
        const params = {
          limit: this.itemsPerPage,
          offset: this.clinicalCommissioningGroups.length,
          order_by: 'created_at:desc'
        }

        if (this.search) {
          params.search = this.search
        }

        return Promise.all([
          this.$axios.get(`/api/v1/admin/clinical-commissioning-groups/count`, { params }),
          this.$axios.get(`/api/v1/admin/clinical-commissioning-groups`, { params })
        ]).then((responses) => {
          this.itemCount = responses[0].data.data.count
          responses[1].data.data.clinical_commissioning_groups.forEach((clinicalCommissioningGroup) => {
            this.clinicalCommissioningGroups.push(clinicalCommissioningGroup)
          })
        })
      },

  		goToPage(page) {

  			if (page < 1) {

  				return

  			}

  			if (page > this.pageCount) {

  				return

  			}

  			const query = {
  				...this.$router.query,
  				clinical_commissionings_group_page: page
  			}

  			if (page === 1) {

  				delete query.clinical_commissionings_group_page

  			}

	      if (this.$router.resolve({ query }).href !== this.$route.fullPath) {

	        this.loading = true

	      }

	      this.$router.push({ query })

  		},

  		searchSubmit() {

  			const query = {
  				...this.$router.query
  			}

  			delete query.page

  			query.clinical_commissioning_groups_search = this.search

  			if (this.search === '') {

  				delete query.clinical_commissioning_groups_search

  			}

	      if (this.$router.resolve({ query }).href !== this.$route.fullPath) {

	        this.loading = true

	      }

	      this.$router.push({ query })

  		},

      scrollHandler() {
        if (this.$refs.scrollContainer.scrollHeight - Math.trunc(this.$refs.scrollContainer.scrollTop) - this.$refs.scrollContainer.offsetHeight < 1) {
          this.loading = true

          this.loadMore().then(() => {
            this.loading = false
          })
        }
      }
  	},

    mounted() {

      new Promise((resolve, reject) => {
        (() => {
          this.$nextTick(async () => {

            let scrollIsAtTheBottom = this.$refs.scrollContainer.scrollHeight - Math.trunc(this.$refs.scrollContainer.scrollTop) - this.$refs.scrollContainer.offsetHeight < 1

            // while (scrollIsAtTheBottom) {
            if (scrollIsAtTheBottom) {

              await this.loadMore()

              scrollIsAtTheBottom = this.$refs.scrollContainer.scrollHeight - Math.trunc(this.$refs.scrollContainer.scrollTop) - this.$refs.scrollContainer.offsetHeight < 1
            }

            resolve()
          })
        })()
      })

    }
  }
</script>

<style>
  div.__custom-scroll::-webkit-scrollbar {
    width: 10px;
  }

  div.__custom-scroll::-webkit-scrollbar-track-piece {
    background: #505561;
  }

  div.__custom-scroll::-webkit-scrollbar-thumb:vertical {
    background: #7B8396;
  }
</style>