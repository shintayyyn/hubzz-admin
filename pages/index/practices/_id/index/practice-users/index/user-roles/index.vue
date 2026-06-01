<template>
  <div>
    <AppTableNew
      v-if="practice_roles.length > 0"
      :total="total"
      :items="practice_roles"
      :currentPage="currentPage"
      :perPage="perPage"
      :columns="columns"
      :routerLink="`/practices/${$route.params.id}/practice-users/user-roles`"
      @pagechanged="pagechanged"
    />
    <p v-if="!practice_roles.length" class="text-center py-4">
      No roles.
    </p>
  </div>
</template>
<script>
import AppTableNew from '@/components/Base/AppTableNew'
export default {
  components: {
    AppTableNew
  },
  data() {
    return {
      currentPage: 1,
      perPage: 10,
      total: 0,
      practice_roles: [],

      columns: [
        {
          name: 'Role',
          dataIndex: 'name',
          class: 'text-center',
          sortable: false
        },
        {
          name: 'Description',
          dataIndex: 'description',
          class: 'text-center',
          sortable: false
        },
        {
          name: 'Created At',
          dataIndex: 'created_at',
          class: 'text-center localDate',
          sortable: false
        }
      ]
    }
  },
  watch: {
    $route(to) {
      this.currentPage = parseInt(to.query.practice_roles_page)
      this.getPracticeRoles()
    }
  },
  async asyncData({ app, route, store }) {
    try {
      let response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}/practice-roles/count`)
      const total = response.data.count
      let params = {
        limit: 10,
        offset: 0
      }
      response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}/practice-roles`, { params })
      const practice_roles = response.data.roles

      return {
        total,
        practice_roles
      }
    } catch (err) {
      store.commit('SET_NOTIFICATION', {
        enabled: true,
        status: 'danger',
        text: err.response.data.message
      })
    }
  },
  beforeDestroy() {
    let query = Object.assign({}, this.$route.query)
    delete query.practice_roles_page
    this.$router.push({ query })
  },
  methods: {
    pagechanged(e) {
      const query = {
        ...this.$route.query,
        practice_users_page: e || 1
      }
      this.$router.push({ query })
      this.getPracticeRoles()
    },
    async getPracticeRoles() {
      let limit = 5
      let offset = 0
      offset = this.perPage * (parseInt(this.$route.query.practice_roles_page) - 1)
      let params = {
        limit,
        offset
      }
      await this.$axios.$get(`/api/v1/admin/practice/${this.$route.params.id}/practice-roles`, { params }).then(res => {
        this.practice_roles = res.data.roles
      })
    }
  }
}
</script>
