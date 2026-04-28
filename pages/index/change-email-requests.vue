<template>
  <section class="flex-1 flex flex-col py-2 px-2 md:px-6 overflow-y-auto">
    <template v-if="$route.name === 'index-change-email-requests'">
      <AppTableNew
        :total="count"
        :items="changeEmailRequests"
        :currentPage="page"
        :perPage="limit"
        :columns="columns"
        :loading="loading"
        :routerLink="changeEmailRequest => ({ name: 'index-change-email-requests-id-index-index', params: { id: changeEmailRequest.id } })"
        :orderBy="orderBy"
        :customWidth="'800'"
        @pagechanged="_page => (page = _page)"
        @limitchanged="_limit => (limit = _limit)"
        @sorted="_orderBy => (orderBy = _orderBy)"
      >
        <template v-slot:status_slot="slotProps">
          <div class="px-4 py-1 rounded-full w-32 text-center mx-auto my-1" :class="changeEmailRequestStatusColorClass[slotProps.item.status]">
            <span>{{ slotProps.item.status }}</span>
          </div>
        </template>
      </AppTableNew>

      <div v-if="!loading && count === 0" class="mt-2 w-full text-center text-white">
        <span>No change email requests.</span>
      </div>
    </template>

    <nuxt-child
      :changeEmailRequests="changeEmailRequests"
      :changeEmailRequestStatusColorClass="changeEmailRequestStatusColorClass"
      @changeEmailRequests="_changeEmailRequests => (changeEmailRequests = _changeEmailRequests)"
    />
  </section>
</template>

<script>
import debounce from 'lodash.debounce'

import AppLoading from '@/components/Base/AppLoading'
import AppTableNew from '@/components/Base/AppTableNew'

export default {
  components: {
    AppLoading,
    AppTableNew
  },

  data() {
    return {
      loading: false,
      limit: 15,
      page: 1,
      search: '',
      filterStatus: null,
      sort: null,
      orderBy: ['requested_at_formatted:desc'],
      count: 0,
      changeEmailRequests: []
    }
  },

  computed: {
    authAdminPermissions() {
      return this.$store.getters['permissions']
    },
    pages() {
      return Math.max(Math.ceil(this.count / this.limit), 1)
    },

    offset() {
      return Math.max(this.page * this.limit - this.limit, 0)
    },

    columns() {
      return [
        {
          name: 'ID',
          dataIndex: 'id',
          class: 'text-center',
          sortable: true,
          flex: '1 0 0',
          width: 100
        },
        {
          name: 'New E-Mail Address',
          dataIndex: 'new_email',
          class: 'text-center',
          sortable: true,
          flex: '1 0 0',
          width: 300
        },
        {
          name: 'User Count',
          dataIndex: 'user_count',
          class: 'text-center',
          sortable: true,
          flex: '1 0 0',
          width: 100
        },
        {
          name: 'Requested At',
          dataIndex: 'requested_at_formatted',
          class: 'text-center',
          sortable: true,
          flex: '1 0 0',
          width: 300
        },
        {
          name: 'Status',
          dataIndex: 'status',
          class: 'text-center',
          sortable: true,
          flex: '1 0 0',
          width: 300
          // slot: true,
          // slotName: 'status_slot',
        },
        {
          name: 'Accepted At',
          dataIndex: 'accepted_at_in_gb_formatted',
          class: 'text-center',
          sortable: true,
          flex: '1 0 0',
          width: 300
        },
        {
          name: 'Rejected At',
          dataIndex: 'rejected_at_in_gb_formatted',
          class: 'text-center',
          sortable: true,
          flex: '1 0 0',
          width: 300
        }
      ]
    },

    orderByValues() {
      return this.columns.reduce((orderByValues, column) => {
        const { name, dataIndex, sortable } = column

        if (sortable) {
          orderByValues.push({
            displayLabel: `${name} (asc)`,
            value: `${dataIndex}:asc`
          })

          orderByValues.push({
            displayLabel: `${name} (desc)`,
            value: `${dataIndex}:desc`
          })
        }

        return orderByValues
      }, [])
    },

    selectedOrderByValue: {
      get() {
        return this.orderBy.length > 0 ? this.orderBy[0] : null
      },
      set(orderBy) {
        this.orderBy = [orderBy]
      }
    },

    changeEmailRequestStatusColorClass() {
      return {
        Accepted: 'bg-green-500 text-white',
        Pending: 'bg-gray-500 text-gray-700',
        Rejected: 'bg-red-600 border-red-600 text-white'
      }
    }
  },

  watch: {
    page() {
      this.searchSubmit()
    },

    limit() {
      this.searchSubmit()
    },

    orderBy() {
      this.searchSubmit()
    }
  },

  async asyncData({ store, error }) {
    try {
      const authAdminPermissions = store.getters['permissions']

      if (authAdminPermissions.includes('View Change Email Requests') === false) {
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
      console.log('get parent practice error!!', err)
    }
  },

  mounted() {
    this.loading = true
    this.getChangeEmailRequests()
      .catch(err => {
        console.log('err', err)
      })
      .finally(() => {
        this.loading = false
      })

    this.$store.dispatch('pendingChangeEmailRequestIds')
    this.$socket.on('Admin Notification Change Email Request Pending', this.getChangeEmailRequests)
    this.$socket.on('Admin Notification Change Email Request Rejected', this.changeEmailRequestUpdated)
    this.$socket.on('Admin Notification Change Email Request Accepted', this.changeEmailRequestUpdated)
  },

  destroyed() {
    this.$socket.removeListener('Admin Notification Change Email Request Pending', this.getChangeEmailRequests)
    this.$socket.removeListener('Admin Notification Change Email Request Rejected', this.changeEmailRequestUpdated)
    this.$socket.removeListener('Admin Notification Change Email Request Accepted', this.changeEmailRequestUpdated)
  },

  methods: {
    changeEmailRequestUpdated(changeEmailRequest) {
      const index = this.changeEmailRequests.findIndex(({ id }) => id === changeEmailRequest.id)

      if (index > -1) {
        this.changeEmailRequests.splice(index, 1, changeEmailRequest)
      }
    },

    searchSubmit: debounce(function() {
      this.activePage = 1
      this.loading = true
      this.getChangeEmailRequests()
        .catch(err => {
          console.log('err', err)
        })
        .finally(() => {
          this.loading = false
        })
    }, 500),

    getChangeEmailRequests() {
      return Promise.all([
        this.$axios.get('/api/v1/admin/change-email-requests/count').then(response => response.data.data.count),
        this.$axios
          .get('/api/v1/admin/change-email-requests', {
            params: {
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset
            }
          })
          .then(response => response.data.data.change_email_requests)
      ]).then(responses => {
        const [count, changeEmailRequests] = responses

        this.count = count
        this.changeEmailRequests = changeEmailRequests
      })
    }
  }
}
</script>
