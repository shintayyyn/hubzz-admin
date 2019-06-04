<template>
  <div class="flex-1 flex flex-col py-2 px-4 overflow-auto">
    <div>
      <nuxt-link
        to="/qualifications/create"
        class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-xs text-black rounded-lg shadow"
      >Create</nuxt-link>
    </div>

    <div class="flex py-2">
       	<div class="relative">
				<input class="rounded-lg border-2 border-transparent text-xs text-white p-2 pr-6 focus:border-sunglow bg-waterloo" placeholder="Search for..." v-model="search" @keyup.enter="searchSubmit">
				<button class="p-2 absolute pin-t pin-r pin-b" @click="search = '', searchSubmit()">
					<svgicon name="times-solid" height="12" width="12" class="text-white fill-current"/>
				</button>
			</div>
      <button class="rounded-lg text-xs text-white p-2 mx-1 hover:text-black hover:bg-yellow-dark" @click="searchSubmit">Go</button>
      </div>

    <!-- TABLE -->
    <div>
      <div class="flex flex-col">
        <!-- HEADER -->
        <div class="flex my-2">
          <div style="width: 30%;">
            <div class="flex text-white text-xs p-4">
              <strong>Name</strong>
            </div>
          </div>
          <div style="width: 25%;">
            <div class="flex text-white text-xs p-4">
              <strong>Created At</strong>
            </div>
          </div>
          <div style="width: 25%;">
            <div class="flex text-white text-xs p-4">
              <strong>Updated At</strong>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <strong>Actions</strong>
            </div>
          </div>
        </div>
        <!-- HEADER -->

        <!-- BODY -->
        <nuxt-link
          v-for="(qualification, index) in qualifications"
          :key="`qualification-${index}`"
          :to="`/qualifications/${qualification._id}`"
          class="flex no-underline rounded-lg shadow-lg bg-waterloo hover:bg-waterloo-light my-2"
        >
          <div style="width: 30%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ qualification.name }}</span>
            </div>
          </div>
          <div style="width: 25%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ $moment(qualification.createdAt).format('MMM D, YYYY | hh:mm A') }}</span>
            </div>
          </div>
          <div style="width: 25%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ qualification.updatedAt }}</span>
            </div>
          </div>
          <div style="width: 25%;">
            <div class="flex text-white text-xs p-4">
              <button>Edit</button>
              <button>Delete</button>
            </div>
          </div>
        </nuxt-link>
        <!-- BODY -->
      </div>
    </div>
    <!-- TABLE -->
    <!-- PAGINATION -->
		<div v-if="pageCount > 1">
			<button class="p-2 m-1 rounded-lg border text-xs text-white hover:bg-waterloo-light" @click="goToPage(activePage - 1)">Prev</button>
			<button class="p-2 m-1 rounded-lg border text-xs text-white hover:bg-waterloo-light" :class="`${activePage === page ? 'bg-waterloo' : ''}`" v-for="page in pageCount" :key="`page-${page}`" @click="goToPage(page)">{{ page }}</button>
			<button class="p-2 m-1 rounded-lg border text-xs text-white hover:bg-waterloo-light" @click="goToPage(activePage + 1)">Next</button>																									<!-- ^ Removed the FF. code in this area: v-if="showPage(page)"-->
		</div>
		<!-- PAGINATION -->
    <nuxt-child/>
  </div>
</template>

<script>
export default {
    watchQuery: [
      'page',
      'search'
    ],
   async asyncData({ app, route }) {
    try {
      let {
        page = 1,
        search=''
      } = route.query
      page = parseInt(page)
      const limit = 10
      const offset = page * limit - limit
      const order_by = 'created_at:desc'
      const params = { limit, offset, order_by }

      if (search) {
        params.search = search
      }

      const getQualificationsCountPromise = app.$axios.get(`/api/v1/admin/qualifications/count`, { params })
			const getQualificationsPromise = app.$axios.get(`/api/v1/admin/qualifications`, { params })
				
  		let response = null
			response = await getQualificationsCountPromise
				
  		const itemCount = response.data.data.count
			response = await getQualificationsPromise
				
  		const qualifications = response.data.data.qualifications
  		return {
  			loading: false,
  			itemsPerPage: limit,
  			itemCount,
  			activePage: page,
        qualifications,
        search
  		}
    } catch (err) {
      console.log("index compliances index asyncData err", err);
    }
  },

    data() {
      return {
        loading: false,
        itemsPerPage: 10,
        itemCount: 0,
        activePage: 1,
        qualifications: [],
        search:''
      };
    },
    computed:{
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
        searchSubmit() {
          const query = {
            ...this.$router.query
          }

          delete query.page

          query.search = this.search

          if (this.search === '') {
            delete query.search
          }

          if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
            this.loading = true
          }

          this.$router.push({ query })
      }
    }
};
</script>
