<template>
	<div class="flex flex-col rounded-lg">
		<transition name="drop" mode="in-out">
			<AppConfirm
				v-if="confirm"
				:message="'Are you sure you want to deactivate this practice?'"
				@cancel="confirm=false"
				@confirm="toDeactivate()"
			/>
		</transition>

		<div class="flex flex-col lg:flex-row">
			<form
				class="order-2 lg:order-1 flex flex-col bg-waterloo p-4 my-1 lg:my-0 shadow rounded-lg"
				:class="practice.status === 'Inactive' ? 'w-full lg:w-4/6' : 'max-w-5xl' "
			>
				<div class="flex flex-wrap">
					<!-- VIEW PRIMARY INFORMATION -->
					<div class="w-full md:w-1/2 text-gray-300 text-sm">
						<p class="flex font-bold">Practice ID</p>
						<p class="mx-2">{{ practice.id }}</p>

						<p class="flex font-bold">Practice Name</p>
						<p class="flex flex-wrap items-center text-white text-sm mb-2 md:px-2">
							<span class="mr-2">{{ practice.name }}</span>
							<span
								class="inline-flex px-4 py-1 mr-2 mb-1 rounded-lg text-sm md:px-2"
								:class="practiceTypeStyle(practice.type)"
							>{{ practice.type }}</span>
							<span
								v-if="practice.type === 'Hub' && practice.hub_type === 'Type 2'"
								class="inline-flex px-4 py-1 mr-2 mb-1 rounded-lg text-sm md:px-2"
								:class="practiceTypeStyle(practice.hub_type)"
							>'Health Board'</span>
						</p>

						<p class="flex font-bold">Practice Code</p>
						<p class="flex text-white text-sm md:px-2 mb-2">{{ practice.code }}</p>

						<p class="flex font-bold">Post Code</p>
						<p class="flex text-white text-sm md:px-2 mb-2">{{ practice.postcode }}</p>

						<p class="flex font-bold">Address</p>
						<p class="flex flex-col text-white text-sm md:px-2 mb-2">
							<span v-if="practice.address_line_1">{{ practice.address_line_1 }}</span>
							<span v-if="practice.address_line_2">{{ practice.address_line_2 }}</span>
							<span v-if="practice.address_line_3">{{ practice.address_line_3 }}</span>
							<span v-if="practice.address_line_4">{{ practice.address_line_4 }}</span>
							<span v-if="practice.address_line_5">{{ practice.address_line_5 }}</span>
						</p>

						<p class="flex font-bold">CCG</p>
						<p
							class="flex text-white text-sm md:px-2 mb-2"
						>{{ practice.clinical_commissioning_group_name }}</p>

						<p class="flex font-bold">Practice Types</p>

						<div
							v-if="practice.practice_types && practice.practice_types.length > 0"
							class="flex flex-wrap mb-2"
						>
							<p
								v-for="practiceType in practice.practice_types"
								:key="practiceType.id"
								class="inline-flex px-4 py-1 mr-2 mb-1 rounded-lg text-sm text-black md:px-2 bg-yellow-500"
							>{{ practiceType.name }}</p>
						</div>

						<div v-if="practice.practice_types && practice.practice_types.length === 0">
							<p class="flex text-white text-sm md:px-2 mb-2">Not set</p>
						</div>

						<template
							v-if="
                practice.practice_profession_compliance_category_compliance_documents
                  && practice.practice_profession_compliance_category_compliance_documents.length > 0
              "
						>
							<div
								v-for="professionComplianceCategory in professionComplianceCategories"
								:key="professionComplianceCategory.id"
								class="mb-4"
							>
								<p
									class="flex font-bold"
								>Compliance Requirements for {{ professionComplianceCategory.name }}:</p>

								<div
									v-for="
                    referenceComplianceDocument in professionComplianceCategory.reference_compliance_documents
                      .filter((referenceComplianceDocument) => {
                        return practice.practice_profession_compliance_category_compliance_documents
                          .some(practiceProfessionComplianceCategoryComplianceDocument => {
                            return practiceProfessionComplianceCategoryComplianceDocument.compliance_document_id
                              === referenceComplianceDocument.id
                              && practiceProfessionComplianceCategoryComplianceDocument.profession_compliance_category_id
                                === professionComplianceCategory.id
                          })
                      })
                  "
									:key="referenceComplianceDocument.id"
									class="text-white text-sm m-1 mb-2"
								>
									<span>{{ referenceComplianceDocument.name }}</span>
								</div>

								<div
									v-for="mandatoryComplianceDocument in professionComplianceCategory.mandatory_compliance_documents"
									:key="mandatoryComplianceDocument.id"
								>
									<div
										v-if="
                      mandatoryComplianceDocument.compliance_document_type_name !== 'Safeguarding'
                        && practice.practice_profession_compliance_category_compliance_documents
                          .some(practiceProfessionComplianceCategoryComplianceDocument => {
                            return practiceProfessionComplianceCategoryComplianceDocument.compliance_document_id
                              === mandatoryComplianceDocument.id
                              && practiceProfessionComplianceCategoryComplianceDocument.profession_compliance_category_id
                                === professionComplianceCategory.id
                          })
                    "
										class="text-white text-sm m-1 mb-2"
									>
										<span>{{ mandatoryComplianceDocument.name }}</span>
									</div>
									<template
										v-if="
                      mandatoryComplianceDocument.compliance_document_type_name === 'Safeguarding'
                        && practice.practice_profession_compliance_category_compliance_documents
                          .some(practiceProfessionComplianceCategoryComplianceDocument => {
                            return practiceProfessionComplianceCategoryComplianceDocument.compliance_document_id
                              === childComplianceDocument.id
                              && practiceProfessionComplianceCategoryComplianceDocument.profession_compliance_category_id
                                === professionComplianceCategory.id
                          })
                    "
									>
										<div
											v-for="childComplianceDocument in mandatoryComplianceDocument.child_compliance_documents"
											:key="childComplianceDocument.id"
											class="text-white text-sm m-1 mb-2"
										>
											<span>{{ childComplianceDocument.name }}</span>
										</div>
									</template>
								</div>

								<div
									v-for="optionalComplianceDocument in professionComplianceCategory.optional_compliance_documents"
									:key="optionalComplianceDocument.id"
								>
									<div
										v-if="
                      optionalComplianceDocument.compliance_document_type_name !== 'Safeguarding'
                        && practice.practice_profession_compliance_category_compliance_documents
                          .some(practiceProfessionComplianceCategoryComplianceDocument => {
                            return practiceProfessionComplianceCategoryComplianceDocument.compliance_document_id
                              === optionalComplianceDocument.id
                              && practiceProfessionComplianceCategoryComplianceDocument.profession_compliance_category_id
                                === professionComplianceCategory.id
                          })
                    "
										class="text-white text-sm m-1 mb-2"
									>
										<span>{{ optionalComplianceDocument.name }}</span>
									</div>
									<template
										v-if="
                      optionalComplianceDocument.compliance_document_type_name === 'Safeguarding'
                        && practice.practice_profession_compliance_category_compliance_documents
                          .some(practiceProfessionComplianceCategoryComplianceDocument => {
                            return practiceProfessionComplianceCategoryComplianceDocument.compliance_document_id
                              === childComplianceDocument.id
                              && practiceProfessionComplianceCategoryComplianceDocument.profession_compliance_category_id
                                === professionComplianceCategory.id
                          })
                    "
									>
										<div
											v-for="childComplianceDocument in optionalComplianceDocument.child_compliance_documents"
											:key="childComplianceDocument.id"
											class="text-white text-sm m-1 mb-2"
										>
											<span>{{ childComplianceDocument.name }}</span>
										</div>
									</template>
								</div>
							</div>
						</template>

						<div v-if="practice.mandatory_trainings && practice.mandatory_trainings.length > 0">
							<p class="flex font-bold">Mandatory Trainings</p>

							<div
								v-for="mandatoryTraining in practice.mandatory_trainings"
								:key="mandatoryTraining.id"
								class="text-white text-sm m-1 mb-2"
							>
								<span>{{ mandatoryTraining.name }}</span>
							</div>
						</div>

						<div
							v-if="
                practice.practice_profession_compliance_category_compliance_documents
                  && practice.practice_profession_compliance_category_compliance_documents.length === 0
              "
						>
							<p class="flex text-white md:text-base py-2 font-bold leading-tight">
								<span>Compliance Documents is not yet set up by the Practice Hub.</span>
							</p>
						</div>
					</div>

					<!-- VIEW / EDIT OTHER INFORMATION / PRACTICE TYPE -->
					<div v-if="practice.status !== 'Deactivated'" class="w-full text-sm text-white md:w-1/2">
						<div class="flex flex-wrap justify-between items-center">
							<span class="text-lg mr-2 font-bold">Invoicing Details</span>
						</div>

						<div>
							<p class="flex text-gray-300 font-bold">VAT Registered</p>

							<p class="flex text-white text-sm md:px-2 mb-2">{{ practice.vat_registered ? 'Yes' : 'No' }}</p>

							<template v-if="practice.vat_registered">
								<p class="flex font-bold">Vat Number</p>

								<p
									class="flex text-white text-sm md:px-2 mb-2"
								>{{ practice.vat_number ? practice.vat_number : 'N/A' }}</p>

								<p class="flex font-bold">Tax Year End Date</p>

								<p
									class="flex text-white text-sm md:px-2 mb-2"
								>{{ practice.tax_year_end_date ? $moment(practice.tax_year_end_date, 'YYYY-MM-DD').format('DD/MM/YYYY') : 'N/A' }}</p>
							</template>

							<p class="flex text-gray-300 font-bold">Bank Details</p>

							<div class="ml-2">
								<p class="flex text-gray-300 font-bold">Account name</p>

								<p
									class="flex md:mx-2 mb-2"
								>{{ practice && practice.account_name ? practice.account_name : 'N/A' }}</p>

								<p class="flex text-gray-300 font-bold">Bank name</p>

								<p
									class="flex md:mx-2 mb-2"
								>{{ practice && practice.bank_name ? practice.bank_name : 'N/A' }}</p>

								<p class="flex text-gray-300 font-bold">Sort code</p>

								<p
									class="flex md:mx-2 mb-2"
								>{{ practice && practice.sort_code ? practice.sort_code : 'N/A' }}</p>

								<p class="flex text-gray-300 font-bold">Account number</p>

								<p
									class="flex md:mx-2 mb-2"
								>{{ practice && practice.account_number ? practice.account_number : 'N/A' }}</p>
							</div>
						</div>

						<div class="flex flex-wrap justify-between items-center">
							<span class="text-lg mr-2 font-bold">Other Information</span>
							<AppButton
								v-if="authAdminPermissions.includes('Edit Practice Other Information')"
								:label="toEdit ? 'Cancel Editing' : 'Edit'"
								@click="edit()"
							/>
						</div>

						<!-- VIEWING OTHER INFORMATION -->
						<div v-if="!toEdit">
							<!-- <p class="flex text-gray-300 font-bold">
                Direct Debit
              </p>
              <p class="flex text-white text-sm md:px-2 mb-2">
                {{ practice.direct_debit ? 'Yes' : 'No' }}
							</p>-->
							<template v-if="practice.direct_debit">
								<p class="flex font-bold">Sage reference</p>
								<p
									class="flex text-white text-sm md:px-2 mb-2"
								>{{ practice.sage_ref ? practice.sage_ref : 'N/A' }}</p>
								<!-- <p class="flex font-bold">Nominal code</p>
								<p class="flex ftext-white text-sm md:px-2 mb-2">{{practice.nominal_code}}</p>-->
							</template>
							<p class="flex text-gray-300 font-bold">Phone Number</p>
							<p
								class="flex md:mx-2 mb-2"
							>{{ practice && practice.phone_number ? practice.phone_number : 'N/A' }}</p>
							<p class="flex text-gray-300 font-bold">Full name to report to</p>
							<p
								class="flex md:mx-2 mb-2"
							>{{ practice && practice.report_to ? practice.report_to : 'N/A' }}</p>
							<p
								class="flex text-gray-300 font-bold"
							>Extra information (Parking restrictions, transport links, etc.)</p>
							<p
								class="flex md:mx-2 mb-2"
							>{{ practice && practice.extra_information ? practice.extra_information : 'N/A' }}</p>
							<!-- <div class="flex items-center mb-2">
                <span class="text-gray-300 mr-2 font-bold">Status:</span>
                <span
                  class="text-white px-4 py-1 rounded-lg"
                  :class="practice.status == 'Active' ? 'bg-green-500' : 'bg-red-500'"
                >{{ practice.status }}</span>
                <span
                  class="tool"
                  data-tip="Manual status control will only work when verification requirements are already completed (Documents and Rates)."
                  tabindex="1"
                >
                  <svgicon
                    name="info"
                    width="21"
                    height="21"
                    color="white transparent black"
                    class="ml-2"
                  />
                </span>
							</div>-->
							<!-- <template v-if="practice.status === 'Active'">
                <p class="text-gray-300 font-bold">
                  Active Until
                </p>
                <p
                  class="flex md:mx-2 mb-2"
                >
                  {{ practice && practice.actived_until ? $moment(practice.actived_until, 'YYYY-MM-DD[T]').utc().format('DD/MM/YYYY') : 'N/A' }}
                </p>
							</template>-->
							<div class="flex flex-col item-center">
								<div class="w-full sm:w-1/2 m-2">
									<AppButton
										:inClass="'text-white'"
										:label="'Deactivate this Practice'"
										:background="'charade'"
										:disabled="authAdminPermissions.includes('Edit Practice Other Information') === false"
										@click="confirm=true"
									/>
									<!-- Deactivate this Practice -->
								</div>
								<div
									v-if="practice.status !== 'Bogus' && practice.status !== 'Active' && practice.status !== 'Dormant'"
									class="w-full sm:w-1/2 m-2 text-base font-semibold text-center rounded-lg bg-red-600 hover:bg-red-700 mx-2 p-2 cursor-pointer transition-hover"
									@click="toMarkBogus()"
								>Mark as Bogus</div>
								<div
									v-if="practice.status === 'Bogus'"
									class="w-full sm:w-1/2 m-2 text-base font-semibold text-center rounded-lg bg-yellow-600 hover:bg-yellow-700 mx-2 p-2 cursor-pointer transition-hover"
									@click="toUnmarkBogus()"
								>Remove Bogus Status</div>
							</div>
						</div>

						<!-- EDITING OTHER INFORMATION -->
						<div v-if="toEdit && authAdminPermissions.includes('Edit Practice Other Information')">
							<!-- <AppInput
                v-model="toPutPractice.direct_debit"
                class="w-2/3 md:w-1/2 mr-2"
                :type="'select'"
                :name="'status'"
                :label="'Direct Debit'"
                :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
							/>-->
							<template v-if="['true', true].includes(toPutPractice.direct_debit)">
								<AppInput
									v-model="toPutPractice.sage_ref"
									:type="'text'"
									:name="'sage_ref'"
									:label="'Sage reference'"
								/>
								<!-- <AppInput
									v-model="toPutPractice.nominal_code"
									:type="'text'"
									:name="'nominal_code'"
									:label="'Nominal code'"
								/>-->
							</template>
							<AppInput
								v-model="toPutPractice.phone_number"
								:type="'text'"
								:name="'phonenumber'"
								:label="'Phone Number'"
							/>
							<AppInput
								v-model="toPutPractice.report_to"
								:type="'text'"
								:name="'report_to'"
								:label="'Full name to report to'"
							/>
							<AppInput
								v-model="toPutPractice.extra_information"
								:type="'textarea'"
								:name="'practiceNote'"
								:label="'Extra information (Parking restrictions, transport links, etc.)'"
								:resize="false"
								:rows="2"
							/>
							<!-- <div class="flex items-center mb-4">
                <AppInput
                  v-model="toPutPractice.status"
                  class="w-2/3 md:w-1/2 mr-2"
                  :type="'select'"
                  :name="'status'"
                  :label="'Status'"
                  :placeholder="'Select...'"
                  :items="practiceStatusChoices"
                />
                <span
                  class="tool"
                  data-tip="Practice Status cannot be set to 'Active' until the Practice is Verified at least once, since the day it was created."
                  tabindex="1"
                >
                  <svgicon name="info" width="21" height="21" color="white transparent black" />
                </span>
							</div>-->
							<!-- <AppDate
                v-if="toPutPractice.status === 'Active'"
                v-model="toPutPractice.actived_until"
                :name="'actived_until'"
                :label="'Active Until'"
                is-after
                @blur="CheckEmptyField(toPutPractice.actived_until,'actived_until')"
							/>-->

							<AppButton :label="'Save'" @click="toPutPracticeInfo(practice.id,toPutPractice)" />
						</div>

						<!-- VIEW PRACTICE STATUS -->
						<div class="flex flex-wrap justify-between items-center">
							<div class="flex flex-row">
								<span class="text-lg mr-2 font-bold">Practice Status</span>
								<span
									class="tool"
									data-tip="
                    Manual status control will only work when verification requirements are already completed (Documents and Rates).
                    Status cannot be set to 'Active' until the Practice is Verified at least once, since the day it was created
                  "
									tabindex="1"
								>
									<svgicon name="info" width="21" height="21" color="white transparent black" class="ml-2" />
								</span>
							</div>

							<AppButton
								v-if="authAdminPermissions.includes('Edit Practice Other Information')"
								:label="toEditPracticeStatus ? 'Cancel Editing' : 'Edit'"
								@click="editPracticeStatus()"
							/>
						</div>
						<div v-if="!toEditPracticeStatus" class="flex flex-col mb-2">
							<div class="flex flex-row m-2">
								<span class="text-gray-300 mr-2 font-bold">Status:</span>
								<span
									class="text-white px-4 py-1 rounded-lg"
									:class="practice.status == 'Active' ? 'bg-green-500' : 'bg-red-500'"
								>{{ practice.status }}</span>
							</div>
							<div class="m-2">
								<template v-if="practice.status === 'Active'">
									<p class="text-gray-300 font-bold">Active Until</p>
									<p
										class="flex md:mx-2 mb-2"
									>{{ practice && practice.actived_until ? $moment(practice.actived_until, 'YYYY-MM-DD[T]').utc().format('DD/MM/YYYY') : 'N/A' }}</p>
								</template>
							</div>
						</div>
						<!-- EDITING PRACTICE STATUS -->
						<div v-if="toEditPracticeStatus" class="flex flex-col mb-4">
							<div class="flex">
								<AppInput
									v-model="toPutPractice.status"
									class="w-2/3 md:w-1/2 mr-2"
									:type="'select'"
									:name="'status'"
									:label="'Status'"
									:placeholder="'Select...'"
									:items="practiceStatusChoices"
								/>
							</div>

							<div>
								<AppDate
									v-if="toPutPractice.status === 'Active'"
									v-model="toPutPractice.actived_until"
									:name="'actived_until'"
									:label="'Active Until'"
									is-after
									@blur="CheckEmptyField(toPutPractice.actived_until,'actived_until')"
								/>
							</div>

							<div>
								<AppButton :label="'Change'" @click="toPutPracticeInfo(practice.id,toPutPractice)" />
							</div>
						</div>

						<!-- VIEW PRACTICE TYPE -->
						<div class="flex flex-wrap justify-between items-center">
							<span class="text-lg mr-2 font-bold">Practice Type</span>

							<AppButton
								v-if="authAdminPermissions.includes('Edit Practice Other Information')"
								:label="toEditPracticeType ? 'Cancel Editing' : 'Edit'"
								@click="editPracticeType()"
							/>
						</div>

						<div v-if="!toEditPracticeType">
							<span>Practice Type:</span>

							<span
								class="inline-flex px-4 py-1 mr-2 mb-1 rounded-lg text-sm md:px-2"
								:class="practiceTypeStyle(practice.type)"
							>{{ practice.type }}</span>

							<span
								v-if="practice.type === 'Hub' && practice.hub_type === 'Type 2'"
								class="inline-flex px-4 py-1 mr-2 mb-1 rounded-lg text-sm md:px-2"
								:class="practiceTypeStyle(practice.hub_type)"
							>{{ practice.hub_type === 'Type 2' ? 'Health Board' : null }}</span>
						</div>

						<!-- EDIT PRACTICE TYPE -->
						<div v-if="toEditPracticeType && authAdminPermissions.includes('Change Practice Type')">
							<AppInput
								v-model="toPutPracticeType.type"
								:type="'select'"
								:name="'type'"
								:label="'Change Practice Type'"
								:placeholder="'Select...'"
								:items="[
                  { label: 'Hub', value: 'Hub' },
                  { label: 'Spoke', value: 'Spoke' },
                  { label: 'Stand Alone', value: 'Stand Alone' }
                ]"
							/>

							<AppInput
								v-if="toPutPracticeType.type === 'Hub'"
								v-model="toPutPracticeType.hub_type"
								:type="'select'"
								:name="'hub_type'"
								:placeholder="'Select...'"
								:items="[
                  { label: 'Type 1', value: 'Type 1' },
                  { label: 'Type 2', value: 'Type 2' },
                ]"
							/>

							<AppButton :label="'Change'" @click="toChangePracticeType(practice.id,toPutPracticeType)" />
						</div>
					</div>
				</div>
			</form>

			<!-- TOOLTIPS FOR VERIFICATION -->
			<div
				v-if="practice.status === 'Inactive' || practice.sage_ref === null"
				class="order-1 lg:order-2 bg-waterloo rounded-lg px-2 py-4 my-1 lg:my-0 lg:mx-2 w-full lg:w-2/6 text-white text-sm"
			>
				<div v-if="practice.status === 'Inactive'">
					<!-- Title -->
					<div class="flex items-center font-bold">
						<svgicon name="idea" color="yellow black" width="32" height="32" />

						<div class="px-2 leading-none">
							<p class="text-base">Practice Verification</p>

							<p class="font-normal italic text-xs">Hover on item to for more instruction</p>
						</div>
					</div>
					<!-- Content -->
					<div class="px-1 py-4">
						<ul>
							<p v-if="practice.status !== 'Active'" class="font-bold">Profile</p>

							<li v-if="practice.manual_status !== 'Active'" class="flex px-2">
								<span class="tool flex" data-tip="Edit Profile and set the status to active." tabindex="1">
									<span class="hover:font-bold">Practice must be set to active.</span>
								</span>
							</li>

							<li
								v-if="practice.manual_status === 'Active' && practice.past_actived_until"
								class="flex px-2"
							>
								<span
									class="tool flex"
									data-tip="Edit Profile and change practice active until."
									tabindex="1"
								>
									<span class="hover:font-bold">Practice expires.</span>
								</span>
							</li>

							<p v-if="!practice.has_active_user" class="font-bold mt-2">User</p>

							<li v-if="!practice.has_active_user" class="flex px-2">
								<span class="tool flex" data-tip="This must be done by the user." tabindex="1">
									<span class="hover:font-bold">The user must verify his account via email verification.</span>
								</span>
							</li>

							<template v-if="practice && !practice.complete_document">
								<p class="font-bold mt-2">Documents</p>

								<li class="flex px-2">
									<span
										class="tool flex"
										data-tip="Go to Documents Tab and upload the documents specified below."
										tabindex="1"
									>
										<span class="hover:font-bold">Documents must be filled out.</span>
									</span>
								</li>

								<ul class="px-8">
									<li v-if="practice && !practice.has_agreement_document">Agreement</li>

									<li v-if="practice && !practice.has_direct_debit_document">Direct Debit</li>
								</ul>
							</template>

							<template v-if="practice && !practice.complete_rate">
								<p class="font-bold mt-2">Rates</p>

								<li class="flex px-2">
									<span class="tool flex" data-tip="Go to Rates Tab and fill all fields." tabindex="1">
										<span class="hover:font-bold">Rates must be filled out.</span>
									</span>
								</li>
							</template>
						</ul>
					</div>
				</div>
				<div v-if="practice.sage_ref === null">
					<div class="flex items-center font-bold">
						<svgicon name="idea" color="yellow black" width="32" height="32" />

						<div class="px-2 leading-none">
							<p class="text-base">HUBZZ Billing Requirements</p>

							<p class="font-normal italic text-xs">Hover on item to for more instruction</p>
						</div>
					</div>
					<div class="px-1 py-4">
						<ul>
							<p class="font-bold">Other Information</p>
							<li class="flex px-2">
								<span
									class="tool flex"
									data-tip="Click 'Edit' on the Other Information section in profile, then add the practice's SAGE Reference "
									tabindex="1"
								>
									<span class="hover:font-bold">SAGE Reference is Required</span>
								</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>

		<transition name="fade" mode="in-out">
			<div v-if="confirm" class="shield" @click="confirm=false" />
		</transition>
	</div>
</template>

<script>
import AppDate from "@/components/Base/AppDate";
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppConfirm from "@/components/Base/AppConfirm";

export default {
	components: {
		AppDate,
		AppInput,
		AppButton,
		AppConfirm
	},

	props: {
		practice: {
			type: Object,
			default: () => null
		},

		professionComplianceCategories: {
			type: Array,
			default: () => []
		}
	},

	data() {
		return {
			practiceStatusChoices: [],

			toBogus: false,
			toPutPractice: {
				direct_debit: this.practice.direct_debit,
				sage_ref: this.practice.sage_ref,
				// nominal_code: this.practice.nominal_code,
				phone_number: this.practice.phone_number,
				report_to: this.practice.report_to,
				extra_information: this.practice.extra_information,
				status: this.practice.status,
				actived_until: this.practice.actived_until
			},

			toEdit: false,
			toEditPracticeType: false,
			toPutPracticeType: {
				type: this.practice.type,
				hub_type: this.practice.hub_type
			},

			toEditPracticeStatus: false,
			toPutPracticeStatus: {
				status: this.practice.status
			},

			confirm: false
		};
	},

	computed: {
		authAdminPermissions() {
			return this.$store.getters["permissions"];
		}
	},

	async mounted() {
		if (
			this.practice.complete_rate &&
			this.practice.complete_document &&
			this.practice.has_active_user &&
			(this.practice.sage_ref || this.toPutPractice.sage_ref !== null)
		) {
			this.practiceStatusChoices = [
				{ label: "Active", value: "Active" },
				{ label: "Inactive", value: "Inactive" },
				{ label: "Account Suspension", value: "Account Suspension" }
			];
		} else {
			this.toBogus = true;
			this.practiceStatusChoices = [
				{ label: "Inactive", value: "Inactive" },
				{ label: "Account Suspension", value: "Account Suspension" }
			];
		}
		console.log("practice", this.practice);
	},

	methods: {
		getQuery() {
			const query = {
				...this.$route.query
			};
			const offset = parseInt(query.page) * 8 - 8;
			return offset;
		},

		async toPutPracticeInfo(practiceID) {
			try {
				if (!this.practice.complete_document || !this.practice.complete_rate) {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: "Upload practice documents and set the practice rates first."
					});
				} else if (
					this.practice.status !== this.toPutPractice.status &&
					this.toPutPractice.status === "Active" &&
					!this.toPutPractice.actived_until
				) {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: "Actived Until is Required"
					});
				} else {
					await this.$axios
						.put(`/api/v1/admin/practices/${practiceID}`, this.toPutPractice)
						.then(response => {
							const practice = response.data.data.practice;

							this.$store.commit("SET_NOTIFICATION", {
								enabled: true,
								status: "success",
								text: "Saved"
							});

							this.$emit("practiceUpdated", practice);

							if (
								practice.complete_rate &&
								practice.complete_document &&
								practice.has_active_user &&
								practice.sage_ref
							) {
								this.practiceStatusChoices = [
									{ label: "Active", value: "Active" },
									{ label: "Inactive", value: "Inactive" },
									{ label: "Account Suspension", value: "Account Suspension" }
								];
							} else {
								this.toBogus = true;
								this.practiceStatusChoices = [
									{ label: "Inactive", value: "Inactive" },
									{ label: "Account Suspension", value: "Account Suspension" }
								];
							}

							this.toEdit = false;
							this.toEditPracticeStatus = false;
						});
				}
			} catch (err) {
				this.$store.commit("SET_NOTIFICATION", {
					enabled: true,
					status: "danger",
					text: err.response.data.message
				});
				console.log("put locum profile info error", err.message);
			}
		},

		async toChangePracticeType(practiceID) {
			await this.$axios
				.put(
					`/api/v1/admin/practices/${practiceID}/practice-type`,
					this.toPutPracticeType
				)
				.then(response => {
					const practice = response.data.data.practice;

					this.$emit("practiceUpdated", practice);

					this.toEdit = false;

					this.toEditPracticeType = false;

					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "Saved"
					});
				})
				.catch(err => {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: err.response.data.message
					});
				});
		},

		async toMarkBogus() {
			await this.$axios
				.put(`/api/v1/admin/practices/${this.practice.id}/bogus`)
				.then(response => {
					const practice = response.data.data.practice;

					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "Practice Successfully Marked as Bogus"
					});

					this.$emit("practiceUpdated", practice);

					this.confirm = false;
				})
				.catch(err => {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: err.response.data.message
					});
				});
		},

		async toUnmarkBogus() {
			await this.$axios
				.put(`/api/v1/admin/practices/${this.practice.id}/unbogus`)
				.then(response => {
					const practice = response.data.data.practice;

					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "Practice Successfully Unmarked Bogus"
					});

					this.$emit("practiceUpdated", practice);

					this.confirm = false;
				})
				.catch(err => {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: err.response.data.message
					});
				});
		},

		async toDeactivate() {
			await this.$axios
				.put(`/api/v1/admin/practices/${this.practice.id}/deactivate`)
				.then(response => {
					const practice = response.data.data.practice;

					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "Practice Successfully Deactivated"
					});

					this.$emit("practiceUpdated", practice);

					this.confirm = false;

					this.$router.push("/practices/deactivated-practices");
				})
				.catch(err => {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: err.response.data.message
					});
				});
		},

		practiceTypeStyle(type) {
			switch (type) {
				case "Stand Alone":
					return "bg-indigo-500 text-white lg:px-4 sm:px-2";
				case "Hub":
					return "bg-red-500 text-white lg:px-8 sm:px-2";
				case "Spoke":
					return "bg-blue-500 text-white lg:px-8 sm:px-2";
				case "Type 2":
					return "bg-purple-500 text-white lg:px-8 sm:px-2";
				default:
			}
		},

		edit() {
			this.toEdit = !this.toEdit;
			if (this.toEdit) {
				this.toPutPractice.phone_number = this.practice.phone_number;
				this.toPutPractice.report_to = this.practice.report_to;
				this.toPutPractice.extra_information = this.practice.extra_information;
				this.toPutPractice.status = this.practice.status;
				this.toPutPractice.actived_until = this.practice.actived_until;
			}
		},

		editPracticeStatus() {
			this.toEditPracticeStatus = !this.toEditPracticeStatus;
			if (this.toEditPracticeStatus) {
				this.toPutPracticeStatus = this.practice.status;
			}
		},

		editPracticeType() {
			this.toEditPracticeType = !this.toEditPracticeType;
			if (this.toEditPracticeType) {
				this.toPutPracticeType.type = this.practice.type;
				this.toPutPracticeType.hub_type = this.practice.hub_type;
			}
		}
	}
};
</script>

<style>
.shield {
	z-index: 511;
}
</style>
