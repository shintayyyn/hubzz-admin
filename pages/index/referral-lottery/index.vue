<template>
  <section class="relative">
    <template v-if="isRootRoute">
      <template v-if="isEntriesView">
        <div class="w-full flex flex-col items-start md:flex-row md:items-center mx-2">
          <AppDate v-model="date_start" class="w-full md:w-1/2 md:mx-2" name="date_start" label="Date Start" />
          <AppDate v-model="date_end" class="w-full md:w-1/2 md:mx-2" name="date_end" label="Date End" />
        </div>

        <div class="flex justify-start mb-4">
          <AppButton label="Clear Filter" @click="clearFilters" />
          <div class="mx-1" />
          <AppButton label="Filter Entries" @click="display" />
          <div class="mx-1" />
          <AppButton v-if="hasDrawPermission" label="Initiate Draw" class="mx-1" :disabled="!canInitiateDraw" @click="draw_modal = true" />
        </div>
      </template>

      <AppConfirm v-if="draw_modal" message="Are you sure you want to initiate lottery?" @confirm="initiateDraw" @cancel="draw_modal = false" />

      <div v-if="winner_modal" class="wrapper absolute top-0 mx-auto rounded-b-lg p-4 bg-white shadow-lg">
        <div class="flex flex-col justify-center">
          <div class="font-bold text-lg">
            Winner
          </div>
          <div class="text-center">
            {{ winner && winner.winner_user ? winner.winner_user.name : '' }}
          </div>
        </div>

        <AppInput v-model="description" type="textarea" name="description" label="Description" :resize="false" :rows="3" required />

        <div class="flex justify-start">
          <AppButton
            v-if="winner && !winner.winner_notified"
            label="Notify"
            class="mt-4 mx-1"
            :disabled="loadingNotify"
            @click="notifyWinner(winner.id)"
          />
          <div class="mx-1" />
          <AppButton label="Close" background="red" class="mt-4 mx-1" @click="winner_modal = false" />
        </div>
      </div>

      <transition name="fade" mode="out-in">
        <div v-if="initialLoading" class="relative flex w-full" style="min-height:80px">
          <AppLoading :loading="initialLoading" spinner />
        </div>

        <div v-else>
          <!-- ENTRIES TABLE -->
          <AppTableNew
            v-if="hasEntries"
            :total="total"
            :items="users"
            :current-page="current_page"
            :perPage="limit"
            :columns="columns"
            :loading="loading"
            :customWidth="tableWidth"
            :orderBy="orderBy"
            @pagechanged="pagechanged"
            @sorted="onSorted"
          >
            <template v-slot:actions="slotProps">
              <div class="flex justify-center">
                <button
                  v-if="isEntriesView"
                  class="px-4 bg-sunglow hover:bg-sunglow-dark rounded focus:outline-none cursor-pointer"
                  @click="goEntry(slotProps.item.id)"
                >
                  View
                </button>
              </div>
            </template>
          </AppTableNew>

          <!-- WINNERS TABLE -->
          <AppTableNew
            v-if="hasRaffles"
            :total="total"
            :items="raffles"
            :current-page="current_page"
            :perPage="limit"
            :columns="columns"
            :loading="loading"
            :custom-width="tableWidth"
            :orderBy="orderBy"
            @pagechanged="pagechanged"
            @sorted="onSorted"
          >
            <template v-slot:actions="slotProps">
              <div class="flex justify-center">
                <div
                  v-if="isWinnersView"
                  class="px-4 bg-sunglow hover:bg-sunglow-dark rounded focus:outline-none cursor-pointer"
                  @click="goWinner(slotProps.item.id)"
                >
                  View
                </div>

                <div class="mx-1" />

                <div
                  v-if="isWinnersView && slotProps.item && !slotProps.item.winner_notified"
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
import AppTableNew from '@/components/Base/AppTableNew'
import AppInput from '@/components/Base/AppInput'
import AppConfirm from '@/components/Base/AppConfirm'
import AppDate from '@/components/Base/AppDate'
import AppLoading from '@/components/Base/AppLoading'
import AppButton from '@/components/Base/AppButton'

const STATUS = {
  ENTRIES: 'entries',
  WINNERS: 'winners'
}

export default {
  components: {
    AppTableNew,
    AppInput,
    AppConfirm,
    AppDate,
    AppLoading,
    AppButton
  },

  data() {
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
      limit: 20,

      date_start: null,
      date_end: null,

      currentDateStart: null,
      currentDateEnd: null
    }
  },

  computed: {
    status() {
      return (this.$route.query.status || STATUS.ENTRIES).toLowerCase()
    },

    isRootRoute() {
      return this.$route.name === 'index-referral-lottery-index'
    },

    isEntriesView() {
      return this.status === STATUS.ENTRIES
    },

    isWinnersView() {
      return this.status === STATUS.WINNERS
    },

    hasEntries() {
      return this.isEntriesView && this.users.length > 0
    },

    hasRaffles() {
      return this.isWinnersView && this.raffles.length > 0
    },

    tableWidth() {
      return 500
    },

    authAdminPermissions() {
      return this.$store.getters['permissions']
    },

    hasDrawPermission() {
      return this.authAdminPermissions.includes('Referral Lottery Processes')
    },

    canInitiateDraw() {
      return this.currentDateStart && this.currentDateEnd && !this.loading && !this.initialLoading && this.users.length > 0
    },

    columns() {
      if (this.isEntriesView) {
        return [
          { name: 'Name', dataIndex: 'name', class: 'text-left', sortable: true },
          { name: 'Account Type', dataIndex: 'domain', class: 'text-left', sortable: true },
          { name: 'Total Invited Count', dataIndex: 'total_invited_count', class: 'text-center', sortable: true },
          { name: 'Actions', dataIndex: 'actions', class: 'text-center' }
        ]
      }

      return [
        {
          name: 'Name',
          dataIndex: 'winner_user.name',
          class: 'text-left',
          sortable: true,
          sortIndex: 'winner_user_name'
        },
        { name: 'Notified', dataIndex: 'winner_notified', class: 'text-center', sortable: true },
        { name: 'Winning Date', dataIndex: 'date_created', class: 'text-center localDate', sortable: true },
        { name: 'Actions', dataIndex: 'actions', class: 'text-center' }
      ]
    },

    noDataFound() {
      if (this.isEntriesView && this.users.length === 0) {
        return `No Prize Draw ${STATUS.ENTRIES} Found`
      }
      if (this.isWinnersView && this.raffles.length === 0) {
        return `No Prize Draw ${STATUS.WINNERS} Found`
      }
      return ''
    }
  },

  watch: {
    orderBy() {
      this.pagechanged(1)
    },

    '$route.query'(n, o) {
      if (n.status !== o.status) {
        this.resetState()
        this.getUsersPromiseAll().finally(() => {
          this.initialLoading = false
        })
      }
    },

    winner_modal() {
      this.description = ''
    }
  },

  async asyncData({ app, query, error }) {
    try {
      const status = (query.status || STATUS.ENTRIES).toLowerCase()
      const base = status === STATUS.ENTRIES ? '/api/v1/admin/raffle-users' : '/api/v1/admin/raffles'

      const [total, list] = await Promise.all([
        app.$axios.$get(`${base}/count`).then(r => r.data?.count || 0),
        app.$axios.$get(base, { params: { offset: 0, limit: 20 } }).then(r => [r.data?.raffles, r.data?.users])
      ])

      return {
        total,
        raffles: list[0],
        users: list[1]
      }
    } catch (err) {
      return error({
        status: 400,
        message: err.response?.message
      })
    }
  },

  methods: {
    resetState() {
      this.current_page = 1
      this.total = 0
      this.users = []
      this.raffles = []
      this.date_start = null
      this.date_end = null
      this.orderBy = []
      this.initialLoading = true
    },

    apiBase() {
      return this.isEntriesView ? '/api/v1/admin/raffle-users' : '/api/v1/admin/raffles'
    },

    getUsersPromiseAll() {
      const url = this.apiBase()

      const params = {
        date_start: this.date_start,
        date_end: this.date_end
      }

      return Promise.all([
        this.$axios.$get(`${url}/count`, { params }).then(r => {
          this.total = r.data?.count || 0
        }),
        this.$axios
          .$get(url, {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: (this.current_page - 1) * this.limit
            }
          })
          .then(r => {
            if (r.data?.users) this.users = r.data.users
            if (r.data?.raffles) this.raffles = r.data.raffles
          })
      ]).then(() => {
        this.currentDateStart = this.date_start
        this.currentDateEnd = this.date_end
      })
    },

    onSorted(sort) {
      this.orderBy = sort
    },

    goEntry(id) {
      this.$router.push({
        path: `/referral-lottery/entries/${id}`,
        query: this.$route.query
      })
    },

    goWinner(id) {
      this.$router.push({
        path: `/referral-lottery/winners/${id}`,
        query: this.$route.query
      })
    },

    display() {
      if (!this.date_start || !this.date_end) return

      this.loading = true
      this.getUsersPromiseAll().finally(() => {
        this.loading = false
      })
    },

    clearFilters() {
      this.date_start = null
      this.date_end = null
      this.orderBy = []
      this.pagechanged(1)
    },

    pagechanged(page) {
      this.current_page = page
      this.loading = true
      this.getUsersPromiseAll().finally(() => {
        this.loading = false
      })
    },

    initiateDraw() {
      if (!this.currentDateStart || !this.currentDateEnd) return

      this.loading = true

      this.getUsersPromiseAll()
        .finally(() => {
          this.loading = false
        })
        .then(() =>
          this.$axios.$post('/api/v1/admin/raffles', {
            date_start: this.currentDateStart,
            date_end: this.currentDateEnd
          })
        )
        .finally(() => {
          this.draw_modal = false
        })
    },

    selectUserNotify(id) {
      this.winner = this.raffles.find(i => i.id === id)
      this.winner_modal = true
    },

    notifyWinner(id) {
      const desc = this.description.trim()
      if (!desc) return

      this.loadingNotify = true

      this.$axios
        .$post(`/api/v1/admin/raffles/${id}/notify-winner`, {
          description: desc
        })
        .finally(() => {
          this.loadingNotify = false
          this.winner = null
          this.description = ''
          this.winner_modal = false
        })
    },

    notify(raffle) {
      const item = this.raffles.find(i => i.id === raffle.id)
      if (item) {
        item.winner_notified = true
        item.description = raffle.description
      }
    }
  }
}
</script>
