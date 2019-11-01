<template>
  <div class="flex-1 flex flex-col py-2 px-4 overflow-auto">
    <div class="text-xl md:text-4xl text-white">Inquiries</div>
    <!-- TABLE RESPONSIVE-->
    <div v-if="emails.length > 0" class="w-full"> 
      <!-- HEADER -->
      <div class="hidden md:flex items-center text-white justify-around font-semibold"> 
        <div class="align-middle px-2 w-1/4">Sender Name</div> 
        <div class="align-middle px-2 text-center w-1/4">Account Type</div>
        <div class="align-middle px-2 text-center w-1/4">Account Role</div>
        <div class="align-middle px-2 text-center w-1/4">Date Sent</div>
      </div>
      <!-- END HEADER -->
      <!-- BODY -->
      <nuxt-link
        v-for="(email, index) in emails"
          :key="`emails-${index}`"
          :to="{ path:`/inquiries/${email.id}`, query:$route.query}"
        class="flex flex-col cursor-pointer md:flex-row px-2 md:px-4 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light" 
      >
        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/4 p-1 md:p-2 leading-tight align-middle">
          <strong class="block md:hidden text-sm uppercase">Sender E-Mail</strong>
          <span>{{ email.sender.email }}</span>
        </div>
        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/4 p-1 md:p-2 leading-tight align-middle md:text-center">
          <strong class="block md:hidden text-sm uppercase">Account Type</strong>
          <span>{{ email.sender.domain }}</span>
        </div>
        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/4 p-1 md:p-2 leading-tight align-middle md:text-center">
          <strong class="block md:hidden text-sm uppercase">Account Domain</strong>
          <span>{{ email.sender.domain }}</span>
        </div>
        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/4 p-1 md:p-2 leading-tight align-middle md:text-center">
          <strong class="block md:hidden text-sm uppercase">Date Sent</strong>
          <span>{{$moment(email.sender.created_at).format('MMM DD,YYYY | HH:MM:ss') }}</span>
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
					:class="activePage === 1 ? 'text-gray-dark' : 'hover:bg-yellow'">Prev
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
					:class="`${activePage == pageCount ? 'text-gray-dark': ''}`">Next
				</button>														
			</div>
		</div>
		<!-- PAGINATION ENDS HERE -->
    <div class="support-shield" v-if="$route.name.includes('index-inquiries-id')" @click="$router.go(-1)"></div>
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