<template>
	<div class="flex-1 flex flex-col py-2">
		<div class="flex flex-col md:flex-row justify-between px-6">
			<div class="flex py-2">
				<div class="relative">
					<input class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo" placeholder="Search for..." v-model="search" @keyup.enter="searchSubmit">
					<button class="absolute pin-t pin-r pin-b mr-2 px-4 py-2" @click="search = '', searchSubmit()">
						<svgicon name="times-solid" height="12" width="12" class="text-white fill-current -mx-2 md:-mx-6"/>
					</button>
				</div>
				<button class="rounded-lg text-sm text-white p-2 hover:text-black hover:bg-yellow-dark focus:outline-none" @click="searchSubmit(activePage,order_by,filterCompliances)">Go</button>
			</div>
			<div class="relative flex flex-col md:flex-row md:items-center md:items-end py-2 md:py-0 md:px-4 md:px-6 -mt-2 md:mt-0">
				<label class="text-sm text-white md:pr-2">Filter by Compliance Status</label>
				<select
					v-model="filterCompliances"
					class="w-full sm:w-1/2 md:w-auto outline-none rounded-lg border-2 border-transparent text-sm text-white p-1 pr-6 focus:hubzz-yellow bg-waterloo"
					id="grid-state"
					>
					<option :value="null">All</option>
					<option>Empty</option>
					<option>Incomplete</option>
					<option>Pending</option>
					<option>Expiring</option>
					<option>Expired</option>
					<option>Rejected</option>
					<option>Compliant</option>
				</select>
			</div>
		</div>

		<!-- <div>
			<AppLoading :message:'hello'/>
		</div> -->

		<!-- TABLE -->
		<div class="table border-separate overflow-x-auto mx-6" style="border-spacing: 0 10px;"> 
			<!-- HEADER -->
			<div class="hidden md:table-row font-bold text-white text-sm py-4"> 
				<div class="table-cell p-2 align-middle cursor-pointer" @click="sortBy('name',activePage,search,filterCompliances)">
					Name
					<svgicon v-if="sortedBy!='name'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
					<svgicon v-if="sortType==true && sortedBy=='name'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white"/>
					<svgicon v-if="sortType==false && sortedBy=='name'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white"/>
				</div> 
				<div class="table-cell p-2 align-middle cursor-pointer" @click="sortBy('profession',activePage,search,filterCompliances)" >
					Profession
					<svgicon v-if="sortedBy!='profession'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
					<svgicon v-if="sortType==true && sortedBy=='profession'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white"/>
					<svgicon v-if="sortType==false && sortedBy=='profession'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white"/>
				</div>
				<div class="table-cell p-2 align-middle cursor-pointer" @click="sortBy('created_at',activePage,search,filterCompliances)" >
					Date signed-up
					<svgicon v-if="sortedBy!='created_at'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
					<svgicon v-if="sortType==true && sortedBy=='created_at'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white"/>
					<svgicon v-if="sortType==false && sortedBy=='created_at'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white"/>
				</div>
				<div class="table-cell p-2 align-middle cursor-pointer" @click="sortBy('email_verified_at',activePage,search,filterCompliances)" >
					Sign-up verified
					<svgicon v-if="sortedBy!='email_verified_at'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
					<svgicon v-if="sortType==true && sortedBy=='email_verified_at'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white"/>
					<svgicon v-if="sortType==false && sortedBy=='email_verified_at'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white"/>
				</div>
				<div class="table-cell p-2 align-middle">
					Status
				</div>
				<div class="table-cell p-2 align-middle">
					Compliance Status
				</div>
			</div>
			<!-- BODY -->
			<nuxt-link 
			v-for="(locumUser, index) in locumUsers" 
			:key="`locumUser-${index}`" 
			:to="{ path: `/locums/${locumUser.id}`, query: $route.query }" 
			class="flex flex-col sm:flex-row sm:flex-wrap px-2 py-2 my-2 border-l-8 border-yellow-dark md:border-l-0 md:table-row text-white no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light" 
			draggable="false"
			>
				<div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 py-2 md:py-4 align-middle">
					<strong class="block md:hidden text-sm uppercase">Name</strong>
					<span class="">{{ locumUser.personal_detail ? locumUser.personal_detail.name : null }}</span>
				</div>
				<div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
					<strong class="block md:hidden text-sm uppercase">Profession</strong>
					<span class="">{{ locumUser.locum_detail && locumUser.locum_detail.profession ? locumUser.locum_detail.profession.name : null }}</span>
				</div>
				<div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
					<strong class="block md:hidden text-sm uppercase">Date signed-up</strong>
					<span class="">{{ $moment(locumUser.created_at).format('MMM D, YYYY') }}</span>
				</div>
				<div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
					<strong class="block md:hidden text-sm uppercase">Sign-up verified</strong>
					<span class="">{{ locumUser.email_verified_at ? $moment(locumUser.email_verified_at).format('MMM D, YYYY') : 'Not yet verified' }}</span>
				</div>
				<div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell sm:px-1 py-2 md:py-4 align-middle">
					<strong class="block md:hidden text-sm uppercase">Status</strong>
					<span class="inline-flex text-black text-sm py-2 p-3 rounded-full"
						:class="statusStyle(locumUser.status)">{{ locumUser.status  }}</span>
				</div>
				<div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell sm:pl-1 sm:pr-4 py-2 md:py-4  align-middle">
						<strong class="block md:hidden text-sm uppercase">Compliance Status</strong>
					<span class="inline-flex text-black text-sm py-2 p-3 rounded-full"
						:class="complianceStatusStyle(locumUser.compliance_status)">{{ locumUser.compliance_status  }}</span>
					</div>
			</nuxt-link>
		</div>
		<!-- TABLE ENDS HERE-->
		
		
		<!-- PAGINATION -->
		<div class="flex justify-center">
			<div >
				<button class="page-button p-2 px-4 m-1 rounded-lg font-bold text-sm text-black"
					@click="goToPage(activePage - 1, search, order_by, filterCompliances)" 
					:class="activePage === 1 ? 'text-grey-dark' : 'hover:bg-yellow'">Prev
				</button>

				<button class="page-button p-2 px-4 m-1 rounded-lg font-bold text-sm text-black hover:bg-waterloo-light" 
					:class="`${activePage === page ? 'text-white' : ''}`" 
					v-for="page in pageCount" 
					v-if="showPage(page)"
					:key="`page-${page}`" 
					@click="goToPage(page, search, order_by, filterCompliances)">{{ page }}
				</button>
				
				<button class="page-button p-2 px-4 m-1 rounded-lg font-bold text-sm text-black hover:bg-waterloo-light" 
					@click="goToPage(activePage + 1, search, order_by, filterCompliances)"
					:class="`${activePage == pageCount ? 'text-grey-dark': ''}`">Next
				</button>														
			</div>
		</div>
		<!-- PAGINATION ENDS HERE -->
		<div class="locum-shield" v-if="$route.name.includes('index-locums-id')"></div>
		<nuxt-child/>

	</div>
</template>

<script>
import AppLoading from '@/components/Base/AppLoading'
export default {
	components:{
		AppLoading
	},
	data() {
		return {
			loading: false,
			itemsPerPage: 8,
			activePage: 1,
						
			filterCompliances:'',
			search: '',
			paramFilterSort:{
				order_by:''
			},
			sort:'',
			sortedBy:'',
			sortType:'', 
			order_by:'',
			name: true,
			profession: true,
			created_at: true,
			email_verified_at: true
		}
	},
	watchQuery: [
	'page',
	'search',
	'compliance_status'
	],

	async asyncData({ app, store, route }) {
		try {
			let {
				page = 1,
				search = '',
				order_by='',
				compliance_status = null  
			} = route.query

			if (!compliance_status) {
		
			}
			page = parseInt(page)
			const createdRoute = route.query
			const limit = 8
			const offset = page * limit - limit
			order_by = createdRoute && createdRoute.order_by ? createdRoute.order_by : 'created_at:desc'
			const params = { limit, offset, order_by }
				
			if (search) {
				params.search = search
			}
			params.compliance_status = compliance_status
				
			const getLocumUsersCountPromise = app.$axios.get(`/api/v1/admin/locum-users/count`, { params })
			const getLocumUsersPromise = app.$axios.get(`/api/v1/admin/locum-users`, { params })
			
			let response = await getLocumUsersCountPromise
			const itemCount = response.data.data.count
			
			response = await getLocumUsersPromise
			const locumUsers = response.data.data.users
			
			store.commit('locums/SET_LOCUM_COUNT',itemCount) //put the obtained data from the database to the state
			store.commit('locums/SET_LOCUM_USERS',locumUsers)// 'SET_DATA_PROPERTY denotes a mutation 

			return {
				filterCompliances: compliance_status,
				loading: false,
				itemsPerPage: limit,
				activePage: page,
				search,
				order_by
			}
		} catch (err) {
			console.log('index users index asyncData err', err)
		}
	},

	computed: {
		locumUsers(){
			return this.$store.state.locums.locumUsers //the data obtained by the state goes here
		},
		itemCount(){
			return this.$store.state.locums.itemCount
		},
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

	watch: {
		async filterCompliances() {
			const query = {
				...this.$router.query
			}

			query.compliance_status = this.filterCompliances

			if (this.filterCompliances === '') {
				delete query.compliance_status
			}

			if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
				this.loading = true
			}

			this.$router.push({ query })

			return

			const params = {}

			if (this.search) {
				params.search = this.search
			}

			if (this.filterCompliances) {
				params.compliance_status = this.filterCompliances
			}

			this.paramFilterSort.compliance_status = this.filterCompliances

			this.getLocums(this.paramFilterSort)
		}
	},

	methods: {
		getQuery(){
			const query = {
				...this.$route.query
			}
			const offset = parseInt(query.page)*8 - 8 
			return offset
		},
		getLocums(params){
			this.$store.dispatch("locums/fetchLocums",{
				limit:8,
				search:params.search,
				compliance_status:params.compliance_status,
				order_by:params.order_by,
				offset: this.getQuery()
			});
		},
		async sortBy(sortedBy,page,search,compliance_status) {
			switch (sortedBy) {
				case 'name':
					this.sortedBy = sortedBy
					this.name = !this.name
					this.sortType = this.name
				case 'profession':
					this.sortedBy = sortedBy
					this.profession = !this.profession
					this.sortType = this.profession
				break;
				case 'created_at':
					this.sortedBy = sortedBy
					this.created_at = !this.created_at
					this.sortType = this.created_at
				break;
				case 'email_verified_at':
					this.sortedBy = sortedBy
					this.email_verified_at = !this.email_verified_at
					this.sortType = this.email_verified_at
				break;
			}
			this.paramFilterSort.order_by = await `${sortedBy}:${this.sortType ? 'asc' : 'desc'}`
			let order_by = await this.paramFilterSort.order_by
			console.log(order_by)
			let query = {
				...this.$router.query,
				order_by
			}
			if (page === 1) {
				delete query.page
			}
			if(page){
				query = {...this.$router.query,page,order_by}
			}
			if(search){
				query = {...this.$router.query,search,order_by}
			}
			if(compliance_status){
				query = {...this.$route.query,compliance_status,order_by}
			}
			if(page && search){
				query = {...this.$router.query,page,search,order_by}
			}
			if(page && compliance_status){
				query = {...this.$router.query,page,compliance_status,order_by}
			}
			if(search && compliance_status){
				query = {...this.$router.query,search,compliance_status,order_by}
			}
			if(page && search && compliance_status){
				query = {...this.$router.query,page,search,compliance_status}
			}
			if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
				this.loading = true
			}
			this.$router.push({query})
			
			console.log('hello',this.paramFilterSort)
			this.paramFilterSort.search = search
			this.paramFilterSort.compliance_status = compliance_status
			this.getLocums(this.paramFilterSort)
		},
		goToPage(page,search,order_by, compliance_status) {
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
			if(order_by){
				query = {...this.$router.query,page,order_by}
			}
			if(compliance_status){
				query = {...this.$router.query,page,compliance_status}
			}

			if(search && order_by){
				query = {...this.$router.query,page,search,order_by}
			}

			if(search && compliance_status){
				query = {...this.$router.query,page,search,compliance_status}
			}

			if(order_by && compliance_status){
				query = {...this.$router.query,page,order_by,compliance_status}
			}

			if(search && order_by && compliance_status){
				query = {...this.$router.query,page,search,order_by,compliance_status}
			}

			if (page === 1) {
				delete query.page
			}

			if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
				this.loading = true
			}

			this.$router.push({ query })
		},

		searchSubmit(page,order_by,compliance_status) {
			let search= this.search

			let query = {...this.$router.query,search}

			if (page === 1) {
				delete query.page
			}

			if(page){
				query = {...this.$router.query,page,search}
			}
			if(order_by){
				query = {...this.$router.query,search,order_by}
			}
			if(compliance_status){
				query = {...this.$router.query,search,compliance_status}
			}
			if(page && order_by){
				query = {...this.$router.query,page,search,order_by}
			}
			if(page && compliance_status){
				query = {...this.$router.query,page,search,compliance_status}
			}
			if(compliance_status && order_by){
				query={...this.$router.query,search,compliance_status,order_by}
			}
			if(page && compliance_status && order_by){
				query = {...this.$router.query,page,search,compliance_status,order_by}
			}
			if (this.search === '') {
				delete query.search
			}

			if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
				this.loading = true
			}

			this.$router.push({ query })
		},

		statusStyle(status){
			switch(status){
				case 'Active':
					return 'bg-green text-white lg:px-8 sm:px-2'
					break;
				case 'Inactive':
					return 'bg-yellow text-black lg:px-8 sm:px-2'
					break;
				case 'Deactivated':
					return 'bg-grey text-black lg:px-8 sm:px-2'
					break;
				case 'Suspended':
					return 'bg-red text-white lg:px-8 sm:px-2'
					break;
				case 'Dormant':
					return 'bg-green-darker text-white lg:px-8 sm:px-2'
					break;
				default:
					return
			}
		},
		complianceStatusStyle(status){
			switch(status){
				case 'Empty':
					return 'border border-white text-white lg:px-8 sm:px-2'
					break;
				case 'Incomplete':
					return 'bg-yellow-light text-black lg:px-8 sm:px-2'
					break;
				case 'Pending':
					return 'bg-yellow text-black lg:px-8 sm:px-2'
					break;
				case 'Expiring':
					return 'bg-orange text-black lg:px-8 sm:px-2'
					break;
				case 'Expired':
					return 'bg-red text-white lg:px-8 sm:px-2'
					break;
				case 'Rejected':
					return 'bg-orange-dark text-black lg:px-8 sm:px-2'
					break;
				case 'Compliant':
					return 'bg-green text-white lg:px-8 sm:px-2'
					break;
				default:
					return
			}
		},
		
	}
}
</script>
<style>
.page-button {
  background: linear-gradient(to top, #f2d024, #efde86);
}
</style>
