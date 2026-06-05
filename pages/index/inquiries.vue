<template>
  <section>
    <template v-if="$route.name === 'index-inquiries'">
      <div class="flex-1 flex flex-col px-4 mt-4 mx-1 md:mx-2 overflow-auto">
        <div class="flex"></div>

        <AppTableNew
          v-if="itemCount > 0"
          :total="itemCount"
          :items="emails"
          :currentPage="currentPage"
          :perPage="params.limit"
          :columns="columns"
          :loading="loadingSupportEmail"
          :routerLink="`/inquiries`"
          :customWidth="400"
          :loadingMessage="'Loading Inquiries'"
          @pagechanged="pagechanged"
        >
          <template v-slot:acknowledged="slotProps">
            <div :class="[!slotProps.item.acknowledged_at_in_gb_formatted && 'text-orange-600', 'text-xs']">
              <template v-if="slotProps.item.acknowledged_at_in_gb_formatted">
                {{ slotProps.item.acknowledged_at_in_gb_formatted }}
              </template>

              <template v-else>
                Pending
              </template>
            </div>
          </template>
        </AppTableNew>

        <template v-else>
          <div class="mt-2 w-full text-center text-white">
            There are no inquiries messages.
          </div>
        </template>
      </div>
    </template>
    <nuxt-child />
  </section>
</template>

<script>
import debounce from 'lodash.debounce'
import AppTableNew from '@/components/Base/AppTableNew'
export default {
  components: {
    AppTableNew
  },

  data() {
    return {
      currentPage: 1,

      params: {
        limit: 15,
        offset: 0,
        order_by: ['created_at:desc']
      },

      search: '',
      activePage: 1,

      columns: [
        {
          name: 'Sender E-Mail',
          dataIndex: 'sender.email'
        },
        {
          name: 'Account Type',
          dataIndex: 'sender.domain',
          class: 'text-center'
        },
        {
          name: 'Date Sent',
          dataIndex: 'created_at_in_gb_formatted',
          class: 'text-center'
        },
        {
          name: 'Acknowledged At',
          dataIndex: 'acknowledged_at_in_gb_formatted',
          class: 'text-center',
          slot: true,
          slotName: 'acknowledged'
        }
      ]
    }
  },

  watchQuery: ['page', 'search'],

  computed: {
    loadingSupportEmail() {
      return this.$store.state.supports.loading_support_emails
    },
    emails() {
      return this.$store.state.supports.emails
    },
    itemCount() {
      return this.$store.state.supports.itemCount
    },
    total() {
      return this.emails.length
    },
    totalPages() {
      return Math.ceil(this.itemCount / this.params.limit)
    }
  },

  watch: {
    search() {
      this.searchSubmit()
      this.getInquiries(this.params)
    }
  },

  async asyncData({ app, store, route, error }) {
    try {
      await store.commit('supports/TOGGLE_LOADING', true)
      let { page = 1, search = '', order_by = [] } = route.query
      page = parseInt(page)
      const createdRoute = route.query
      const limit = 15
      const offset = page * limit - limit
      order_by = createdRoute && createdRoute.order_by ? createdRoute.order_by : 'created_at:desc'
      const params = { limit, offset, order_by }

      if (search) {
        params.search = search
      }

      let response = await app.$axios.$get(`/api/v1/admin/supports/count`, {
        params
      })
      const itemCount = response.data.count
      await store.commit('supports/SET_EMAILS_COUNT', itemCount)

      response = await app.$axios.$get(`/api/v1/admin/supports`, { params })
      const emails = response.data.emails

      await store.commit('supports/SET_EMAILS', emails)

      const authAdminPermissions = store.getters['permissions']

      if (authAdminPermissions.includes('View Inquiries Messages') === false) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.'
        })
        return
      }

      await store.commit('supports/TOGGLE_LOADING', false)
      return {
        itemsPerPage: limit,
        activePage: page,
        currentPage: page
      }
    } catch (err) {
      console.log('index emails index err', err.response || err)
      if (err.response && err.response.status === 401) {
        console.log('something went wrong')
        error(err.response.data)
        return
      }
      throw err
    }
  },

  methods: {
    getInquiries(params) {
      console.log(params)
      this.$store.dispatch('supports/fetchSupports', {
        search: params.search,
        limit: params.limit,
        order_by: params.order_by,
        offset: params.offset
      })
    },

    show() {
      this.modal = true
    },

    searchSubmit: debounce(function(page) {
      let search = this.search

      let query = { ...this.$router.query, search }

      if (page === 1) {
        delete query.page
      }
      if (page) {
        query = { ...this.$router.query, page, search }
      }

      if (this.search === '') {
        delete query.search
      }

      if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
        this.loading = true
      }

      this.$router.push({ query })
    }, 500),

    pagechanged(page) {
      this.params.offset = this.params.limit * (page - 1)
      this.currentPage = page
      this.getInquiries(this.params)
    },

    sorted(order_by) {
      this.currentPage = 1
      this.params.order_by = order_by
      this.getInquiries(this.params)
    }
  }
}
</script>

<style>
.page-button {
  background: linear-gradient(to top, #f2d024, #efde86);
}
</style>
