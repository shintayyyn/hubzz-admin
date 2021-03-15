<template>
  <section class="relative">
    <template v-if="$route.name === 'index-referral-lottery-index'">
      <template v-if="!$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'entries')">
        <div class="w-full flex flex-col items-start md:flex-row md:items-center mx-2">
          <AppDate
            v-model="date_start"
            class="w-full md:w-1/2 md:mx-2"
            :name="'date_start'"
            :label="'Date Start'"
          />
          <AppDate
            v-model="date_end"
            class="w-full md:w-1/2 md:mx-2"
            :name="'date_end'"
            :label="'Date End'"
          />
        </div>
        <div class="flex justify-start mb-4">
          <AppButton 
            :label="'Clear Filter'"
            @click="clearFilters"
          />
          <div class="mx-1" />
          <AppButton 
            :label="'Filter Entries'"
            @click="display"
          />
          <div class="mx-1" />
          <AppButton
            v-if="authAdminPermissions.includes('Referral Lottery Processes')"
            :label="'Initiate Draw'" 
            class="mx-1" 
            :disabled="!canInitiateDraw" 
            @click="draw_modal = true" 
          />
        </div>
      </template>

      <AppConfirm
        v-if="draw_modal"
        :message="'Are you sure you want to initiate lottery?'"
        @confirm="initiateDraw"
        @cancel="draw_modal = false"
      />

      <div v-if="winner_modal" class="wrapper absolute top-0 mx-auto rounded-b-lg p-4 bg-white shadow-lg">
        <div class="flex flex-col justify-center">
          <div class="font-bold text-lg">
            Winner
          </div>
          <div class="text-center">
            {{ winner.winner_user.name }}
          </div>
        </div>
        <AppInput
          v-model="description"
          :type="'textarea'"
          :name="'description'"
          :label="'Description'"
          :resize="false"
          :rows="3"
          required
        />
        <div class="flex justify-start">
          <AppButton v-if="!winner.winner_notified" :label="'Notify'" class="mt-4 mx-1" :disabled="loadingNotify" @click="notifyWinner(winner.id)" />
          <div class="mx-1" />
          <AppButton :label="'Close'" :background="'red'" class="mt-4 mx-1" @click="winner_modal = false" />
        </div>
      </div>

      <transition name="fade" mode="out-in">
        <div v-if="initialLoading" class="relative flex w-full" style="min-height:80px">
          <AppLoading :loading="initialLoading" spinner />
        </div>

        <div v-if="!initialLoading">
          <AppTableNew
            v-if="users && users.length > 0"
            :total="total"
            :items="users"
            :current-page="current_page"
            :perPage="limit"
            :columns="columns"
            :loading="loading"
            :custom-width="500"
            :orderBy="orderBy"
            @pagechanged="pagechanged"
            @sorted="(sort) => orderBy = sort"
          >
            <template v-slot:actions="slotProps">
              <div class="flex justify-center">
                <button v-if="!$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'entries')"
                    class="px-4 bg-sunglow hover:bg-sunglow-dark rounded focus:outline-none cursor-pointer"
                    @click="$router.push({ path: `/referral-lottery/entries/${slotProps.item.id}`, query: {...$route.query }})"
                >
                  View
                </button>
              </div>
            </template>
          </AppTableNew>

          <AppTableNew
            v-if="raffles && raffles.length > 0"
            :total="total"
            :items="raffles"
            :current-page="current_page"
            :perPage="limit"
            :columns="columns"
            :loading="loading"
            :custom-width="500"
            :orderBy="orderBy"
            @pagechanged="pagechanged"
            @sorted="(sort) => orderBy = sort"
          >
            <template v-slot:actions="slotProps">
              <div class="flex justify-center">
                <div v-if="($route.query.status && $route.query.status.toLowerCase() === 'winners')"
                    class="px-4 bg-sunglow hover:bg-sunglow-dark rounded focus:outline-none cursor-pointer"
                    @click="$router.push({ path: `/referral-lottery/winners/${slotProps.item.id}`, query: {...$route.query }})"
                >
                  View
                </div>
                <div class="mx-1" />
                <div v-if="($route.query.status && $route.query.status.toLowerCase() === 'winners') && !slotProps.item.winner_notified"
                    class="px-4 bg-sunglow hover:bg-sunglow-dark rounded focus:outline-none cursor-pointer"
                    @click="selectUserNotify(slotProps.item.id)"
                >
                  Notify
                </div>
              </div>
            </template>
          </AppTableNew>

          <div v-if="!loading" class="flex justify-center py-4">
            {{ noDataFound }}
          </div>
          
        </div>
      </transition>
    </template>

    <nuxt-child :dateStart="date_start" :dateEnd="date_end" @notify="notify" />
  </section>
</template>

<script>
  import AppTableNew from "@/components/Base/AppTableNew"
  import AppInput from "@/components/Base/AppInput"
  import AppConfirm from "@/components/Base/AppConfirm"
  import AppDate from "@/components/Base/AppDate"
  import AppLoading from "@/components/Base/AppLoading"
  import AppButton from "@/components/Base/AppButton"

  export default {
    components: {
      AppTableNew,
      AppInput,
      AppConfirm,
      AppDate,
      AppLoading,
      AppButton
    },

    data () {
      return {
        draw_modal: false,
        winner_modal: false,
        winner: null,
        description: '',
        loadingNotify: false,

        initialLoading: false,
        loading: false,
        total: 0,
        users: [],
        raffles: [],

        orderBy: [],

        current_page: 1,
        offset: 0,
        limit: 20,

        date_start: null,
        date_end: null,

        currentDateStart: null,
        currentDateEnd: null,
      }
    },

    computed: {
      authAdminPermissions () {
        return this.$store.getters["permissions"]
      },

      canInitiateDraw () {
        return this.currentDateStart && this.currentDateEnd && !this.loading && !this.initialLoading && this.users.length > 0
      },

      columns () {
        let columns = []
        let routeQuery = this.$route.query.status ? this.$route.query.status.toLowerCase() : 'entries'
        if (routeQuery === 'entries') {
          columns.push(...[
            {
              name: "Name",
              dataIndex: "name",
              class: "text-left",
              sortable: true,
            },
            {
              name: "Account Type",
              dataIndex: "domain",
              class: "text-left",
              sortable: true,
            },
            {
              name: "Total Invited Count",
              dataIndex: "total_invited_count",
              class: "text-center",
              sortable: true,
            },
            {
              name: "Actions",
              dataIndex: "actions",
              class: "text-center"
            },
          ])
        } else if (routeQuery === 'winners') {
          columns.push(...[{
              name: "Name",
              dataIndex: "winner_user.name",
              class: "text-left",
              sortable: true,
              sortIndex: 'winner_user_name',
            },
            {
              name: "Notified",
              dataIndex: "winner_notified",
              class: "text-center",
              sortable: true,
            },
            {
              name: "Winning Date",
              dataIndex: "date_created",
              class: "text-center localDate",
              sortable: true,
            },
            {
              name: "Actions",
              dataIndex: "actions",
              class: "text-center"
            }
          ])
        }

        return columns
      },

      noDataFound () {
        let routeQuery = this.$route.query.status ? this.$route.query.status.toLowerCase() : 'entries'

        if (routeQuery === 'entries' && this.users.length === 0) {
          return `No Prize Draw ${routeQuery} Found`
        } else if (routeQuery === 'winners' && this.raffles.length === 0) {
          return `No Prize Draw ${routeQuery} Found`
        }

        return ''
      },

      routeLink () {
        let routeQuery = this.$route.query.status ? this.$route.query.status.toLowerCase() : 'entries'

        if (routeQuery === 'entries') {
          return ``
        }

        return ''
      },

    },

    watch: {
      orderBy () {
        this.current_page = 1
        this.loading = true
        this.getUsersPromiseAll().finally(() => {
          this.loading = false
        })
      },

      "$route.query" (newValue, oldValue) {
        let newStatus = newValue.status
        let oldStatus = oldValue.status
        if (newStatus && newStatus !== null && newStatus !== oldStatus) {
          this.current_page = 1
          this.total = 0
          this.users = []
          this.raffles = []
          this.date_start = null
          this.date_end = null
          this.orderBy = []
          this.initialLoading = true
          this.getUsersPromiseAll().finally(() => {
            this.initialLoading = false
          })
        }
      },

      winner_modal () {
        this.description = ''
      }
    },

    async asyncData ({ app, query, error }) {
      try {
        let routeQuery = query.status ? query.status.toLowerCase() : 'entries'

        let url = routeQuery === 'entries' ? `/api/v1/admin/raffle-users` : `/api/v1/admin/raffles`

        const [total, [raffles, users]] = await Promise.all([
          app.$axios.$get(`${url}/count`).then(res => {
            const total = res.data && res.data.count ? res.data.count : 0
            return total
          }),
          app.$axios.$get(`${url}`, { params: {
            offset: 0,
            limit: 20
          }}).then(res => {
            let users
            let raffles

            if (res.data && res.data.users) {
              users = res.data.users 
            } else if (res.data && res.data.raffles) {
              raffles = res.data.raffles
            }

            return [
              raffles,
              users,
            ]
          })
        ])

        return {
          total,
          raffles,
          users
        }
      } catch (err) {
        return error({
          status: 400,
          message: err.response.message,
        })
      }
    },

    mounted () {

    },

    methods: {

      getUsersPromiseAll () {
        let routeQuery = this.$route.query.status ? this.$route.query.status.toLowerCase() : 'entries' 

        let url = routeQuery === 'entries' ? `/api/v1/admin/raffle-users` : `/api/v1/admin/raffles`

        const params = {
          date_start: this.date_start,
          date_end: this.date_end,
        }

        return Promise.all([
          this.$axios.$get(`${url}/count`, {
            params: {
              ...params,
            },
          }).then(res => {
            this.total = res.data && res.data.count ? res.data.count : 0
          }),
          this.$axios.$get(`${url}`, {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: (this.current_page - 1) * this.limit,
            },
          }).then(res => {
            if (res.data && res.data.users) {
              this.users = res.data.users 
            } else if (res.data && res.data.raffles) {
              this.raffles = res.data.raffles
            }
          })
        ]).then(() => {
          this.currentDateStart = this.date_start
          this.currentDateEnd = this.date_end
        }).catch((err) => {
          console.log('err', err.response || err)

          let message = null

          if (err.response) {
            message = err.response.data.message
          } else if (err.request) {
            message = 'Something went wrong!'
          } else {
            message = err.message
          }

          if (message) {
            this.$store.commit('SET_NOTIFICATION', {
              enabled: true,
              status: 'danger',
              text: [`${message}`],
            })
            return
          }

          throw err
        })
      },

      display () {
        try {
          if (this.date_start === null || this.date_end === null) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: "Date input is required",
            })

            return
          }
          this.loading = true
          this.getUsersPromiseAll().finally(() => {
            this.loading = false
          })
        } catch (err) {
          console.log('err', err.response || err)

          this.loading = false
          return this.$nuxt.error({
            status: 400,
            message: err.response.message,
          })
        }
      },

      initiateDraw () {
        if (!this.currentDateStart || !this.currentDateEnd) {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: "Date inputs are required",
          })

          return
        }

        this.loading = true
        this.getUsersPromiseAll().finally(() => {
          this.loading = false
        }).then(() => {
          return this.$axios.$post(`/api/v1/admin/raffles`, {
            date_start: this.currentDateStart,
            date_end: this.currentDateEnd
          })
        }).then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: 'Successfully pick a winner',
          })
          this.winner_modal = true
          this.winner = res.data.raffle
        }).catch(err => {
          throw err
        }).finally(() => {
          this.draw_modal = false
        })
      },

      selectUserNotify (raffleId) {
        this.winner = this.raffles.find(item => item.id === raffleId)
        this.winner_modal = true
      },
    
      notifyWinner (id) {
        this.description = this.description.trim()
        if (!this.description) {
            this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: "Description is required",
            })
            return
        }
        this.loadingNotify = true
        this.$axios.$post(`/api/v1/admin/raffles/${id}/notify-winner`, { description: this.description })
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: res.message,
            })

            this.winner.winner_notified = true
            // this.getUsersPromiseAll()

            let winner = this.raffles.find(item => item.id === id)

            if (winner) {
              winner.winner_notified = true
            }
          }).catch(err => {
            console.log('err', err || err.response)
          }).finally(() => {
            this.winner = null
            this.description = ''
            this.winner_modal = false
          })

        this.loadingNotify = false
      },

      notify (raffle) {
        let winner = this.raffles.find(item => item.id === raffle.id)

        if (winner) {
          winner.winner_notified = true
          winner.description = raffle.description
        }
      },

      clearFilters () {
        this.date_start = null
        this.date_end = null
        this.orderBy = []
        this.current_page = 1
        this.loading = true
        this.getUsersPromiseAll().then(() => {
          this.loading = false
        })
      },

      pagechanged (currentPage) {
        this.current_page = currentPage
        this.loading = true
        this.getUsersPromiseAll().then(() => {
          this.loading = false
        })
      },

    },

  }
</script>
