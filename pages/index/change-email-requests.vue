<template>
  <div class="flex-1 flex flex-col py-2 px-2 md:px-6 overflow-y-auto">
    <AppLoading :loading="loading" spinner />

    <div class="text-lg md:text-2xl text-white">
      <span>Change Email Requests</span>
    </div>

    <div v-if="false" class="mt-2">
      <div class="flex justify-start overflow-x-auto">
        <nuxt-link
          to="/locum-change-email-requests"
          style="font-family:Nunito"
          class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="true ? 'border rounded-lg text-black border-sunglow bg-sunglow' : 'text-white'"
        >
          <span>Locum</span>
        </nuxt-link>
        <nuxt-link
          v-if="false"
          to="/practice-change-email-requests"
          style="font-family:Nunito"
          class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="false ? 'border rounded-lg text-black border-sunglow bg-sunglow' : 'text-white'"
        >
          <span>Practice</span>
        </nuxt-link>
      </div>
    </div>

    <div class="mt-2 flex flex-col md:flex-row justify-between md:items-center">
      <div v-if="false" class="flex py-2">
        <div class="relative">
          <input
            v-model="search"
            style="width: 250px;"
            class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo"
            placeholder="Search Locum by Name or E-Mail"
            @keyup.enter="searchSubmit"
          >
          <button
            v-if="search"
            class="absolute top-0 right-0 bottom-0 mr-3 md:mr-1"
            @click="(search = ''), searchSubmit()"
          >
            <svgicon
              name="times-solid"
              height="12"
              width="12"
              class="text-white hover:text-yellow-500 fill-current -mx-2 md:-mx-6"
            />
          </button>
        </div>
      </div>

      <div class="flex flex-col w-full justify-end">
        <div
          v-if="false"
          class="md:w-full relative flex flex-col md:flex-row justify-end md:items-center md:items-end md:py-2 py-0"
        >
          <label class="text-sm text-white md:pr-2">Filter by Status</label>
          <select
            v-model="filterStatus"
            class="w-full md:w-auto outline-none rounded-lg border-2 border-transparent text-sm text-white p-1 pr-6 focus:hubzz-yellow bg-waterloo"
          >
            <option :value="null">
              All
            </option>
            <option>Pending</option>
            <option>Accepted</option>
            <option>Rejected</option>
          </select>
        </div>

        <div class="relative md:hidden flex flex-col justify-end md:flex-row md:items-center md:items-end pt-2 md:p-2 md:py-0">
          <label class="text-sm text-white md:pr-2">Sort by</label>
          <select
            v-model="orderByValue"
            class="w-full md:w-auto outline-none rounded-lg border-2 border-transparent text-sm text-white p-1 pr-6 focus:hubzz-yellow bg-waterloo"
          >
            <option value="id:asc">
              ID (asc)
            </option>
            <option value="id:desc">
              ID (desc)
            </option>
            <option value="new_email:asc">
              New E-Mail Address (asc)
            </option>
            <option value="new_email:desc">
              New E-Mail Address (desc)
            </option>
            <option value="user_count:asc">
              User Count (asc)
            </option>
            <option value="user_count:desc">
              User Count (desc)
            </option>
            <option value="requested_at_formatted:asc">
              Requested At (asc)
            </option>
            <option value="requested_at_formatted:desc">
              Requested At (desc)
            </option>
            <option value="status:asc">
              Status (asc)
            </option>
            <option value="status:desc">
              Status (desc)
            </option>
            <option value="accepted_at:asc">
              Accepted At (asc)
            </option>
            <option value="accepted_at:desc">
              Accepted At (desc)
            </option>
            <option value="rejected:asc">
              Rejected At (asc)
            </option>
            <option value="rejected:desc">
              Rejected At (desc)
            </option>
          </select>
        </div>
      </div>
    </div>

    <AppTable
      :total="count"
      :items="changeEmailRequests"
      :currentPage="page"
      :perPage="limit"
      :columns="columns"
      :loading="loading"
      :routerLink="changeEmailRequest => ({ name: 'index-change-email-requests-id-index-index', params: { id: changeEmailRequest.id } })"
      :orderBy="orderBy"
      @pagechanged="(_page) => page = _page"
      @limitchanged="(_limit) => limit = _limit"
      @sorted="(_orderBy) => orderBy = _orderBy"
    >
      <template v-slot:status_slot="slotProps">
        <div
          class="px-4 py-1 rounded-full w-32 text-center mx-auto my-1"
          :class="changeEmailRequestStatusColorClass[slotProps.item.status]"
        >
          <span>{{ slotProps.item.status }}</span>
        </div>
      </template>
    </AppTable>

    <div v-if="!loading && count === 0" class="mt-2 w-full text-center text-white">
      <span>No change email requests.</span>
    </div>

    <nuxt-link
      v-if="$route.name !== 'index-change-email-requests'"
      class="bg-shield z-511 fixed inset-0 opacity-50"
      :to="{ name: 'index-change-email-requests' }"
      draggable="false"
    />

    <nuxt-child
      :changeEmailRequests="changeEmailRequests"
      :changeEmailRequestStatusColorClass="changeEmailRequestStatusColorClass"
      @changeEmailRequests="(_changeEmailRequests) => changeEmailRequests = _changeEmailRequests"
    />
  </div>
</template>

<script>
  import debounce from "lodash.debounce"

  import AppLoading from '@/components/Base/AppLoading'
  import AppTable from "@/components/Base/AppTable"

  export default {

    components: {
      AppLoading,
      AppTable,
    },

    data () {
      return {
        loading: false,
        limit: 10,
        page: 1,
        search: '',
        filterStatus: null,
        sort: null,
        orderBy: [],
        count: 0,
        changeEmailRequests: [],
      }
    },

    computed: {
      pages () {
        return Math.max(Math.ceil(this.count / this.limit), 1)
      },

      offset () {
        return Math.max(this.page * this.limit - this.limit, 0)
      },

      orderByValue: {
        get () {
          return this.orderBy.length > 0 ? this.orderBy[0] : null
        },
        set (orderBy) {
          this.orderBy = [orderBy]
        },
      },

      columns () {
        return [
          {
            name: "ID",
            dataIndex: "id",
            class: "text-center",
            sortable: true
          },
          // {
          //   name: "Memorable Word Category",
          //   dataIndex: "memorable_word_category_name",
          //   class: "text-center",
          //   sortable: true
          // },
          // {
          //   name: "Memorable Word",
          //   dataIndex: "memorable_word",
          //   class: "text-center",
          //   sortable: true
          // },
          // {
          //   name: "Memorable Date",
          //   dataIndex: "memorable_date_formatted",
          //   class: "text-center",
          //   sortable: true
          // },
          // {
          //   name: "Memorable Number",
          //   dataIndex: "memorable_number",
          //   class: "text-center",
          //   sortable: true
          // },
          {
            name: "New E-Mail Address",
            dataIndex: "new_email",
            class: "text-center",
            sortable: true,
          },
          {
            name: "User Count",
            dataIndex: "user_count",
            class: "text-center",
            sortable: true,
          },
          {
            name: "Requested At",
            dataIndex: "requested_at_formatted",
            class: "text-center",
            sortable: true,
          },
          {
            name: "Status",
            dataIndex: "status",
            class: "text-center",
            sortable: true,
						slot: true,
						slotName: 'status_slot',
          },
          {
            name: "Accepted At",
            dataIndex: "accepted_at_formatted",
            class: "text-center",
            sortable: true,
          },
          {
            name: "Rejected At",
            dataIndex: "rejected_at_formatted",
            class: "text-center",
            sortable: true,
          },
        ]
      },

      changeEmailRequestStatusColorClass () {
        return {
          Accepted: 'bg-green-500 text-white',
          Pending: 'bg-gray-500 text-gray-700',
          Rejected: 'bg-red-600 border-red-600 text-white',
        }
      }
    },

    watch: {
      page () {
        this.searchSubmit()
      },

      limit () {
        this.searchSubmit()
      },

      orderBy () {
        this.searchSubmit()
      },
    },

    mounted () {
      this.loading = true
      this.getChangeEmailRequests().catch((err) => {
        console.log('err', err)
      }).finally(() => {
        this.loading = false
      })
      
      this.$store.dispatch('pendingChangeEmailRequestIds')
      this.$socket.on('Admin Notification Change Email Request Pending', this.getChangeEmailRequests)
      this.$socket.on('Admin Notification Change Email Request Rejected', this.changeEmailRequestUpdated)
      this.$socket.on('Admin Notification Change Email Request Accepted', this.changeEmailRequestUpdated)
    },

    destroyed () {
      this.$socket.removeListener('Admin Notification Change Email Request Pending', this.getChangeEmailRequests)
      this.$socket.removeListener('Admin Notification Change Email Request Rejected', this.changeEmailRequestUpdated)
      this.$socket.removeListener('Admin Notification Change Email Request Accepted', this.changeEmailRequestUpdated)
    },

    methods: {
      changeEmailRequestUpdated (changeEmailRequest) {
        const index = this.changeEmailRequests.findIndex(({ id }) => id === changeEmailRequest.id)

        if (index > -1) {
          this.changeEmailRequests.splice(index, 1, changeEmailRequest)
        }
      },

      searchSubmit: debounce(function () {
        this.activePage = 1
        this.loading = true
        this.getChangeEmailRequests().catch((err) => {
          console.log('err', err)
        }).finally(() => {
          this.loading = false
        })
      }, 500),

      getChangeEmailRequests () {
        return Promise.all([
          this.$axios.get('/api/v1/admin/change-email-requests/count')
            .then(response => response.data.data.count),
          this.$axios.get('/api/v1/admin/change-email-requests', {
            params: {
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            }
          }).then(response => response.data.data.change_email_requests),
        ]).then((responses) => {
          const [
            count,
            changeEmailRequests,
          ] = responses

          this.count = count
          this.changeEmailRequests = changeEmailRequests
        })
      },
    },
  }
</script>
