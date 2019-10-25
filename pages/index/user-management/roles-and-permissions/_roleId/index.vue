<template>
  <div class="role-modal">
    <div class="m-6 text-white">
      <div @click="goBack()" class="cursor-pointer pb-4">
        <svgicon name="arrow-left-solid" height="32" widht="32" class="text-white fill-current" />
      </div>
      <div class="">
        <div class="text-4xl">
          {{specificRole.name}}
        </div>
        <div class="text-sm mx-4">
          {{specificRole.description}}
        </div>
      </div>
      <!-- SHOW ROLE PERMISSIONS -->
      <div class="m-4">
        <div class="flex flex-wrap overflow-hidden xl:-mx-1">
          <div class="xl:w-1/5 w-full overflow-hidden xl:my-1 xl:px-1">
            <div class="text-lg font-semibold">Locum Management</div> 
            <div 
              v-for="(permission, index) in rolePermissions"
              :key="`permission-${index}`"
              class="">
              {{ permission.category === 'Locum' ? permission.name : null}}
            </div>
          </div>
          <div class="xl:w-1/5 w-full overflow-hidden xl:my-1 xl:px-1">
            <div class="text-lg font-semibold">Practice Management</div>
            <div 
              v-for="(permission, index) in rolePermissions"
              :key="`permission-${index}`"
              class="">
              {{ permission.category === 'Practice' ? permission.name : null}}
            </div>
          </div>
          <div class="xl:w-1/5 w-full overflow-hidden xl:my-1 xl:px-1">
            <div class="text-lg font-semibold">Billing and Reports Management</div>
            <div 
              v-for="(permission, index) in rolePermissions"
              :key="`permission-${index}`"
              class="">
              {{ permission.category === 'Billing' ? permission.name : null}}
            </div>
          </div>
          <div class="xl:w-1/5 w-full overflow-hidden xl:my-1 xl:px-1">
            <div class="text-lg font-semibold">Miscellaneous</div>
            <div 
              v-for="(permission, index) in rolePermissions"
              :key="`permission-${index}`"
              class="">
              {{ permission.category === 'Misc' ? permission.name : null}}
            </div>
          </div>
          <div class="xl:w-1/5 w-full overflow-hidden xl:my-1 xl:px-1">
            <div class="text-lg font-semibold">User Management</div>
            <div 
              v-for="(permission, index) in rolePermissions"
              :key="`permission-${index}`"
              class="">
              {{ permission.category === 'User Management' ? permission.name : null}}
            </div>
          </div>
        </div>
      </div>
      <!-- EDIT ROLE PERMISSIONS -->
      <div class="m-4">
        <div class="flex flex-wrap overflow-hidden xl:-mx-1">
          <div class="xl:w-1/5 w-full overflow-hidden xl:my-1 xl:px-1">
            <div class="text-lg font-semibold">Locum Management</div> 
            <div 
              v-for="(permission, index) in allPermissions"
              :key="`permission-${index}`"
              class="">
              {{ permission.category === 'Locum' ? permission.name : null}}
            </div>
          </div>
          <div class="xl:w-1/5 w-full overflow-hidden xl:my-1 xl:px-1">
            <div class="text-lg font-semibold">Practice Management</div> 
            <div 
              v-for="(permission, index) in allPermissions"
              :key="`permission-${index}`"
              class="">
              {{ permission.category === 'Practice' ? permission.name : null}}
            </div>
          </div>
          <div class="xl:w-1/5 w-full overflow-hidden xl:my-1 xl:px-1">
            <div class="text-lg font-semibold">Billings Management</div> 
            <div 
              v-for="(permission, index) in allPermissions"
              :key="`permission-${index}`"
              class="">
              {{ permission.category === 'Billings' ? permission.name : null}}
            </div>
          </div>
          <div class="xl:w-1/5 w-full overflow-hidden xl:my-1 xl:px-1">
            <div class="text-lg font-semibold">Misc Management</div> 
            <div 
              v-for="(permission, index) in allPermissions"
              :key="`permission-${index}`"
              class="">
              {{ permission.category === 'Misc' ? permission.name : null}}
            </div>
          </div>
          <div class="xl:w-1/5 w-full overflow-hidden xl:my-1 xl:px-1">
            <div class="text-lg font-semibold">User Management</div> 
            <div 
              v-for="(permission, index) in allPermissions"
              :key="`permission-${index}`"
              class="">
              {{ permission.category === 'User Management' ? permission.name : null}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      specificRole: '',
      rolePermissions: [],
      allPermissions: []
    }
  },
  async asyncData({ app, store, route }){
    try{
      let response = await app.$axios.$get(`/api/v1/admin/admin-roles/${route.params.roleId}`)
      const specificRole = response.data.role
      const rolePermissions = response.data.role.permissions
      response = await app.$axios.$get(`/api/v1/admin/admin-permissions`)
      const allPermissions = response.data.permissions
      return{
        specificRole,
        rolePermissions,
        allPermissions
      }
    }catch(err){
       store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
      console.log('get users error',err)
    }
  },
  methods: {
    goBack() {
      const query = {
        ...this.$route.query
      };
      if (query.job_status) {
        delete query.job_status;
      }
      this.$router.push({ path: "/user-management/roles-and-permissions", query });
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