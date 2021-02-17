<template>
  <div style="transition: all 0.3s ease-in-out;"> 
    <section v-if="$route.name === 'index-test-script-practice-dormant-status-index'" class="flex-1 flex flex-col self-end">
      <div class="py-4">
        <div class="mx-2 md:mx-4 ">
          <div class="text-lg font-bold">
            Active and Dormant Practices
          </div>
        </div>

        <div class="flex flex-col md:flex-row justify-between md:items-center">
          <div class="w-full">
            <AppInputSmall
              v-model="search"
              :type="'text'"
              :name="'search'"
              :button="true"
              :buttonLabel="'Search'"
              :placeholder="'Search Practice by Name or Code'"
              @click="searchSubmit()"
            />
          </div>
          

          <div class="flex flex-col w-full justify-end">
            <div
              class="md:w-full relative flex flex-col md:flex-row justify-end md:items-center md:items-end md:py-2 py-0"
            >
              <label class="text-sm  md:pr-2">Filter by Status</label>
              <select
                id="grid-state"
                v-model="filterStatus"
                class="w-full md:w-auto outline-none rounded-lg border-2 border-transparent text-sm  p-1 pr-6 focus:hubzz-yellow shadow-lg"
              >
                <option :value="null">
                  All
                </option>
                <option>Active</option>
                <option>Dormant</option>
              </select>
            </div>

            <div
              class="relative md:hidden flex flex-col justify-end md:flex-row md:items-center md:items-end pt-2 md:p-2 md:py-0"
            >
              <label class="text-sm  md:pr-2">Sort by</label>
              <select
                v-model="orderByValue"
                class="w-full md:w-auto outline-none rounded-lg border-2 border-transparent text-sm  p-1 pr-6 focus:hubzz-yellow bg-waterloo"
              >
                <option v-for="tempOrderByValue in orderByValues" :key="tempOrderByValue.value" :value="tempOrderByValue.value">
                  {{ tempOrderByValue.displayLabel }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <AppTableNew
          v-if="count !== 0"
          :total="count"
          :items="practices"
          :currentPage="currentPage"
          :perPage="limit"
          :columns="columns"
          :loading="loading"
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
        </AppTableNew>

        <div v-if="count === 0 && !loading" class="mt-2 w-full text-center ">
          <span>{{ 'No practices.' }}</span>
        </div>
      </div>
    </section>
    <nuxt-child @refreshPracticeTable="getPractices" />
  </div>
</template>

<script>
  import debounce from 'lodash.debounce'
  import AppTableNew from '@/components/Base/AppTableNew'
  import AppInputSmall from '@/components/Base/AppInputSmall'

  export default {
    components: {
      AppTableNew,
      AppInputSmall,
    },

    data () {
      return {
        loading: false,
				currentPage: 1,
        limit: 10,
        orderBy: [
          'created_at_in_gb_formatted:desc',
        ],
        count: 0,
        practices: [],

        filterStatus: null,
        search: '',
      }
    },

    computed: {
      routerLink () {
        return (practice) => {
          return {
            name: 'index-test-script-practice-dormant-status-index-practiceId',
            params: {
              practiceId: practice.id,
            },
          }
        }
      },
      
      columns () {
        return [
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
            maxWidth: '190px',
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
            name: 'Last job date created',
            dataIndex: 'last_job_posted_date_in_gb_formatted',
            class: 'md:text-center',
            sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '170px',
          },
          { 
            name: 'Override Created',
            dataIndex: 'override_created_at_in_gb_formatted',
            class: 'md:text-center',
            sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '170px',
          },
          { 
            name: 'Override last job posted date',
            dataIndex: 'override_last_job_posted_date_in_gb_formatted',
            class: 'md:text-center',
            sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '170px',
          },
          { 
            name: 'Dormant Date',
            dataIndex: 'dormanted_at_in_gb_formatted',
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
        ]
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

      offset () {
        return this.limit * (this.currentPage - 1)
      },

      totalPages () {
        return Math.ceil(this.count / this.limit)
      },

      orderByValue: {
        get () {
          return this.orderBy.length > 0 ? this.orderBy[0] : null
        },
        set (orderBy) {
          this.orderBy = [orderBy]
        },
      },
    },

    watch: {
      filterStatus () {
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
      this.count = 0
      this.practices = []
			this.getPractices()
    },
    
		methods: {
      getPractices () {
        this.loading = true
        const filters = {
          status: [
            'Active',
            'Dormant',
          ],
        }

        if (this.search) {
          filters.search = this.search
        }

        if (this.filterStatus) {
          filters.status = this.filterStatus
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
          this.loading = false
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
      
		},
  }
</script>
