<template>
    <div class="flex-1 flex flex-col py-2 px-4 overflow-auto">
      <div class="flex flex-row-reverse px-2 justify-between flex-wrap">
        <div>
             <button
          class="inline-flex no-underline m-1 py-2 px-4 md:my-2 bg-red-500 text-sm font-semibold text-white rounded-lg shadow md:float-right"
          >Delete Role</button>
          <button
          class="inline-flex no-underline m-1 py-2 px-4 md:my-2 bg-green-500 text-sm font-semibold text-white rounded-lg shadow md:float-right"
          @click="modal=true"
          >Add New Role</button>
        </div>
      </div>
      <div class="px-2 table border-separate overflow-x-auto" style="border-spacing: 0 10px;">
        <!-- HEADER -->
        <div class="hidden md:table-row font-bold text-white text-sm py-4">
          <div class="table-cell p-2 align-middle">Role Name</div> 
          <div class="table-cell p-2 align-middle">Date Created</div>
          <div class="table-cell p-2 align-middle">Description</div>
        </div>
        <!-- END HEADER -->
        <!-- BODY -->
        <nuxt-link
          v-for="(role, index) in adminRoles"
          :key="`role-${index}`"
          :to="{ path:`/user-management/roles-and-permissions/${role.id}`}"
          class="flex flex-col cursor-pointer sm:flex-row sm:flex-wrap justify-between px-2 py-2 border-l-8 border-yellow-500 md:border-l-0 md:table-row my-2 text-white no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light" 
        >
          <div class="flex flex-col text-white sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
            <strong class="block md:hidden text-sm uppercase">Role Name</strong>
            <span class="break-word">{{ role.name }}</span>
          </div>
          <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
            <strong class="block md:hidden text-sm uppercase">Date Created</strong>
            <span class="break-all">{{ $moment(role.created_at).format('MMM D, YYYY')}}</span>
          </div>
          <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
            <strong class="block md:hidden text-sm uppercase">Description</strong>
            <span class="break-all">{{ role.description }}</span>
          </div>
        </nuxt-link>
      </div>

      <div class="role-shield" v-if="modal == true" @click="modal ? modal = false : $router.push('/user-management/roles-and-permissions')"></div>
      <transition name="slide" mode="out-in">
        <div class="role-modal shadow-lg" v-if="modal">
          <CreateAdminRole @close="modal = false"/>
        </div>
      </transition>
    </div>
</template>
<script>
import CreateAdminRole from '@/components/UserManagement/CreateAdminRole'
export default {
  components:{
    CreateAdminRole
  },
  data(){
    return{
      adminRoles:[],
      modal:false
    }
  },
  async asyncData({ app, route, store}){
    try{
      let response = await app.$axios.$get(`/api/v1/admin/admin-roles`)
      console.log('response', response)
      const adminRoles = response.data.roles
      return {
        adminRoles
      }
    }catch(err){
      console.log('get error!', err)
    }
  }
}
</script>
<style>
.role-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.role-modal{
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
  .role-modal {
    width: 80%;
  }
}
</style>