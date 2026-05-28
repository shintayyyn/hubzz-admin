<template>
  <section class="h-full py-2 px-2">
    <template>
      <div v-if="!$route.params.id" class="flex flex-row justify-start overflow-x-auto border-b border-yellow-500 pt-1">
        <nuxt-link
          v-if="authAdminPermissions.includes('View Admin Accounts')"
          :to="getRoute()"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.path == `/user-management` ? 'border-b-4 border-yellow-500' : 'text-gray-600'"
        >
          Users
        </nuxt-link>

        <nuxt-link
          v-if="authAdminPermissions.includes('View Roles')"
          :to="getRoute('roles-and-permissions')"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.path.includes(`/user-management/roles-and-permissions`) ? 'border-b-4 border-yellow-500' : 'text-gray-600'"
        >
          Roles and Permissions
        </nuxt-link>
      </div>
    </template>
    <nuxt-child />
  </section>
</template>
<script>
export default {
  data() {
    return {
      userManagementPermissions: []
    }
  },

  computed: {
    authAdminPermissions() {
      return this.$store.getters['permissions']
    },
    getRoute() {
      return tab => {
        if (!tab) {
          tab = ''
        }
        const query = {
          ...this.$route.query
        }
        delete query.page
        return {
          path: tab ? `/user-management/${tab}` : `/user-management`,
          query
        }
      }
    }
  },

  async asyncData({ store, error }) {
    try {
      const authAdminPermissions = store.getters['permissions']

      if (authAdminPermissions.includes('View Roles') === false && authAdminPermissions.includes('View Admin Accounts') === false) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.'
        })
        return
      }
    } catch (err) {
      error({ statusCode: 404 })
      store.commit('SET_NOTIFICATION', {
        enabled: true,
        status: 'danger',
        text: 'Something went wrong!'
      })
    }
  },

  created() {
    if (this.authAdminPermissions.find(item => item === 'View Admin Accounts') === undefined) {
      this.$router.push(`/user-management/roles-and-permissions`)
    }
  }
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
