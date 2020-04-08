<template>
  <div class="modal-container shadow-lg">
    <div class="p-4 md:p-8">
      <div class="flex justify-between text-sm text-white">
        <nuxt-link to="/referral-lottery" class="cursor-pointer">
          <svgicon
            name="arrow-left-solid"
            height="32"
            width="32"
            class="text-white hover:text-sunglow fill-current"
          />
        </nuxt-link>
      </div>

      <AppTable
        v-if="entries.length > 0"
        :total="total"
        :items="entries"
        :current-page="current_page"
        :per-page="limit"
        :columns="columns"
        :loading="loading"
        :custom-width="200"
        @pagechanged="pagechanged"
      />
    </div>
  </div>
</template>

<script>
  import AppTable from "@/components/Base/AppTable"

  export default {
    components: {
      AppTable,
    },

    data () {
      return {
        loading: false,
        total: 0,
        entries: [],
        current_page: 1,
        offset: 0,
        limit: 5,
      }
    },

    computed: {
      columns () {
        return [
          {
              name: "Domain",
              dataIndex: "domain",
              class: "text-left"
          },
          {
              name: "Name",
              dataIndex: "invited_name",
              class: "text-center"
          },
          {
              name: 'Active At',
              dataIndex: "first_actived_at",
              class: "text-center localDate"
          },
        ]
      }
    },

    async asyncData ({ app, params, error }) {
      try {
        const [
          total,
          entries,
        ] = await Promise.all([
          app.$axios.$get(`/api/v1/admin/raffle-users/${params.id}/raffle-entries/count`).then(res => {
            let total = res.data && res.data.count ? res.data.count : 0
            return total
          }),
          app.$axios.$get(`/api/v1/admin/raffle-users/${params.id}/raffle-entries`, { params: {
            offset: 0,
            limit: 5
          }}).then(res => {
            let entries = res.data && res.data.raffle_entries && res.data.raffle_entries.length > 0
              ? res.data.raffle_entries
              : []

            return entries
          }),
        ])

        return {
          total,
          entries
        }
      } catch (err) {
        console.log('err', err || err.response)

        return error({
          status: 400,
          message: err.response.message,
        })
      }
    },

    methods: {
      async getEntries () {
        try {
          this.$axios.$get(`/api/v1/admin/raffle-users/${this.$route.params.id}/raffle-entries`, { params: {
            offset: (this.current_page - 1) * this.limit,
            limit: this.limit
          }}).then(res => {
            this.entries = res.data && res.data.raffle_entries && res.data.raffle_entries.length > 0 ? res.data.raffle_entries : []
          })
        } catch (err) {
          console.log(err.response || err)

          return this.$nuxt.error({
            status: 400,
            message: err.response.message,
          })
        }
      },

      async pagechanged (e) {
        this.current_page = e
        this.loading = true
        await this.getEntries()
        this.loading = false
      },

    },

  }
</script>

<style scoped>
  .modal-container {
    position: fixed;
    top: 0;
    right: 0;
    margin-right: 0%;
    width: 100%;
    height: 100%;
    overflow: auto;
    border-left: solid 2px #ffc72c;
    transition: all 0.3s ease-in-out;
    background-color: #505561;
    z-index: 512;
  }

  @media screen and (min-width: 1200px) {
    .modal-container {
      width: 80%;
    }
  }
</style>
