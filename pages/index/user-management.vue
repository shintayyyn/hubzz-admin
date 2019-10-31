<template>
    <div class="flex-1 flex flex-col py-2 px-4 overflow-auto">
      <!-- <div>
        <div class="text-4xl text-white leading-none">User Management</div>
        <div class="text-xs mb-4 text-white">Work in progress.</div>
      </div> -->
      <div>
        <UserManagementTabs />
      </div>
      <div class="admin-shield" v-if="$route.name.includes('index-user-management-id') || $route.name.includes('roleId')" @click="$router.go(-1)"/>
      <nuxt-child/>
    </div>
</template>
<script>
import CreatePracticeUser from '@/components/Practices/CreatePracticeUser'
import AppConfirmCancel from '@/components/AppConfirmCancel'
import UserManagementTabs from '@/components/UserManagement/UserManagementTabs'
  export default {
    components:{
      CreatePracticeUser,
      AppConfirmCancel,
      UserManagementTabs
    },
  }
</script>
<style>
.admin-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
</style>