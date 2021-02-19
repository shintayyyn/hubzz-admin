<template>
  <div>
    <AppTableNew
      v-if="entries.length > 0"
      :total="count"
      :items="entries"
      :current-page="current_page"
      :customItemsWidth="'cursor-default'"
      :perPage="limit"
      :columns="columns"
      :loading="loading"
      :custom-width="200"
      :orderBy="orderBy"
      @pagechanged="pagechanged"
      @sorted="(sort) => orderBy = sort"
    />
  </div>
</template>

<script>
  import AppTableNew from "@/components/Base/AppTableNew"

  export default {
    components: {
      AppTableNew,
    },

    props: {
      dateStart: {
        type: String,
        default: null,
      },
      dateEnd: {
        type: String,
        default: null,
      },
    },

    data () {
      return {
        loading: false,
        count: 0,
        entries: [],
        orderBy: [],
        current_page: 1,
        offset: 0,
        limit: 5,
      }
    },

    computed: {
      columns () {
        return [
          {
              name: "Account Type",
              dataIndex: "domain",
              class: "text-left",
              sortable: true,
              sortIndex: 'domain',
          },
          {
              name: "Name",
              dataIndex: "invited_name",
              class: "text-center",
              sortable: true,
              sortIndex: 'invited_name',
          },
          {
              name: 'Active At',
              dataIndex: "first_actived_at",
              class: "text-center localDate",
              sortable: true,
              sortIndex: 'first_actived_at',
          },
        ]
      }
    },

    watch: {
      orderBy () {
        this.current_page = 1
        this.loading = true
        this.getEntries().finally(() => {
          this.loading = false
        })
      },
    },

    mounted () {
      this.current_page = 1
      this.loading = true
      this.getEntries().finally(() => {
        this.loading = false
      })
    },

    methods: {
      getEntries () {
        const params = {
          date_start: this.dateStart,
          date_end: this.dateEnd,
        }
        return Promise.all([
          this.$axios.get(`/api/v1/admin/raffle-users/${this.$route.params.id}/raffle-entries/count`, {
            params: {
              ...params,
            }
          }).then(response => {
            return response.data.data.count
          }),
          this.$axios.get(`/api/v1/admin/raffle-users/${this.$route.params.id}/raffle-entries`, {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: (this.current_page - 1) * this.limit,
            }
          }).then(response => {
            return response.data.data.raffle_entries
          })
        ]).then((results) => {
          const [
            count,
            entries,
          ] = results

          this.count = count
          this.entries = entries
        }).catch((err) => {
          console.log(err.response || err)

          this.$nuxt.error({
            status: 400,
            message: err.response.message,
          })
        })
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
