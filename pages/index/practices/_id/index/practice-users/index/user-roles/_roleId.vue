<template>
  <div class="role-modal">
    <div class="m-4 flex justify-between text-sm text-white py-2 px-6">
      <nuxt-link :to="{path:`/practices/${$route.params.id}/practice-users/user-roles`,query:$route.query}" class="text-white p-1">
        <svgicon name="arrow-left-solid" height="32" width="32" class="text-white hover:text-sunglow fill-current"/>
      </nuxt-link>
    </div>
    <div class="text-white m-8 md:my-4">
      <div class="flex flex-wrap overflow-hidden">
        <div 
          v-if="practiceRolePermissions.find(permission => permission.category === 'Profile')"
          class="w-full md:w-1/2 xl:w-1/3 overflow-hidden pb-3 md:p-1"
        >
          <div class="text-lg font-semibold">Profile Management</div>
          <div
            v-for="(permission, index) in practiceRolePermissions"
            :key="`permission-${index}`"
            :class="permission.name.includes('View') ? 'text-sm mx-2' : 'text-sm mx-6'"
            class="px-2"
          >
            {{ permission.category === "Profile" ? permission.name : null }}
          </div>
        </div>
        <div 
          v-if="practiceRolePermissions.find(permission => permission.category === 'Billings')"
          class="w-full md:w-1/2 xl:w-1/3 overflow-hidden pb-3 md:p-1"
        >
          <div class="text-lg font-semibold">Billings Management</div>
          <div
            v-for="(permission, index) in practiceRolePermissions"
            :key="`permission-${index}`"
            :class="permission.name.includes('View') ? 'text-sm mx-2' : 'text-sm mx-6'"
            class="px-2"
          >
            {{ permission.category === "Billings" ? permission.name : null }}
          </div>
        </div>
        <div 
          v-if="practiceRolePermissions.find(permission => permission.category === 'Surgery')"
          class="w-full md:w-1/2 xl:w-1/3 overflow-hidden pb-3 md:p-1"
        >
          <div class="text-lg font-semibold">
            Surgery Management
          </div>
          <div
            v-for="(permission, index) in practiceRolePermissions"
            :key="`permission-${index}`"
            :class="permission.name.includes('View') ? 'text-sm mx-2' : 'text-sm mx-6'"
            class="px-2"
          >
            {{ permission.category === "Surgery" ? permission.name : null }}
          </div>
        </div>
        <div 
          v-if="practiceRolePermissions.find(permission => permission.category === 'Sessions')"
          class="w-full md:w-1/2 xl:w-1/3 overflow-hidden pb-3 md:p-1"
        >
          <div class="text-lg font-semibold">Sessions Management</div>
          <div
            v-for="(permission, index) in practiceRolePermissions"
            :key="`permission-${index}`"
            :class="permission.name.includes('View') ? 'text-sm mx-2' : 'text-sm mx-6'"
            class="px-2"
          >
            {{ permission.category === "Sessions" ? permission.name : null }}
          </div>
        </div>
        <div 
          v-if="practiceRolePermissions.find(permission => permission.category === 'Permanent Jobs')"
          class="w-full md:w-1/2 xl:w-1/3 overflow-hidden pb-3 md:p-1"
        >
          <div class="text-lg font-semibold">Permanent Jobs Management</div>
          <div
            v-for="(permission, index) in practiceRolePermissions"
            :key="`permission-${index}`"
            :class="permission.name.includes('View') ? 'text-sm mx-2' : 'text-sm mx-6'"
            class="px-2"
          >
            {{
              permission.category === "Permanent Jobs"
                ? permission.name
                : null
            }}
          </div>
        </div>
        <div 
          v-if="practiceRolePermissions.find(permission => permission.category === 'My Banks')"
          class="w-full md:w-1/2 xl:w-1/3 overflow-hidden pb-3 md:p-1"
        >
          <div class="text-lg font-semibold">My Banks Management</div>
          <div
            v-for="(permission, index) in practiceRolePermissions"
            :key="`permission-${index}`"
            :class="permission.name.includes('View') ? 'text-sm mx-2' : 'text-sm mx-6'"
            class="px-2"
          >
            {{
              permission.category === "My Banks"
                ? permission.name
                : null
            }}
          </div>
        </div>
        <div 
          v-if="practiceRolePermissions.find(permission => permission.category === 'Practice Reports')"
          class="w-full md:w-1/2 xl:w-1/3 overflow-hidden pb-3 md:p-1"
        >
          <div class="text-lg font-semibold">Practice Reports Management</div>
          <div
            v-for="(permission, index) in practiceRolePermissions"
            :key="`permission-${index}`"
            :class="permission.name.includes('View') ? 'text-sm mx-2' : 'text-sm mx-6'"
            class="px-2"
          >
            {{
              permission.category === "Practice Reports"
                ? permission.name
                : null
            }}
          </div>
        </div>
        <div 
          v-if="practiceRolePermissions.find(permission => permission.category === 'Roles and Permissions')"
          class="w-full md:w-1/2 xl:w-1/3 overflow-hidden pb-3 md:p-1"
        >
          <div class="text-lg font-semibold">Roles and Permissions Management</div>
          <div
            v-for="(permission, index) in practiceRolePermissions"
            :key="`permission-${index}`"
            :class="permission.name.includes('View') ? 'text-sm mx-2' : 'text-sm mx-6'"
            class="px-2"
          >
            {{
              permission.category === "Roles and Permissions"
                ? permission.name
                : null
            }}
          </div>
        </div>
      </div>
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
      let response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}/practice-roles/${route.params.roleId}`)
      const practiceRolePermissions = response.data.role.permissions
      console.log('das', practiceRolePermissions)
      return {
        practiceRolePermissions
      }
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