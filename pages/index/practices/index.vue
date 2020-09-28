<template>
  <div
    v-if="authAdminPermissions.includes('View Practices') 
      || authAdminPermissions.includes('View Practice Sessions')
      || authAdminPermissions.includes('View Practice Users')
      || authAdminPermissions.includes('View Practice Documents')
      || authAdminPermissions.includes('View Practice Rates')"
    class="flex-1 flex flex-col py-2"
  >
    <div class="px-2 flex justify-between items-center flex-wrap">
      <div>
        <div class="flex justify-start -mx-2 overflow-x-auto">
          <nuxt-link
            :to="{ name: 'index-practices', query: { ...$route.query, practice_tab: undefined }}"
            class="p-3 mx-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
            :class="practiceTab === 'Verified' ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
          >
            Verified
          </nuxt-link>
          
          <nuxt-link
            :to="{ name: 'index-practices', query: { ...$route.query, practice_tab: 'Pending' }}"
            class="p-3 mx-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
            :class="practiceTab === 'Pending' ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
          >
            Pending
          </nuxt-link>

          <nuxt-link
            :to="{ name: 'index-practices', query: { ...$route.query, practice_tab: 'Bogus' }}"
            class="p-3 mx-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
            :class="practiceTab === 'Bogus' ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
          >
            Bogus
          </nuxt-link>

          <nuxt-link
            :to="{ name: 'index-practices', query: { ...$route.query, practice_tab: 'Deactivated' }}"
            class="p-3 mx-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
            :class="practiceTab === 'Deactivated' ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
          >
            Deactivated
          </nuxt-link>
        </div>
      </div>

      <div>
        <AppButton
          v-if="authAdminPermissions.includes('Create New Practice') && authAdminPermissions.includes('Create New Practice User')"
          class="text-sm"
          :label="'Create New Practice'"
          :icon="'add-rectangle'"
          :nuxtLink="{ name: 'index-practices-add-practice', query: $route.query }"
        />
      </div>
    </div>

    <div class="px-2 flex flex-col md:flex-row justify-between md:items-center">
      <div class="flex py-2">
        <div class="relative">
          <input
            v-model="search"
            style="width: 280px;"
            class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo"
            placeholder="Search Practice by Name"
            @keyup.enter="searchSubmit"
          >

          <button
            v-if="search"
            class="absolute top-0 right-0 bottom-0 mr-3 md:mr-1"
            @click="(search = ''), searchSubmit()"
          >
            <svgicon
              name="times-solid"
              height="12"
              width="12"
              class="text-white hover:text-yellow-500 fill-current -mx-2 md:-mx-6"
            />
          </button>
        </div>
      </div>

      <div class="flex flex-col w-full justify-end">
        <div
          v-if="practiceTab === 'Verified'"
          class="md:w-full relative flex flex-col md:flex-row justify-end md:items-center md:items-end md:py-2 py-0 pt-2"
        >
          <label class="text-sm text-white md:pr-2">Filter by Status</label>

          <select
            id="grid-state"
            v-model="filterPracticeStatus"
            class="w-full md:w-auto outline-none rounded-lg border-2 border-transparent text-sm text-white p-1 pr-6 focus:hubzz-yellow bg-waterloo"
          >
            <option :value="null">
              All
            </option>
            <option>Active</option>
            <option>Dormant</option>
            <option>Inactive</option>
            <option>Suspended</option>
          </select>
        </div>

        <div
          class="md:w-full relative flex flex-col md:flex-row justify-end md:items-center md:items-end md:py-2 py-0 pt-2"
        >
          <label class="text-sm text-white md:pr-2">Filter by Type</label>

          <select
            id="grid-state"
            v-model="filterPracticeType"
            class="w-full md:w-auto outline-none rounded-lg border-2 border-transparent text-sm text-white p-1 pr-6 focus:hubzz-yellow bg-waterloo"
          >
            <option :value="null">
              All
            </option>
            <option>Hub</option>
            <option>Spoke</option>
            <option>Stand Alone</option>
          </select>
        </div>

        <div
          class="md:w-full relative flex flex-col md:flex-row justify-end md:items-center md:items-end md:py-2 py-0 pt-2"
        >
          <label class="text-sm text-white md:pr-2">Filter by Hub Type</label>

          <select
            id="grid-state"
            v-model="filterPracticeHubType"
            class="w-full md:w-auto outline-none rounded-lg border-2 border-transparent text-sm text-white p-1 pr-6 focus:hubzz-yellow bg-waterloo"
          >
            <option :value="null">
              All
            </option>
            <option>Type 1</option>
            <option>Type 2</option>
          </select>
        </div>
        
        <div
          class="relative md:hidden flex flex-col justify-end md:flex-row md:items-center md:items-end pt-2 md:p-2 md:py-0"
        >
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
      <AppTable
        v-if="count > 0"
        :total="count"
        :items="practices"
        :currentPage="currentPage"
        :perPage="limit"
        :columns="columns"
        :loading="loadingPractices"
        :routerLink="routerLink"
        :orderBy="orderBy"
        @pagechanged="pageChangedHandler"
        @sorted="(_orderBy) => orderBy = _orderBy"
      >
        <template v-slot:status_slot="slotProps">
          <div
            class="px-4 py-1 rounded-full text-center w-32 mx-auto"
            :class="slotProps.item.status === 'Active' ? 'bg-green-500' : 'bg-gray-500 text-gray-700'"
          >
            {{ slotProps.item.status }}
          </div>
        </template>

        <template v-slot:type_slot="slotProps">
          <div class="px-4 py-1 rounded-full text-center w-32 mx-auto" :class="typeStyle(slotProps.item.type)">
            {{ slotProps.item.type }}
          </div>
        </template>

        <template v-slot:hub_type_slot="slotProps">
          <div class="px-4 py-1 rounded-full text-center w-32 mx-auto" :class="hubTypeStyle(slotProps.item.hub_type)">
            {{ slotProps.item.hub_type }}
          </div>
        </template>
      </AppTable>

      <div v-if="!loadingPractices && practices.length === 0" class="mt-2 w-full text-center text-white">
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
import AppTable from "@/components/Base/AppTable"

export default {
	components: {
		AppButton,
    AppTable,
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
      limit: 10,
      search: '',
      filterPracticeStatus: null,
      filterPracticeType: null,
      filterPracticeHubType: null,
			params: {
				limit: 10,
				offset: 0,
				order_by: ["created_at:desc"]
      },
      professionComplianceCategories: [],
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
      const columns = [
				{
					name: "Practice ID",
          dataIndex: 'id',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '100px',
          maxWidth: '140px',
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
          minWidth: '120px',
          maxWidth: '550px',
				},
				{ 
          name: 'Created',
          dataIndex: 'created_at_in_gb_formatted',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '100px',
          maxWidth: '170px',
				},
				{
          name: 'Expires',
          dataIndex: 'actived_until_in_gb_formatted',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '100px',
          maxWidth: '170px',
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
				},
      ]

      if (!this.filterPracticeType || this.filterPracticeType === 'Hub') {
        columns.push({
          name: 'Hub Type',
          dataIndex: 'hub_type',
          class: 'md:text-center',
          sortable: true,
          slot: true,
          slotName: 'hub_type_slot',
          flex: '1 0 0',
          minWidth: '150px',
          maxWidth: '170px',
				})
      }

      if (this.filterPracticeType && this.filterPracticeType === 'Spoke') {
        columns.push({
          name: 'Hub',
          dataIndex: 'parent_practice_name',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '120px',
          maxWidth: '550px',
				})
      }

      if (this.practiceTab === 'Verified') {
        columns.push({ 
          name: 'Verified',
          dataIndex: 'first_actived_at_in_gb_formatted',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '100px',
          maxWidth: '170px',
				})
      }

      if (this.practiceTab === 'Bogus') {
        columns.push({ 
          name: 'Verified',
          dataIndex: 'first_actived_at_in_gb_formatted',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '100px',
          maxWidth: '170px',
        })
        
        columns.push({ 
          name: 'Marked Bogus',
          dataIndex: 'marked_bogus_at_in_gb_formatted',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '120px',
          maxWidth: '170px',
				})
      }

      if (this.practiceTab === 'Deactivated') {
        columns.push({ 
          name: 'Verified',
          dataIndex: 'first_actived_at_in_gb_formatted',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '100px',
          maxWidth: '170px',
        })

        columns.push({ 
          name: 'Deactivated',
          dataIndex: 'deactivated_at_in_gb_formatted',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '100px',
          maxWidth: '170px',
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

    filterPracticeStatus () {
      this.currentPage = 1
			this.getPractices()
    },

    filterPracticeType () {
      this.currentPage = 1
			this.getPractices()
    },

    filterPracticeHubType () {
      this.currentPage = 1
			this.getPractices()
    },

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
      }).finally(() => {
        this.loadingPractices = false
      })
    },

		searchSubmit: debounce(function () {
      this.currentPage = 1
			this.getPractices()
    }, 500),
    
    pageChangedHandler (page) {
      this.currentPage = page
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
					return "bg-red-500 text-white px-4 py-1"
				case "Spoke":
					return "bg-blue-500 text-white px-4 py-1"
				case "Stand Alone":
					return "bg-indigo-600 text-white px-6 md:px-5 py-1"
				default:
					return
			}
		},

		hubTypeStyle (hubType) {
			switch (hubType) {
				case "Type 1":
					return "bg-red-500 text-white px-4 py-1"
				case "Type 2":
					return "bg-purple-500 text-white px-4 py-1"
				default:
					return ""
			}
		},
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
