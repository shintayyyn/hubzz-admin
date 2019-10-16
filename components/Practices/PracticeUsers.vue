<template>
    <div>
        <AppLoading :loading="loadingPracticeUsers" :message="'Loading Practice Users'"/>
        <div class="w-full overflow-hidden">
            <div>
              <button
                class="inline-flex no-underline py-2 px-4 bg-sunglow text-sm font-semibold text-black rounded-lg shadow float-left"
                @click="show(surgery.id)"
              >Add User
              </button>
            </div>
        </div>
        <div class="text-white " v-if="users.length == 0">
            <div
            class="mt-10 w-full text-center"
            style="font-family: Nunito"
            >This practice has no users.</div>
        </div>
        <div v-else class="flex flex-col text-white mt-4"> 
            <div class="w-full hidden md:flex text-sm font-bold pb-2"> 
                <div class="w-1/5 px-4">Full Name</div> 
                <div class="w-1/5 px-3">Email Address</div>
                <div class="w-1/5 px-2">Role</div>
                <div class="w-1/5 px-1">Sign-Up Verified</div>
                <div class="w-1/5">Status</div>
            </div>
            <div
                v-for="(user, index) in users"
                :key="`user-${index}`"
                @click="$router.push(`/practices/${practice.id}/practice-users/${user.id}`)"
                class="w-full flex flex-col md:flex-row rounded-lg bg-waterloo hover:bg-waterloo-light my-2 shadow-lg cursor-pointer p-4 md:p-2 border-l-8 border-sunglow md:border-0" 
                ><!--This needs to lead to a nuxt child with admin being able to modify the user-->
                <div class="w-full md:w-1/5 py-2 md:px-2 flex flex-col md:flex-row md:items-center">
                    <strong class="block md:hidden text-sm uppercase">Full Name</strong>
                    <span class="break-words">{{ user.personal_detail.name }}</span>
                </div>
                <div class="w-full md:w-1/5 py-2 md:px-2 flex flex-col md:flex-row md:items-center">
                    <strong class="block md:hidden text-sm uppercase">Email Address</strong>
                    <span class="break-words break-all">{{ user.email }}</span>
                </div>
                <div class="w-full md:w-1/5 py-2 md:px-2 flex flex-col md:flex-row md:items-center">
                    <strong class="block md:hidden text-sm uppercase">Role</strong>
                    <span class="break-words">{{ user.practice_detail.practice_role }}</span>
                </div>
                <div class="w-full md:w-1/5 py-2 md:px-2 flex flex-col md:flex-row md:items-center">
                    <strong class="block md:hidden text-sm uppercase">Sign-up Verified</strong>
                    <span class="break-words">{{ user.email_verified_at ? $moment(user.email_verified_at).format('MMM D, YYYY | hh:mm A') : null }}</span>
                </div>
                <div class="w-full md:w-1/5 py-2 md:px-2 flex flex-col md:flex-row md:items-center">
                    <strong class="block md:hidden">Status</strong>
                    <span class="inline-flex w-1/3 md:w-full justify-center text-black text-sm py-2 px-8 rounded-full"
                    :class="`${user.status === 'Active' ? 'bg-green-500 text-white lg:px-8 sm:px-2' : 'bg-yellow-500 text-black lg:px-6 sm:px-2' }`"
                    >{{ user.status }}
                    </span>
                </div>
            </div> 
        </div>
        <div v-if="!users.length == 0">
            <AppPagination
                :total="total"
                :totalPages="totalPages"
                :currentPage="currentPage"
                @pagechanged="pagechanged"
            />
        </div> 
        <div class="edit-practice-user-shield" v-if="$route.name.includes('index-practices-id-index-practice-users-pracUserId')"></div>
        <div class="edit-practice-user-shield" v-if="modal"></div>
        <transition name="slide" mode="out-in">
            <div class="practice-user-modal shadow-lg" v-if="modal">
                <CreatePracticeUser @close="modal = false" :practice="practice" :surgery="surgery" :userCount="total"/>
            </div>
        </transition>
    </div>
</template>
<script>
import CreatePracticeUser from '@/components/Practices/CreatePracticeUser'
import AppPagination from '@/components/Base/AppPagination'
import AppLoading from '@/components/Base/AppLoading'
export default {
    props:['practice'],
    components:{
        CreatePracticeUser,
        AppPagination,
        AppLoading
    },
    data(){
        return {
            loadingPracticeUsers:false,
            modal:false,
            // total:0,
            // users:[],
            // totalPages:0,
            currentPage:1,
            perPage:0,
            surgery:null,
            query:null
        }
    },
    beforeDestroy(){
        let query = Object.assign({}, this.$route.query)
        delete query.practice_users_page
        this.$router.push({ query })
    },
    watch:{
        $route(to, from){
            this.currentPage = parseInt(to.query.practice_users_page)
            this.getAllPracticeUsers() 
        },
    },
    computed:{
        total(){
            return this.$store.state.practices.practiceUsersCount
        },
        users(){
            return this.$store.state.practices.practiceUsers
        },
        totalPages(){
            return this.$store.state.practices.practiceUsersPageCount
        }

    },
    async created(){
        const query = {
            ...this.$route.query,
            practice_users_page: this.$route.query.practice_users_page || 1
        }
        this.loading = true
        let practice_id = this.practice.id
        let params = {
            practice_id
        } 
        try{
            this.loadingPracticeUsers = true
            await this.$axios.$get(`/api/v1/admin/practice-users/count`,{params}).then(res=>{
                this.$store.commit(`practices/SET_PRACTICE_USERS_COUNT`,res.data.count)
                this.perPage = 5
                let pageCount = Math.ceil(this.total / this.perPage)
                this.$store.commit('practices/SET_PRACTICE_USERS_PAGE_COUNT',pageCount)
                this.getAllPracticeUsers()
            })
        }catch(err){
            this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
            console.log(err)
        }
       
        this.surgery = this.practice.surgery
        
    }, 
    methods:{
        async getAllPracticeUsers(){
            let practice_id = this.practice.id
            let limit = 5
            let offset = 0
            offset = this.perPage*(parseInt(this.$route.query.practice_users_page)-1)
            let params = {
                practice_id,
                order_by:'created_at:desc',
                limit,
                offset,
            } 
            await this.$axios.$get(`/api/v1/admin/practice-users`,{params}).then(res=>{
                this.$store.commit('practices/SET_PRACTICE_USERS', res.data.users)
            }).catch(err=>{
                console.log('get users error!',err)
                this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
            })
            this.loadingPracticeUsers = false
        },
        
        show(id){
            Promise.all([
                this.surgery = this.practice.surgery
            ]).then(()=>{
                console.log('The surgery opened is', this.surgery)
                this.modal = true
            })
        },
        pagechanged(e) {
            const query = {
                ...this.$route.query,
                practice_users_page: e || 1
            }
            this.$router.push({ query })
            this.getAllPracticeUsers()
        }
    },
      
    
}
</script>
<style>
.edit-practice-user-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.edit-practice-user-modal {
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
  .edit-practice-user-modal {
    width: 70%;
  }
}
</style>