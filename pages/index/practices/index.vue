<template>
  <div
    v-if="authAdminPermissions.includes('View Practices')
      || authAdminPermissions.includes('View Surgery Management') 
      || authAdminPermissions.includes('View Practice Sessions')
      || authAdminPermissions.includes('View Practice Users')
      || authAdminPermissions.includes('View Practice Documents')
      || authAdminPermissions.includes('View Practice Rates')"
    class="flex-1 flex flex-col"
  >
    <div class="flex flex-row justify-between items-center overflow-x-auto border-b border-gray-500 mb-1 py-2">
      <div>
        <nuxt-link
          :to="{ name: 'index-practices', query: { ...$route.query, practice_tab: undefined }}"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="practiceTab === 'Verified' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
        >
          Verified
        </nuxt-link>
        
        <nuxt-link
          :to="{ name: 'index-practices', query: { ...$route.query, practice_tab: 'Pending' }}"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="practiceTab === 'Pending' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
        >
          Pending
        </nuxt-link>

        <nuxt-link
          :to="{ name: 'index-practices', query: { ...$route.query, practice_tab: 'Bogus' }}"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="practiceTab === 'Bogus' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
        >
          Bogus
        </nuxt-link>

        <nuxt-link
          :to="{ name: 'index-practices', query: { ...$route.query, practice_tab: 'Deactivated' }}"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wra"
          :class="practiceTab === 'Deactivated' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
        >
          Deactivated
        </nuxt-link>

        <nuxt-link
          :to="{ name: 'index-practices', query: { ...$route.query, practice_tab: 'Deleted' }}"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wra"
          :class="practiceTab === 'Deleted' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
        >
          Deleted
        </nuxt-link>
      </div>
      <div>
        <AppButton
          v-if="authAdminPermissions.includes('Create New Practice') && authAdminPermissions.includes('Create New Practice User')"
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
                  @click="getPractices(params)"
                />
              </div>

              <div v-if="filterModal" class="mx-1 my-2">
                <AppButton
                  label="Clear"
                  :customTheme="'bg-gray-400 hover:bg-gray-500 text-whtie border border-gray-400 rounded'"
                  @click="filterReset"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          class="flex flex-row flex-wrap justify-start items-center w-full rounded-lg -mt-3 mb-2"
          :class="filterModal ? 'flex' : 'hidden'"
        >
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
            <AppInputSmall
              v-model="filterPracticeHubType"
              :type="'select'"
              :name="'hub_type'"
              :placeholder="'Hub Type'"
              :items="hubType"
            />
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
        :customWidth="'800'"
        @pagechanged="pageChangedHandler"
        @sorted="(_orderBy) => orderBy = _orderBy"
        @limitchanged="limitChangedHandler"
      >
        <template v-slot:status_slot="slotProps">
          <div
            class="text-xs"
            :class="slotProps.item.status === 'Active' ? 'text-green-500' : 'text-gray-700'"
          >
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
          <div
            class="px-4 py-1 rounded-full w-32 text-center mx-auto"
          >
            {{ registrationType(slotProps.item.referrer_domain) }}
          </div>
        </template>
      </AppTableNew>

      <div v-if="!loadingPractices && practices.length === 0" class="mt-2 w-full text-center">
        <span v-if="hasFilter">No practices found.</span>
        <span v-if="!hasFilter">There are no {{ practiceTab.toLowerCase() }} practices.</span>
      </div>
    </div>

    <div
      v-if="$route.name !== 'index-practices'"
      class="practice-shield"
      @click="$router.push({ name: 'index-practices', query: $route.query })"
    />

    <nuxt-child
      :professionComplianceCategories="professionComplianceCategories"
      @updatePractices="getPractices"
      @practiceUpdated="practiceUpdatedHandler"
    />
  </div>
</template>

<script>
import debounce from "lodash.debounce"
import AppButton from "@/components/Base/AppButton"
import AppTableNew from '@/components/Base/AppTableNew'
import AppInputSmall from '@/components/Base/AppInputSmall'
export default {
	components: {
		AppButton,
    AppTableNew,
    AppInputSmall,
  },
  
	data () {
		return {
      loadingPractices: true,
      count: 0,
      practices: [],
      currentPage: 1,
      orderBy: [
        'created_at_in_gb_formatted:desc',
      ],
      limit: 15,
      search: '',
      filterPracticeStatus: null,
      filterPracticeType: null,
      filterPracticeHubType: null,
			params: {
				limit: 15,
				offset: 0,
				order_by: ["created_at:desc"]
      },
      professionComplianceCategories: [],

      practiceStatuses: [
        {
          label: "Active",
          value: "Active",
        },
        {
          label: "Dormant",
          value: "Dormant",
        },
        {
          label: "Inactive",
          value: "Inactive",
        },
        {
          label: "Account Suspension",
          value: "Account Suspension",
        },
      ],
      practiceType: [
        {
          label: "Hub",
          value: "Hub",
        },
        {
          label: "Spoke",
          value: "Spoke",
        },
        {
          label: "Stand Alone",
          value: "Stand Alone",
        },
      ],
      hubType: [
        {
          label: "Type 1",
          value: "Type 1",
        },
        {
          label: "Type 2",
          value: "Type 2",
        },
      ],

      defaultColumns:  [
				{
					name: "Practice ID",
          dataIndex: 'id',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          width: 100,
          // minWidth: '100px',
          // maxWidth: '140px',
				},
				{
          name: 'Practice Name',
          dataIndex: 'name',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '120px',
          maxWidth: '550px',
				},
				{
          name: 'Practice Code',
          dataIndex: 'code',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          // minWidth: '120px',
          // maxWidth: '550px',
          width: 150
				},
				{ 
          name: 'Created',
          dataIndex: 'created_at_in_gb_formatted',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          // minWidth: '100px',
          // maxWidth: '170px',
          width: 120
				},
				{
          name: 'Expires',
          dataIndex: 'actived_until_in_gb_formatted',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '100px',
          maxWidth: '170px',
          width: 100
				},
				{
          name: 'Status',
          dataIndex: 'status',
          class: 'md:text-center',
          sortable: true,
          slot: true,
          slotName: 'status_slot',
          flex: '1 0 0',
          minWidth: '150px',
          maxWidth: '170px',
          width: 100
				},
				{
          name: 'Type',
          dataIndex: 'type',
          class: 'md:text-center',
          sortable: true,
          slot: true,
          slotName: 'type_slot',
          flex: '1 0 0',
          minWidth: '130px',
          maxWidth: '150px',
          width: 100
        },
        {
          name: 'Registration Type',
          dataIndex: 'referrer_domain',
          class: 'md:text-center',
          sortable: true,
          slot: true,
          slotName: 'registration_type_slot',
          flex: '1 0 0',
          minWidth: '150px',
          maxWidth: '170px',
          width: 150
        },
      ],
      dynamicColumns: [],

      filterModal: false,
		}
	},

	computed: {
    authAdminPermissions () {
			return this.$store.getters["permissions"]
    },

    practiceTab () {
      const practiceTab = this.$route.query.practice_tab

      if (practiceTab && practiceTab.toLowerCase() === 'pending') {
        return 'Pending'
      }

      if (practiceTab && practiceTab.toLowerCase() === 'bogus') {
        return 'Bogus'
      }

      if (practiceTab && practiceTab.toLowerCase() === 'deactivated') {
        return 'Deactivated'
      }

      if (practiceTab && practiceTab.toLowerCase() === 'deleted') {
        return 'Deleted'
      }

      return 'Verified'
    },

    routerLink () {
      return (practice) => {
        return {
          name: 'index-practices-id-index',
          params: {
            id: practice.id,
          },
          query: {
            ...this.$route.query,
          },
        }
      }
    },

    columns () {
      const columns = [...this.dynamicColumns]
      console.log('columns', columns)

      if (columns.length > 0 && this.practiceTab === 'Verified') {
        columns.push({ 
          name: 'Verified',
          dataIndex: 'first_actived_at_in_gb_formatted',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '100px',
          maxWidth: '170px',
          width: 150
				})
      }

      if (columns.length > 0 && this.practiceTab === 'Bogus') {
        columns.push({ 
          name: 'Verified',
          dataIndex: 'first_actived_at_in_gb_formatted',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '100px',
          maxWidth: '170px',
          width: 120
        })
        
        columns.push({ 
          name: 'Marked Bogus',
          dataIndex: 'marked_bogus_at_in_gb_formatted',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '120px',
          maxWidth: '170px',
          width: 120
				})
      }

      if (columns.length > 0 && this.practiceTab === 'Deactivated' || this.practiceTab === 'Deleted') {
        columns.push({ 
          name: 'Verified',
          dataIndex: 'first_actived_at_in_gb_formatted',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '100px',
          maxWidth: '170px',
          width: 120
        })
      }

      if (columns.length > 0 && this.practiceTab === 'Deactivated') {
        columns.push({ 
          name: 'Deactivated',
          dataIndex: 'deactivated_at_in_gb_formatted',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '100px',
          maxWidth: '170px',
          width: 120
        })
      }

      if (columns.length > 0 && this.practiceTab === 'Deleted') {
        columns.push({ 
          name: 'Deleted',
          dataIndex: 'deleted_at_in_gb_formatted',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '100px',
          maxWidth: '170px',
          width: 120
        })
      }
      
      return columns
    },

    offset () {
      return this.limit * (this.currentPage - 1)
    },

    hasFilter () {
      return this.search || this.filterPracticeStatus || this.filterPracticeType || this.filterPracticeHubType
    },

    orderByValues () {
      return this.columns.reduce((orderByValues, column) => {
        const {
          name,
          dataIndex,
          sortable,
        } = column

        if (sortable) {
          orderByValues.push({
            displayLabel: `${name} (asc)`,
            value: `${dataIndex}:asc`,
          })

          orderByValues.push({
            displayLabel: `${name} (desc)`,
            value: `${dataIndex}:desc`,
          })
        }

        return orderByValues
      }, [])
    },

    selectedOrderByValue: {
      get () {
        return this.orderBy.length > 0 ? this.orderBy[0] : null
      },
      set (orderBy) {
        this.orderBy = [orderBy]
      },
    },
      
    totalPages () {
      return Math.ceil(this.count / this.limit)
    },

		
	},

	watch: {
    practiceTab () {
      this.currentPage = 1
			this.getPractices()
    },

    // filterPracticeStatus () {
    //   this.currentPage = 1
		// 	this.getPractices()
    // },

    // filterPracticeType () {
    //   this.currentPage = 1
		// 	this.getPractices()
    // },

    // filterPracticeHubType () {
    //   this.currentPage = 1
		// 	this.getPractices()
    // },

		search () {
			this.searchSubmit()
		},
    
    orderBy () {
      this.currentPage = 1
			this.getPractices()
    },
  },
  


  mounted () {
    this.getPractices()

    this.$axios.get('/api/v1/admin/profession-compliance-categories').then((response) => {
      this.professionComplianceCategories = response.data.data.profession_compliance_categories
    })
  },

	methods: {
    getPractices () {
      this.loadingPractices = true
      const filters = {
        search: this.search,
        practice_tab: this.practiceTab,
        status: this.practiceTab === 'Verified' ? this.filterPracticeStatus : null,
        type: this.filterPracticeType,
        hub_type: this.filterPracticeHubType,
      }
      Promise.all([
        this.$axios.get('/api/v1/admin/practices/count', {
          params: {
            ...filters,
          },
        }).then((response) => response.data.data.count),

        this.$axios.get('/api/v1/admin/practices', {
          params: {
            ...filters,
            order_by: this.orderBy,
            limit: this.limit,
            offset: this.offset,
          },
        }).then((response) => response.data.data.practices),
      ]).then((responses) => {
        const [
          count,
          practices,
        ] = responses

        this.count = count
        this.practices = practices
        this.dynamicColumns = []
        const columns = [...this.defaultColumns]

        if (!this.filterPracticeType) {
          const updatedColumns = [
            ...columns,
            {
              name: 'Hub Type',
              dataIndex: 'hub_type',
              class: 'md:text-center',
              sortable: true,
              slot: true,
              slotName: 'hub_type_slot',
              flex: '1 0 0',
              minWidth: '150px',
              maxWidth: '170px',
              width: 100
            },
            {
              name: 'Hub',
              dataIndex: 'parent_practice_name',
              class: 'md:text-center',
              sortable: true,
              flex: '1 0 0',
              minWidth: '150px',
              maxWidth: '170px',
            }
          ]
          this.dynamicColumns = updatedColumns
        } else if (this.filterPracticeType && this.filterPracticeType === 'Hub') {
          const updatedColumns = [
            ...columns,
            {
              name: 'Hub Type',
              dataIndex: 'hub_type',
              class: 'md:text-center',
              sortable: true,
              slot: true,
              slotName: 'hub_type_slot',
              flex: '1 0 0',
              minWidth: '150px',
              maxWidth: '170px',
              width: 100
            }
          ]
          this.dynamicColumns = updatedColumns
        } else if (this.filterPracticeType && this.filterPracticeType === 'Spoke') {
          const updatedColumns = [
            ...columns,
            {
              name: 'Hub',
              dataIndex: 'parent_practice_name',
              class: 'md:text-center',
              sortable: true,
              flex: '1 0 0',
              minWidth: '150px',
              maxWidth: '170px',
            }
          ]
          this.dynamicColumns = updatedColumns
        } else {
          this.dynamicColumns = columns
        }

      }).finally(() => {
        this.loadingPractices = false
      })
    },

		searchSubmit: debounce(function () {
      this.currentPage = 1
			this.getPractices()
    }, 500),

    filterReset () {
      this.search = null
      this.filterPracticeStatus = null
      this.filterPracticeType = null
      this.filterPracticeHubType = null

      this.getPractices()
    },
    
    pageChangedHandler (page) {
      this.currentPage = page
      this.getPractices()
    },

    limitChangedHandler (limit) {
			this.currentPage = 1
      this.limit = limit
			this.getPractices()
    },
      
    practiceUpdatedHandler (practice) {
      if (!practice) {
        this.getPractices()
        return
      }
      
      const index = this.practices.findIndex(({ id }) => id === practice.id)

      if (index > -1) {
        this.practices.splice(index, 1, practice)
      }
    },

		typeStyle (type) {
			switch (type) {
				case "Hub":
					return "text-red-500"
				case "Spoke":
					return "text-blue-500"
				case "Stand Alone":
					return "text-indigo-600"
				default:
					return
			}
		},

		hubTypeStyle (hubType) {
			switch (hubType) {
				case "Type 1":
					return "text-red-500"
				case "Type 2":
					return "text-purple-500"
				default:
					return ""
			}
		},

    registrationType (type) {
      let registrationType = ''
      if (type === 'Practice') {
        registrationType = 'Referred by Practice'
      } else if (type === 'Locum') {
        registrationType = 'Referred by Locum'
      } else {
        registrationType = 'Organic'
      }

      return registrationType
    }
	},

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
