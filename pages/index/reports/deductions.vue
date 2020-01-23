<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm text-white">
        <nuxt-link to="/reports" class="text-white hover:text-sunglow p-1">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div>
        <div>
          <label class="text-white">Limit: </label>
          <select v-model="limit">
            <option v-for="limit in limits" :key="`limit_${limit}`" :value="limit">{{ limit }}</option>
          </select>
        </div>
        <div>
          <label class="text-white">Page: </label>
          <select v-model="page">
            <option v-for="page in pages" :key="`page_${page}`" :value="page">{{ page }}</option>
          </select>
        </div>
      </div>

      <div class="w-full text-xs overflow-x-auto mt-1">
        <div class="flex bg-waterloo text-white font-bold">
          <div class="flex-1 p-2">
            <span>#</span>
          </div>

          <div class="flex-1 flex justify-center items-center p-2">
            <span>Invoice Number</span>

            <button class="px-1" @click="setOrderBy('invoice_number')">
              <span v-if="getColumnOrderByDirection('invoice_number') === null">
                <svgicon name="sort" height="12" width="12" color="white" />
              </span>
              <span v-if="getColumnOrderByDirection('invoice_number') === 'asc'">
                <svgicon name="sort-ascend" height="12" width="12" color="white" />
              </span>

              <span v-if="getColumnOrderByDirection('invoice_number') === 'desc'">
                <svgicon name="sort-descend" height="12" width="12" color="white" />
              </span>
            </button>
          </div>

          <div class="flex-1 p-2">
            <span>Practice</span>

            <button @click="setOrderBy('practice_name')">
              <span v-if="getColumnOrderByDirection('practice_name') === null">
                <svgicon name="sort" height="12" width="12" color="white" />
              </span>
              <span v-if="getColumnOrderByDirection('practice_name') === 'asc'">
                <svgicon name="sort-ascend" height="12" width="12" color="white" />
              </span>

              <span v-if="getColumnOrderByDirection('practice_name') === 'desc'">
                <svgicon name="sort-descend" height="12" width="12" color="white" />
              </span>
            </button>
          </div>

          <div class="flex-1 flex justify-center items-center p-2">
            <span>Locum</span>

            <button class="px-1" @click="setOrderBy('locum_user_name')">
              <span v-if="getColumnOrderByDirection('locum_user_name') === null">
                <svgicon name="sort" height="12" width="12" color="white" />
              </span>
              <span v-if="getColumnOrderByDirection('locum_user_name') === 'asc'">
                <svgicon name="sort-ascend" height="12" width="12" color="white" />
              </span>

              <span v-if="getColumnOrderByDirection('locum_user_name') === 'desc'">
                <svgicon name="sort-descend" height="12" width="12" color="white" />
              </span>
            </button>
          </div>

          <div class="flex-1 flex justify-center items-center p-2">
            <span>Locums UTR or Company Reg number</span>

            <button class="px-1" @click="setOrderBy('tax_number')">
              <span v-if="getColumnOrderByDirection('tax_number') === null">
                <svgicon name="sort" height="12" width="12" color="white" />
              </span>
              <span v-if="getColumnOrderByDirection('tax_number') === 'asc'">
                <svgicon name="sort-ascend" height="12" width="12" color="white" />
              </span>

              <span v-if="getColumnOrderByDirection('tax_number') === 'desc'">
                <svgicon name="sort-descend" height="12" width="12" color="white" />
              </span>
            </button>
          </div>

          <div class="flex-1 flex justify-center items-center p-2">
            <span>NI Amount</span>

            <button class="px-1" @click="setOrderBy('ni_amount')">
              <span v-if="getColumnOrderByDirection('ni_amount') === null">
                <svgicon name="sort" height="12" width="12" color="white" />
              </span>
              <span v-if="getColumnOrderByDirection('ni_amount') === 'asc'">
                <svgicon name="sort-ascend" height="12" width="12" color="white" />
              </span>

              <span v-if="getColumnOrderByDirection('ni_amount') === 'desc'">
                <svgicon name="sort-descend" height="12" width="12" color="white" />
              </span>
            </button>
          </div>

          <div class="flex-1 flex justify-center items-center p-2">
            <span>PAYE Amount</span>

            <button class="px-1" @click="setOrderBy('paye_amount')">
              <span v-if="getColumnOrderByDirection('paye_amount') === null">
                <svgicon name="sort" height="12" width="12" color="white" />
              </span>
              <span v-if="getColumnOrderByDirection('paye_amount') === 'asc'">
                <svgicon name="sort-ascend" height="12" width="12" color="white" />
              </span>

              <span v-if="getColumnOrderByDirection('paye_amount') === 'desc'">
                <svgicon name="sort-descend" height="12" width="12" color="white" />
              </span>
            </button>
          </div>

          <div class="flex-1 flex justify-center items-center p-2">
            <span>Date Start</span>

            <button class="px-1" @click="setOrderBy('date_start')">
              <span v-if="getColumnOrderByDirection('date_start') === null">
                <svgicon name="sort" height="12" width="12" color="white" />
              </span>
              <span v-if="getColumnOrderByDirection('date_start') === 'asc'">
                <svgicon name="sort-ascend" height="12" width="12" color="white" />
              </span>

              <span v-if="getColumnOrderByDirection('date_start') === 'desc'">
                <svgicon name="sort-descend" height="12" width="12" color="white" />
              </span>
            </button>
          </div>

          <div class="flex-1 flex justify-center items-center p-2">
            <span>Date End</span>

            <button class="px-1" @click="setOrderBy('date_end')">
              <span v-if="getColumnOrderByDirection('date_end') === null">
                <svgicon name="sort" height="12" width="12" color="white" />
              </span>
              <span v-if="getColumnOrderByDirection('date_end') === 'asc'">
                <svgicon name="sort-ascend" height="12" width="12" color="white" />
              </span>

              <span v-if="getColumnOrderByDirection('date_end') === 'desc'">
                <svgicon name="sort-descend" height="12" width="12" color="white" />
              </span>
            </button>
          </div>

          <div class="flex-1 flex justify-center items-center p-2">
            <span>Date deductions made</span>

            <button class="px-1" @click="setOrderBy('paid_at')">
              <span v-if="getColumnOrderByDirection('paid_at') === null">
                <svgicon name="sort" height="12" width="12" color="white" />
              </span>
              <span v-if="getColumnOrderByDirection('paid_at') === 'asc'">
                <svgicon name="sort-ascend" height="12" width="12" color="white" />
              </span>

              <span v-if="getColumnOrderByDirection('paid_at') === 'desc'">
                <svgicon name="sort-descend" height="12" width="12" color="white" />
              </span>
            </button>
          </div>
        </div>

        <div
          v-for="(deduction, index) in deductions"
          :key="`locum_invoice_id_${deduction.locum_invoice_id}`"
          class="flex bg-white"
        >
          <span class="flex-1 p-2">{{ index + 1 }}</span>
          <span class="flex-1 p-2 text-center">{{ deduction.invoice_number }}</span>
          <span class="flex-1 p-2">{{ deduction.practice_name }}</span>
          <span class="flex-1 p-2 text-center">{{ deduction.locum_user_name }}</span>
          <span class="flex-1 p-2 text-center">{{ deduction.tax_number }}</span>
          <span class="flex-1 p-2 text-center">{{ deduction.ni_amount }}</span>
          <span class="flex-1 p-2 text-center">{{ deduction.paye_amount }}</span>
          <span class="flex-1 p-2 text-center">{{ deduction.date_start ? $moment(deduction.date_start, 'YYYY-MM-DD').format('DD/MM/YYYY') : '' }}</span>
          <span class="flex-1 p-2 text-center">{{ deduction.date_end ? $moment(deduction.date_end, 'YYYY-MM-DD').format('DD/MM/YYYY') : '' }}</span>
          <span class="flex-1 p-2 text-center">{{ deduction.paid_at ? $moment(deduction.paid_at, 'YYYY-MM-DD').format('DD/MM/YYYY') : '' }}</span>
        </div>
      </div>

      <div>
        <button @click="page = Math.max(page - 1, 1)">
          <svg-icon name="left-chevron"></svg-icon>
          <span><<</span>
        </button>
        <button v-for="page in pages" class="p-2" :class="activePage === page ? 'active' : ''" @click="setPage(page)" v-if="showPage(page)">
          <span>{{ page }}</span>
        </button>
        <button @click="page = Math.min(page + 1, pages)">
          <svg-icon name="chevron-right"></svg-icon>
          <span>>></span>
        </button>
      </div>

      <div class="text-white"> 
        <span>Count: {{ count }}</span>
        <br>
        <span>Order By: {{ orderBy.join(',') }}</span>
        <br>
        <span>Page {{ page }} of {{ pages }} pages</span>
      </div>

      <div v-if="loading">
        <span>Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loading: false,
        count: 0,
        deductions: [],
        orderBy: [],
        orderBys: [
          {
            title: 'Practice Name (Ascending)',
            column: 'practice_name',
            direction: 'asc',
          },
          {
            title: 'Practice Name (Descending)',
            column: 'practice_name',
            direction: 'desc',
          },
        ],
        limit: 10,
        limits: [
          1,
          2,
          3,
          4,
          5,
          10,
          15,
          20,
          25,
        ],
        page: 1,
      };
    },

    computed: {
      pages() {
        return Math.ceil(this.count / this.limit)
      },

      activePage() {
        return parseInt(this.page)
      },

      showPage() {
        return page => {
          if (page === 1) {
            return true
          }

          if (page === this.pages) {
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

          if (this.activePage === this.pages && page > this.pages - 4) {
            return true
          }

          if (this.activePage === 2 && page === 4) {
            return true
          }

          if (
            this.activePage === this.pages - 1 &&
            page === this.pages - 3
          ) {
            return true
          }

          return false
        }
      },

      getColumnOrderByDirection() {
        return column => {
          const index = this.orderBy.findIndex((orderBy) => {
            const [_col] = orderBy.split(":")
            const col = _col ? _col.toLowerCase() : null
            return col === column
          })

          if (index > -1) {
            const [_col, _dir] = this.orderBy[index].split(":")
            return _dir && _dir.toLowerCase() === 'desc' ? 'desc' : 'asc'
          }

          return null
        }
      },
    },

    watch: {
      orderBy() {
        this.getDeductions()
      },

      limit() {
        this.getDeductions()
      },

      page() {
        this.getDeductions()
      },
    },

    methods: {
      getDeductions() {
        this.loading = true
        Promise.all([
          this.$axios.get('/api/v1/admin/reports/deductions/count').then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/reports/deductions', {
            params: {
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.page * this.limit - this.limit,
            },
          }).then((responses) => {
            return responses.data.data.deductions
          }),
        ]).then((results) => {
          const [
            count,
            deductions,
          ] = results

          this.count = count
          this.deductions = deductions

          console.log('count', count)
          console.log('deductions', deductions)
        }).catch((err) => {
          console.log('err', err)
        }).finally(() => {
          this.loading = false
        })
      },

      setOrderBy(column) {
        const orderBy = [...this.orderBy]

        const index = orderBy.findIndex((orderBy) => {
          const [_col] = orderBy.split(":")
          const col = _col ? _col.toLowerCase() : null
          return col === column
        })

        if (index > -1) {
          let direction = this.getColumnOrderByDirection(column)

          orderBy.splice(index, 1)

          if (direction === "asc") {
            orderBy.push(`${column}:desc`)
          }
        } else {
          orderBy.push(column)
        }

        this.orderBy = orderBy
      },

      setPage(page) {
        this.page = page
      },
    },

    mounted() {      
      const {
        order_by: orderBy = [
          'paid_at:desc',
        ],
        page = 1
      } = this.$route.query

      this.orderBy = orderBy

      this.page = page

      this.getDeductions()
    },

  };
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
    border-left: solid 2px #ffc72c;
    transition: all 0.3s ease-in-out;
    background-color: #505561;
    z-index: 512;
  }

  @media screen and (min-width: 1200px) {
    .report-modal {
      width: 80%;
    }
  }

  @media (min-width: 450px) {
    .right-side-header-content {
      width: calc(100% - 0px);
    }
  }

  .page-overlap {
    min-width: 100%;
  }

  @media screen and (min-width: 768px) {
    .page-overlap {
      min-width: calc(100% - 70px);
    }
  }

  @media screen and (min-width: 1200px) {
    .page-overlap {
      min-width: calc(100% - 200px);
    }
  }
</style>
