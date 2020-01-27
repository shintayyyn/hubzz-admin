<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout">

      <div class="flex justify-between text-sm text-white">
        <nuxt-link to="/reports" class="text-white hover:text-sunglow p-1">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div v-if="true">
        <div>
          <label class="text-white">Limit: </label>
          <select v-model="limit">
            <option v-for="limit in limits" :key="`limit_${limit}`" :value="limit">{{ limit }}</option>
          </select>
        </div>
        <div>
          <label class="text-white">Page: </label>
          <select v-model="activePage">
            <option v-for="page in pages" :key="`page_${page}`" :value="page">{{ page }}</option>
          </select>
        </div>
      </div>

      <ReportTable
        :limit="limit"
        :items="practiceLocums"
        :getItemKey="(item) => item.locum_user_id"
        :columnDetails="columnDetails"
        :orderBy="orderBy"
        :loading="loading"
        @setOrderBy="(value) => orderBy = value"
      />

      <ReportPagination :pages="pages" :activePage="activePage" @setPage="(value) => activePage = value"/>

      <div class="text-white" v-if="true"> 
        <span>Count: {{ count }}</span>
        <br>
        <span>Order By: {{ orderBy.join(',') }}</span>
        <br>
        <span>Page {{ activePage }} of {{ pages }} pages</span>
      </div>

    </div>
  </div>
</template>

<script>
  import ReportTable from '@/components/Reports/ReportTable'
  import ReportPagination from '@/components/Reports/ReportPagination'

  export default {
    components: {
      ReportTable,
      ReportPagination,
    },

    data() {
      return {
        loading: false,
        count: 0,
        practiceLocums: [],
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
        activePage: 1,
      };
    },

    computed: {
      offset() {
        return this.activePage * this.limit - this.limit
      },

      columnDetails() {
        return [
          {
            title: '#',
            key: 'index',
            sort_key: null,
            column: (item, index) => this.offset + index + 1,
            justify: 'end',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Practice',
            key: 'practice_name',
            sort_key: 'practice_name',
            column: (item) => item.practice_name,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Date Start',
            key: 'date_start',
            sort_key: 'date_start',
            column: (item) => item.date_start,
            justify: 'center',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Date End',
            key: 'date_end',
            sort_key: 'date_end',
            column: (item) => item.date_end,
            justify: 'center',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Invoice Number',
            key: 'invoice_number',
            sort_key: 'invoice_number',
            column: (item) => item.invoice_number,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: '£ Amount',
            key: 'total_amount',
            sort_key: 'total_amount',
            column: (item) => item.total_amount,
            justify: 'end',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Hours',
            key: 'hours',
            sort_key: 'hours',
            column: (item) => item.hours,
            justify: 'end',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Discount',
            key: 'total_credit',
            sort_key: 'total_credit',
            column: (item) => item.total_credit,
            justify: 'end',
            flexGrow: 1,
            flexShrink: 0,
          },
        ]
      },

      pages() {
        return Math.max(Math.ceil(this.count / this.limit), 1)
      },
    },

    watch: {
      orderBy() {
        this.getPracticeInvoices()
      },

      limit() {
        this.page = 1
        this.getPracticeInvoices()
      },

      activePage() {
        this.getPracticeInvoices()
      },
    },

    methods: {
      getPracticeInvoices() {
        this.loading = true
        this.practiceLocums = []
        Promise.all([
          this.$axios.get('/api/v1/admin/reports/practice-invoices/count').then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/reports/practice-invoices', {
            params: {
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.practice_invoices
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          const [
            count,
            practiceLocums,
          ] = results

          this.count = count
          this.practiceLocums = practiceLocums
        }).catch((err) => {
          console.log('err.response ? err.response.data : err', err.response ? err.response.data : err)
          this.$nuxt.error(err.response ? err.response.data : err)
        }).finally(() => {
          this.loading = false
        })
      },
    },

    mounted() {      
      // const {
      //   order_by: orderBy = [],
      //   page,
      // } = this.$route.query

      // this.orderBy = orderBy
      // this.activePage = page ? Number.parseInt(page) : 1

      this.getPracticeInvoices()
    },

  };
</script>
