<template>
  <section class="flex-1 flex flex-col py-2 px-2 md:px-6 overflow-y-auto">
    <template v-if="$route.name === 'index-change-email-requests'">
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
              v-model="selectedOrderByValue"
              class="w-full md:w-auto outline-none rounded-lg border-2 border-transparent text-sm text-white p-1 pr-6 focus:hubzz-yellow bg-waterloo"
            >
              <option v-for="orderByValue in orderByValues" :key="orderByValue.value" :value="orderByValue.value">
                {{ orderByValue.displayLabel }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <AppTableNew
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
      </AppTableNew>

      <div v-if="!loading && count === 0" class="mt-2 w-full text-center text-white">
        <span>No change email requests.</span>
      </div>
    </template>
    
    <nuxt-child
      :changeEmailRequests="changeEmailRequests"
      :changeEmailRequestStatusColorClass="changeEmailRequestStatusColorClass"
      @changeEmailRequests="(_changeEmailRequests) => changeEmailRequests = _changeEmailRequests"
    />
  </section>
</template>

<script>
  import debounce from "lodash.debounce"

  import AppLoading from '@/components/Base/AppLoading'
  import AppTableNew from "@/components/Base/AppTableNew"

  export default {

    components: {
      AppLoading,
      AppTableNew,
    },

    data () {
      return {
        loading: false,
        limit: 15,
        page: 1,
        search: '',
        filterStatus: null,
        sort: null,
        orderBy: [
          'requested_at_formatted:desc',
        ],
        count: 0,
        changeEmailRequests: [],
      }
    },

    computed: {
      authAdminPermissions () {
        return this.$store.getters["permissions"]
      },
      pages () {
        return Math.max(Math.ceil(this.count / this.limit), 1)
      },

      offset () {
        return Math.max(this.page * this.limit - this.limit, 0)
      },

      columns () {
        return [
          {
            name: "ID",
            dataIndex: "id",
            class: "text-center",
            sortable: true
          },
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
						// slot: true,
						// slotName: 'status_slot',
          },
          {
            name: "Accepted At",
            dataIndex: "accepted_at_in_gb_formatted",
            class: "text-center",
            sortable: true,
          },
          {
            name: "Rejected At",
            dataIndex: "rejected_at_in_gb_formatted",
            class: "text-center",
            sortable: true,
          },
        ]
      },

      orderByValues () {
        return this.columns.reduce((orderByValues, column) => {
          const {
            name,
            dataIndex,
            sortable,
          } = column

          if (sortable) {
            orderByValues.push({
              displayLabel: `${name} (asc)`,
              value: `${dataIndex}:asc`,
            })

            orderByValues.push({
              displayLabel: `${name} (desc)`,
              value: `${dataIndex}:desc`,
            })
          }

          return orderByValues
        }, [])
      },

      selectedOrderByValue: {
        get () {
          return this.orderBy.length > 0 ? this.orderBy[0] : null
        },
        set (orderBy) {
          this.orderBy = [orderBy]
        },
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

    async asyncData ({ store, error }) {
      try {
        const authAdminPermissions = store.getters["permissions"]

        if (authAdminPermissions.includes('View Change Email Requests') === false) {
          error({
            statusCode: 403,
            message: 'You are not authorized to view this page.',
          })
          return
        }

      } catch(err) {
        error({ statusCode: 404 })
        store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: "Something went wrong!"
        })
        console.log("get parent practice error!!", err)
      }
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
