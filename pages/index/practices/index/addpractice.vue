<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
    <div style="width: calc(100% - 70px);" class="flex-1 flex flex-col self-end bg-trout shadow-lg">
      <!-- HEADER -->
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link to="/practices" class="text-white p-1">
          <svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
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
            class="flex items-center pd-4 border-b-2 border-grey-light focus-within:border-teal"
            style="width: 400px;"
          >
            <input
              class="bg-transparent border-none w-full text-white mr-3 py-1 leading-tight focus:outline-none"
              type="text"
              placeholder="Search for practice by name, etc."
              v-model="search" @keyup.enter="searchSubmit"
              aria-label="Full name"
            >
          </div>
        </div>
        <div class="w-full overflow-hidden">
          <div class="self-end">
            <button class="rounded-lg text-xs text-black p-2 mx-1 my-2 bg-yellow-dark" @click="searchSubmit">Search</button>
          </div>
          <div>
            <!--TABLE-->
            <!-- BODY -->
            <nuxt-link
              v-for="(practice, index) in practices"
              :key="`practice-${index}`"
              :to="{path:`/practices/${practice.id}/users`,query:$route.query}"
              class="flex no-underline rounded-lg bg-waterloo  shadow hover:bg-waterloo-light my-2"
            >
              <div class="flex" style="width: 100%;">
                <div class="flex text-white text-xs p-4">
                  <div>{{ practice.surgery.name }}</div>
                  <div>{{ practice.surgery.code }}</div>
                </div>
              </div>
            </nuxt-link>
              <!--TABLE ENDS HERE-->
          </div>
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
        practices: [],
        search: ''
      };
    },

    watchQuery: [
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

      const getPracticesPromise = app.$axios.get(`/api/v1/admin/practices`,{ params })

      let response = await getPracticesPromise
      const practices = response.data.data.practices
      
      return{
        loading:false,
        practices,
        search
      }
    } catch (err) {
      console.log("index qualifications index create asyncData err", err);
    }
  },

  
    computed: {
  	},
  
  	methods: {
  		async searchSubmit() {
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
