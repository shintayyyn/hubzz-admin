<template>
    <div class="flex-1 flex flex-col py-2 px-4 overflow-auto">
        <div class="flex px-2 justify-between">
            <div>
                <div class="text-4xl mb-4 text-white">Admin Management</div>
            </div>
            <div>
                <button
                @click="show()"
                class="inline-flex no-underline py-2 px-4 md:my-2 bg-sunglow text-sm text-black rounded-lg shadow md:float-right"
                >Create Admin Account</button>
            </div>
        </div>
        <div v-if="users.length>0" class="px-2 table border-separate overflow-x-auto" style="border-spacing: 0 10px;"> 
            <!-- HEADER -->
            <div class="hidden md:table-row font-bold text-white text-sm py-4"> 
                <div class="table-cell p-2 align-middle">E-Mail</div> 
                <div class="table-cell p-2 align-middle">Domain</div>
                <div class="table-cell p-2 align-middle">Name</div>
            </div>
            <!-- END HEADER -->
            <!-- BODY -->
            <div
                v-for="(user, index) in users"
                :key="`user-${index}`"
                class="flex flex-col sm:flex-row sm:flex-wrap justify-between px-2 py-2 border-l-8 border-yellow-dark md:border-l-0 md:table-row my-2 text-white no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light" 
            >
                <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
                    <strong class="block md:hidden text-sm uppercase">E-Mail</strong>
                    <span class="break-word">{{ user.email }}</span>
                </div>
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
        <div class="new-user-shield" v-if="modal"></div>
        <transition name="slide" mode="out-in">
        <div class="new-user-modal" v-if="modal">
            <CreatePracticeUser @close="modal = false" :adminCreate="adminCreate"/>
        </div>
        </transition>
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
                users:{},
                adminCreate:true,
                modal:false
            }
        },
        async asyncData({app,store,route}){
            try{
                let response = await app.$axios.get(`/api/v1/admin/admin-users`)
                const users = response.data.data.users

                return{
                    users
                }
            }catch(err){
                console.log('get users error',err)
            }
        },
        methods:{
            show(){
                this.modal=true
            },
        }
    }
</script>
<style>
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