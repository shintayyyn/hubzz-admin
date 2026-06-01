<template>
  <div>
    <div class="m-2 md:my-4">
      <div class="flex flex-wrap overflow-hidden">
        <div
          v-for="section in categorySections"
          v-if="section.permissions.length > 0"
          :key="section.category"
          class="w-full md:w-1/2 xl:w-1/3 overflow-hidden pb-3 md:p-1"
        >
          <div class="text-lg font-semibold">
            {{ section.title }}
          </div>
          <div
            v-for="permission in section.permissions"
            :key="permission.id"
            :class="permission.name.includes('View') ? 'text-sm mx-2' : 'text-sm mx-6'"
            class="px-2"
          >
            {{ permission.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const PERMISSION_CATEGORY_SECTIONS = [
  { category: 'Profile', title: 'Profile Management' },
  { category: 'Billings', title: 'Billings Management' },
  { category: 'Surgery', title: 'Surgery Management' },
  { category: 'Sessions', title: 'Sessions Management' },
  { category: 'Permanent Jobs', title: 'Permanent Jobs Management' },
  { category: 'My Banks', title: 'My Banks Management' },
  { category: 'Practice Reports', title: 'Practice Reports Management' },
  { category: 'Roles and Permissions', title: 'Roles and Permissions Management' }
]

export default {
  data() {
    return {
      practiceRolePermissions: []
    }
  },

  computed: {
    categorySections() {
      return PERMISSION_CATEGORY_SECTIONS.map(section => ({
        ...section,
        permissions: this.practiceRolePermissions.filter(permission => permission.category === section.category)
      }))
    }
  },

  async asyncData({ app, route, store }) {
    try {
      let response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}/practice-roles/${route.params.roleId}`)
      const practiceRolePermissions = response.data.role.permissions
      return {
        practiceRolePermissions
      }
    } catch (err) {
      store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
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
