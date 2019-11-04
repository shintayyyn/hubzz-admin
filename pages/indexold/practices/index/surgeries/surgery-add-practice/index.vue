<template>
  <div class="absolute top-0 bottom-0 right-0 left-0 flex flex-col overflow-auto">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout shadow-lg ">
      <!-- HEADER -->
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link to="/practices" class="text-white p-1">
          <svgicon name="arrow-left-solid" height="32" width="32" class="text-white hover:text-sunglow fill-current"/>
        </nuxt-link>
      </div>
      <!-- HEADER -->

      <div class="flex flex-wrap overflow-hidden p-6 text-base text-white py-2">
        <div class="w-full overflow-hidden">
          <div class="pb-4">
            <strong>Add Practice</strong>
          </div>
        </div>
        <div class="w-full">
          <div
            class="flex items-center pd-4 border-gray-300"
            style="width: 400px;"
          >
            <input
              class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3  px-2 leading-tight focus:outline-none focus:border-orange"
              type="text"
              placeholder="Search for surgery by name, etc."
              v-model="search" @keyup.enter="searchSubmit"
              aria-label="Full name"
            >
          </div>
        </div>
        <div class="w-full overflow-hidden">
          <div class="self-end">
            <button class="rounded-lg text-xs text-black p-2 mx-1 my-2 bg-yellow-500" @click="searchSubmit">Search</button>
          </div>
          <div>
            <!--TABLE-->
            <!-- BODY -->
            <nuxt-link
              v-for="(surgery, index) in surgeries"
              :key="`surgery-${index}`"
              :to="{path:`/practices/surgeries/surgery-add-practice/${surgery.id}`,query:$route.query}"
              class="flex no-underline rounded-lg bg-waterloo shadow hover:bg-waterloo-light my-2"
            >
              <div class="flex" style="width: 100%;">
                <div class="text-white text-xs p-4">
                  <span class="font-bold">{{ surgery.name }}</span><br><br><br>
                  <span>{{surgery.address.line_1}}</span>
                  <span>{{surgery.address.line_2}}</span>
                  <span>{{surgery.address.line_3}}</span><br><br><br>
                  <span class='p-2 bg-trout rounded'>CCG</span>
                  <span>{{surgery.clinical_commissioning_group.name}}</span><br><br><br>
                  <span class='p-2 bg-trout rounded'>Practice Code</span>
                  <span>{{ surgery.code }}</span><br>
                </div>
              </div>
            </nuxt-link>
              <!--TABLE ENDS HERE-->
          </div>
        </div>
        <div v-if="pageCount > 1">
          <button class="p-2 m-1 rounded-lg border text-xs text-white hover:bg-waterloo-light" @click="goToPage(activePage - 1)">Prev</button>
          <button class="p-2 m-1 rounded-lg border text-xs text-white hover:bg-waterloo-light" :class="`${activePage === page ? 'bg-waterloo' : ''}`" v-for="page in pageCount" :key="`page-${page}`" v-if="showPage(page)" @click="goToPage(page)">{{ page }}</button>
          <button class="p-2 m-1 rounded-lg border text-xs text-white hover:bg-waterloo-light" @click="goToPage(activePage + 1)">Next</button>														<!-- ^ Removed the FF. code in this area: v-if="showPage(page)"-->
        </div>
      </div>
    </div>
    <nuxt-child/>
  </div>
</template>

<script>
export default {
  transition: "subpage",
    data() {
      return {
        loading: false,
        itemsPerPage:10,
        itemCount:0,
        activePage:1,
        surgeries: [],
        search: '',
        disabled:'true'
      };
    },

    watchQuery: [
      'page',
	    'search'
	  ],

  async asyncData({ app, route }) {
    try {
      let {
        page=1,
        search=''
      } = route.query

      page = parseInt(page)
      const limit = 10
      const offset = page * limit - limit
      const order_by = 'created_at:desc'
      const params = { limit, offset, order_by }
      
      if (search){
        params.search = search
      }

      const getSurgeriesCountPromise = app.$axios.get(`/api/v1/admin/surgeries/count`,{ params })
      const getSurgeriesPromise = app.$axios.get(`/api/v1/admin/surgeries`,{ params })

      let response = null

      response = await getSurgeriesCountPromise
      const itemCount = response.data.data.count
      
      response = await getSurgeriesPromise
      const surgeries = response.data.data.surgeries
      
      return{
        loading:false,
        itemsPerPage:limit,
        itemCount,
        activePage: page,
        surgeries,
        search
      }
    } catch (err) {
      console.log("index qualifications index create asyncData err", err);
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
    },
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
