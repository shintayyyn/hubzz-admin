<template>
  <div v-if="canViewPracticesPage" class="flex-1 flex flex-col">
    <div class="flex flex-row justify-between items-center overflow-x-auto border-b border-gray-500 mb-1 py-2">
      <div>
        <nuxt-link
          v-for="tab in practiceTabs"
          :key="tab.value"
          :to="{ name: 'index-practices', query: { ...$route.query, practice_tab: tab.queryValue } }"
          :class="`${tab.className} ${practiceTabClass(tab.value)}`"
        >
          {{ tab.value }}
        </nuxt-link>
      </div>
      <div>
        <AppButton
          v-if="canCreatePractice"
          class="text-sm"
          :label="'Create New Practice'"
          :icon="'add-rectangle'"
          @click="$router.push('/practices/add-practice')"
        />
      </div>
    </div>

    <div class="flex flex-col md:flex-row justify-between md:items-center">
      <div class="flex flex-col w-full justify-start">
        <div>
          <div class="flex justify-between">
            <div class="flex">
              <div class="w-full">
                <AppInputSmall
                  v-model="search"
                  :type="'text'"
                  :name="'search'"
                  :button="true"
                  :buttonLabel="'Search'"
                  :placeholder="'Search by Practice Name'"
                  @click="searchSubmit()"
                />
              </div>
              <div class="mx-1 my-2">
                <AppButton
                  label="Filters"
                  icon="caret-down"
                  :rotate="filterModal ? 180 : ''"
                  :customTheme="'border-2 border-gray-400 rounded-lg font-bold text-gray-600'"
                  labelClass="flex-row-reverse mr-2"
                  :iconWidth="'10'"
                  @click="filterModal = !filterModal"
                />
              </div>
              <div v-if="filterModal" class="mx-1 my-2">
                <AppButton
                  label="Apply"
                  :customTheme="'bg-orange-400 hover:bg-orange-500 text-gray-700 border border-gray-400 rounded'"
                  @click="getPractices"
                />
              </div>

              <div v-if="filterModal" class="mx-1 my-2">
                <AppButton
                  label="Clear"
                  :customTheme="'bg-gray-400 hover:bg-gray-500 text-black border border-gray-400 rounded'"
                  @click="filterReset"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-row flex-wrap justify-start items-center w-full rounded-lg -mt-3 mb-2" :class="filterModal ? 'flex' : 'hidden'">
          <div v-if="practiceTab === 'Verified'" class="mx-1 text-gray-600 w-full lg:w-1/4 md:w-1/5">
            <AppInputSmall
              v-model="filterPracticeStatus"
              :type="'select'"
              :name="'practice_status'"
              :placeholder="'Practice Status'"
              :items="practiceStatuses"
            />
          </div>

          <div class="mx-1 text-gray-600 w-full lg:w-1/4 md:w-1/5">
            <AppInputSmall
              v-model="filterPracticeType"
              :type="'select'"
              :name="'practice_type'"
              :placeholder="'Practice Type'"
              :items="practiceType"
            />
          </div>

          <div class="mx-1 text-gray-600 w-full lg:w-1/4 md:w-1/5">
            <AppInputSmall v-model="filterPracticeHubType" :type="'select'" :name="'hub_type'" :placeholder="'Hub Type'" :items="hubType" />
          </div>
        </div>
      </div>
    </div>

    <div>
      <AppTableNew
        v-if="count > 0"
        :total="count"
        :items="practices"
        :currentPage="currentPage"
        :perPage="limit"
        :columns="columns"
        :loading="loadingPractices"
        :routerLink="routerLink"
        :orderBy="orderBy"
        :customWidth="'1200'"
        @pagechanged="pageChangedHandler"
        @sorted="_orderBy => (orderBy = _orderBy)"
        @limitchanged="limitChangedHandler"
        @messageButtonClicked="messageButtonClicked"
      >
        <template v-slot:messageButton="slotProps">
          <div class="flex justify-center">
            <svgicon name="chat" width="20" class="text-gray-600 fill-current" />
          </div>
        </template>

        <template v-slot:status_slot="slotProps">
          <div class="text-xs" :class="slotProps.item.status === 'Active' ? 'text-green-500' : 'text-gray-700'">
            {{ slotProps.item.status }}
          </div>
        </template>

        <template v-slot:type_slot="slotProps">
          <div class="text-xs" :class="typeStyle(slotProps.item.type)">
            {{ slotProps.item.type }}
          </div>
        </template>

        <template v-slot:hub_type_slot="slotProps">
          <div v-if="slotProps.item.type === 'Hub'" class="text-xs" :class="hubTypeStyle(slotProps.item.hub_type)">
            {{ slotProps.item.hub_type }}
          </div>
          <div v-else>
            (none)
          </div>
        </template>

        <template v-slot:registration_type_slot="slotProps">
          <div class="px-4 py-1 rounded-full w-32 text-center mx-auto">
            {{ registrationType(slotProps.item.referrer_domain) }}
          </div>
        </template>
      </AppTableNew>

      <div v-if="!loadingPractices && practices.length === 0" class="mt-2 w-full text-center">
        <span v-if="hasFilter">No practices found.</span>
        <span v-if="!hasFilter">There are no {{ practiceTab.toLowerCase() }} practices.</span>
      </div>
    </div>

    <div v-if="$route.name !== 'index-practices'" class="practice-shield" @click="$router.push({ name: 'index-practices', query: $route.query })" />

    <nuxt-child
      :professionComplianceCategories="professionComplianceCategories"
      @updatePractices="getPractices"
      @practiceUpdated="practiceUpdatedHandler"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import AppButton from '@/components/Base/AppButton'
import AppTableNew from '@/components/Base/AppTableNew'
import AppInputSmall from '@/components/Base/AppInputSmall'
export default {
  components: {
    AppButton,
    AppTableNew,
    AppInputSmall
  },

  data() {
    return {
      loadingPractices: true,
      count: 0,
      practices: [],
      currentPage: 1,
      orderBy: ['created_at_in_gb_formatted:desc'],
      limit: 15,
      search: '',
      filterPracticeStatus: null,
      filterPracticeType: null,
      filterPracticeHubType: null,
      professionComplianceCategories: [],

      practiceStatuses: [
        {
          label: 'Active',
          value: 'Active'
        },
        {
          label: 'Dormant',
          value: 'Dormant'
        },
        {
          label: 'Inactive',
          value: 'Inactive'
        },
        {
          label: 'Account Suspension',
          value: 'Account Suspension'
        }
      ],
      practiceType: [
        {
          label: 'Hub',
          value: 'Hub'
        },
        {
          label: 'Spoke',
          value: 'Spoke'
        },
        {
          label: 'Stand Alone',
          value: 'Stand Alone'
        }
      ],
      hubType: [
        {
          label: 'Type 1',
          value: 'Type 1'
        },
        {
          label: 'Type 2',
          value: 'Type 2'
        }
      ],

      defaultColumns: [
        {
          name: 'Message',
          dataIndex: 'messageButton',
          class: 'text-center',
          slotName: 'messageButton',
          eventName: 'messageButtonClicked',
          width: 80,
          order: 1
        },
        {
          name: 'Practice ID',
          dataIndex: 'id',
          class: 'md:text-center',
          sortable: true
        },
        {
          name: 'Practice Name',
          dataIndex: 'name',
          class: 'md:text-center',
          sortable: true
        },
        {
          name: 'Practice Code',
          dataIndex: 'code',
          class: 'md:text-center',
          sortable: true
        },
        {
          name: 'Created',
          dataIndex: 'created_at_in_gb_formatted',
          class: 'md:text-center',
          sortable: true
        },
        {
          name: 'Expires',
          dataIndex: 'actived_until_in_gb_formatted',
          class: 'md:text-center',
          sortable: true
        },
        {
          name: 'Status',
          dataIndex: 'status',
          class: 'md:text-center',
          sortable: true,
          slot: true,
          slotName: 'status_slot'
        },
        {
          name: 'Type',
          dataIndex: 'type',
          class: 'md:text-center',
          sortable: true,
          slot: true,
          slotName: 'type_slot'
        },
        {
          name: 'Registration Type',
          dataIndex: 'referrer_domain',
          class: 'md:text-center',
          sortable: true,
          slot: true,
          slotName: 'registration_type_slot'
        }
      ],
      dynamicColumns: [],

      filterModal: false
    }
  },

  computed: {
    authAdminPermissions() {
      return this.$store.getters['permissions']
    },

    practiceTabs() {
      return [
        { value: 'Verified', queryValue: undefined, className: 'md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap' },
        { value: 'Pending', queryValue: 'Pending', className: 'md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap' },
        { value: 'Bogus', queryValue: 'Bogus', className: 'md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap' },
        { value: 'Deactivated', queryValue: 'Deactivated', className: 'md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wra' },
        { value: 'Deleted', queryValue: 'Deleted', className: 'md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wra' }
      ]
    },

    canViewPracticesPage() {
      return (
        this.authAdminPermissions.includes('View Practices') ||
        this.authAdminPermissions.includes('View Surgery Management') ||
        this.authAdminPermissions.includes('View Practice Sessions') ||
        this.authAdminPermissions.includes('View Practice Users') ||
        this.authAdminPermissions.includes('View Practice Documents') ||
        this.authAdminPermissions.includes('View Practice Rates')
      )
    },

    canCreatePractice() {
      return this.authAdminPermissions.includes('Create New Practice') && this.authAdminPermissions.includes('Create New Practice User')
    },

    practiceTab() {
      const practiceTab = this.$route.query.practice_tab

      if (practiceTab) {
        const normalizedTab = practiceTab.toLowerCase()
        if (normalizedTab === 'pending') return 'Pending'
        if (normalizedTab === 'bogus') return 'Bogus'
        if (normalizedTab === 'deactivated') return 'Deactivated'
        if (normalizedTab === 'deleted') return 'Deleted'
      }

      return 'Verified'
    },

    routerLink() {
      return practice => ({
        name: 'index-practices-id-index',
        params: {
          id: practice.id
        },
        query: {
          ...this.$route.query
        }
      })
    },

    columns() {
      const columns = [...this.dynamicColumns]

      if (columns.length > 0 && this.practiceTab === 'Verified') {
        columns.push({
          name: 'Verified',
          dataIndex: 'first_actived_at_in_gb_formatted',
          class: 'md:text-center',
          sortable: true
        })
      }

      if (columns.length > 0 && this.practiceTab === 'Bogus') {
        columns.push({
          name: 'Verified',
          dataIndex: 'first_actived_at_in_gb_formatted',
          class: 'md:text-center',
          sortable: true
        })

        columns.push({
          name: 'Marked Bogus',
          dataIndex: 'marked_bogus_at_in_gb_formatted',
          class: 'md:text-center',
          sortable: true
        })
      }

      if ((columns.length > 0 && this.practiceTab === 'Deactivated') || this.practiceTab === 'Deleted') {
        columns.push({
          name: 'Verified',
          dataIndex: 'first_actived_at_in_gb_formatted',
          class: 'md:text-center',
          sortable: true
        })
      }

      if (columns.length > 0 && this.practiceTab === 'Deactivated') {
        columns.push({
          name: 'Deactivated',
          dataIndex: 'deactivated_at_in_gb_formatted',
          class: 'md:text-center',
          sortable: true
        })
      }

      if (columns.length > 0 && this.practiceTab === 'Deleted') {
        columns.push({
          name: 'Deleted',
          dataIndex: 'deleted_at_in_gb_formatted',
          class: 'md:text-center',
          sortable: true
        })
      }

      return columns
    },

    offset() {
      return this.limit * (this.currentPage - 1)
    },

    hasFilter() {
      return this.search || this.filterPracticeStatus || this.filterPracticeType || this.filterPracticeHubType
    }
  },

  watch: {
    practiceTab() {
      this.currentPage = 1
      this.getPractices()
    },

    search() {
      this.searchSubmit()
    },

    orderBy() {
      this.currentPage = 1
      this.getPractices()
    }
  },

  mounted() {
    this.getPractices()

    this.$axios.get('/api/v1/admin/profession-compliance-categories').then(response => {
      this.professionComplianceCategories = response.data.data.profession_compliance_categories
    })
  },

  methods: {
    practiceTabClass(tabValue) {
      return this.practiceTab === tabValue ? 'border-b-4 border-gray-500' : 'text-gray-600'
    },

    messageButtonClicked(item) {
      this.$axios
        .get(`/api/v1/conversations?practice_id=${item.id}`)
        .then(res => {
          if (res.data.data.conversations.length > 0) {
            this.$router.push(`/messages/${res.data.data.conversations[0].id}`)
          } else {
            this.$router.push(`/messages/create/practice/${item.id}`)
          }
        })
        .catch(err => {
          if (err.response.data.message) {
            this.$store.commit('SET_NOTIFICATION', {
              enabled: true,
              status: 'danger',
              text: [`${err.response.data.message}`]
            })
          }
        })
    },

    getPractices() {
      this.loadingPractices = true
      const filters = this.getPracticeFilters()
      Promise.all([
        this.$axios
          .get('/api/v1/admin/practices/count', {
            params: {
              ...filters
            }
          })
          .then(response => response.data.data.count),

        this.$axios
          .get('/api/v1/admin/practices', {
            params: {
              ...filters,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset
            }
          })
          .then(response => response.data.data.practices)
      ])
        .then(responses => {
          const [count, practices] = responses

          this.count = count
          this.practices = practices
          this.dynamicColumns = this.getDynamicColumns()
        })
        .finally(() => {
          this.loadingPractices = false
        })
    },

    searchSubmit: debounce(function() {
      this.currentPage = 1
      this.getPractices()
    }, 500),

    filterReset() {
      this.search = null
      this.filterPracticeStatus = null
      this.filterPracticeType = null
      this.filterPracticeHubType = null

      this.getPractices()
    },

    pageChangedHandler(page) {
      this.currentPage = page
      this.getPractices()
    },

    limitChangedHandler(limit) {
      this.currentPage = 1
      this.limit = limit
      this.getPractices()
    },

    practiceUpdatedHandler(practice) {
      if (!practice) {
        this.getPractices()
        return
      }

      const index = this.practices.findIndex(({ id }) => id === practice.id)

      if (index > -1) {
        this.practices.splice(index, 1, practice)
      }
    },

    getPracticeFilters() {
      return {
        search: this.search,
        practice_tab: this.practiceTab,
        status: this.practiceTab === 'Verified' ? this.filterPracticeStatus : null,
        type: this.filterPracticeType,
        hub_type: this.filterPracticeHubType
      }
    },

    hubTypeColumn() {
      return {
        name: 'Hub Type',
        dataIndex: 'hub_type',
        class: 'md:text-center',
        sortable: true,
        slot: true,
        slotName: 'hub_type_slot'
      }
    },

    hubColumn() {
      return {
        name: 'Hub',
        dataIndex: 'parent_practice_name',
        class: 'md:text-center',
        sortable: true
      }
    },

    getDynamicColumns() {
      const columns = [...this.defaultColumns]

      if (!this.filterPracticeType) {
        return [...columns, this.hubTypeColumn(), this.hubColumn()]
      }

      if (this.filterPracticeType === 'Hub') {
        return [...columns, this.hubTypeColumn()]
      }

      if (this.filterPracticeType === 'Spoke') {
        return [...columns, this.hubColumn()]
      }

      return columns
    },

    typeStyle(type) {
      switch (type) {
        case 'Hub':
          return 'text-red-500'
        case 'Spoke':
          return 'text-blue-500'
        case 'Stand Alone':
          return 'text-indigo-600'
        default:
          return
      }
    },

    hubTypeStyle(hubType) {
      switch (hubType) {
        case 'Type 1':
          return 'text-red-500'
        case 'Type 2':
          return 'text-purple-500'
        default:
          return ''
      }
    },

    registrationType(type) {
      if (type === 'Practice') {
        return 'Referred by Practice'
      }
      if (type === 'Locum') {
        return 'Referred by Locum'
      }
      return 'Organic'
    }
  }
}
</script>

<style>
.page-button {
  background: linear-gradient(to top, #f2d024, #efde86);
}

.page-button-disabled {
  background: linear-gradient(to top, #6b717e, #6b7386);
  cursor: not-allowed;
}

.page-button:active {
  transform: translate(2px, 2px);
}

.card {
  min-width: 100px;
  height: 250px;
  box-sizing: content-box;
}
.double-truncate {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s linear;
}
</style>
