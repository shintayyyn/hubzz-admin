<template>
    <div class="flex-1 flex flex-col py-2 px-4 overflow-auto">
        <div class="flex px-2 justify-between">
            <div>
                <div class="text-4xl text-white">Admin Management</div>
                <div class="text-xs mb-4 text-white">Work in progress.</div>
            </div>
            <div>
                <button
                v-if="deleteAdminUser == true"
                @click="deleteAdminUser = false"
                class="inline-flex no-underline m-1 py-2 px-4 md:my-2 bg-green text-sm font-semibold text-white rounded-lg shadow md:float-right"
                >Done</button>
                <button
                v-if="deleteAdminUser == false"
                @click="deleteAdminUser = true"
                class="inline-flex no-underline m-1 py-2 px-4 md:my-2 bg-red text-sm font-semibold text-white rounded-lg shadow md:float-right"
                >Delete Admin User</button>
                <button
                @click="show()"
                class="inline-flex no-underline m-1 py-2 px-4 md:my-2 bg-sunglow text-sm font-semibold text-black rounded-lg shadow md:float-right"
                >Create Admin Account</button>
            </div>
        </div>
        <div v-if="adminUsers.length>0" class="px-2 table border-separate overflow-x-auto" style="border-spacing: 0 10px;"> 
            <!-- HEADER -->
            <div class="hidden md:table-row font-bold text-white text-sm py-4">
                <div v-if="deleteAdminUser == true" class="table-cell">Delete Admin User</div> 
                <div class="table-cell p-2 align-middle">E-Mail</div> 
                <div class="table-cell p-2 align-middle">Domain</div>
                <div class="table-cell p-2 align-middle">Name</div>
            </div>
            <!-- END HEADER -->
            <!-- BODY -->
            <div
                v-for="(user, index) in adminUsers"
                :key="`user-${index}`"
                class="flex flex-col sm:flex-row sm:flex-wrap justify-between px-2 py-2 border-l-8 border-yellow-dark md:border-l-0 md:table-row my-2 text-white no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light" 
            >
                <div @click="toDeleteAdminUser(user.id)" v-if="deleteAdminUser == true">
                    <svgicon
                        name="delete-user"
                        width="21"
                        height="21"
                        color="red red"
                        class="mx-3 mt-3"/>
                </div>
                <nuxt-link :to="{ path: `/admin-management/${user.id}`,query: $route.query}" class="flex flex-col text-white sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
                    <strong class="block md:hidden text-sm uppercase">E-Mail</strong>
                    <span class="break-word">{{ user.email }}</span>
                </nuxt-link>
                <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
                    <strong class="block md:hidden text-sm uppercase">Domain</strong>
                    <span class="break-all">{{ user.domain }}</span>
                </div>
                <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
                    <strong class="block md:hidden text-sm uppercase">Name</strong>
                    <span class="break-all">{{ user.personal_detail.name }}</span>
                </div>
            </div>
            <!-- END BODY -->
        </div>
        <!-- PAGINATION -->
		<div class="flex justify-center">
			<div >
				<button class="page-button p-2 px-4 m-1 rounded-lg font-bold text-sm text-black"
					@click="goToPage(activePage - 1 ,search)" 
					:class="activePage === 1 ? 'text-grey-dark' : 'hover:bg-yellow'">Prev
				</button>

				<button class="page-button p-2 px-4 m-1 rounded-lg font-bold text-sm text-black hover:bg-waterloo-light" 
					:class="`${activePage === page ? 'text-white' : ''}`" 
					v-for="page in pageCount" 
					v-if="showPage(page)"
					:key="`page-${page}`" 
					@click="goToPage(page, search)">{{ page }}
				</button>
				
				<button class="page-button p-2 px-4 m-1 rounded-lg font-bold text-sm text-black hover:bg-waterloo-light" 
					@click="goToPage(activePage + 1, search)"
					:class="`${activePage == pageCount ? 'text-grey-dark': ''}`">Next
				</button>														
			</div>
		</div>
		<!-- PAGINATION ENDS HERE -->
        <nuxt-child/>
        <div class="new-user-shield" v-if="modal"></div>
        <transition name="slide" mode="out-in">
            <div class="new-user-modal" v-if="modal">
                <CreatePracticeUser @close="modal = false" :adminCreate="adminCreate"/>
            </div>
        </transition>
        <div class="admin-user-shield" v-if="$route.name.includes('index-admin-management-id')"/>
   </div>
</template>
<script>
import CreatePracticeUser from '@/components/Practices/CreatePracticeUser'
    export default {
        components:{
            CreatePracticeUser
        },
        data(){
            return{
                itemsPerPage : 8,
                activePage: 1,

                search:'',
                // itemCount:'',
                // adminUsers:{},
                adminCreate:true,
                modal:false,
                deleteAdminUser:false
            }
        },
        watchQuery: [
        'page',
        'search',
        ],
        async asyncData({ app, store, route}){
            try{
                await store.commit('adminusers/TOGGLE_LOADING', true)
                let{
                    page = 1,
                    search = '',
                } = route.query

                page = parseInt(page)
                const limit = 8
                const offset = page * limit - limit
                const params = { limit, offset }
                
                if(search){
                    params.search = search
                }
                const getAdminUsersCount = await app.$axios.get(`/api/v1/admin/admin-users/count`,{ params })
                const getAdminUsers = await app.$axios.get(`/api/v1/admin/admin-users`,{ params })

                let response = await getAdminUsersCount
                const itemCount = response.data.data.count

                response = await getAdminUsers
                const adminUsers = response.data.data.users
                
                //store users adn count here
                await store.commit('adminusers/SET_ADMIN_COUNT', itemCount)
                await store.commit('adminusers/SET_ADMIN_USERS', adminUsers)
                await store.commit('adminusers/TOGGLE_LOADING', false)
                return{
                    itemsPerPage: limit,
                    activePage: page,
                    search,
                    //itemCount, //store
                    //adminUsers //store
                }
            }catch(err){
                store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
                console.log('get users error',err)
            }
        },
        computed:{
            loadingAdminUsers(){
                return this.$store.state.adminusers.loading_admin_users
            },
            itemCount(){
                return this.$store.state.adminusers.itemCount
            },
            adminUsers(){
                return this.$store.state.adminusers.adminUsers
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
        methods:{
             getAdminUsers(){
                this.$store.dispatch("adminusers/fetchAdminUsers",{})
                this.$store.dispatch("adminusers/fetchAdminUsers",{
                    limit:8
                })
            },
            async toDeleteAdminUser(userId){
                await this.$axios.$delete(`/api/v1/admin/admin-users/${userId}`).then(()=>{
                    this.getAdminUsers()
                    this.$store.commit('SET_NOTIFICATION',{ enabled:true, status: 'success', text: 'Admin Account Successfully Deleted'})
                }).catch((err)=>{
                    this.$store.commit('SET_NOTIFICATION',{ enabled:true, status: 'danger', text: 'Something Went Wrong!'})
                })
            },
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
    }
</script>
<style>
.page-button {
  background: linear-gradient(to top, #f2d024, #efde86);
}
.new-user-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.new-user-modal{
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
  .new-user-modal {
    width: 70%;
  }
}
</style>