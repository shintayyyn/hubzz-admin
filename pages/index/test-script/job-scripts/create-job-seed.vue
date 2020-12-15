<template>
  <div class="modal shadow-lg">
    <div class="flex-1 flex flex-col self-end text-white m-6">
      <div class="flex justify-between text-sm text-white">
        <nuxt-link :to="{ name: 'index-test-script-job-scripts' }" class="text-white hover:text-sunglow p-1" draggable="false">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>
      <div>
        Create a new job
      </div>
      <div class="md:px-1 w-full lg:w-1/4 ">
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

      <div v-if="showCriteriaInputs" class="flex flex-col">
        <!-- PAGE 1 -->
        <div class="flex flex-row">
          <div class="w-full md:w-1/2 lg:pl-4 mb-4">
          <!-- CRITERIA -->
          <div>
            <h4 class="font-bold mt-4">Criteria</h4>
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
                  <div class>Compliance documents</div>
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
                <div class="mb-2">Compliance Documents</div>
                <div class="mb-4 text-sm">Please Select a Practice first</div>
              </template>
            </template>
          </div>
          <!-- DURATION -->
          <div class="flex flex-col">
            <h4 class="font-bold mt-4">Duration</h4>
            
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
            <h4 class="font-bold mt-4">Overview</h4>

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
                <div class="mb-2">Mandatory Training List</div>
                <div class="mb-4 text-sm">Please Select a Practice first</div>
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
            @getSchedule="getSchedule"
          />
          <div class="pt-4 pb-8 w-full flex justify-between">
            <AppButton class="mr-2" :label="'Back'" :disabled="loading" @click="tabActive='details'" />
            <AppButton
              v-if="authPermissions.includes('Create Sessions Job')"
              :disabled="!form.schedules.length || loading"
              :label="'Publish'"
              @click="canPublish"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppSuggestSelect from "@/components/Base/AppSuggestSelect"
import AppInput from "@/components/Base/AppInput"
import AppFilterSearch from "@/components/Base/AppFilterSearch"
import AppButton from "@/components/Base/AppButton"
import AppSchedules from "@/components/Base/AppSchedules"

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
  },
  data () {
    return {
      loading: false,
      dataLoading: false,

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
      
      // To Input
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
				favorite_only_until: null
      },
      
      // Shows
      showCriteriaInputs: false,
      // Errors
      formError: []
    }
  },
 computed: {
		authPermissions () {
			return this.$store.getters["permissions"];
		},

		repostJob () {
			return this.$store.state.calendar.repost_job;
		},

		hasBanks () {
			return this.banksCount > 0 ? true : false;
		},

		complianceListLabel () {
			return `For ${this.selectedProfession.profession_compliance_category_name}:`;
		},

		selectedProfession () {
			if (!this.form.role) {
				return null;
			}

			const profession = this.professions_categories.find(
				profession => profession.id.toString() === this.form.role.toString()
			);

			if (!profession) {
				return null;
			}

			return profession;
		},

		selectedProfessionComplianceCategory () {
			if (!this.form.role) {
				return null;
			}

			const profession = this.professions_categories.find(
				profession => profession.id.toString() === this.form.role.toString()
			);

			if (!profession) {
				return null;
			}

			const professionComplianceCategory = this.professionComplianceCategories.find(
				professionComplianceCategory =>
					professionComplianceCategory.id ===
					profession.profession_compliance_category_id
			);

			return professionComplianceCategory || null;
		},

		emptyComplianceDocumentId: {
			get() {
				return this.form.compliance_document_id.length === 0;
			},
			set(emptyComplianceDocumentId) {
				if (emptyComplianceDocumentId) {
					this.form.compliance_document_id = [];
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
					);
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
					};
				});
		},

		practice_rate() {
			const profession = this.professions_categories.find(
				profession => profession.id.toString() === this.form.role.toString()
			);

			const practiceRates =
				this.$auth.user &&
				this.$auth.user.practice_detail &&
				this.$auth.user.practice_detail.practice
					? this.$auth.user.practice_detail.practice.practice_rates
					: [];

			const practiceRate = practiceRates.find(
				item => item.type === profession.profession_category_name
			);

			return practiceRate ? practiceRate.rate : 0;
		},

		hubzz_fee() {
			return this.schedules
				.reduce((scheduleTotal, sched) => {
					const shiftTotal = sched.shifts.reduce((shiftTotal, shift) => {
						const time_start = shift.time_start;

						const time_end = shift.time_end;

						const total_hours = this.totalHours(
							time_start,
							time_end,
							sched.date
						);

						if (total_hours > 0) {
							const num = parseInt(total_hours);

							if (!isNaN(num)) {
								shiftTotal =
									shiftTotal +
									Math.round(
										(Math.round((num / 60) * 100) / 100) *
											this.practice_rate *
											100
									) /
										100;
							}
						}

						return shiftTotal;
					}, 0);

					return scheduleTotal + shiftTotal;
				}, 0)
				.toFixed(2);
		}
	},
  watch: {
    async "form.practice_id" (value) {
      if (value !== "" && Number.isInteger(value)) {
        this.tailorForPractice()
        this.showCriteriaInputs = true
      } else {
        this.showCriteriaInputs = false
      }
    },
  },
  methods: {
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
    }
  }
}
</script>

<style>

</style>