<template>
  <section class="flex-1 flex-col py-2 px-2">
    <template>
      <div class="flex flex-row justify-start overflow-x-auto border-b border-yellow-500 mb-2 pt-1">
        <nuxt-link
          :to="`/survey-responses`" 
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="
            $route.name === `index-survey-responses` && (!$route.query.survey_domain || $route.query.survey_domain === 'Locum')
              ? 'border-b-4 border-yellow-500'
              : 'text-gray-600'
          "
        >
          Locum
        </nuxt-link>

        <nuxt-link
          :to="`/survey-responses?survey_domain=Practice`" 
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="
            $route.name === `index-survey-responses` && ($route.query.survey_domain === 'Practice')
              ? 'border-b-4 border-yellow-500'
              : 'text-gray-600'
          "
        >
          Practice
        </nuxt-link>
      </div>
    </template>

    <section class="flex-1 flex flex-col overflow-y-auto">
      <template>
        <div class="flex flex-col md:flex-row md:items-center">
          <div class="flex flex-col w-full justify-start mb-2">
            <div class="flex">
              <div class="flex w-full">
                <div class="md:w-4/12">
                  <AppInputSmall
                    v-model="search"
                    :type="'text'"
                    :name="'search'"
                    :button="true"
                    :buttonLabel="'Search'"
                    :placeholder="surveyDomain === 'Locum' ? 'Search Locum ID, Name, Email' : 'Search Practice User ID, Name, Email / Practice ID, Name'"
                    @click="searchSubmit()"
                  />
                </div>
                
                <template>
                  <div class="mx-1 my-2">
                    <AppButton
                      label="Filters"
                      icon="caret-down"
                      :rotate="filterModal ? 180 : ''"
                      :customTheme="'border-2 border-gray-400 rounded-lg font-bold text-gray-600'"
                      labelClass="flex-row-reverse mr-2"
                      iconWidth="10"
                      @click="filterModal = !filterModal"
                    />
                  </div>

                  <div v-if="filterModal" class="mx-1 my-2">
                    <AppButton
                      label="Apply"
                      :customTheme="'bg-orange-400 hover:bg-orange-500 text-gray-700 border border-gray-400 rounded'"
                      @click="submitFilters()"
                    />
                  </div>

                  <div v-if="filterModal" class="mx-1 my-2">
                    <AppButton
                      label="Clear"
                      :customTheme="'bg-gray-400 hover:bg-gray-500 text-whtie border border-gray-400 rounded'"
                      @click="filterReset"
                    />
                  </div>
                </template>
              </div>
            </div>
            
            <div
              class="flex flex-col flex-wrap justify-start items-start w-full rounded-lg -mt-3"
              :class="filterModal ? 'flex' : 'hidden'"
            >
              <div class="text-gray-800 w-full md:w-4/12 mr-2">
                <AppInputSmall
                  v-model="locumProfessionId"
                  :type="'select'"
                  :name="'locum_profession'"
                  :placeholder="'Locum Profession'"
                  :items="locumProfessionSelection"
                />
              </div>
              
              <div class="flex items-end mx-2">
                <div class="text-gray-800">
                  <AppDate
                    v-model="dateSubmittedStart"
                    :name="'date_start'"
                    :label="'Date Submitted Start'"
                  />
                </div>

                <div class="mx-2 text-gray-800">
                  <AppDate
                    v-model="dateSubmittedEnd"
                    :name="'date_end'"
                    :label="'Date Submitted End'"
                  />
                </div>
              </div>

              <template v-if="false">
                <div class="text-gray-800 w-full lg:w-1/4 md:w-1/5">
                  <AppInputSmall
                    v-model="filterStatus"
                    :type="'select'"
                    :name="'locum_status'"
                    :placeholder="'Locum Status'"
                    :items="locumStatuses"
                  />
                </div>

                <div class="mx-2 text-gray-800 w-full lg:w-1/4 md:w-1/5">
                  <AppInputSmall
                    v-model="filterCompliances"
                    :type="'select'"
                    :name="'compliance_status'"
                    :placeholder="'Compliance Status'"
                    :items="complianceStatuses"
                  />
                </div>
              </template>
            </div>
          </div>
        </div>

        <AppTableNew
          v-if="count !== 0"
          :total="count"
          :items="surveyResponses"
          :currentPage="currentPage"
          :perPage="limit"
          :columns="columns"
          :loading="gettingSurveyResponses"
          :routerLink="`/survey-responses`"
          :orderBy="orderBy"
          :customWidth="'800'"
          :min-height="'55vh'"
          @pagechanged="pageChangedHandler"
          @sorted="(_orderBy) => orderBy = _orderBy"
          @limitchanged="limitChangedHandler"
        >
          <template v-slot:status_slot="slotProps">
            <div
              class="text-center text-xs"
              :class="statusStyle(slotProps.item.status)"
            >
              {{ slotProps.item.status }}
            </div>
          </template>
          <template v-slot:compliance_slot="slotProps">
            <div
              class="text-center text-xs"
              :class="complianceStatusStyle(slotProps.item.compliance_status)"
            >
              {{ slotProps.item.compliance_status }}
            </div>
          </template>

          <template v-slot:registration_type_slot="slotProps">
            <div
              class="text-center text-xs"
            >
              {{ registrationType(slotProps.item.referrer_domain) }}
            </div>
          </template>
        </AppTableNew>

        <div v-if="count === 0 && !gettingSurveyResponses" class="mt-2 w-full text-center">
          <span>{{ hasFilter ? 'No survey responses found.' : 'No survey responses.' }}</span>
        </div>
      </template>

      <div
        class="flex-wrap justify-start items-center w-full p-3 flex my-2"
      >
        <div class="md:px-1 flex flex-wrap w-full justify-end">
          <button
            :disabled="downloading || count === 0"
            class="px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
            :class="count === 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-sunglow hover:bg-sunglow-dark cursor-pointer'"
            @click="downloadCsv"
          >
            <svgicon name="cloud-download" width="21" height="21" color="fill" class="fill-current mr-2" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      <nuxt-child
        @updateLocumUsers="getAllSurveyResponses"
      />
    </section>
  </section>
</template>

<script>
	import debounce from 'lodash.debounce'
  import AppTableNew from '@/components/Base/AppTableNew'
  import AppInputSmall from '@/components/Base/AppInputSmall'
  import AppDate from '@/components/Base/AppDate'
  import AppButton from '@/components/Base/AppButton'

	export default {

		components: {
      AppTableNew,
      AppInputSmall,
      AppButton,
      AppDate,
		},

		data () {
			return {
        gettingSurveyResponses: false,
				currentPage: 1,
				filterStatus: null,
				filterCompliances: null,
				search: '',
        limit: 15,
        orderBy: [
          'created_at_in_gb_formatted:desc',
        ],
        count: 0,
        surveyResponses: [],

        locumProfessionId: null,
        professions: [],

        locumStatuses: [
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
            label: "Bogus",
            value: "Bogus",
          },
          {
            label: "Deactivated",
            value: "Deactivated",
          },
          {
            label: "Account Suspension",
            value: "Account Suspension",
          },
          {
            label: "Compliance Suspension",
            value: "Compliance Suspension",
          },
        ],

        complianceStatuses: [
          {
            label: "Empty",
            value: "Empty",
          },
          {
            label: "Incomplete",
            value: "Incomplete",
          },
          {
            label: "Pending",
            value: "Pending",
          },
          {
            label: "Expiring",
            value: "Expiring",
          },
          {
            label: "Expired",
            value: "Expired",
          },
          {
            label: "Rejected",
            value: "Rejected",
          },
          {
            label: "Compliant",
            value: "Compliant",
          },
        ],

        filterModal: false,

        dateSubmittedStart: null,
        dateSubmittedEnd: null,

        downloading: false,
        downloadToken: null,
			}
		},

		computed: {
      locumProfessionSelection () {
        return this.professions.map((profession) => {
          return {
            label: profession.name,
            value: profession.id,
          }
        })
      },

      authAdminPermissions () {
        return this.$store.getters["permissions"]
      },

      columns () {
        if (this.surveyDomain === 'Locum') {
          return [
            {
              name: 'Survey Response ID',
              dataIndex: 'id',
              class: 'md:text-center',
              sortable: true,
              flex: '1 0 0',
              minWidth: '100px',
              maxWidth: '140px',
              width: 200
            },
            {
              name: 'User ID',
              dataIndex: 'user_id',
              class: 'md:text-center',
              sortable: true,
              flex: '1 0 0',
              minWidth: '100px',
              maxWidth: '140px',
              width: 200
            },
            {
              name: 'Locum Name',
              dataIndex: 'user_name',
              class: 'md:text-center',
              sortable: true,
              flex: '1 0 0',
              minWidth: '120px',
              maxWidth: '550px',
            },
            {
              name: 'Profession',
              dataIndex: 'locum_profession_name',
              class: 'md:text-center',
              sortable: true,
              flex: '1 0 0',
              minWidth: '120px',
              maxWidth: '550px',
            },
            {
              name: 'E-Mail Address',
              dataIndex: 'user_email',
              class: 'md:text-center',
              sortable: true,
              flex: '1 0 0',
              minWidth: '120px',
              maxWidth: '550px',
            },
            {
              name: 'Date Submitted',
              dataIndex: 'created_at_in_gb_formatted',
              class: 'md:text-center',
              sortable: true,
              flex: '1 0 0',
              minWidth: '100px',
              maxWidth: '170px',
              width: 200
            },
          ]
        }
        
        return [
          {
            name: 'Survey Response ID',
            dataIndex: 'id',
            class: 'md:text-center',
            sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '140px',
            width: 200
          },
          {
            name: 'Practice ID',
            dataIndex: 'practice_id',
            class: 'md:text-center',
            sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '140px',
            width: 200
          },
          {
            name: 'Practice Name',
            dataIndex: 'practice_name',
            class: 'md:text-center',
            sortable: true,
            flex: '1 0 0',
            minWidth: '120px',
            maxWidth: '550px',
          },
          {
            name: 'Practice User ID',
            dataIndex: 'user_id',
            class: 'md:text-center',
            sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '140px',
            width: 200
          },
          {
            name: 'Practice User Name',
            dataIndex: 'user_name',
            class: 'md:text-center',
            sortable: true,
            flex: '1 0 0',
            minWidth: '120px',
            maxWidth: '550px',
          },
          {
            name: 'E-Mail Address',
            dataIndex: 'user_email',
            class: 'md:text-center',
            sortable: true,
            flex: '1 0 0',
            minWidth: '120px',
            maxWidth: '550px',
          },
          {
            name: 'Date Submitted',
            dataIndex: 'created_at_in_gb_formatted',
            class: 'md:text-center',
            sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '170px',
            width: 200
          },
        ]
      },

      offset () {
        return this.limit * (this.currentPage - 1)
      },

      hasFilter () {
        return this.search || this.filterStatus || this.filterCompliances
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

      surveyDomain () {
        return this.$route.query.survey_domain || 'Locum'
      },
		},

		watch: {
			// filterStatus () {
			// 	this.currentPage = 1
      //   this.getAllSurveyResponses()
			// },

			// filterCompliances () {
			// 	this.currentPage = 1
      //   this.getAllSurveyResponses()
			// },

			search () {
				this.searchSubmit()
			},
      
			orderBy () {
        this.currentPage = 1
        this.getAllSurveyResponses()
      },
      
			surveyDomain () {
        this.currentPage = 1
        this.getAllSurveyResponses()
      },
		},

		mounted () {
      this.count = 0
      this.surveyResponses = []
			this.getAllSurveyResponses()

      this.$axios.get('/api/v1/admin/professions').then((response) => {
        this.professions = response.data.data.professions
      }).catch(this.errorHandler)
    },

		methods: {
      downloadCsv () {
        window.open(`${process.env.API_URL}/api/v1/admin/survey-responses/csv?token=${this.downloadToken}`)
      },

      submitFilters () {
        this.currentPage = 1
        this.getAllSurveyResponses()
      },

      errorHandler (err) {
        console.log('err', err.response || err)

        let message = null

        if (err.response?.data?.message) {
          message = err.response.data.message
        } else if (err.request) {
          message = 'Something went wrong!'
        } else {
          message = err.message
        }

        if (message) {
          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'danger',
            text: message,
          })
        }
      },

			getAllSurveyResponses () {
        const filters = {}

        if (this.surveyDomain) {
          filters.survey_domain = this.surveyDomain
        }

        if (this.search) {
          filters.search = this.search
        }

        if (this.locumProfessionId) {
          filters.locum_profession_id = this.locumProfessionId
        }

        if (this.dateSubmittedStart) {
          filters.date_submitted_start = this.dateSubmittedStart
        }

        if (this.dateSubmittedEnd) {
          filters.date_submitted_end = this.dateSubmittedEnd
        }

        const filename = this.surveyDomain === 'Locum'
          ? `survey_locum_responses.csv`
          : this.surveyDomain === 'Practice'
            ? `survey_practice_responses.csv`
            : `survey_responses.csv`

        this.gettingSurveyResponses = true

				Promise.all([
					this.$axios.get('/api/v1/admin/survey-responses/count', {
						params: {
							...filters,
						},
					}).then(response => response.data.data.count),

					this.$axios.get('/api/v1/admin/survey-responses', {
						params: {
              ...filters,
              order_by: this.orderBy,
							limit: this.limit,
							offset: this.offset,
						},
					}).then(response => response.data.data.survey_responses),

          this.$axios.post('/api/v1/admin/survey-responses/generate-key', {
            filename,
          }, {
            params: {
              ...filters,
            },
          }).then((responses) => {
            const token = responses.data.data.token

            return token
          })
				]).then((responses) => {
					const [
						count,
						surveyResponses,
            downloadToken,
					] = responses

          this.count = count
          this.surveyResponses = surveyResponses
          this.downloadToken = downloadToken
				}).catch(this.errorHandler).finally(() => {
          this.gettingSurveyResponses = false
				})
      },
      
			searchSubmit: debounce(function () {
				this.currentPage = 1
        this.getAllSurveyResponses()
      }, 500),
      
      filterReset () {
        this.search = null
        this.locumProfessionId = null
        this.filterStatus = null
        this.filterCompliances = null
        this.dateSubmittedStart = null
        this.dateSubmittedEnd = null

        this.getAllSurveyResponses()
      },
    
      pageChangedHandler (page) {
        this.currentPage = page
        this.getAllSurveyResponses()
      },

      limitChangedHandler (limit) {
        this.currentPage = 1
        this.limit = limit
        this.getAllSurveyResponses()
      },
      
			statusStyle (status) {
				switch (status) {
					case 'Active':
						return 'text-green-700'
					case 'Inactive':
						return 'text-gray-700'
					case 'Deactivated':
						return 'text-black'
					case 'Account Suspension':
						return 'text-red-600'
					case 'Compliance Suspension':
						return 'text-red-600'
					case 'Dormant':
            return 'text-gray-500'
          case 'Bogus':
						return 'text-gray-600'
					default:
						return
				}
			},

			complianceStatusStyle (status) {
				switch (status) {
					case 'Empty':
						return 'text-gray-400'
					case 'Incomplete':
						return 'text-orange-600'
					case 'Pending':
						return 'text-yellow-800'
					case 'Expiring':
						return ' text-red-400'
					case 'Expired':
						return 'text-red-500'
					case 'Rejected':
						return 'text-orange-700'
					case 'Compliant':
						return 'text-green-700'
					default:
						return
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
</style>
