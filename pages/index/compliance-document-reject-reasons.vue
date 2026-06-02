<template>
  <section class="flex-1 flex flex-col py-2 px-2 md:px-6 overflow-y-auto">
    <template v-if="$route.name === 'index-compliance-document-reject-reasons'">
      <div class="flex justify-end">
        <nuxt-link
          v-if="authAdminPermissions.includes('Create Compliance Document Reject Reasons')"
          :to="{ name: 'index-compliance-document-reject-reasons-create' }"
          class="
            flex items-center text-black rounded-lg py-2 px-4 font-bold focus:outline-none transition-hover
            text-sm bg-sunglow hover:bg-sunglow-dark
          "
          draggable="false"
        >
          Create New Compliance Document Reject Reason
        </nuxt-link>
      </div>

      <div class="flex flex-col md:flex-row justify-between md:items-center mb-2 ">
        <div v-if="false" class="flex py-2">
          <div class="relative">
            <input
              v-model="search"
              style="width: 250px;"
              class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo"
              placeholder="Search Locum by Name or E-Mail"
              @keyup.enter="searchSubmit"
            />
            <button v-if="search" class="absolute top-0 right-0 bottom-0 mr-3 md:mr-1" @click=";(search = ''), searchSubmit()">
              <svgicon name="times-solid" height="12" width="12" class="text-white hover:text-yellow-500 fill-current -mx-2 md:-mx-6" />
            </button>
          </div>
        </div>

        <div class="flex flex-col w-full justify-end">
          <div v-if="false" class="md:w-full relative flex flex-col md:flex-row justify-end md:items-center md:items-end md:py-2 py-0">
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
      <div>
        <AppTableNew
          class="qweqweqwe"
          :total="count"
          :items="complianceDocumentRejectReasons"
          :currentPage="page"
          :perPage="limit"
          :columns="columns"
          :loading="loading"
          :routerLink="routerLink"
          :orderBy="orderBy"
          :customWidth="'800'"
          @pagechanged="_page => (page = _page)"
          @limitchanged="_limit => (limit = _limit)"
          @sorted="_orderBy => (orderBy = _orderBy)"
        />
      </div>
      <div v-if="!loading && count === 0" class="mt-2 w-full text-center text-white">
        <span>No compliance document reject reasons.</span>
      </div>
    </template>

    <nuxt-child
      :complianceDocuments="complianceDocuments"
      :complianceDocumentSelectionList="complianceDocumentSelectionList"
      :loadingComplianceDocuments="loadingComplianceDocuments"
      :complianceDocumentRejectReasons="complianceDocumentRejectReasons"
      @complianceDocumentRejectReasons="_complianceDocumentRejectReasons => (complianceDocumentRejectReasons = _complianceDocumentRejectReasons)"
      @complianceDocumentRejectReasonCreated="getComplianceDocumentRejectReasons()"
      @complianceDocumentRejectReasonUpdated="complianceDocumentRejectReasonUpdated"
      @complianceDocumentRejectReasonDeleted="complianceDocumentRejectReasonDeleted"
    />
  </section>
</template>

<script>
import debounce from 'lodash.debounce'

import AppTableNew from '@/components/Base/AppTableNew'

export default {
  components: {
    AppTableNew
  },

  data() {
    return {
      loading: false,
      limit: 20,
      page: 1,
      search: '',
      filterStatus: null,
      sort: null,
      orderBy: ['id:asc'],
      count: 0,
      complianceDocumentRejectReasons: [],

      loadingComplianceDocuments: false,
      complianceDocuments: []
    }
  },

  computed: {
    authAdminPermissions() {
      return this.$store.getters['permissions']
    },

    pages() {
      return Math.max(Math.ceil(this.count / this.limit), 1)
    },

    offset() {
      return Math.max(this.page * this.limit - this.limit, 0)
    },

    columns() {
      return [
        {
          name: 'ID',
          dataIndex: 'id',
          class: 'text-center',
          sortable: true,
          flex: '1 0 0',
          width: 100
        },
        {
          name: 'Compliance Document',
          dataIndex: 'compliance_document_name',
          sortable: true,
          flex: '1 0 0',
          width: 300
        },
        {
          name: 'Reject Reason',
          dataIndex: 'reject_reason',
          sortable: true,
          flex: '1 0 0',
          width: 600
        }
      ]
    },

    routerLink() {
      return complianceDocumentRejectReason => {
        return {
          name: 'index-compliance-document-reject-reasons-id',
          params: {
            id: complianceDocumentRejectReason.id
          }
        }
      }
    },

    orderByValues() {
      return this.columns.reduce((orderByValues, column) => {
        const { name, dataIndex, sortable } = column

        if (sortable) {
          orderByValues.push({
            displayLabel: `${name} (asc)`,
            value: `${dataIndex}:asc`
          })

          orderByValues.push({
            displayLabel: `${name} (desc)`,
            value: `${dataIndex}:desc`
          })
        }

        return orderByValues
      }, [])
    },

    selectedOrderByValue: {
      get() {
        return this.orderBy.length > 0 ? this.orderBy[0] : null
      },
      set(orderBy) {
        this.orderBy = [orderBy]
      }
    },

    complianceDocumentSelectionList() {
      return this.complianceDocuments.map(complianceDocument => ({
        label: complianceDocument.name,
        value: complianceDocument.id
      }))
    }
  },

  watch: {
    page() {
      this.searchSubmit()
    },

    limit() {
      this.searchSubmit()
    },

    orderBy() {
      this.searchSubmit()
    }
  },

  async asyncData({ store, error }) {
    const authAdminPermissions = store.getters['permissions']

    if (authAdminPermissions.includes('View Compliance Document Reject Reasons') === false) {
      error({
        statusCode: 403,
        message: 'You are not authorized to view this page.'
      })
      return
    }
  },

  mounted() {
    this.loading = true
    this.getComplianceDocumentRejectReasons()
      .catch(err => {
        console.log('err', err)
      })
      .finally(() => {
        this.loading = false
      })

    this.loadingComplianceDocuments = true
    this.$axios
      .get('/api/v1/admin/compliance-documents', {
        params: {
          has_parent: false,
          has_verifiable_profession_compliance_category: true,
          limit: 999
        }
      })
      .then(response => {
        this.complianceDocuments = response.data.data.compliance_documents
      })
      .catch(this.errorHandler)
      .finally(() => {
        this.loadingComplianceDocuments = false
      })

    this.$socket.on('Admin Notification Compliance Document Reject Reason Created', this.getComplianceDocumentRejectReasons)
    this.$socket.on('Admin Notification Compliance Document Reject Reason Updated', this.complianceDocumentRejectReasonUpdated)
    this.$socket.on('Admin Notification Compliance Document Reject Reason Deleted', this.complianceDocumentRejectReasonDeleted)
  },

  destroyed() {
    this.$socket.removeListener('Admin Notification Compliance Document Reject Reason Created', this.getComplianceDocumentRejectReasons)
    this.$socket.removeListener('Admin Notification Compliance Document Reject Reason Updated', this.complianceDocumentRejectReasonUpdated)
    this.$socket.removeListener('Admin Notification Compliance Document Reject Reason Deleted', this.complianceDocumentRejectReasonDeleted)
  },

  methods: {
    errorHandler(err) {
      console.log('err', err.response || err)

      let message = null

      if (err.response) {
        if (err.response.status === 400 && err.response.data.error_messages) {
          message = err.response.data.error_messages.map(({ message }) => message).join(', ')
        } else {
          message = err.response.data.message
        }
      } else if (err.request) {
        message = 'Something went wrong!'
      } else {
        message = err.message
      }

      if (message) {
        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'danger',
          text: message
        })
      }
    },

    complianceDocumentRejectReasonUpdated(complianceDocumentRejectReason) {
      const index = this.complianceDocumentRejectReasons.findIndex(({ id }) => id === complianceDocumentRejectReason.id)

      if (index > -1) {
        this.complianceDocumentRejectReasons.splice(index, 1, complianceDocumentRejectReason)
      }
    },

    complianceDocumentRejectReasonDeleted(complianceDocumentRejectReasonId) {
      const index = this.complianceDocumentRejectReasons.findIndex(({ id }) => id === complianceDocumentRejectReasonId)

      if (index > -1) {
        this.complianceDocumentRejectReasons.splice(index, 1)
      }

      this.getComplianceDocumentRejectReasons()
    },

    searchSubmit: debounce(function() {
      this.activePage = 1
      this.loading = true
      this.getComplianceDocumentRejectReasons()
        .catch(err => {
          console.log('err', err)
        })
        .finally(() => {
          this.loading = false
        })
    }, 500),

    getComplianceDocumentRejectReasons() {
      return Promise.all([
        this.$axios.get('/api/v1/admin/compliance-document-reject-reasons/count').then(response => response.data.data.count),
        this.$axios
          .get('/api/v1/admin/compliance-document-reject-reasons', {
            params: {
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset
            }
          })
          .then(response => response.data.data.compliance_document_reject_reasons)
      ]).then(responses => {
        const [count, complianceDocumentRejectReasons] = responses

        this.count = count
        this.complianceDocumentRejectReasons = complianceDocumentRejectReasons
      })
    }
  }
}
</script>
