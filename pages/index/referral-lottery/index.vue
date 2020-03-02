<template>
  <div class="relative">
    <template v-if="!$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'entries')">
      <div class="w-full flex flex-col items-start md:flex-row md:items-center mx-2 text-white">
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
        <AppButton :label="'Initiate Draw'" class="mx-1" :disabled="!canInitiateDraw" @click="draw_modal = true" />
      </div>
    </template>
    <AppConfirm
      v-if="draw_modal"
      :message="'Are you sure you want to initiate lottery?'"
      @confirm="initiateDraw"
      @cancel="draw_modal = false"
    />
    <div v-if="winner_modal" class="wrapper absolute top-0 mx-auto rounded-b-lg p-4 bg-waterloo-dark text-white shadow-lg">
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
        <AppButton :label="'Close'" :background="'red'" class="text-white mt-4 mx-1" @click="winner_modal = false" />
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="initialLoading" class="relative flex w-full" style="min-height:80px">
        <AppLoading :loading="initialLoading" spinner />
      </div>
      <div v-if="!initialLoading">
        <AppTable
          v-if="users && users.length > 0"
          :total="total"
          :items="users"
          :current-page="current_page"
          :per-page="limit"
          :columns="columns"
          :loading="loading"
          :custom-width="500"
          @pagechanged="pagechanged"
        >
          <template v-slot:actions="slotProps">
            <div class="flex justify-center">
              <div v-if="!$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'entries')"
                   class="my-1 p-2 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                   @click="$router.push({ path: `/referral-lottery/entries/${slotProps.item.id}`, query: {...$route.query }})"
              >
                View
              </div>
            </div>
          </template>
        </AppTable>
        <AppTable
          v-if="raffles && raffles.length > 0"
          :total="total"
          :items="raffles"
          :current-page="current_page"
          :per-page="limit"
          :columns="columns"
          :loading="loading"
          :custom-width="500"
          @pagechanged="pagechanged"
        >
          <template v-slot:actions="slotProps">
            <div class="flex justify-center">
              <div v-if="($route.query.status && $route.query.status.toLowerCase() === 'winners')"
                   class="my-1 p-2 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                   @click="$router.push({ path: `/referral-lottery/winners/${slotProps.item.id}`, query: {...$route.query }})"
              >
                View
              </div>
              <div class="mx-1" />
              <div v-if="($route.query.status && $route.query.status.toLowerCase() === 'winners') && !slotProps.item.winner_notified"
                   class="my-1 p-2 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                   @click="selectUserNotify(slotProps.item.id)"
              >
                Notify
              </div>
            </div>
          </template>
        </AppTable>
        <div v-if="!loading" class="flex text-white justify-center py-4">
          {{ noDataFound }}
        </div>
        <div
          v-if="['index-referral-lottery-index-entries-create', 'index-referral-lottery-index-entries-id', 'index-referral-lottery-index-winners-id'].includes($route.name)"
          class="shield"
          @click="$router.push({ path: `/referral-lottery`, query: {...$route.query}})"
        />
        <div
          v-if="winner_modal || draw_modal"
          class="shield"
          @click="winner_modal = false, draw_modal = false"
        />
        <nuxt-child @notify="notify" />
      </div>
    </transition>
  </div>
</template>
<script>
import AppTable from "@/components/Base/AppTable"
import AppInput from "@/components/Base/AppInput"
import AppConfirm from "@/components/Base/AppConfirm"
import AppDate from "@/components/Base/AppDate"
import AppLoading from "@/components/Base/AppLoading"
import AppButton from "@/components/Base/AppButton"
export default {
    components: {
        AppTable,
        AppInput,
        AppConfirm,
        AppDate,
        AppLoading,
        AppButton
    },
    data () {
        return {
            canInitiateDraw: false,
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

            current_page: 1,
            offset: 0,
            limit: 5,

            date_start: null,
            date_end: null
        }
    },
    computed: {
        columns () {
            let columns = []
            let routeQuery = this.$route.query.status ? this.$route.query.status.toLowerCase() : 'entries'
            if (routeQuery === 'entries') {
                columns.push({
                        name: "Name",
                        dataIndex: "first_name",
                        class: "text-left"
                    },
                    {
                        name: "Total Invited Count",
                        dataIndex: "total_invited_count",
                        class: "text-center"
                    },
                    {
                        name: "Actions",
                        dataIndex: "actions",
                        class: "text-center"
                    })
            } else if (routeQuery === 'winners') {
                columns.push({
                        name: "Name",
                        dataIndex: "winner_user.name",
                        class: "text-left"
                    },
                    {
                        name: "Notified",
                        dataIndex: "winner_notified",
                        class: "text-center"
                    },
                    {
                        name: "Winning Date",
                        dataIndex: "date_created",
                        class: "text-center localDate"
                    },
                    {
                        name: "Actions",
                        dataIndex: "actions",
                        class: "text-center"
                    })
            }
            return columns
        },
        noDataFound () {
            let routeQuery = this.$route.query.status ? this.$route.query.status.toLowerCase() : 'entries'
            if (routeQuery === 'entries' && this.users.length === 0) {
                return `No Raffle ${routeQuery} Found`
            } else if (routeQuery === 'winners' && this.raffles.length === 0) {
                return `No Raffle ${routeQuery} Found`
            }
            return ''
        },
        routeLink () {
            let routeQuery = this.$route.query.status ? this.$route.query.status.toLowerCase() : 'entries'
            if (routeQuery === 'entries') {
                return ``
            }
            return ''
        }
    },
    watch: {
        async "$route.query" (newValue, oldValue) {
            let newStatus = newValue.status
            let oldStatus = oldValue.status
            if (newStatus && newStatus !== null && newStatus !== oldStatus) {
                this.current_page = 1
                this.total = 0
                this.users = []
                this.raffles = []
                this.date_start = null
                this.date_end = null
                this.canInitiateDraw = false
                this.initialLoading = true
                await this.getUsersPromiseAll()
                this.initialLoading = false
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
                    limit: 5
                }}).then(res => {
                    let users
                    let raffles
                    if (res.data && res.data.users) {
                        users = res.data.users 
                    } else if (res.data && res.data.raffles) {
                        raffles = res.data.raffles
                    }
                    return [raffles, users]
                })
            ])
            return {
                total,
                raffles,
                users
            }
        } catch (err) {
            return error({ status: 400, message: err.response.message })
        }
    },
    methods: {
        async getUsersPromiseAll () {
            try {
                let routeQuery = this.$route.query.status ? this.$route.query.status.toLowerCase() : 'entries' 
                let url = routeQuery === 'entries' ? `/api/v1/admin/raffle-users` : `/api/v1/admin/raffles`
                return Promise.all([
                    this.$axios.$get(`${url}/count`).then(res => {
                        this.total = res.data && res.data.count ? res.data.count : 0
                    }),
                    this.$axios.$get(`${url}`, { params: {
                        offset: (this.current_page - 1) * this.limit,
                        limit: this.limit
                    }}).then(res => {
                        if (res.data && res.data.users) {
                            this.users = res.data.users 
                        } else if (res.data && res.data.raffles) {
                            this.raffles = res.data.raffles
                        }
                    })
                ])
            } catch (err) {
                return this.$nuxt.error({ status: 400, message: err.response.message })
            }
        },
        async getUsers () {
            try {
                let routeQuery = this.$route.query.status ? this.$route.query.status.toLowerCase() : 'entries' 
                let url = routeQuery === 'entries' ? `/api/v1/admin/raffle-users` : `/api/v1/admin/raffles`
                return Promise.all([
                    this.$axios.$get(`${url}`, { params: {
                        offset: (this.current_page - 1) * this.limit,
                        limit: this.limit
                    }}).then(res => {
                        if (res.data && res.data.users) {
                            this.users = res.data.users 
                        } else if (res.data && res.data.raffles) {
                            this.raffles = res.data.raffles
                        }
                    })
                ])
            } catch (err) {
                return this.$nuxt.error({ status: 400, message: err.response.message })
            }
        },
        async display () {
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
                await Promise.all([
                    this.$axios.$get(`/api/v1/admin/raffle-users/count`, {
                        params: {
                            date_start: this.date_start,
                            date_end: this.date_end
                        }
                    }).then(res => {
                        this.total = res.data && res.data.total ? res.data.total : 0
                    }),
                    this.$axios.$get(`/api/v1/admin/raffle-users`, {
                        params: {
                            date_start: this.date_start,
                            date_end: this.date_end
                        }
                    }).then(res => {
                        this.users = res.data && res.data.users && res.data.users.length > 0 ? res.data.users : []
                        this.canInitiateDraw = this.users.length > 0 ? true : false
                    })
                ])
                this.loading = false
            } catch (err) {
                this.loading = false
                return this.$nuxt.error({ status: 400, message: err.response.message})
            }
        },
        initiateDraw () {
            if (!this.date_start || !this.date_end) {
                this.$store.commit("SET_NOTIFICATION", {
                    enabled: true,
                    status: "danger",
                    text: "Date inputs are required",
                })
                return
            }
            this.$axios.$post(`/api/v1/admin/raffles`, {
                date_start: this.date_start,
                date_end: this.date_end
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
                    // this.getUsers()
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
        async clearFilters () {
            this.date_start = null
            this.date_end = null
            this.canInitiateDraw = false
            this.loading = true
            await this.getUsersPromiseAll()
            this.loading = false
        },
        async pagechanged (e) {
            this.current_page = e
            this.loading = true
            await this.getUsers()
            this.loading = false
        },
    }
}
</script>