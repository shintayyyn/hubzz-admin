<template>
  <div class="role-modal">
    <div class="flex justify-between text-sm text-white py-2 px-6">
      <nuxt-link :to="{path:`/practices/${$route.params.id}/practice-users/user-roles`,query:$route.query}" class="text-white p-1">
        <svgicon name="arrow-left-solid" height="32" width="32" class="text-white hover:text-sunglow fill-current"/>
      </nuxt-link>
      
      <!-- <div class="my-2 md:my-4" v-if="editingPermissions == false">
        <div class="flex flex-wrap overflow-hidden">
          <div class="w-full md:w-1/2 xl:w-1/5 overflow-hidden pb-3 md:p-1">
            <div class="text-lg font-semibold">Locum Management</div>
            <div
              v-for="(permission, index) in rolePermissions"
              :key="`permission-${index}`"
              class="px-2"
            >
              {{ permission.category === "Locum" ? permission.name : null }}
            </div>
          </div>
          <div class="w-full md:w-1/2 xl:w-1/5 overflow-hidden pb-3 md:p-1">
            <div class="text-lg font-semibold">Practice Management</div>
            <div
              v-for="(permission, index) in rolePermissions"
              :key="`permission-${index}`"
              class="px-2"
            >
              {{ permission.category === "Practice" ? permission.name : null }}
            </div>
          </div>
          <div class="w-full md:w-1/2 xl:w-1/5 overflow-hidden pb-3 md:p-1">
            <div class="text-lg font-semibold">
              Billing and Reports Management
            </div>
            <div
              v-for="(permission, index) in rolePermissions"
              :key="`permission-${index}`"
              class="px-2"
            >
              {{ permission.category === "Billing" ? permission.name : null }}
            </div>
          </div>
          <div class="w-full md:w-1/2 xl:w-1/5 overflow-hidden pb-3 md:p-1">
            <div class="text-lg font-semibold">Miscellaneous</div>
            <div
              v-for="(permission, index) in rolePermissions"
              :key="`permission-${index}`"
              class="px-2"
            >
              {{ permission.category === "Misc" ? permission.name : null }}
            </div>
          </div>
          <div class="w-full md:w-1/2 xl:w-1/5 overflow-hidden pb-3 md:p-1">
            <div class="text-lg font-semibold">User Management</div>
            <div
              v-for="(permission, index) in rolePermissions"
              :key="`permission-${index}`"
              class="px-2"
            >
              {{
                permission.category === "User Management"
                  ? permission.name
                  : null
              }}
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  data (){
    return {
      practiceRolePermissions:[]
    }
  },
  async asyncData ({ app, route, store }) {
    try{
      // let response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}/practice-roles/${route.params.roleId}`)
      // const practiceRolePermissions = response.data.role
    }catch(err){
      store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
      console.log("something went wrong!",err)
    }
  }
}
</script>

<style>
.role-modal {
	position: fixed;
	top: 0;
	right: 0;
	margin-right: 0%;
	width: 100%;
	height: 100%;
	overflow: auto;
	border-left: solid 2px #ffc72c;
	transition: all 0.3s ease-in-out;
	background-color: #505561;
	z-index: 512;
}
@media screen and (min-width: 1200px) {
	.role-modal {
		width: 70%;
	}
}
</style>