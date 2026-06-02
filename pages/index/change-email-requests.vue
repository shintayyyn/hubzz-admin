<template>
  <section class="flex-1 flex flex-col py-2 px-2 md:px-6 overflow-y-auto">
    <template v-if="isListView">
      <AppTableNew
        :total="count"
        :items="changeEmailRequests"
        :currentPage="page"
        :perPage="limit"
        :columns="columns"
        :loading="loading"
        :routerLink="rowLink"
        :orderBy="orderBy"
        :customWidth="'800'"
        @pagechanged="page = $event"
        @limitchanged="limit = $event"
        @sorted="orderBy = $event"
      >
        <template #status_slot="{ item }">
          <div class="px-4 py-1 rounded-full w-32 text-center mx-auto my-1" :class="statusClass[item.status]">
            {{ item.status }}
          </div>
        </template>
      </AppTableNew>

      <div v-if="!loading && !count" class="mt-2 w-full text-center text-white">
        <span>No change email requests.</span>
      </div>
    </template>

    <nuxt-child
      :changeEmailRequests="changeEmailRequests"
      :changeEmailRequestStatusColorClass="statusClass"
      @changeEmailRequests="changeEmailRequests = $event"
    />
  </section>
</template>

<script>
import debounce from 'lodash.debounce'
import AppTableNew from '@/components/Base/AppTableNew'

const STATUS_CLASS = Object.freeze({
  Accepted: 'bg-green-500 text-white',
  Pending: 'bg-gray-500 text-gray-700',
  Rejected: 'bg-red-600 border-red-600 text-white'
})

export default {
  components: { AppTableNew },

  data() {
    return {
      loading: false,
      limit: 15,
      page: 1,
      orderBy: ['requested_at_formatted:desc'],
      count: 0,
      changeEmailRequests: []
    }
  },

  computed: {
    isListView() {
      return this.$route.name === 'index-change-email-requests'
    },

    offset() {
      return Math.max((this.page - 1) * this.limit, 0)
    },

    columns() {
      return [
        { name: 'ID', dataIndex: 'id', sortable: true, width: 100 },
        { name: 'New E-Mail Address', dataIndex: 'new_email', sortable: true, width: 300 },
        { name: 'User Count', dataIndex: 'user_count', sortable: true, width: 100 },
        { name: 'Requested At', dataIndex: 'requested_at_formatted', sortable: true, width: 300 },
        { name: 'Status', dataIndex: 'status', sortable: true, width: 300 },
        { name: 'Accepted At', dataIndex: 'accepted_at_in_gb_formatted', sortable: true, width: 300 },
        { name: 'Rejected At', dataIndex: 'rejected_at_in_gb_formatted', sortable: true, width: 300 }
      ]
    },

    statusClass() {
      return STATUS_CLASS
    },

    rowLink() {
      return item => ({
        name: 'index-change-email-requests-id-index-index',
        params: { id: item.id }
      })
    }
  },

  watch: {
    page: 'fetchData',
    limit: 'fetchData',
    orderBy: 'fetchData'
  },

  async asyncData({ store, error }) {
    const permissions = store.getters['permissions']

    if (!permissions?.includes('View Change Email Requests')) {
      return error({
        statusCode: 403,
        message: 'You are not authorized to view this page.'
      })
    }
  },

  mounted() {
    this.init()
  },

  beforeDestroy() {
    this.teardownSockets()
  },

  methods: {
    init() {
      this.fetchData()

      this.$store.dispatch('pendingChangeEmailRequestIds')

      this.$socket.on('Admin Notification Change Email Request Pending', this.fetchData)
      this.$socket.on('Admin Notification Change Email Request Rejected', this.updateRow)
      this.$socket.on('Admin Notification Change Email Request Accepted', this.updateRow)
    },

    teardownSockets() {
      this.$socket.removeListener('Admin Notification Change Email Request Pending', this.fetchData)
      this.$socket.removeListener('Admin Notification Change Email Request Rejected', this.updateRow)
      this.$socket.removeListener('Admin Notification Change Email Request Accepted', this.updateRow)
    },

    updateRow(payload) {
      const index = this.changeEmailRequests.findIndex(i => i.id === payload.id)
      if (index !== -1) this.$set(this.changeEmailRequests, index, payload)
    },

    fetchData: debounce(function() {
      this.loading = true

      Promise.all([
        this.$axios.get('/api/v1/admin/change-email-requests/count'),
        this.$axios.get('/api/v1/admin/change-email-requests', {
          params: {
            order_by: this.orderBy,
            limit: this.limit,
            offset: this.offset
          }
        })
      ])
        .then(([countRes, listRes]) => {
          this.count = countRes.data.data.count
          this.changeEmailRequests = listRes.data.data.change_email_requests
        })
        .catch(err => console.error(err))
        .finally(() => (this.loading = false))
    }, 500)
  }
}
</script>
