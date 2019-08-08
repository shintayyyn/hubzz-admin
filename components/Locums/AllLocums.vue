<template>
	<div class="flex-1 flex flex-col py-2">
		<div class="flex flex-col md:flex-row justify-between px-6">
		
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
		
		<!-- TABLE -->
		<div class="table border-separate overflow-x-auto mx-6" style="border-spacing: 0 10px;"> 
			<!-- HEADER -->
			<div class="hidden md:table-row font-bold text-white text-sm py-4"> 
				<div class="table-cell p-2 align-middle">Name</div> 
				<div class="table-cell p-2 align-middle">Profession</div>
				<div class="table-cell p-2 align-middle">Date signed-up</div>
				<div class="table-cell p-2 align-middle">Sign-up verified</div>
				<div class="table-cell p-2 align-middle">Status</div>
				<div class="table-cell p-2 align-middle">Compliance Status</div>
			</div>
			<!-- BODY -->
			<nuxt-link
				v-for="(locumUser, index) in locumUsers" 
				:to="{path:`/locums/${locumUser.id}`,query:$route.query}"
				:key="`locumUser-${index}`" 
				class="flex flex-col sm:flex-row sm:flex-wrap px-2 py-2 my-2 rounded-lg border-l-8 border-yellow-dark md:border-l-0 md:table-row text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light" 
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
		<!-- TABLE -->
		<!-- PAGINATION -->
		
		<AppPagination
			:total="total"
			:totalPages="totalPages"
			:currentPage="currentPage"
			@pagechanged="pagechanged"
			:loading="loading"
		/>
		
		<!-- PAGINATION -->

			<div class="locum-shield" v-if="$route.name.includes('index-locums-id')"></div>

		<!-- <transition name="slide" mode="out-in">
			<div class="locum-modal shadow-lg" v-if="modal">
				<LocumDetailModal @close="modal = false" :user="user" />
			</div>
		</transition> -->

		<nuxt-child/>
	</div>
</template>

<script>
import AppPagination from '@/components/Base/AppPagination'
import AppLoading from '@/components/Base/AppLoading'
import LocumDetailModal from '@/components/Locums/LocumDetailModal'
export default{
	components:{
		AppPagination,
		AppLoading,
		LocumDetailModal
	},
	data(){
		return {
			locumUsers: [],
			user:null,
			total: 0,
			totalPages: 0,
			currentPage: 0,
			perPage: 0,
			loading: false,
			modal:false,
			filterCompliances:'',
			search: '',
			sortBy: 'name',
			sortDirection:'asc'
		}
	},
	beforeDestroy() {
		let query = Object.assign({}, this.$route.query)
		delete query.current_page
		this.$router.push({ query })
	},
	watch:{
		$route(to, from) {
			this.currentPage = parseInt(to.query.current_page)
			this.getAllLocums()
    	},
	},
	created(){
		const query = {
			...this.$route.query,
			current_page: this.$route.query.current_page || 1
		}

		this.$axios.$get(`/api/v1/admin/locum-users/count`).then(res=>{
			this.total = res.data.count
			this.perPage = 8
			this.totalPages = Math.ceil(this.total/this.perPage)
			this.getAllLocums()
		})

	},

	computed:{

	},
	
	methods:{
		getAllLocums(){
			this.loading = true
			let offset = 0
			offset = this.perPage * (parseInt(this.$route.query.current_page) - 1)
			
			this.$axios.$get(`/api/v1/admin/locum-users?limit=${this.perPage}&offset=${offset}`).then(res=>{
				this.locumUsers = res.data.users
			})
			this.loading = false 
			
		},
		show(id){
			console.log(id)
			Promise.all([
				this.$axios.$get(`/api/v1/admin/locum-users/${id}`).then(res =>{
					this.user = res.data.user
				})
			]).then(()=>{
				console.log('this is the user from all locums', this.user)
				this.modal = true
			})

		},
		pagechanged(e) {
			const query = {
				...this.$route.query,
				current_page: e || 1
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
.card {
  min-width: 100px;
  height: 250px;
  box-sizing: content-box;
}
.locum-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.locum-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px orange;
  transition: all 0.3s ease-in-out;
  background-color:#505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .locum-modal {
    width: 80%;
  }
}
</style>