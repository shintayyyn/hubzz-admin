<template>
  <div class="flex-1 flex flex-col py-2 px-4 overflow-auto">
    <div class="px-2">
      <div class="flex flex-no-wrap justify-start">
        <div class="text-4xl mb-4 text-white">Support</div>
      </div>
    </div>
    <!-- TABLE RESPONSIVE-->
    <div v-if="emails.length>0" class="px-2 table border-separate overflow-x-auto" style="border-spacing: 0 10px;"> 
      <!-- HEADER -->
      <div class="hidden md:table-row font-bold text-white text-sm py-4"> 
        <div class="table-cell p-2 align-middle">Sender Name</div> 
        <div class="table-cell p-2 align-middle">Account Type</div>
        <div class="table-cell p-2 align-middle">Account Role</div>
        <div class="table-cell p-2 align-middle">Date Sent</div>
      </div>
      <!-- END HEADER -->
      <!-- BODY -->
      <nuxt-link
        v-for="(email, index) in emails"
          :key="`support-${index}`"
          :to="{ path:`/supports/${email.id}`, query:$route.query}"
        class="flex flex-col sm:flex-row sm:flex-wrap justify-between px-2 py-2 border-l-8 border-yellow-dark md:border-l-0 md:table-row my-2 text-white no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light" 
      >
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">Sender E-Mail</strong>
          <span class="break-word">{{ email.sender.email }}</span>
        </div>
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">Account Type</strong>
          <span class="break-all">{{ email.sender.domain }}</span>
        </div>
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">Account Domain</strong>
          <span class="break-all">{{ email.sender.domain }}</span>
        </div>
        <div class="flex flex-col sm:w-full md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">Date Sent</strong>
          <span class="break-all">{{$moment(email.sender.created_at).format('MMM DD,YYYY | HH:MM:ss') }}</span>
        </div>
      </nuxt-link>
      <!-- END BODY -->
    </div>
    <div v-else class="flex justify-center text-white ">
      <div>There are currently no messages of concern.</div>
    </div>
    <!-- END TABLE -->
    <!-- PAGINATION -->
		<div v-if="emails.length>0" class="flex justify-center">
			<div >
				<button class="page-button p-2 px-4 m-1 rounded-lg font-bold text-sm text-black"
					@click="goToPage(activePage - 1)" 
					:class="activePage === 1 ? 'text-grey-dark' : 'hover:bg-yellow'">Prev
				</button>

				<button class="page-button p-2 px-4 m-1 rounded-lg font-bold text-sm text-black hover:bg-waterloo-light" 
					:class="`${activePage === page ? 'text-white' : ''}`" 
					v-for="page in pageCount" 
					v-if="showPage(page)"
					:key="`page-${page}`" 
					@click="goToPage(page)">{{ page }}
				</button>
				
				<button class="page-button p-2 px-4 m-1 rounded-lg font-bold text-sm text-black hover:bg-waterloo-light" 
					@click="goToPage(activePage + 1)"
					:class="`${activePage == pageCount ? 'text-grey-dark': ''}`">Next
				</button>														
			</div>
		</div>
		<!-- PAGINATION ENDS HERE -->
    <div class="support-shield" v-if="$route.name.includes('index-supports-id')"></div>
    <nuxt-child/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      emails: [],

      itemsPerPage: 8,
      activePage:1,
      itemCount:0
    };
  },
  watchQuery: [
	'page',
	],
  async asyncData({ app,store,route }) {
    try {
      //put loading here if needed
      let{
        page = 1,
        search = '',
      } = route.query

      page = parseInt(page)
      const limit = 8
      const offset = page * limit - limit
      const params = { limit, offset }

      let response = await app.$axios.get(`/api/v1/admin/supports/count`)
      const itemCount = response.data.data.count

      response = await app.$axios.get(`/api/v1/admin/supports`, { params });
      const emails = response.data.data.emails;
      

      return {
        itemsPerPage : limit,
        activePage: page,
        itemCount,
        emails
      };
    }catch (err) {
      store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
      console.log("index emails index asyncData err", err);
    }
  },

  computed:{
    pageCount(){
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
  methods:{
    show(){
        this.modal=true
    },
            
    goToPage(page,search) {
      if (page < 1) {
          return
      }

      if (page > this.pageCount) {
          return
      }

      let query = {...this.$router.query,page}

      if(search){
          query = {...this.$router.query,page,search}
      }

      if (page === 1) {
          delete query.page
      }

      this.$router.push({ query })
    },
  }

  
};
</script>
<style>
.page-button {
  background: linear-gradient(to top, #f2d024, #efde86);
}
</style>