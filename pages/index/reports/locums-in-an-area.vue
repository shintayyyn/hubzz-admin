<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">

    <div class="page-overlap flex-1 flex flex-col self-end bg-trout">

      <div class="flex justify-between text-sm text-white">
        <nuxt-link to="/reports" class="text-white hover:text-sunglow p-1">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current"/>
        </nuxt-link>
      </div>

      <div class="flex flex-col py-2 w-full">
        <div class="flex flex-wrap items-center flex-col md:flex-row py-1">
          <div class="relative p-1">
            <input class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-8 focus:border-sunglow hover:border-sunglow transition-hover bg-waterloo" placeholder="Search Area">
            <button class="absolute top-0 right-0 bottom-0 border border-transparent rounded-lg m-2 flex items-center justify-center text-white p-2 border-1 focus:outline-none hover:text-red-500 transition-hover">
              <svgicon name="times-solid" height="12" width="12" class="fill-current"/>
            </button>
          </div>

          <div class="relative p-1">
            <input class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-8 focus:border-sunglow hover:border-sunglow transition-hover bg-waterloo" placeholder="Search Profession">
            <button class="absolute top-0 right-0 bottom-0 border border-transparent rounded-lg m-2 flex items-center justify-center text-white p-2 border-1 focus:outline-none hover:text-red-500 transition-hover">
              <svgicon name="times-solid" height="12" width="12" class="fill-current"/>
            </button>
          </div>

<!--           <div class="flex items-center my-2 md:my-0">
            <select class="rounded-lg border-2 border-transparent text-sm text-white p-2 -pl-12 bg-waterloo">
              <option class="bg-gray-700">Filter by</option>
              <option v-for="status in statuses">{{ status }}</option>
            </select>
          </div> -->

          <div class="flex items-center p-1">
            <button class="border rounded-lg text-xs text-white py-2 px-3 mx-1 hover:text-black focus:text-black hover:bg-yellow-500 transition-hover focus:bg-yellow-500">Reset</button>
            <button class="border rounded-lg text-xs text-white py-2 px-3 mx-1 hover:text-black focus:text-black hover:bg-yellow-500 transition-hover focus:bg-yellow-500">Go</button>
          </div>

          <div class="flex-1 p-1 flex justify-end">
            <a class="rounded-lg text-xs text-white hover:text-black focus:text-black hover:bg-yellow-500 focus:bg-yellow-500 p-2 rounded inline-flex items-center" :href="downloadCSVLink" download="locums_in_an_area.csv">
              <svgicon name="cloud-download" width="21" height="21" color="transparent fill" class="fill-current"></svgicon>
              <span class="px-1">Download CSV</span>
            </a>
          </div>

        </div>
      </div>


      <div class="w-full text-xs overflow-x-auto">
        <div class="flex bg-waterloo text-white font-bold">
          <div class="flex-1 p-2">
            <span>Area</span>

            <button @click="setOrderBy('area')">
              <span v-if="getColumnOrderByDirection('area') === null">              
                <svgicon name="sort" height="12" width="12" color="white"/>
              </span>
              <span v-if="getColumnOrderByDirection('area') === 'asc'">
                <svgicon name="sort-ascend" height="12" width="12" color="white"/>
              </span>

              <span v-if="getColumnOrderByDirection('area') === 'desc'">
                <svgicon name="sort-descend" height="12" width="12" color="white"/>
              </span>
            </button>
          </div>

          <div class="flex-1 flex justify-center items-center p-2">
            <span>Profession</span>

            <button class="px-1" @click="setOrderBy('profession')">
              <span v-if="getColumnOrderByDirection('profession') === null">              
                <svgicon name="sort" height="12" width="12" color="white"/>
              </span>
              <span v-if="getColumnOrderByDirection('profession') === 'asc'">
                <svgicon name="sort-ascend" height="12" width="12" color="white"/>
              </span>

              <span v-if="getColumnOrderByDirection('profession') === 'desc'">
                <svgicon name="sort-descend" height="12" width="12" color="white"/>
              </span>
            </button>
          </div>

          <div class="flex-1 flex justify-center items-center p-2">
            <span>Number Locums Registered</span>

            <button class="px-1" @click="setOrderBy('number_locums_registered')">
              <span v-if="getColumnOrderByDirection('number_locums_registered') === null">              
                <svgicon name="sort" height="12" width="12" color="white"/>
              </span>
              <span v-if="getColumnOrderByDirection('number_locums_registered') === 'asc'">
                <svgicon name="sort-ascend" height="12" width="12" color="white"/>
              </span>

              <span v-if="getColumnOrderByDirection('number_locums_registered') === 'desc'">
                <svgicon name="sort-descend" height="12" width="12" color="white"/>
              </span>
            </button>
          </div>

          <div class="flex-1 flex justify-center items-center p-2">
            <span>Status</span>

            <button class="px-1" @click="setOrderBy('status')">
              <span v-if="getColumnOrderByDirection('status') === null">              
                <svgicon name="sort" height="12" width="12" color="white"/>
              </span>
              <span v-if="getColumnOrderByDirection('status') === 'asc'">
                <svgicon name="sort-ascend" height="12" width="12" color="white"/>
              </span>

              <span v-if="getColumnOrderByDirection('status') === 'desc'">
                <svgicon name="sort-descend" height="12" width="12" color="white"/>
              </span>
            </button>
          </div>
        </div>

        <div v-for="locumsInAnArea in locumsInAnArea" :key="getLocumsInAnAreaKey(locumsInAnArea)" class="flex bg-white">
          <span class="flex-1 p-2">{{ locumsInAnArea.area }}</span>
          <span class="flex-1 p-2 text-center">{{ locumsInAnArea.profession }}</span>
          <span class="flex-1 p-2 text-center">{{ locumsInAnArea.number_locums_registered }} </span>
          <span class="flex-1 p-2 text-center">{{ locumsInAnArea.status }} </span>
        </div>
      </div>

      <div v-if="loading">
        <span>Loading...</span>
      </div>

    </div>

  </div>
</template>

<script>
  export default {
    watchQuery: [
      'order_by',
    ],

    async asyncData({ app, route }) {
      try {
        console.log('asyncData')

        let {
          order_by: orderBy = [],
          page = 1,
        } = route.query

        orderBy = Array.isArray(orderBy) ? orderBy : [orderBy]

        const limit = 20

        const params = {
          order_by: orderBy,
          limit,
        }

        const [
          professions,
          count,
          locumsInAnArea
        ] = await Promise.all([
          app.$axios.get(`/api/v1/professions`, {
            limit: 1000000,
          }).then((response) => {
            return response.data.data.professions
          }),
          
          app.$axios.get(`/api/v1/admin/reports/locums-in-an-area/count`, {
            params
          }).then((response) => {
            return response.data.data.count
          }),

          app.$axios.get(`/api/v1/admin/reports/locums-in-an-area`, {
            params
          }).then((response) => {
            return response.data.data.locums_in_an_area
          }),
        ])

        return {
          professions,
          orderBy,
          limit,
          loading: false,
          count,
          locumsInAnArea,
          page,
        }
      } catch (err) {
        console.log('reports locums-in-an-area err', err)
        throw err
      }
    },

    data() {
      return {
        professions: [],
        statuses: [
          'Inactive',
          'Active',
          'Dormant',
          'Suspended',
          'Deactivated',
        ],
        orderBy: [],
        limit: 20,
        loading: false,
        count: 0,
        locumsInAnArea: [],
      }
    },

    computed: {
      pageCount() {
        return Math.ceil(this.count / this.limit)
      },

      activePage() {
        return parseInt(this.activePage);
      },

      showPage() {
        return page => {
          if (page === 1) {
            return true
          }

          if (page === this.pageCount) {
            return true
          }

          if (page === this.activePage) {
            return true
          }

          if (page === this.activePage + 1) {
            return true
          }

          if (page === this.activePage - 1) {
            return true
          }

          if (this.activePage === 1 && page < 5) {
            return true
          }

          if (this.activePage === this.pageCount && page > this.pageCount - 4) {
            return true
          }

          if (this.activePage === 2 && page === 4) {
            return true
          }

          if (this.activePage === this.pageCount - 1 && page === this.pageCount - 3) {
            return true
          }

          return false
        }
      },

      getColumnOrderByDirection() {
        return (column) => {
          const index = this.orderBy.findIndex(orderBy => orderBy.split(':')[0].toLowerCase() === column)

          if (index > -1) {
            let direction = this.orderBy[index].split(':')[1]

            if (!direction || direction.toLowerCase() === 'asc') {
              return 'asc'
            }

            return 'desc'
          } else {
            return null
          }
        }
      },

      getLocumsInAnAreaKey() {
        return (v) => `${v.area}-${v.profession}-${v.number_locums_registered}-${v.status}`
      },

      downloadCSVLink() {
        return `${process.env.API_URL}/api/v1/admin/reports/locums-in-an-area/locums_in_an_area.csv`
      }
    },

    methods: {
      setOrderBy(column) {
        const orderBy = [...this.orderBy]

        const index = orderBy.findIndex(orderBy => orderBy.split(':')[0].toLowerCase() === column)

        if (index > -1) {
          let direction = this.getColumnOrderByDirection(column)

          orderBy.splice(index, 1)

          if (direction === 'asc') {
            orderBy.push(`${column}:desc`)
          }
        } else {
          orderBy.push(column)
        }

        const query = {
          ...this.$route.query,
          order_by: orderBy,
        }

        if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
          this.loading = true
        }

        this.$router.replace(this.$router.resolve({ query }).href)
      },
    },
  }
</script>

<style>
  .report-modal {
    position: fixed;
    top: 0;
    right: 0;
    margin-right: 0%;
    width: 100%;
    height: 100%;
    overflow: auto;
    border-left: solid 2px yellow;
    transition: all 0.3s ease-in-out;
    background-color:#505561;
    z-index: 512;
  }

  @media screen and (min-width: 1200px) {
    .report-modal {
      width: 80%;
    }
  }

  @media(min-width: 450px){
    .right-side-header-content{
      width: calc(100% - 0px);
    }
  }

  .page-overlap{
    min-width: 100%;
  }

  @media screen and (min-width: 768px){
    .page-overlap{
    min-width: calc(100% - 70px);
    }
  }

  @media screen and (min-width: 1200px) {
    .page-overlap{
      min-width: calc(100% - 200px);
    }
  }
</style>
