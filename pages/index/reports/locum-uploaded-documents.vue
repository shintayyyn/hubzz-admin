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
        :items="locumUploadedDocuments"
        :getItemKey="(item) => item.locum_invoice_id"
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
        locumUploadedDocuments: [],
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
            title: 'Locum',
            key: 'locum_user_name',
            sort_key: 'locum_user_name',
            column: (item) => item.locum_user_name,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Date Registered',
            key: 'date_registered',
            sort_key: 'date_registered',
            column: (item) => this.$moment(item.date_registered, 'YYYY-MM-DD').format('DD/MM/YYYY'),
            justify: 'center',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Documents Not Approved',
            key: 'documents_not_approved_count',
            sort_key: 'documents_not_approved_count',
            column: (item) => item.documents_not_approved_count,
            justify: 'end',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Documents Not Uploaded',
            key: 'documents_not_uploaded_count',
            sort_key: 'documents_not_uploaded_count',
            column: (item) => item.documents_not_uploaded_count,
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
        this.getLocumUploadedDocuments()
      },

      limit() {
        this.page = 1
        this.getLocumUploadedDocuments()
      },

      activePage() {
        this.getLocumUploadedDocuments()
      },
    },

    methods: {
      getLocumUploadedDocuments() {
        this.loading = true
        this.locumUploadedDocuments = []
        Promise.all([
          this.$axios.get('/api/v1/admin/reports/locum-uploaded-documents/count').then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/reports/locum-uploaded-documents', {
            params: {
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.locum_uploaded_documents
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          const [
            count,
            locumUploadedDocuments,
          ] = results

          this.count = count
          this.locumUploadedDocuments = locumUploadedDocuments
        }).catch((err) => {
          console.log('err', err)
          this.$nuxt.error(err)
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

      this.getLocumUploadedDocuments()
    },

  };
</script>
