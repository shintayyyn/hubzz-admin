<template>
  
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
  				search = ''
  			} = route.query
  			page = parseInt(page)
  			const limit = 10
  			const offset = page * limit - limit
  			const domain = 'locum'
  			const order_by = 'created_at:desc'
			const params = { limit, offset, domain, order_by }
				
  			if (search) {
  				params.search = search
			}
				
  			const getPracticesCountPromise = app.$axios.get(`/api/v1/admin/practices/count`, { params })
			const getPracticesPromise = app.$axios.get(`/api/v1/admin/practices`, { params })
			console.log(getPracticesPromise)
				
			let response = null
			
			response = await getPracticesCountPromise
			const itemCount = response.data.data.count
			
			response = await getPracticesPromise
			const practices = response.data.data.practices
				
  			return {
  				loading: false,
  				itemsPerPage: limit,
  				itemCount,
  				activePage: page,
  				practices,
  				search
  			}
  		} catch (err) {
  			console.log('index practices index asyncData err', err)
  		}
  	},

    data() {
      return {
        loading: false,
        itemsPerPage: 10,
        itemCount: 0,
        activePage: 1,
        practices: [],
        search: ''
      };
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
