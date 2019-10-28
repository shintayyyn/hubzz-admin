<template>
    <div class="flex-1 flex flex-col py-2 px-4 overflow-auto">
      <div class="flex flex-row-reverse px-2 justify-between flex-wrap">
        <div>
          <button
            v-if="deletingAdminRole == false"
            class="inline-flex no-underline m-1 py-2 px-4 md:my-2 bg-red-500 text-sm font-semibold text-white rounded-lg shadow md:float-right"
            @click="deletingAdminRole = true"
          >Delete Role
            <svgicon
            name="garbage"
            width="21"
            height="21"
            color="white white"
            class="mx-1 -my-1"/>
          </button>
          <button
            v-if="deletingAdminRole == true"
            @click="deletingAdminRole = false"
            class="inline-flex no-underline m-1 py-2 px-4 md:my-2 bg-green-500 text-sm font-semibold text-white rounded-lg shadow md:float-right"
          >Done
          <svgicon
            name="circle-check"
            width="21"
            height="21"
            color="white white"
            class="mx-1 -my-1"/>
          </button>
          <button
            class="inline-flex no-underline m-1 py-2 px-4 md:my-2 bg-yellow-500 text-sm font-semibold text-black rounded-lg shadow md:float-right"
            @click="modal=true"
          >Add New Role
            <svgicon
            name="add-rectangle"
            width="21"
            height="21"
            color="black black"
            class="mx-1 -my-1"/>
          </button>
        </div>
      </div>
      <div class="flex flex-col mx-2 text-white">
        <!-- HEADER -->
        <div class="hidden md:inline-flex w-full font-bold text-white text-sm py-4">
          <div class="w-1/2">Role Name</div> 
          <div class="w-1/2">Date Created</div>
          <div class="w-1/2">Description</div>
        </div>
        <!-- END HEADER -->
        <!-- BODY -->
        <!-- class="flex flex-col cursor-pointer sm:flex-row sm:flex-wrap justify-between px-2 py-2 border-l-8 border-yellow-500 md:border-l-0 md:table-row my-2 text-white no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light"  -->
        <div
          v-for="(role, index) in adminRoles"
          :key="`role-${index}`"
        >
          <div class="inline-flex w-full">
            <div @click="toDeleteAdminRole(role.id)" v-if="deletingAdminRole == true" class='flex items-center pr-6 cursor-pointer text-red-600 hover:text-red-700'>
              <svgicon
              name="garbage"
              width="22"
              height="22"
              class="fill-current"
              />
            </div>
            <nuxt-link 
            :to="{ path:`/user-management/roles-and-permissions/${role.id}`}"
              class="w-full flex flex-col md:flex-row rounded-lg bg-waterloo hover:bg-waterloo-light my-2 shadow-lg p-4 md:p-2 border-l-8 border-yellow-500 md:border-0 text-white">
              <div class="w-full md:w-1/2 py-2 md:px-2 flex flex-col md:flex-row md:items-center">
                <strong class="block md:hidden text-sm uppercase">Role Name</strong>
                <span class="break-word">{{ role.name }}</span>
              </div>
              <div class="w-full md:w-1/2 py-2 md:px-2 flex flex-col md:flex-row md:items-center">
                <strong class="block md:hidden text-sm uppercase">Date Created</strong>
                <span class="break-all">{{ $moment(role.created_at).format('MMM D, YYYY')}}</span>
              </div>
              <div class="w-full md:w-1/2 py-2 md:px-2 flex flex-col md:flex-row md:items-center">
                <strong class="block md:hidden text-sm uppercase">Description</strong>
                <span class="break-all">{{ role.description }}</span>
              </div>
            </nuxt-link>
          </div>
        </div>
      </div>
      <div v-if="!adminRoles.length == 0">
        <AppPagination
          :total="total"
          :totalPages="totalPages"
          :currentPage="currentPage"
          @pagechanged="pagechanged"
        />
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
import AppPagination from '@/components/Base/AppPagination'
export default {
  components:{
    CreateAdminRole,
    AppPagination
  },
  data(){
    return{
      // adminRoles:[],
      modal:false,
      deletingAdminRole: false,
      currentPage: 1,
      perPage: 0,
      totalPages: 0,
    }
  },
  beforeDestroy(){
    let query = Object.assign({},this.$route.query)
    delete query.admin_role_page
    this.$router.push({query})
  },
  watch: {
    $route(to, from) {
      this.currentPage = parseInt(to.query.admin_role_page)
      this.getAdminRoles()
    },
  },
  computed:{
    total(){
      return this.$store.state.adminusers.adminRolesCount
    },
    adminRoles(){
      return this.$store.state.adminusers.adminRoles
    },
  },
  async created(){
    const query = {
      ...this.$route.query,
      admin_role_page: this.$route.query.admin_role_page || 1
    }
    try{
      await this.$axios.$get(`/api/v1/admin/admin-roles/count`).then(res =>{
        this.$store.commit('adminusers/SET_ADMIN_ROLES_COUNT', res.data.count)
        this.perPage = 10
        this.totalPages = Math.ceil(this.total / this.perPage)
        this.getAdminRoles()
      })
    }catch(err){
      console.log('get roles count error', err)
    }
  },
  async getRoles({ app, route, store}){
    
    try{
      
    }catch(err){
      console.log('get roles error!', err)
    }
  },
  methods:{
    async getAdminRoles(){
      let limit = 10
      let offset = 0
      offset = this.perPage * (parseInt(this.$route.query.admin_role_page) - 1)
      let params = {limit, offset}

      await this.$axios.$get(`/api/v1/admin/admin-roles/`,{ params }).then( res => {
        this.$store.commit('adminusers/SET_ADMIN_ROLES', res.data.roles)
      }).catch(err => {
        console.log('get roles error!', err)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
      })
    },
    async toDeleteAdminRole(roleId){
      await this.$axios.delete(`/api/v1/admin/admin-roles/${roleId}`).then(res => {
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Admin Role Successfully Deleted' })
      }).catch(err => {
        console.log('delete admin role error!!', err)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something Went Wrong!' })
      })
    },
    pagechanged(e) {
      const query = {
        ...this.$route.query,
        admin_role_page: e || 1
      }
      this.$router.push({ query })
      this.getAdminRoles()
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