<template>
  <div ref="modalContainer" class="modal shadow-lg">
    <div class="flex-1 flex flex-col self-end text-white m-6">
      <div class="flex justify-between text-sm text-white my-2">
        <nuxt-link :to="{ name: 'index-test-script-job-scripts' }" class="text-white hover:text-sunglow p-1" draggable="false">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>
      <div class="text-xl font-bold w-full border-b-2 my-4">
        Create a new job
      </div>
      <div class="w-full lg:w-1/4 ">
        <div class="text-xl font-bold">
          1. Choose Practice
        </div>
        <AppSuggestSelect
          v-model="form.practice_id"
          :dataIndex="'practices'"
          :urlIndex="'/api/v1/admin/practices'"
          :name="'Practices'"
          :label="'Practice'"
        />
        <div v-if="form.practice_id">
          {{ selectedPractice && selectedPractice.name ? selectedPractice.name : null }}
        </div>
      </div>

      <div v-if="showCriteriaInputs" class="font-bold text-xl">
        2. Job Status
        <div class="flex flex-row">
          <div class="mx-3 text-lg">
            <input id="live" v-model="jobStatus" type="radio" value="Live">
            <label for="live">Live</label>
          </div>
          <div class="mx-3 text-lg">
            <input id="applied" v-model="jobStatus" type="radio" value="Applied">
            <label for="applied">Applied</label>
          </div>
          <div class="mx-3 text-lg">
            <input id="allocated" v-model="jobStatus" type="radio" value="Allocated">
            <label for="allocated">Allocated</label>
          </div>
          <div class="mx-3 text-lg">
            <input id="ongoing" v-model="jobStatus" type="radio" value="Ongoing">
            <label for="ongoing">Ongoing</label>
          </div>
          <!-- <div>
            <input id="allocated" v-model="jobStatus" type="radio" value="Allocated">
            <label for="allocated">Disputed</label>
          </div> -->
          <!-- <div>
            <input id="allocated" v-model="jobStatus" type="radio" value="Allocated">
            <label for="allocated">Completed</label>
          </div> -->
        </div>
      </div>

      <div v-if="showCriteriaInputs && jobStatus" class="flex flex-col">
        <!-- PAGE 1 -->
        <div class="flex flex-row">
          <div class="w-full md:w-1/2 lg:pl-4 mb-4">
            <!-- CRITERIA -->
            <div>
              <h4 class="font-bold mt-4">
                Criteria
              </h4>
              <AppInput
                v-model="form.role"
                :type="'select'"
                :name="'role'"
                :label="'Role'"
                :placeholder="'Select...'"
                :items="professions"
                :error="formError.find(item => item.field === 'role')"
                required
                @blur="CheckEmptyField(form.role,'role')"
              />

              <template v-if="form.role">
                <AppFilterSearch
                  v-model="form.specialty"
                  :name="'specialty'"
                  :label="'Specialty'"
                  :placeholder="'Select...'"
                  :info="'Choose at least one qualification'"
                  :url="'/api/v1/qualifications'"
                  :professionCategoryId="selectedProfession && selectedProfession.profession_category
                    ? selectedProfession.profession_category.id.toString()
                    : null
                  "
                  :error="formError.find(item => item.field === 'specialty')"
                  required
                />

                <AppFilterSearch
                  v-model="form.clinical_system"
                  :name="'clinical_system'"
                  :label="'Clinical systems'"
                  :placeholder="'Select...'"
                  :info="'Choose at least one IT system'"
                  :url="'/api/v1/clinical-systems'"
                  :error="formError.find(item => item.field === 'clinical_system')"
                  required
                />

                <AppFilterSearch
                  v-model="form.spoken_language_id"
                  :name="'spoken_language_id'"
                  :label="'Spoken languages'"
                  :placeholder="'Select...'"
                  :info="'Choose other languages you can speak'"
                  :url="'/api/v1/spoken-languages'"
                  :default-item="'English'"
                />

                <template v-if="form.practice_id">
                  <div class="relative flex flex-col pt-2">
                    <div class>
                      Compliance documents
                    </div>
                  </div>

                  <AppInput
                    v-model="form.compliance_document_id"
                    :type="'multi-checkbox'"
                    :error="formError.find(item => item.field === 'compliance_document_id')"
                    :name="'compliance_document_id'"
                    :label="`${complianceListLabel}`"
                    :lists="compliances"
                    :info="'Check all that apply'"
                    @checked="form.compliance_document_id.push(parseInt($event))"
                    @unchecked="form.compliance_document_id.splice(form.compliance_document_id.findIndex(item => item === parseInt($event)), 1)"
                    @uncheckAll="form.compliance_document_id = []"
                  />

                  <!-- <div v-if="compliances.length === 0" class="mb-6 text-center md:text-left mt-2">
                    <AppButton :label="'Go to Profile to add items here'" @click="goToProfile" />
                  </div> -->
                </template>
                <template v-else-if="!form.practice_id">
                  <div class="mb-2">
                    Compliance Documents
                  </div>
                  <div class="mb-4 text-sm">
                    Please Select a Practice first
                  </div>
                </template>
              </template>
            </div>
            <!-- DURATION -->
            <div class="flex flex-col">
              <h4 class="font-bold mt-4">
                Duration
              </h4>
              
              <AppInput
                v-model="auto_assign_job"
                :type="'select'"
                :name="'auto_assign_job'"
                :label="'Use AUTO-MATCH on this Job?'"
                :items="[ {value: false, label: 'No'}, {value: true, label: 'Yes'} ]"
              />

              <template v-if="['false', false].includes(auto_assign_job)">
                <AppInput
                  v-model="selection_notification"
                  :type="'select'"
                  :name="'selection_notification'"
                  :label="'Add a selection date?'"
                  :items="[ {value: false, label: 'No'}, {value: true, label: 'Yes'} ]"
                />
                <template v-if="selection_notification === true || selection_notification === 'true'">
                  <div>Selection will be made and you will receive a notification by this date</div>
                  <div class="flex flex-row flex-wrap justify-between items-end">
                    <div class="px-1 w-full md:w-1/2">
                      <AppDate
                        v-model="selection_date.date"
                        :name="'selection_date'"
                        :label="'Date'"
                        is-after
                        :error="formError.find(item => item.field === 'selection_date')"
                        required
                      />
                    </div>
                    <div class="px-1 w-full md:w-1/2">
                      <AppTime
                        v-model="selection_date.time"
                        :type="'time'"
                        :name="'time_end'"
                        :label="'Time'"
                        :error="formError.find(item => item.field === 'selection_date')"
                        required
                      />
                    </div>
                  </div>
                </template>
              </template>

              <template v-if="hasBanks">
                <AppInput
                  v-model="form.favorite_only"
                  :type="'select'"
                  :name="'favorite_only'"
                  :label="'Make this Job available for Bank Only?'"
                  :items="[ {value: false, label: 'No'}, {value: true, label: 'Yes'} ]"
                  required
                />
                <template v-if="['false', false].includes(form.favorite_only)">
                  <AppInput
                    v-model="bank_first"
                    :type="'select'"
                    :name="'bank_first'"
                    :label="'Make this Job available for Bank First?'"
                    :items="[ {value: false, label: 'No'}, {value: true, label: 'Yes'} ]"
                    required
                  />
                  <template v-if="bank_first === true || bank_first === 'true'">
                    <div>Only favorite locum will be notified until this date</div>
                    <div class="flex flex-row flex-wrap justify-between items-end">
                      <div class="px-1 w-full md:w-1/2">
                        <AppDate
                          v-model="favorite_only_until.date"
                          :name="'favorite_only_until'"
                          :label="'Date'"
                          is-after
                          :error="formError.find(item => item.field === 'favorite_only_until')"
                          required
                        />
                      </div>
                      <div class="px-1 w-full md:w-1/2">
                        <AppTime
                          v-model="favorite_only_until.time"
                          :type="'time'"
                          :name="'time_end'"
                          :label="'Time'"
                          :error="formError.find(item => item.field === 'favorite_only_until')"
                          required
                        />
                      </div>
                    </div>
                  </template>
                </template>
              </template>
            </div>
          </div>
          <div class="w-full md:w-1/2 lg:pl-4 mb-4">
            <h4 class="font-bold mt-4">
              Overview
            </h4>

            <div class="rounded-lg shadow-lg px-4 md:px-8 py-4 mt-4">
              <AppInput v-model="form.title" :type="'text'" :name="'title'" :label="'Title'" />

              <AppInput
                v-model="form.description"
                :type="'textarea'"
                :name="'description'"
                :label="'Description'"
                :resize="false"
              />

              <AppInput
                v-model="form.report_to"
                :type="'text'"
                :name="'report_to'"
                :label="'Report to'"
                :placeholder="''"
                :error="formError.find(item => item.field === 'report_to')"
                required
                @blur="CheckEmptyField(form.report_to,'report_to')"
              />

              <AppInput
                v-model="form.email"
                :type="'text'"
                :name="'email'"
                :label="'Email'"
                :placeholder="''"
                :error="formError.find(item => item.field === 'email')"
                required
                @blur="CheckEmptyField(form.email,'email')"
              />

              <AppInput
                v-model="form.is_another_doctor"
                :type="'select'"
                :name="'is_another_doctor'"
                :label="'Is there another Dr on site?'"
                :items="[ {value: true, label: 'YES'}, {value: false, label: 'NO'} ]"
              />

              <AppInput
                v-model="form.is_nurse_available"
                :type="'select'"
                :name="'is_nurse_available'"
                :label="'Is nurse support available?'"
                :items="[ {value: true, label: 'YES'}, {value: false, label: 'NO'} ]"
              />

              <AppInput
                v-model="form.number_of_patients"
                :type="'number'"
                :name="'number_of_patients'"
                :label="'Number of patients to be seen during the session?'"
                :placeholder="''"
                :error="formError.find(item => item.field === 'number_of_patients')"
                required
                :limit="4"
                @blur="CheckEmptyField(form.number_of_patients,'number_of_patients')"
              />

              <AppInput
                v-model="form.duration_for_each_appointment"
                :type="'number'"
                :name="'duration_for_each_appointment'"
                :label="'Duration of each appointment?'"
                :placeholder="''"
                :error="formError.find(item => item.field === 'duration_for_each_appointment')"
                required
                :limit="4"
                @blur="CheckEmptyField(form.duration_for_each_appointment, 'duration_for_each_appointment')"
              />

              <AppInput
                v-model="form.opportunity_for_catch_up_slots"
                :type="'select'"
                :name="'opportunity_for_catch_up_slots'"
                :label="'Opportunity for catch up slots?'"
                :items="[ {value: true, label: 'YES'}, {value: false, label: 'NO'} ]"
              />

              <AppInput
                v-model="form.session_requirements"
                :type="'multi-checkbox'"
                :name="'session_requirements'"
                :label="'Session requirements'"
                :placeholder="''"
                :lists="session_requirements_lists"
                :error="formError.find(item => item.field === 'session_requirements')"
                @checked="form.session_requirements.push($event)"
                @unchecked="form.session_requirements.splice(form.session_requirements.findIndex(item => item === $event), 1)"
                @uncheckAll="form.session_requirements = []"
              />

              <AppInput
                v-model="form.session_structure_information"
                :type="'textarea'"
                :name="'session_structure_information'"
                :label="'Session structure information'"
                :placeholder="'For e.g. the first 2 hours of the session is for booked appointments, 3rd hour is walk-ins, and home visits to x number of patients to the end of the session'"
                :resize="false"
              />

              <AppInput
                v-model="form.extra_information"
                :type="'textarea'"
                :name="'extra_information'"
                :label="'Extra information'"
                :placeholder="'For example, number of expected patients, nearby car park, etc.'"
                :resize="false"
              />

              <template v-if="selectedProfession && selectedProfession.profession_category.name === 'GP'">
                <AppInput
                  v-model="form.ir35"
                  :type="'select'"
                  :name="'ir35'"
                  :label="'IR35 - role inside or outside of scope'"
                  :items="[ {value: true, label: 'Inside of Scope'}, {value: false, label: 'Outside of Scope'} ]"
                />
              </template>

              <template v-if="form.practice_id">
                <AppInput
                  v-model="form.mandatory_training_id"
                  :type="'multi-checkbox'"
                  :error="formError.find(item => item.field === 'mandatory_training_id')"
                  :name="'mandatory_training_id'"
                  :label="'Mandatory training required for this job'"
                  :lists="mandatory_training_lists"
                  :info="'Check all that apply'"
                  @checked="form.mandatory_training_id.push(parseInt($event))"
                  @unchecked="form.mandatory_training_id.splice(form.mandatory_training_id.findIndex(item => item === parseInt($event)), 1)"
                  @uncheckAll="form.mandatory_training_id = []"
                />

                <AppInput
                  v-model="form.other_mandatory_training_id"
                  :type="'multi-checkbox'"
                  :error="formError.find(item => item.field === 'other_mandatory_training_id')"
                  :name="'other_mandatory_training_id'"
                  :label="'Other Mandatory training required for this job'"
                  :lists="other_mandatory_training_lists"
                  :info="'Check all that apply'"
                  @checked="form.other_mandatory_training_id.push(parseInt($event))"
                  @unchecked="form.other_mandatory_training_id.splice(form.other_mandatory_training_id.findIndex(item => item === parseInt($event)), 1)"
                  @uncheckAll="form.other_mandatory_training_id = []"
                />
              </template>

              <template v-else-if="!form.practice_id">
                <div class="mb-2">
                  Mandatory Training List
                </div>
                <div class="mb-4 text-sm">
                  Please Select a Practice first
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- PAGE 2 -->
        <div>
          <AppSchedules
            :shifts="shifts"
            :rate_lists="rate_lists"
            :schedule="form.schedules"
            :error="formError.find(err => err.field === 'schedules')"
            :shiftErrors="shiftErrors"
            :type="'create'"
            :jobSeederType="jobStatus"
            @getSchedule="getSchedule"
          />
        </div>
        
        <div v-if="toPublish" class="shield" />
        
        <!-- PAGE 3 CHOOSE LOCUMS -->
        <div v-if="jobStatus === 'Applied' || jobStatus === 'Allocated'">
          <div class="text-xl font-bold">
            3. Candidate Locums (Choose Applicants)
          </div>
          
          <AppTable
            v-if="locumCount !== 0"
            :total="locumCount"
            :items="locums"
            :currentPage="locumFilter.currentPage"
            :perPage="locumFilter.limit"
            :columns="columns"
            :loading="loading"
            :orderBy="locumFilter.order_by"
            @pagechanged="pageChangedHandler"
            @checkClicked="toggleCheckLocums"
            @sorted="(_orderBy) => locumFilter.order_by = _orderBy"
          >
            <template v-slot:checker="slotProps">
              <input
                :id="slotProps.item"
                v-model="chosenLocums"
                type="checkbox"
                :value="slotProps.item"
              >
              <label :for="slotProps.item" />
            </template>
            <template v-slot:status_slot="slotProps">
              <div
                class="px-4 py-1 rounded-full w-32 text-center mx-auto my-1"
                :class="statusStyle(slotProps.item.status)"
              >
                {{ slotProps.item.status }}
              </div>
            </template>
            <template v-slot:compliance_slot="slotProps">
              <div
                class="px-4 py-1 rounded-full w-32 text-center mx-auto my-1"
                :class="complianceStatusStyle(slotProps.item.compliance_status)"
              >
                {{ slotProps.item.compliance_status }}
              </div>
            </template>
          </AppTable>
        </div>
        
        <div class="pt-4 pb-8 w-full flex justify-between">
          <!-- <AppButton class="mr-2" :label="'Back'" :disabled="loading" @click="tabActive='details'" /> -->
          <AppButton
            :disabled="!form.schedules.length || loading"
            :label="'Publish'"
            @click="canPublish"
          />
        </div>
      </div>

      <transition name="fade">
        <div
          v-if="toPublish"
          class="job-notification-modal p-4 rounded font-bold text-white"
        >
          <p
            class="text-center pb-2 mb-4 border-b-2 border-gray-600 text-lg font-bold"
          >
            JOB NOTIFICATION SUMMARY
          </p>
          <div class="px-4">
            <div class="flex justify-between pb-2">
              <p>Total Working Hours:</p>
              <p class="pl-1">
                {{ total_working_hours | hoursMinutes }}
              </p>
            </div>
            <div class="flex justify-between pb-2">
              <p>Total Gross Locum Wages:</p>
              <p class="pl-1">
                £ {{ total_gross_locum_wages | currency }}
              </p>
            </div>
            <div class="flex justify-between pb-2">
              <p>
                Hubzz Fee*
                <span class="font-normal text-sm">(£{{ practice_rate.toFixed(2) }} per hour)</span>:
              </p>
              <p class="pl-1">
                £ {{ hubzz_fee | currency }}
              </p>
            </div>
          </div>
          <div class="flex justify-end items-center text-black mt-3">
            <AppButton :label="'Cancel'" class="mr-1" :disabled="loading" @click="toPublish=false" />
            <AppButton :label="'Confirm & Publish'" :disabled="loading" @click="createJob" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import AppSuggestSelect from "@/components/Base/AppSuggestSelect"
import AppInput from "@/components/Base/AppInput"
import AppFilterSearch from "@/components/Base/AppFilterSearch"
import AppButton from "@/components/Base/AppButton"
import AppSchedules from "@/components/Base/AppSchedules"
import AppTable from "@/components/Base/AppTable"

const session_requirements_lists = [
	{ label: "Practice admin", value: "Practice admin" },
	{ label: "Telephone triage", value: "Telephone triage" },
	{ label: "Home visits", value: "Home visits" }
]
export default {
  components: {
    AppSuggestSelect,
    AppInput,
    AppFilterSearch,
    AppButton,
    AppSchedules,
    AppTable,
  },
  data () {
    return {
      loading: false,
      dataLoading: false,
      
      // Job infos prior to creation
      datePosted: '',
      dateClosing: '',
      jobStatus: '',

      // Practice infos to job
      selectedPractice: '',
      rate_lists: [],
			mandatory_training: [],
			professions: [],
			session_requirements_lists,
			mandatory_training_lists: [],
			other_mandatory_training_lists: [],

			professions_categories: [],

			professionComplianceCategories: [],
			practiceProfessionComplianceCategoryComplianceDocuments: [],

			unpaid_breaks: false,
			auto_assign_job: false,
			selection_notification: false,
			bank_first: false,
			shifts: [],

			selection_date: {
				date: null,
				time: null
			},
			favorite_only_until: {
				date: null,
				time: null
			},

			selectedQualification: [],
			selectedClinicalSystem: [],
      selectedSpokenLanguage: [],

      // SPLIT JOBS
			tabActive: "details",
			hasShiftError: false,
			total_working_hours: 0,
			total_gross_locum_wages: 0,
			shiftErrors: [],
			toPublish: false,
			schedules: [],
			job_parts: [],
      
      // To Input for jobs
      form: {
				practice_id: "",
				title: "",
				description: "",
				email: "",
				report_to: "",
				is_another_doctor: false,
				is_nurse_available: false,
				number_of_patients: "",
				duration_for_each_appointment: "",
				opportunity_for_catch_up_slots: false,
				session_requirements: [],
				session_structure_information: "",
				extra_information: "",
				// rate: "",
				// hours: 0,
				// minutes: 0,
				// total_hours: "",
				// locum_detail_rate_type_id: 1,
				ir35: false,
				mandatory_training_id: [],
				other_mandatory_training_id: [],
				role: "",
				specialty: [],
				clinical_system: [],
				spoken_language_id: [],
				compliance_document_id: [],
				// dates: [],
				schedules: [],
				schedule_templates: [],
				// date_start: null,
				// date_end: null,
				// time_start: null,
				// time_end: null,
				// include_saturday: true,
				// include_sunday: true,
				// unpaid_breaks_in_minutes: "",
				// shift: "",
				auto_assign_at: null,
				selection_date: null,
				favorite_only: false,
				favorite_only_until: null,
      },

      // Locums
      locumCount: 0,
      locums: [],
      locumFilter: {
        search: '',
        locum_status: ['Active','Dormant'],
        compliance_status: ['Compliant'],
        profession_id: '',
        area_includes: '',
        currentPage: 1,
        limit: 5,
        orderBy: [
          'created_at_in_gb_formatted:desc',
        ],
      },
      chosenLocums: [],
      
      
      // Shows
      showCriteriaInputs: false,
      showLocumPicker: false,
      // Errors
      formError: []
    }
  },
 computed: {
		authPermissions () {
			return this.$store.getters["permissions"]
		},

		repostJob () {
			return this.$store.state.calendar.repost_job
		},

		hasBanks () {
			return this.banksCount > 0 ? true : false
		},

		complianceListLabel () {
			return `For ${this.selectedProfession.profession_compliance_category_name}:`
		},

		selectedProfession () {
			if (!this.form.role) {
				return null
			}

			const profession = this.professions_categories.find(
				profession => profession.id.toString() === this.form.role.toString()
			)

			if (!profession) {
				return null
			}

			return profession
		},

		selectedProfessionComplianceCategory () {
			if (!this.form.role) {
				return null
			}

			const profession = this.professions_categories.find(
				profession => profession.id.toString() === this.form.role.toString()
			)

			if (!profession) {
				return null
			}

			const professionComplianceCategory = this.professionComplianceCategories.find(
				professionComplianceCategory =>
					professionComplianceCategory.id ===
					profession.profession_compliance_category_id
			)

			return professionComplianceCategory || null
		},

		emptyComplianceDocumentId: {
			get () {
				return this.form.compliance_document_id.length === 0
			},
			set (emptyComplianceDocumentId) {
				if (emptyComplianceDocumentId) {
					this.form.compliance_document_id = []
				}
			}
		},

		compliances () {
			if (!this.form.role) {
				return []
			}

			const profession = this.professions_categories.find(
				profession => profession.id.toString() === this.form.role.toString()
			)

			if (!profession) {
				return []
			}

			const complianceDocuments = this.professionComplianceCategories.reduce(
				(compliances, professionComplianceCategory) => {
					const {
						reference_compliance_documents: referenceComplianceDocuments,
						mandatory_compliance_documents: mandatoryComplianceDocuments,
						optional_compliance_documents: optionalComplianceDocuments
					} = professionComplianceCategory

					if (
						professionComplianceCategory.id ===
						this.selectedProfessionComplianceCategory.id
					) {
						[
							referenceComplianceDocuments,
							mandatoryComplianceDocuments,
							optionalComplianceDocuments
						].forEach(complianceDocuments => {
							complianceDocuments.forEach(complianceDocument => {
								const {
									id,
									name,
									compliance_document_type_name: complianceDocumentTypeName,
									child_compliance_documents: childComplianceDocuments
								} = complianceDocument

								if (complianceDocumentTypeName === "Safeguarding") {
									childComplianceDocuments.forEach(childComplianceDocument => {
										const { id, name } = childComplianceDocument

										compliances.push({
											label: name,
											value: id
										})
									})
								} else {
									compliances.push({
										label: name,
										value: id
									})
								}
							})
						})
					}

					return compliances
				},
				[]
			)

			const complianceDocumentIds = complianceDocuments.map(
				({ value }) => value
      )
      
      console.log('complianceDocuments', complianceDocuments)

			return this.practiceProfessionComplianceCategoryComplianceDocuments
				.filter(practiceProfessionComplianceCategoryComplianceDocument => {
					const {
						compliance_document_id: complianceDocumentId,
						profession_compliance_category_id: professionComplianceCategoryId
					} = practiceProfessionComplianceCategoryComplianceDocument

					return (
						professionComplianceCategoryId ===
							this.selectedProfessionComplianceCategory.id &&
						complianceDocumentIds.includes(complianceDocumentId)
					)
				})
				.map(practiceProfessionComplianceCategoryComplianceDocument => {
					const {
						compliance_document_id: complianceDocumentId,
						compliance_document_name: complianceDocumentName
					} = practiceProfessionComplianceCategoryComplianceDocument
          console.log('complianceDocumentName', complianceDocumentName)
					return {
						label: complianceDocumentName,
						value: complianceDocumentId
					}
				})
		},

		practice_rate () {
			const profession = this.professions_categories.find(
				profession => profession.id.toString() === this.form.role.toString()
			)

			const practiceRates =
				this.$auth.user &&
				this.$auth.user.practice_detail &&
				this.$auth.user.practice_detail.practice
					? this.$auth.user.practice_detail.practice.practice_rates
					: []

			const practiceRate = practiceRates.find(
				item => item.type === profession.profession_category_name
			)

			return practiceRate ? practiceRate.rate : 0
		},

		hubzz_fee () {
      console.log('totalHours', this.totalHours)
			return this.schedules
				.reduce((scheduleTotal, sched) => {
					const shiftTotal = sched.shifts.reduce((shiftTotal, shift) => {
						const time_start = shift.time_start

						const time_end = shift.time_end

						const total_hours = this.totalHours(
							time_start,
							time_end,
							sched.date
            )
            

						if (total_hours > 0) {
							const num = parseInt(total_hours)

							if (!isNaN(num)) {
								shiftTotal =
									shiftTotal +
									Math.round(
										(Math.round((num / 60) * 100) / 100) *
											this.practice_rate *
											100
									) /
										100
							}
						}

						return shiftTotal
					}, 0)

					return scheduleTotal + shiftTotal
				}, 0)
				.toFixed(2)
    },
    
    // for locums
    columns () {
      return [
        {
					name: "Check",
					dataIndex: "checker",
					class: "flex items-center justify-center",
					slotName: "checker",
					flex: '1 0 0',
					minWidth: '90px',
					maxWidth: '100px',
					eventName: "checkClicked"
				},
        {
          name: 'Name',
          dataIndex: 'name',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '120px',
          maxWidth: '550px',
        },
        {
          name: 'E-Mail Address',
          dataIndex: 'email',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '120px',
          maxWidth: '550px',
        },
        {
          name: 'Profession',
          dataIndex: 'profession_name',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '100px',
          maxWidth: '550px',
        },
        {
          name: 'Date Signed-up',
          dataIndex: 'created_at_in_gb_formatted',
          class: 'md:text-center',
          sortable: true,
          flex: '1 0 0',
          minWidth: '100px',
          maxWidth: '170px',
        },
        {
          name: 'Sign-up verified',
          dataIndex: 'email_verified_at_in_gb_formatted',
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
          name: 'Compliance Status',
          dataIndex: 'compliance_status',
          class: 'md:text-center',
          sortable: true,
          slot: true,
          slotName: 'compliance_slot',
          flex: '1 0 0',
          minWidth: '150px',
          maxWidth: '170px',
        },
      ]
    },

    "locumFilter.offset" () {
      return this.locumFilter.limit * (this.locumFilter.currentPage - 1)
    },

	},
  watch: {
    "form.practice_id" (value) {
      if (value !== "" && Number.isInteger(value)) {
        this.tailorForPractice()
        this.showCriteriaInputs = true
      } else {
        this.showCriteriaInputs = false
      }
    },

    "form.role" (value) {
      this.locumFilter.profession_id = value
    },

    jobStatus (value) {
      if (value === 'Applied' || value === 'Allocated') {
        this.chosenLocums = []
        // this.locumFilter.profession_id = this.form.role
        this.getCompatibleLocums()
        
        this.showLocumPicker = true
      } else {
        this.locums = []
        this.chosenLocums = []
        this.showLocumPicker = false
      }
    }
  },
  methods: {
    totalHours (start, end, date) {
			let startDate = this.$moment(date + " " + start, "DD/MM/YYYY HH:mm")
			let endDate = this.$moment(date + " " + end, "DD/MM/YYYY HH:mm")
			return start && end
				? this.$moment(endDate, "DD/MM/YYYY HH:mm").diff(startDate, "minutes")
				: 0
    },
    
    tailorForPractice () {
      console.log(this.form)
      this.dataLoading = true

      Promise.all([
        this.$axios.get("/api/v1/locum-detail-rate-types").then(response =>
          response.data.data.locum_detail_rate_types.map(rateType => ({
            label: rateType.name,
            value: rateType.id
          }))
        ),
        this.$axios.get("/api/v1/shifts").then(response =>
          response.data.data.shifts.map(shift => ({
            label: shift.name,
            value: shift.id
          }))
        ),
        this.$axios
          .get("/api/v1/professions")
          .then(response => response.data.data.professions),
        this.$axios
          .get(`/api/v1/admin/practices/${this.form.practice_id}`)
          .then(response => response.data.data.practice),
        this.$axios
          .get("/api/v1/profession-compliance-categories")
          .then(response => {
            return response.data.data.profession_compliance_categories
          })
      ])
        .then(responses => {
          const [
            rateLists,
            shiftLists,
            professions,
            profileProfile,
            professionComplianceCategories
          ] = responses

          this.selectedPractice = profileProfile

          console.log('rateLists', rateLists)

          this.rate_lists = rateLists
          this.shifts = shiftLists
          this.professions = professions.map(profession => ({
            label: profession.name,
            value: profession.id
          }))
          this.professions_categories = professions
          this.professionComplianceCategories = professionComplianceCategories

          const {
            report_to: reportTo,
            email,
            extra_information: extraInformation
          } = profileProfile

          this.form.report_to = reportTo
          this.form.email = email
          this.form.extra_information = extraInformation
        })
        .finally(() => {
          this.dataLoading = false
        })
    },

    getSchedule (
			schedule,
			total_gross_locum_wages,
			total_working_hours,
			deductions,
			total_lates,
			hasError,
			job_parts
		) {
			this.form.schedules = []

			this.schedules = schedule

			schedule.forEach((sched, index) => {
				if (sched.shifts && sched.shifts.length) {
					let dateErrIndex = this.shiftErrors.findIndex(
						err => err.field === `shift-${sched.date}`
					)

					if (dateErrIndex > -1) {
						this.shiftErrors.splice(dateErrIndex, 1)
					}

					sched.shifts.forEach((shift, i) => {
						this.form.schedules.push({
							date: this.$moment(sched.date, "DD/MM/YYYY").format("YYYY-MM-DD"),
							shift_id: shift.shift_id,
							time_start: shift.time_start,
							time_end: shift.time_end,
							locum_detail_rate_type_id: shift.locum_detail_rate_type_id,
							rate: shift.rate
						})

						if (shift.time_start) {
							let startIndex = this.shiftErrors.findIndex(
								err => err.field === `time_start-s${index}-${i}`
							)

							if (startIndex > -1) {
								this.shiftErrors.splice(startIndex, 1)
							}
						}

						if (shift.time_end) {
							let endIndex = this.shiftErrors.findIndex(
								err => err.field === `time_end-s${index}-${i}`
							)

							if (endIndex > -1) {
								this.shiftErrors.splice(endIndex, 1)
							}
						}

						if (
							shift.locum_detail_rate_type_id !== 0 &&
							shift.locum_detail_rate_type_id !== ""
						) {
							let rateTypeIndex = this.shiftErrors.findIndex(
								err => err.field === `locum_detail_rate_type_id-s${index}-${i}`
							)

							if (rateTypeIndex > -1) {
								this.shiftErrors.splice(rateTypeIndex, 1)
							}
						}

						if (shift.shift_id !== 0 && shift.shift_id !== "") {
							let shiftIdIndex = this.shiftErrors.findIndex(
								err => err.field === `shift_id-s${index}-${i}`
							)

							if (shiftIdIndex > -1) {
								this.shiftErrors.splice(shiftIdIndex, 1)
							}
						}

						if (shift.rate !== 0 && shift.rate !== "") {
							let rateIndex = this.shiftErrors.findIndex(
								err => err.field === `rate-s${index}-${i}`
							)

							if (rateIndex > -1) {
								this.shiftErrors.splice(rateIndex, 1)
							}
						}
					})
				}
			})

			this.total_working_hours = total_working_hours

			this.total_gross_locum_wages = total_gross_locum_wages

			this.hasShiftError = hasError

			this.job_parts = job_parts
    },

    canPublish () {
			this.shiftErrors = []
			this.formError = []
			let has_conflict = false
			this.schedules.forEach((sched, index) => {
				if (!sched.shifts.length) {
					this.shiftErrors.push({
						field: `shift-${sched.date}`,
						message: "Schedule is required. Add Shift to create schedule."
					})
				} else {
					sched.shifts.forEach((shift, i) => {
						if (!shift.time_start) {
							this.shiftErrors.push({
								field: `time_start-s${index}-${i}`,
								message: "Start is required."
							})
						}
						if (!shift.time_end) {
							this.shiftErrors.push({
								field: `time_end-s${index}-${i}`,
								message: "End is required."
							})
						}
						if (shift.locum_detail_rate_type_id === 0) {
							this.shiftErrors.push({
								field: `locum_detail_rate_type_id-s${index}-${i}`,
								message: "Rate type is required."
							})
						}
						if (shift.shift_id === 0) {
							this.shiftErrors.push({
								field: `shift_id-s${index}-${i}`,
								message: "Shift is required."
							})
						}
						if (shift.rate === 0) {
							this.shiftErrors.push({
								field: `rate-s${index}-${i}`,
								message: "Rate is required."
							})
						}
					})
				}
			})
			if (!this.shiftErrors.length) {
        console.log('there are no errors')
				this.form.profession_id = this.form.role
				this.form.shift_id = this.form.shift
				this.selectedClinicalSystem = [...this.form.clinical_system]
				this.form.clinical_system_id = this.form.clinical_system.map(
					item => item.value
				)
				this.selectedQualification = [...this.form.specialty]
				this.form.qualification_id = this.form.specialty.map(
					item => item.value
				)
				this.selectedSpokenLanguage = [...this.form.spoken_language_id]
				this.form.spoken_language_id = this.form.spoken_language_id.map(
					item => item.value
				)

				if (Array.isArray(this.form.session_requirements)) {
					if (this.form.session_requirements.length === 1) {
						this.form.session_requirements = this.form.session_requirements[0]
					} else if (this.form.session_requirements.length > 0) {
						this.form.session_requirements = this.form.session_requirements.join()
					} else if (this.form.session_requirements.length === 0) {
						this.form.session_requirements = ""
					}
				}

				this.form.auto_assign_at = null
				if (["true", true].includes(this.auto_assign_job)) {
					this.form.auto_assign_at = "1970-01-01 00:00"
				}

				this.form.selection_date = null
				if (["false", false].includes(this.auto_assign_job)) {
					if (["true", true].includes(this.selection_notification)) {
						this.form.selection_date = `${this.$moment(
							this.selection_date.date,
							"YYYY-MM-DD"
						).format("YYYY-MM-DD")} ${this.selection_date.time}`
					}
				}

				this.form.favorite_only_until = null
				if (["true", true].includes(this.bank_first)) {
					this.form.favorite_only_until = `${this.$moment(
						this.favorite_only_until.date,
						"YYYY-MM-DD"
					).format("YYYY-MM-DD")} ${this.favorite_only_until.time}`
				}

				if (["15", 15, "30", 30, "60", 60].includes(this.unpaid_breaks)) {
					this.form.unpaid_breaks_in_minutes = this.unpaid_breaks
				}
				if (this.unpaid_breaks === "other") {
					this.form.unpaid_breaks_in_minutes = this.form.unpaid_breaks_in_minutes
				}
				if (["false", false].includes(this.unpaid_breaks)) {
					this.form.unpaid_breaks_in_minutes = ""
				}

				this.form.ir35 =
					this.selectedProfession &&
					this.selectedProfession.profession_category.name === "GP"
						? this.form.ir35
						: false

				this.loading = true

				this.$axios
					.$post(`/api/v1/admin/admin-seeder/jobs/create-job/check`, {
						...this.form,
						// for Locums
						posting_status: this.jobStatus,
						locum_applicants: this.jobStatus !== 'Live' ? this.chosenLocums : [],
						old_job_id:
							this.repostJob && !["Cancelled"].includes(this.repostJob.status)
								? this.repostJob.id
								: null
					})
					.then(() => {
						if (
							!this.shiftErrors.length &&
							!this.hasShiftError &&
							!this.formError.length &&
							!has_conflict
						) {
							this.toPublish = true
						}
						this.loading = false
					})
					.catch(err => {
						console.log("err", err.response || err)

						this.$refs.modalContainer.scrollTop = 0

						this.form.clinical_system = this.selectedClinicalSystem

						this.form.specialty = this.selectedQualification

						this.form.spoken_language_id = this.selectedSpokenLanguage

						this.form.session_requirements = this.form.session_requirements
							? this.form.session_requirements.split(",")
							: []

						let message = null

						if (err.response) {
							if (
								err.response.data.error_messages &&
								err.response.data.error_messages.length > 0
							) {
								this.shiftErrors = err.response.data.error_messages
								// let detailsError = [
								//   "practice_id",
								//   "number_of_patients",
								//   "duration_for_each_appointment",
								//   "role",
								//   "specialty",
								//   "clinical_system",
								// ]
								let sched_has_conflict = this.shiftErrors.find(
									err => err.field === "schedules"
								)
								if (sched_has_conflict) {
									has_conflict = true
									sched_has_conflict.conflictSchedules.forEach(item => {
										this.shiftErrors.push({
											field: `conflict-${this.$moment(
												item.date,
												"YYYY-MM-DD"
											).format("DD/MM/YYYY")}-${item.index}`,
											message:
												"This schedule has a conflict with another schedule."
										})
									})
									let conflictDates = sched_has_conflict.conflictSchedules
										.map(item => item.date)
										.filter(item => item)
									let job_parts = []
									conflictDates.forEach(date => {
										let job_part = this.job_parts.find(item =>
											item.dates.includes(date)
										)
										if (!job_parts.includes(job_part.value)) {
											job_parts.push(job_part.value)
										}
									})
									this.$store.commit("SET_NOTIFICATION", {
										enabled: true,
										status: "danger",
										text: [
											`Conflict schedule on Job Part/s (${job_parts.join(",")})`
										],
										duration: 3000
									})
								}

								this.formError = err.response.data.error_messages

								console.log("formErropr", this.formError)
								let detailsError = [
									"practice_id",
									"number_of_patients",
									"duration_for_each_appointment",
									"role",
									"specialty",
									"clinical_system"
								]

								let hasDetailsError = this.formError
									.map(err => detailsError.includes(err.field))
									.includes(true)
								if (hasDetailsError) {
									this.tabActive = "details"
								} else if (
									this.formError
										.map(err => ["schedules", "dates"].includes(err.field))
										.includes(true)
								) {
									this.tabActive = "schedule"
								}
							} else {
								message = err.response.data.message
							}
							// if (this.shiftErrors.length) {
							//   let sched_has_conflict = this.shiftErrors.find(
							//     err => err.field === "schedules"
							//   )
							// }
						} else if (err.request) {
							message = "Something weng wrong!"
						} else {
							message = err.message
						}

						if (message) {
							this.$store.commit("SET_NOTIFICATION", {
								enabled: true,
								status: "danger",
								text: [`${message}`]
							})
						}
						this.loading = false
					})
			}
			if (this.shiftErrors.length) {
				let has_empty_sched_dates = this.shiftErrors.filter(err =>
					err.field.includes("shift-")
				)
				let job_parts = []
				if (has_empty_sched_dates.length) {
					has_empty_sched_dates.forEach(err => {
						let empty_date = err.field.split("-")[1]
						let job_part = this.job_parts.find(part =>
							part.dates.includes(
								this.$moment(empty_date, "DD/MM/YYYY").format("YYYY-MM-DD")
							)
						)
						let exist = job_parts.find(item => item === `${job_part.value}`)
						if (job_part && !exist) {
							job_parts.push(`${job_part.value}`)
						}
					})
					let partsLabel = ""
					job_parts.forEach((item, index) => {
						if (job_parts.length > 1) {
							if (index !== job_parts.length - 1) {
								partsLabel += `${item}, `
							} else if (index === job_parts.length - 1) {
								partsLabel += `${item}`
							}
							//  else {
							// partsLabel += ` and ${item}`
							// }
						} else {
							partsLabel += item
						}
					})
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: [`Empty schedule on Job Part/s (${partsLabel})`],
						duration: 3000
					})
				}
			}
    },

    createJob () {
			this.formError = []
			let notRequired = [
				"title",
				"description",
				"session_requirements",
				"session_structure_information",
				"extra_information",
				"is_another_doctor",
				"is_nurse_available",
				"opportunity_for_catch_up_slots",
				"spoken_language_id",
				"ir35",
				"mandatory_training_id",
				"other_mandatory_training_id",
				"include_saturday",
				"include_sunday",
				"compliance_document_id",
				"auto_assign_at",
				"total_hours",
				"hours",
				"minutes",
				"favorite_only",
				"shift_id",
				"schedule_templates",
				"unpaid_breaks_in_minutes",
				"posting_status",
				"chosen_locums",
			]
			if (!this.hasBanks) {
				this.form.favorite_only = false
				this.bank_first = false
				this.favorite_only_until.date = null
				this.favorite_only_until.time = null
			}

			if (["true", true].includes(this.auto_assign_job)) {
				this.selection_notification = false
			}

			if (["false", false].includes(this.selection_notification)) {
				notRequired.push("selection_date")
			} else if (
				["true", true].includes(this.selection_notification) &&
				this.selection_date.date &&
				this.selection_date.time
			) {
				notRequired.push("selection_date")
			}

			if (["true", true].includes(this.form.favorite_only)) {
				this.bank_first = false
			}

			if (["false", false].includes(this.bank_first)) {
				notRequired.push("favorite_only_until")
			} else if (
				["true", true].includes(this.bank_first) &&
				this.favorite_only_until.date &&
				this.favorite_only_until.time
			) {
				notRequired.push("favorite_only_until")
			}

			this.Validate(this.form, notRequired)

			if (!this.formError.length) {
				this.form.profession_id = this.form.role
				this.form.shift_id = this.form.shift
				this.selectedClinicalSystem = [...this.form.clinical_system]
				this.form.clinical_system_id = this.form.clinical_system.map(
					item => item.value
				)
				this.selectedQualification = [...this.form.specialty]
				this.form.qualification_id = this.form.specialty.map(
					item => item.value
				)
				this.selectedSpokenLanguage = [...this.form.spoken_language_id]
				this.form.spoken_language_id = this.form.spoken_language_id.map(
					item => item.value
				)
				// this.form.date_start = this.$moment(
				//   this.form.date_start,
				//   "YYYY-MM-DD"
				// ).format("YYYY-MM-DD")
				// this.form.date_end = this.$moment(
				//   this.form.date_end,
				//   "YYYY-MM-DD"
				// ).format("YYYY-MM-DD")

				if (Array.isArray(this.form.session_requirements)) {
					if (this.form.session_requirements.length === 1) {
						this.form.session_requirements = this.form.session_requirements[0]
					} else if (this.form.session_requirements.length > 0) {
						this.form.session_requirements = this.form.session_requirements.join()
					} else if (this.form.session_requirements.length === 0) {
						this.form.session_requirements = ""
					}
				}

				this.form.auto_assign_at = null
				if (["true", true].includes(this.auto_assign_job)) {
					this.form.auto_assign_at = "1970-01-01 00:00"
				}

				this.form.selection_date = null
				if (["false", false].includes(this.auto_assign_job)) {
					if (["true", true].includes(this.selection_notification)) {
						this.form.selection_date = `${this.$moment(
							this.selection_date.date,
							"YYYY-MM-DD"
						).format("YYYY-MM-DD")} ${this.selection_date.time}`
					}
				}

				this.form.favorite_only_until = null
				if (["true", true].includes(this.bank_first)) {
					this.form.favorite_only_until = `${this.$moment(
						this.favorite_only_until.date,
						"YYYY-MM-DD"
					).format("YYYY-MM-DD")} ${this.favorite_only_until.time}`
				}

				if (["15", 15, "30", 30, "60", 60].includes(this.unpaid_breaks)) {
					this.form.unpaid_breaks_in_minutes = this.unpaid_breaks
				}
				if (this.unpaid_breaks === "other") {
					this.form.unpaid_breaks_in_minutes = this.form.unpaid_breaks_in_minutes
				}
				if (["false", false].includes(this.unpaid_breaks)) {
					this.form.unpaid_breaks_in_minutes = ""
				}

				this.form.ir35 =
					this.selectedProfession &&
					this.selectedProfession.profession_category.name === "GP"
						? this.form.ir35
						: false

				this.loading = true

				this.$axios
					.$post(`/api/v1/admin/admin-seeder/jobs/create-job`, {
						...this.form,
						// for Locums
						posting_status: this.jobStatus,
						locum_applicants: this.jobStatus !== 'Live' ? this.chosenLocums : [],
						old_job_id:
							this.repostJob && !["Cancelled"].includes(this.repostJob.status)
								? this.repostJob.id
								: null
					})
					.then(() => {
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "success",
							text: "Successfully created job",
						})
					})
					.catch(err => {
						console.log("err", err.response || err)

						this.$refs.modalContainer.scrollTop = 0

						this.form.clinical_system = this.selectedClinicalSystem

						this.form.specialty = this.selectedQualification

						this.form.spoken_language_id = this.selectedSpokenLanguage

						this.form.session_requirements = this.form.session_requirements
							? this.form.session_requirements.split(",")
							: []

						let message = null

						if (err.response) {
							if (
								err.response.data.error_messages &&
								err.response.data.error_messages.length > 0
							) {
								this.formError = err.response.data.error_messages
								let detailsError = [
									"practice_id",
									"number_of_patients",
									"duration_for_each_appointment",
									"role",
									"specialty",
									"clinical_system"
								]

								let hasDetailsError = this.formError
									.map(err => detailsError.includes(err.field))
									.includes(true)
								if (hasDetailsError) {
									this.tabActive = "details"
								} else if (
									this.formError
										.map(err => ["schedules", "dates"].includes(err.field))
										.includes(true)
								) {
									this.tabActive = "schedule"
								}
							} else {
								message = err.response.data.message
							}
						} else if (err.request) {
							message = "Something weng wrong!"
						} else {
							message = err.message
						}

						if (message) {
							this.$store.commit("SET_NOTIFICATION", {
								enabled: true,
								status: "danger",
								text: [`${message}`]
							})
						}
					})
					.finally(() => {
						this.toPublish = false
						this.loading = false
					})
			} else {
				let detailsError = [
					"practice_id",
					"number_of_patients",
					"duration_for_each_appointment",
					"role",
					"specialty",
					"clinical_system"
				]
				let hasDetailsError = this.formError
					.map(err => detailsError.includes(err.field))
					.includes(true)
				if (hasDetailsError) {
					this.tabActive = "details"
				}
				console.log("errors", this.formError)
				this.toPublish = false
				this.$nextTick(() => {
					this.$refs.modalContainer.scrollTop = 0
				})
			}
		},

    pageChangedHandler (page) {
      this.locumFilter.currentPage = page
      this.getCompatibleLocums()
    },
    
    getCompatibleLocums () {
      console.log('locumFilter', this.locumFilter)
      Promise.all([
        this.$axios.get('/api/v1/admin/locum-users/count', {
          params: {
            search: this.locumFilter.search,
            profession_id: this.locumFilter.profession_id,
            locum_status: this.locumFilter.locum_status,
            compliance_status: this.locumFilter.compliance_status,
          },
        }).then(response => response.data.data.count),
        this.$axios.get('/api/v1/admin/locum-users', {
          params: {
            search: this.locumFilter.search,
            profession_id: this.locumFilter.profession_id,
            locum_status: this.locumFilter.locum_status,
            compliance_status: this.locumFilter.compliance_status,
            order_by: this.locumFilter.order_by,
            limit: this.locumFilter.limit,
            offset: 0,
          },
        }).then(response => response.data.data.users),
      ]).then((responses) => {
        const [
          count,
          locums,
        ] = responses

        this.locumCount = count
        this.locums = locums
      }).finally(() => {
        this.loading = false
      })
    },

    toggleCheckLocums (item) {
			if (this.jobStatus === 'Applied' || (this.jobStatus === 'Allocated' && this.chosenLocums.length <=0)) {
				const index = this.chosenLocums.findIndex(locum => {
					return locum.id === item.id
				})
 
				if (index > -1) {
					this.chosenLocums.splice(index, 1)
				} else {
					this.chosenLocums.push(item)
				}
			} else {
				const index = this.chosenLocums.findIndex(locum => {
					return locum.id === item.id
				})

				if (index > -1) {
					this.chosenLocums.splice(index, 1)
				}
			}
			console.log("chosen chosenLocumsChecker", this.chosenLocums)
		},

    statusStyle (status) {
      switch (status) {
        case 'Active':
          return 'bg-green-500 text-white'
        case 'Inactive':
          return 'bg-gray-500 text-gray-700'
        case 'Deactivated':
          return 'bg-red-800 text-red-400'
        case 'Account Suspension':
          return 'bg-red-600 text-white'
        case 'Compliance Suspension':
          return 'bg-red-600 text-white'
        case 'Dormant':
          return 'bg-orange-500 text-white'
        case 'Bogus':
          return 'bg-gray-700 text-white'
        default:
          return
      }
    },

    complianceStatusStyle (status) {
      switch (status) {
        case 'Empty':
          return 'border border-white text-white'
        case 'Incomplete':
          return 'bg-orange-600 text-white'
        case 'Pending':
          return 'bg-yellow-500 text-yellow-800'
        case 'Expiring':
          return 'bg-red-400 text-white'
        case 'Expired':
          return 'bg-red-800 text-red-400'
        case 'Rejected':
          return 'bg-red-600 text-white'
        case 'Compliant':
          return 'bg-green-500 text-white'
        default:
          return
      }
    },
  }
}
</script>

<style>
.message-modal.job-notification-modal {
	min-width: 50vw;
}

@media (min-width: 768px) {
	.message-modal.job-notification-modal {
		min-width: 25vw;
	}
}

.job-notification-modal {
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	border-radius: 25px;
	width: 800px;
	max-width: 95%;
	max-height: 80%;
	overflow: auto;
	transition: all 0.3s ease-in-out;
	background-color: #424650;
	z-index: 512;
}

@media screen and (min-width: 768px) {
	.job-notification-modal {
		max-height: 60%;
	}
}

</style>