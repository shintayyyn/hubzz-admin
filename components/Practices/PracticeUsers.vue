<template>
<!-- <div>
  Users tab
</div> -->
    <div>
        <div class="flex flex-col rounded-lg px-6 py-2">
        <div class="w-full overflow-hidden">
          <!-- <nuxt-link :to="`/practices/${practice.id}/users/new-practice-user/${surgeries.id}`">
            <button
              class="inline-flex no-underline  py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow float-left" no-underline
            >Add User
            </button>
            
          </nuxt-link> -->
        </div>
          <div class="table border-separate overflow-x-auto" style="border-spacing: 0 10px;"> 
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
            :to="`/practices/${practice.id}/users/edit-user/${user.id}`"
            class="flex flex-col md:flex-row sm:flex-wrap px-2 py-2 border-l-8 border-yellow-dark md:border-l-0 md:table-row my-2 text-white no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light" 
            draggable="false"
            >
              <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
                <strong class="block md:hidden text-sm uppercase">Full Name</strong>
                <span class="break-word">{{ user.personal_detail.name }}</span>
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
           </div>
        </div>
    </div>
</template>
<script>
import AppLoading from '@/components/Base/AppLoading'
export default {
    components:{
      AppLoading
    },  
    props:['practice'],
    data(){
        return{
          users:[],
          total: 0,
          totalPages: 0,
          currentPage: 0,
          perPage: 0,
          loading: false,
        }
    },
    components:{

    },
    created(){  
      this.$axios.$get(`/api/v1/admin/practice-users/count?practice_id=${this.practice.id}`).then(res=>{
        this.total = res.data.count
        this.perPage = 8
        this.totalPages = Math.ceil(this.total/this.perPage)
        this.getAllPracticeUsers()
      })
    },
    methods:{
      getAllPracticeUsers(){
        this.loading = true
        let offset = 0
        offset = this.perPage *(parseInt(this.$route.query.current_page) - 1)

        this.$axios.$get(`/api/v1/admin/practice-users?practice_id=${this.practice.id}`).then(res=>{
          this.users = res.data.users
        })
        this.loading = false
      }
    }
}
</script>
