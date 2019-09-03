<template>
    <div class="px-4">
        <div class="w-full overflow-hidden">
            <div>
              <button
                class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow float-left"
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
        <div v-else class="table border-separate overflow-x-auto" style="border-spacing: 0 10px;"> 
            <div class="hidden md:table-row font-bold text-white text-sm py-4"> 
                <div class="table-cell p-2 align-middle">Full Name</div> 
                <div class="table-cell p-2 align-middle">Email Address</div>
                <div class="table-cell p-2 align-middle">Role</div>
                <div class="table-cell p-2 align-middle">Sign-Up Verified</div>
                <div class="table-cell p-2 align-middle">Status</div>
            </div>
            <nuxt-link
                v-for="(user, index) in users"
                :key="`user-${index}`"
                :to="{path:`/practices/${practice.id}/practice-users/${user.id}`,query}"
                class="flex flex-col md:flex-row sm:flex-wrap px-2 py-2 border-l-8 border-yellow-dark md:border-l-0 md:table-row my-2 text-white no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light" 
                draggable="false"
                ><!--This needs to lead to a nuxt child with admin being able to modify the user-->
                <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
                    <strong class="block md:hidden text-sm uppercase">Full Name</strong>
                    <span class="break-word">{{ user.personal_detail.name }}</span>
                    <span class="break-word">{{ user.id}}</span>
                </div>
                <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
                    <strong class="block md:hidden text-sm uppercase">Email Address</strong>
                    <span class="break-all">{{ user.email }}</span>
                </div>
                <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
                    <strong class="block md:hidden text-sm uppercase">Role</strong>
                    <span class="break-all">{{ user.practice_detail.practice_role }}</span>
                </div>
                <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
                    <strong class="block md:hidden text-sm uppercase">Sign-up Verified</strong>
                    <span class="break-all">{{ user.email_verified_at ? $moment(user.email_verified_at).format('MMM D, YYYY | hh:mm A') : null }}</span>
                </div>
                <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell pl-1 pr-4 py-2 md:py-4 align-middle">
                    <strong class="block md:hidden">Status</strong>
                    <span class="inline-flex text-black text-sm py-2 px-8 rounded-full"
                    :class="`${user.status === 'Active' ? 'bg-green text-white lg:px-8 sm:px-2' : 'bg-yellow text-black lg:px-6 sm:px-2' }`"
                    >{{ user.status }}
                    </span>
                </div>
            </nuxt-link> 
            <div v-if="!users.length == 0" class="ml-32">
                <AppPagination
                    :total="total"
                    :totalPages="totalPages"
                    :currentPage="currentPage"
                    @pagechanged="pagechanged"
                />
            </div> 
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
export default {
    props:['practice'],
    components:{
        CreatePracticeUser,
        AppPagination
    },
    data(){
        return {
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
            await this.$axios.$get(`/api/v1/admin/practice-users/count`,{params}).then(res=>{
                console.log(res)
                this.$store.commit(`practices/SET_PRACTICE_USERS_COUNT`,res.data.count)
                this.perPage = 5

                let pageCount = Math.ceil(this.total / this.perPage)
                this.$store.commit('practices/SET_PRACTICE_USERS_PAGE_COUNT',pageCount)
                this.getAllPracticeUsers()
            })
        }catch(err){
            console.log(err)
        }
       
        this.surgery = this.practice.surgery
        console.log(this.$route.name)
        
    }, 
    methods:{
        async getAllPracticeUsers(){
            this.loading = true
            let practice_id = this.practice.id
            let limit = 5
            let offset = 0
            offset = this.perPage*(parseInt(this.$route.query.practice_users_page)-1)
            let params = {
                practice_id,
                limit,
                offset
            } 
            await this.$axios.$get(`/api/v1/admin/practice-users`,{params}).then(res=>{
                console.log(res)
                this.$store.commit('practices/SET_PRACTICE_USERS', res.data.users)
            }).catch(err=>{
                console.log('get users error!',err)
                this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
            })
            this.loading = false
        },
        
        show(id){
            console.log(id)
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