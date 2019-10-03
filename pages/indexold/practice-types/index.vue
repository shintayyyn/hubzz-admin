<template>
	<div class="flex-1 flex flex-col py-2 px-6 overflow-auto">

		<!-- BUTTON -->
		<div>
			<nuxt-link :to="{ path: `/practice-types/create`, query: $route.query }" class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-xs text-black rounded-lg shadow">Create</nuxt-link>
		</div>
		<!-- BUTTON -->

		<!-- FILTER -->
		<div class="flex py-2">
			<div class="relative">
				<input class="rounded-lg border-2 border-transparent text-xs text-white p-2 pr-6 focus:border-sunglow bg-waterloo" placeholder="Search for..." v-model="search" @keyup.enter="searchSubmit">
				<button class="p-2 absolute top-0 right-0 bottom-0" @click="search = '', searchSubmit()">
					<svgicon name="times-solid" height="12" width="12" class="text-white fill-current"/>
				</button>
			</div>
			<button class="rounded-lg text-xs text-white p-2 mx-1 hover:text-black hover:bg-yellow-500" @click="searchSubmit">Go</button>
		</div>
		<!-- FILTER -->

		<div class="pt-4">
			<span class="text-white text-xs">Showing {{ itemsPerPage * activePage - itemsPerPage + (practiceTypes.length > 0 ? 1 : 0) }}-{{ itemsPerPage * activePage - itemsPerPage + practiceTypes.length }} of {{ itemCount }} Practice Types</span>
		</div>

		<!-- TABLE -->
		<div class="w-full xl:w-4/5" v-if="!loading">
			<div class="flex flex-col">

				<!-- HEADER -->
				<div class="flex mt-2">
					<div class="flex w-full md:w-1/2">
						<div class="flex text-white text-xs p-4">
							<strong>Name</strong>
						</div>
					</div>
					<div class="hidden md:flex w-1/4">
						<div class="flex text-white text-xs p-4">
							<strong>Created By</strong>
						</div>
					</div>
					<div class="hidden md:flex w-1/4">
						<div class="flex text-white text-xs p-4">
							<strong>Created At</strong>
						</div>
					</div>
					<div class="hidden lg:flex w-1/4">
						<div class="flex text-white text-xs p-4">
							<strong>Updated By</strong>
						</div>
					</div>
					<div class="hidden lg:flex w-1/4">
						<div class="flex text-white text-xs p-4">
							<strong>Updated At</strong>
						</div>
					</div>
				</div>
				<!-- HEADER -->

				<!-- BODY -->
				<nuxt-link v-for="(practiceType, index) in practiceTypes" :key="`practiceType-${index}`" :to="{ path: `/practice-types/${practiceType.id}`, query: $route.query }" class="flex no-underline rounded-lg shadow-lg bg-waterloo hover:bg-waterloo-light my-2" draggable="false">
					<div class="flex w-full md:w-1/2">
						<div class="flex text-white text-xs p-4">
							<span>{{ practiceType.name }}</span>
						</div>
					</div>
					<div class="hidden md:flex w-1/4">
						<div class="flex text-white text-xs p-4">
							<span>{{ practiceType.created_by_user && practiceType.created_by_user.personal_detail ? practiceType.created_by_user.personal_detail.name : null  }}</span>
						</div>
					</div>
					<div class="hidden md:flex w-1/4">
						<div class="flex text-white text-xs p-4">
							<span>{{ $moment(practiceType.created_at).format('MMM D, YYYY | hh:mm A') }}</span>
						</div>
					</div>
					<div class="hidden lg:flex w-1/4">
						<div class="flex text-white text-xs p-4">
							<span>{{ practiceType.updated_by_user && practiceType.updated_by_user.personal_detail ? practiceType.updated_by_user.personal_detail.name : null  }}</span>
						</div>
					</div>
					<div class="hidden lg:flex w-1/4">
						<div class="flex text-white text-xs p-4">
							<span>{{ practiceType.updated_at ? $moment(practiceType.updated_at).format('MMM D, YYYY | hh:mm A') : null }}</span>
						</div>
					</div>
				</nuxt-link>
				<!-- BODY -->

			</div>
		</div>
		<!-- TABLE -->

		<!-- LOADING -->
		<div class="w-full p-12" v-if="loading">
			<span class="text-white">Loading...</span>
		</div>
		<!-- LOADING -->

		<!-- PAGINATION -->
		<div v-if="pageCount > 1" class="my-1">
			<button class="p-2 m-1 rounded-lg border text-xs text-white hover:bg-waterloo-light" @click="goToPage(activePage - 1)">Prev</button>
			<button class="p-2 m-1 rounded-lg border text-xs text-white hover:bg-waterloo-light" :class="`${activePage === page ? 'bg-waterloo' : ''}`" v-for="page in pageCount" :key="`page-${page}`" v-if="showPage(page)" @click="goToPage(page)">{{ page }}</button>
			<button class="p-2 m-1 rounded-lg border text-xs text-white hover:bg-waterloo-light" @click="goToPage(activePage + 1)">Next</button>
		</div>
		<!-- PAGINATION -->

		<nuxt-child/>

	</div>
</template>

<script>
  export default {

	  watchQuery: [
	    'practice_types_page',
	    'practice_types_search'
	  ],

  	async asyncData({ app, route }) {

  		try {

  			let {
  				practice_types_page = 1,
  				practice_types_search = ''
  			} = route.query

  			let page = parseInt(practice_types_page)

  			const limit = 10

  			const offset = page * limit - limit

  			const order_by = 'created_at:desc'

  			const params = {
  				limit,
  				offset,
  				order_by
  			}

  			if (practice_types_search) {

  				params.search = practice_types_search

  			}

  			const getPracticeTypesCountPromise = app.$axios.get(`/api/v1/practice-types/count`, {
  				params
  			})

  			const getPracticeTypesPromise = app.$axios.get(`/api/v1/practice-types`, {
  				params
  			})

  			let response = null

  			response = await getPracticeTypesCountPromise

  			const itemCount = response.data.data.count

  			response = await getPracticeTypesPromise

  			const practiceTypes = response.data.data.practice_types

  			return {
  				loading: false,
  				itemsPerPage: limit,
  				itemCount,
  				activePage: page,
  				practiceTypes,
  				search: practice_types_search
  			}

  		} catch (err) {

  			console.log('index practice-types index asyncData err', err)

  		}

  	},

  	data() {

  		return {
  			loading: false,
  			itemsPerPage: 10,
  			itemCount: 0,
  			activePage: 1,
  			practiceTypes: [],
  			search: ''
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
  				practice_types_page: page
  			}

  			if (page === 1) {

  				delete query.practice_types_page

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

  			query.practice_types_search = this.search

  			if (this.search === '') {

  				delete query.practice_types_search

  			}

	      if (this.$router.resolve({ query }).href !== this.$route.fullPath) {

	        this.loading = true

	      }

	      this.$router.push({ query })

  		}
  	}
  }
</script>
