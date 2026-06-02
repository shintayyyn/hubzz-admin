<template>
  <div>
    <transition name="fade" mode="out-in">
      <AdminRoles />
    </transition>
  </div>
</template>
<script>
import AdminRoles from '@/components/UserManagement/AdminRoles'
export default {
  components: {
    AdminRoles
  }
}
</script>
