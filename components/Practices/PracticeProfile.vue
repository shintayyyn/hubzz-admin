<template>
  <div class="flex flex-col rounded-lg">
    <div class="flex flex-col lg:flex-row">
      <form class="order-2 lg:order-1 flex flex-col  p-4 my-1 lg:my-0 border rounded-lg w-full" @submit.prevent>
        <div class="flex flex-wrap">
          <!-- VIEW PRIMARY INFORMATION -->
          <div class="w-full md:w-1/3 text-gray-800 text-sm">
            <p class="flex font-bold">
              Practice ID
            </p>
            <p class="mx-2">
              {{ practice.id }}
            </p>

            <p class="flex font-bold">
              Practice Name
            </p>
            <p class="flex flex-wrap items-center  text-sm mb-2 md:px-2">
              <span class="mr-2">{{ practice.name }}</span>
              <span class="inline-flex px-4 py-1 mr-2 mb-1 rounded-lg text-sm md:px-2" :class="practiceTypeStyle(practice.type)">{{
                practice.type
              }}</span>
              <span
                v-if="practice.type === 'Hub' && practice.hub_type === 'Type 2'"
                class="inline-flex px-4 py-1 mr-2 mb-1 rounded-lg text-sm md:px-2"
                :class="practiceTypeStyle(practice.hub_type)"
                >'Health Board'</span
              >
            </p>

            <p class="flex font-bold">
              Practice Code
            </p>
            <p class="flex  text-sm md:px-2 mb-2">
              {{ practice.code }}
            </p>

            <p class="flex font-bold">
              Post Code
            </p>
            <p class="flex  text-sm md:px-2 mb-2">
              {{ practice.postcode }}
            </p>

            <p class="flex font-bold">
              Address
            </p>
            <p class="flex flex-col  text-sm md:px-2 mb-2">
              <span v-if="practice.address_line_1">{{ practice.address_line_1 }}</span>
              <span v-if="practice.address_line_2">{{ practice.address_line_2 }}</span>
              <span v-if="practice.address_line_3">{{ practice.address_line_3 }}</span>
              <span v-if="practice.address_line_4">{{ practice.address_line_4 }}</span>
              <span v-if="practice.address_line_5">{{ practice.address_line_5 }}</span>
            </p>

            <p class="flex font-bold">
              CCG
            </p>
            <p class="flex  text-sm md:px-2 mb-2">
              {{ practice.clinical_commissioning_group_name }}
            </p>

            <p class="flex font-bold">
              Practice Types
            </p>

            <div v-if="practice.practice_types && practice.practice_types.length > 0" class="flex flex-wrap mb-2">
              <p
                v-for="practiceType in practice.practice_types"
                :key="practiceType.id"
                class="inline-flex px-4 py-1 mr-2 mb-1 rounded-lg text-sm text-black md:px-2 bg-sunglow"
              >
                {{ practiceType.name }}
              </p>
            </div>

            <div v-if="practice.practice_types && practice.practice_types.length === 0">
              <p class="flex  text-sm md:px-2 mb-2">
                Not set
              </p>
            </div>

            <template
              v-if="
                practice.practice_profession_compliance_category_compliance_documents &&
                  practice.practice_profession_compliance_category_compliance_documents.length > 0
              "
            >
              <div v-for="professionComplianceCategory in professionComplianceCategories" :key="professionComplianceCategory.id" class="mb-4">
                <p class="flex font-bold">Compliance Requirements for {{ professionComplianceCategory.name }}:</p>

                <div
                  v-for="referenceComplianceDocument in professionComplianceCategory.reference_compliance_documents.filter(
                    referenceComplianceDocument => {
                      return practice.practice_profession_compliance_category_compliance_documents.some(
                        practiceProfessionComplianceCategoryComplianceDocument => {
                          return (
                            practiceProfessionComplianceCategoryComplianceDocument.compliance_document_id === referenceComplianceDocument.id &&
                            practiceProfessionComplianceCategoryComplianceDocument.profession_compliance_category_id ===
                              professionComplianceCategory.id
                          )
                        }
                      )
                    }
                  )"
                  :key="referenceComplianceDocument.id"
                  class=" text-sm m-1 mb-2"
                >
                  <span>{{ referenceComplianceDocument.name }}</span>
                </div>

                <div
                  v-for="mandatoryComplianceDocument in professionComplianceCategory.mandatory_compliance_documents"
                  :key="mandatoryComplianceDocument.id"
                >
                  <div
                    v-if="
                      mandatoryComplianceDocument.compliance_document_type_name !== 'Safeguarding' &&
                        practice.practice_profession_compliance_category_compliance_documents.some(
                          practiceProfessionComplianceCategoryComplianceDocument => {
                            return (
                              practiceProfessionComplianceCategoryComplianceDocument.compliance_document_id === mandatoryComplianceDocument.id &&
                              practiceProfessionComplianceCategoryComplianceDocument.profession_compliance_category_id ===
                                professionComplianceCategory.id
                            )
                          }
                        )
                    "
                    class=" text-sm m-1 mb-2"
                  >
                    <span>{{ mandatoryComplianceDocument.name }}</span>
                  </div>
                  <template
                    v-if="
                      mandatoryComplianceDocument.compliance_document_type_name === 'Safeguarding' &&
                        practice.practice_profession_compliance_category_compliance_documents.some(
                          practiceProfessionComplianceCategoryComplianceDocument => {
                            return (
                              practiceProfessionComplianceCategoryComplianceDocument.compliance_document_id === childComplianceDocument.id &&
                              practiceProfessionComplianceCategoryComplianceDocument.profession_compliance_category_id ===
                                professionComplianceCategory.id
                            )
                          }
                        )
                    "
                  >
                    <div
                      v-for="childComplianceDocument in mandatoryComplianceDocument.child_compliance_documents"
                      :key="childComplianceDocument.id"
                      class=" text-sm m-1 mb-2"
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
                      optionalComplianceDocument.compliance_document_type_name !== 'Safeguarding' &&
                        practice.practice_profession_compliance_category_compliance_documents.some(
                          practiceProfessionComplianceCategoryComplianceDocument => {
                            return (
                              practiceProfessionComplianceCategoryComplianceDocument.compliance_document_id === optionalComplianceDocument.id &&
                              practiceProfessionComplianceCategoryComplianceDocument.profession_compliance_category_id ===
                                professionComplianceCategory.id
                            )
                          }
                        )
                    "
                    class=" text-sm m-1 mb-2"
                  >
                    <span>{{ optionalComplianceDocument.name }}</span>
                  </div>
                  <template
                    v-if="
                      optionalComplianceDocument.compliance_document_type_name === 'Safeguarding' &&
                        practice.practice_profession_compliance_category_compliance_documents.some(
                          practiceProfessionComplianceCategoryComplianceDocument => {
                            return (
                              practiceProfessionComplianceCategoryComplianceDocument.compliance_document_id === childComplianceDocument.id &&
                              practiceProfessionComplianceCategoryComplianceDocument.profession_compliance_category_id ===
                                professionComplianceCategory.id
                            )
                          }
                        )
                    "
                  >
                    <div
                      v-for="childComplianceDocument in optionalComplianceDocument.child_compliance_documents"
                      :key="childComplianceDocument.id"
                      class=" text-sm m-1 mb-2"
                    >
                      <span>{{ childComplianceDocument.name }}</span>
                    </div>
                  </template>
                </div>
              </div>
            </template>

            <div v-if="practice.mandatory_trainings && practice.mandatory_trainings.length > 0">
              <p class="flex font-bold">
                Mandatory Trainings
              </p>

              <div v-for="mandatoryTraining in practice.mandatory_trainings" :key="mandatoryTraining.id" class=" text-sm m-1 mb-2">
                <span>{{ mandatoryTraining.name }}</span>
              </div>
            </div>

            <div
              v-if="
                practice.practice_profession_compliance_category_compliance_documents &&
                  practice.practice_profession_compliance_category_compliance_documents.length === 0
              "
            >
              <p class="flex  md:text-base py-2 font-bold leading-tight">
                <span>Compliance Documents is not yet set up by the Practice Hub.</span>
              </p>
            </div>
          </div>

          <!-- VIEW / EDIT OTHER INFORMATION / PRACTICE TYPE -->
          <div v-if="practice.status !== 'Deleted'" class="w-full flex flex-col md:flex-row text-sm  md:w-2/3">
            <div class="md:w-1/2">
              <div class="flex flex-wrap justify-between items-center">
                <span class="text-lg mr-2 font-bold">Invoicing Details</span>
              </div>

              <div>
                <p class="flex text-gray-800 font-bold">
                  VAT Registered
                </p>

                <p class="flex  text-sm md:px-2 mb-2">
                  {{ practice.vat_registered ? 'Yes' : 'No' }}
                </p>

                <template v-if="practice.vat_registered">
                  <p class="flex font-bold">
                    Vat Number
                  </p>

                  <p class="flex  text-sm md:px-2 mb-2">
                    {{ practice.vat_number ? practice.vat_number : 'N/A' }}
                  </p>

                  <p class="flex font-bold">
                    Tax Year End Date
                  </p>

                  <p class="flex  text-sm md:px-2 mb-2">
                    {{ practice.tax_year_end_date ? $moment(practice.tax_year_end_date, 'YYYY-MM-DD').format('DD/MM/YYYY') : 'N/A' }}
                  </p>
                </template>

                <p class="flex text-gray-800 font-bold">
                  Bank Details
                </p>

                <div class="ml-2">
                  <p class="flex text-gray-800 font-bold">
                    Account name
                  </p>

                  <p class="flex md:mx-2 mb-2">
                    {{ practice && practice.account_name ? practice.account_name : 'N/A' }}
                  </p>

                  <p class="flex text-gray-800 font-bold">
                    Bank name
                  </p>

                  <p class="flex md:mx-2 mb-2">
                    {{ practice && practice.bank_name ? practice.bank_name : 'N/A' }}
                  </p>

                  <p class="flex text-gray-800 font-bold">
                    Sort code
                  </p>

                  <p class="flex md:mx-2 mb-2">
                    {{ practice && practice.sort_code ? practice.sort_code : 'N/A' }}
                  </p>

                  <p class="flex text-gray-800 font-bold">
                    Account number
                  </p>

                  <p class="flex md:mx-2 mb-2">
                    {{ practice && practice.account_number ? practice.account_number : 'N/A' }}
                  </p>
                </div>
              </div>
            </div>
            <div class="md:w-1/2">
              <div class="flex flex-wrap justify-between items-center">
                <span class="text-lg mr-2 font-bold">Other Information</span>
                <AppButton v-if="canEditPracticeOtherInformation" :label="toEdit ? 'Cancel Editing' : 'Edit'" @click="edit()" />
              </div>
              <!-- VIEWING OTHER INFORMATION -->
              <div v-if="!toEdit">
                <template v-if="practice.direct_debit">
                  <p class="flex font-bold">
                    Sage reference
                  </p>
                  <p class="flex  text-sm md:px-2 mb-2">
                    {{ practice.sage_ref ? practice.sage_ref : 'N/A' }}
                  </p>
                </template>
                <p class="flex text-gray-800 font-bold">
                  Phone Number
                </p>
                <p class="flex md:mx-2 mb-2">
                  {{ practice && practice.phone_number ? practice.phone_number : 'N/A' }}
                </p>
                <p class="flex text-gray-800 font-bold">
                  Full name to report to
                </p>
                <p class="flex md:mx-2 mb-2">
                  {{ practice && practice.report_to ? practice.report_to : 'N/A' }}
                </p>
                <p class="flex text-gray-800 font-bold">
                  Extra information (Parking restrictions, transport links, etc.)
                </p>
                <p class="flex md:mx-2 mb-2">
                  {{ practice && practice.extra_information ? practice.extra_information : 'N/A' }}
                </p>
                <!-- <div class="flex items-center mb-2">
                  <span class="text-gray-800 mr-2 font-bold">Status:</span>
                  <span
                    class=" px-4 py-1 rounded-lg"
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
                  <p class="text-gray-800 font-bold">
                    Active Until
                  </p>
                  <p
                    class="flex md:mx-2 mb-2"
                  >
                    {{ practice && practice.actived_until ? $moment(practice.actived_until, 'YYYY-MM-DD[T]').utc().format('DD/MM/YYYY') : 'N/A' }}
                  </p>
                </template>-->

                <div v-if="hasPendingDeleteRequest" class="flex justify-center">
                  <span>Requested to delete practice on {{ practice.practice_delete_requested_at_formatted }}</span>
                </div>

                <div class="flex flex-wrap items-center md:mb-2">
                  <AppButton
                    label="Delete this Practice"
                    class="m-1"
                    :disabled="!canEditPracticeOtherInformation"
                    @click="showDeletePracticeModal = true"
                  />

                  <AppButton
                    v-if="hasPendingDeleteRequest"
                    label="Reject Delete Request"
                    class="m-1"
                    :disabled="!canEditPracticeOtherInformation"
                    @click="showRejectDeletePracticeModal = true"
                  />

                  <AppButton
                    v-if="!isDeactivatedPractice"
                    label="Deactivate this Practice"
                    class="m-1"
                    :disabled="!canEditPracticeOtherInformation"
                    @click="showDeactivatePracticeModal = true"
                  />

                  <AppButton
                    v-if="isDeactivatedPractice"
                    label="Reactivate this Practice"
                    class="m-1"
                    :disabled="!canEditPracticeOtherInformation"
                    @click="showReactivatePracticeModal = true"
                  />

                  <template v-if="isNotDeactivatedDeletedPractice">
                    <button
                      v-if="canMarkBogus"
                      class="m-1 text-sm text-white text-center rounded-lg bg-red-600 hover:bg-red-700 px-4 py-1 cursor-pointer transition-hover"
                      @click="toMarkBogus()"
                    >
                      Mark as Bogus
                    </button>

                    <button
                      v-if="practice.status === 'Bogus'"
                      class="m-1 text-sm text-white text-center rounded-lg bg-yellow-600 hover:bg-yellow-700 px-4 py-1 cursor-pointer transition-hover"
                      @click="toUnmarkBogus()"
                    >
                      Remove Bogus Status
                    </button>
                  </template>
                </div>
              </div>

              <!-- EDITING OTHER INFORMATION -->
              <div v-if="toEdit && canEditPracticeOtherInformation">
                <template v-if="['true', true].includes(toPutPractice.direct_debit)">
                  <AppInput v-model="toPutPractice.sage_ref" :type="'text'" :name="'sage_ref'" :label="'Sage reference'" />
                </template>
                <AppInput v-model="toPutPractice.phone_number" :type="'text'" :name="'phonenumber'" :label="'Phone Number'" />
                <AppInput v-model="toPutPractice.report_to" :type="'text'" :name="'report_to'" :label="'Full name to report to'" />
                <AppInput
                  v-model="toPutPractice.extra_information"
                  :type="'textarea'"
                  :name="'practiceNote'"
                  :label="'Extra information (Parking restrictions, transport links, etc.)'"
                  :resize="false"
                  :rows="2"
                />
                <AppButton :label="'Save'" @click="toPutPracticeInfo" />
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
                    <svgicon name="info" width="21" height="21" color="#aaa transparent white" class="ml-2" />
                  </span>
                </div>

                <AppButton
                  v-if="canEditPracticeOtherInformation"
                  :label="toEditPracticeStatus ? 'Cancel Editing' : 'Edit'"
                  :disabled="isDormant"
                  @click="editPracticeStatus()"
                />
              </div>
              <div v-if="!toEditPracticeStatus" class="flex flex-col mb-2">
                <div class="flex flex-row items-center m-2">
                  <span class="text-gray-800 mr-2 font-bold">Status:</span>
                  <span class=" px-4 py-1 rounded-lg" :class="practice.status == 'Active' ? 'bg-green-500' : 'bg-red-600 text-white'">{{
                    practice.status
                  }}</span>
                </div>
                <div class="m-2">
                  <template v-if="practice.status === 'Active'">
                    <p class="text-gray-800 font-bold">
                      Active Until
                    </p>
                    <p class="flex md:mx-2 mb-2">
                      {{
                        practice && practice.actived_until
                          ? $moment(practice.actived_until, 'YYYY-MM-DD[T]')
                              .utc()
                              .format('DD/MM/YYYY')
                          : 'N/A'
                      }}
                    </p>
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
                    @blur="CheckEmptyField(toPutPractice.actived_until, 'actived_until')"
                  />
                </div>

                <div>
                  <AppButton
                    v-if="canEditPracticeOtherInformation"
                    :label="toEditPracticeStatus ? 'Cancel Editing' : 'Edit'"
                    @click="editPracticeStatus()"
                  />
                </div>
              </div>

              <!-- VIEW PRACTICE TYPE -->
              <div class="flex flex-wrap justify-between items-center">
                <span class="text-lg mr-2 font-bold">Practice Type</span>

                <AppButton
                  v-if="canEditPracticeOtherInformation"
                  :label="toEditPracticeType ? 'Cancel Editing' : 'Edit'"
                  @click="editPracticeType()"
                />
              </div>

              <div v-if="!toEditPracticeType">
                <span>Practice Type:</span>

                <span class="inline-flex px-4 py-1 mr-2 mb-1 rounded-lg text-sm md:px-2" :class="practiceTypeStyle(practice.type)">{{
                  practice.type
                }}</span>

                <span
                  v-if="practice.type === 'Hub' && practice.hub_type === 'Type 2'"
                  class="inline-flex px-4 py-1 mr-2 mb-1 rounded-lg text-sm md:px-2"
                  :class="practiceTypeStyle(practice.hub_type)"
                  >{{ practice.hub_type === 'Type 2' ? 'Health Board' : null }}</span
                >
              </div>

              <!-- EDIT PRACTICE TYPE -->
              <div v-if="toEditPracticeType && canChangePracticeType">
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
                    { label: 'Type 2', value: 'Type 2' }
                  ]"
                />

                <AppButton :label="'Change'" @click="toChangePracticeType(practice.id, toPutPracticeType)" />
              </div>

              <!-- HUBZZ PRACTICE NOTES -->
              <div class="">
                <AppInput v-model="hubzzPracticeNotes" :type="'textarea'" :name="'hubzz_practice_notes'" :label="'Notes'" :resize="false" :rows="4" />
                <AppButton :label="'Save Notes'" class="mx-1" @click="toPutPracticeNotes" />
              </div>
            </div>
          </div>
        </div>
      </form>

      <!-- TOOLTIPS FOR VERIFICATION -->
      <div
        v-if="practice.status === 'Inactive' || (!practice.sage_ref && !['Deleted', 'Deactivated'].includes(practice.status))"
        class="order-1 lg:order-2  rounded-lg px-2 lg:py-4 my-1 lg:my-0 lg:mx-2 w-full lg:w-2/6  text-sm"
      >
        <div v-if="practice.status === 'Inactive'">
          <!-- Title -->
          <div class="flex items-center font-bold">
            <svgicon name="idea" color="yellow black" width="32" height="32" />

            <div class="px-2 leading-none">
              <p class="text-base">
                Practice Verification
              </p>

              <p class="font-normal italic text-xs">
                Hover on item to for more instruction
              </p>
            </div>
          </div>
          <!-- Content -->
          <div class="px-1 py-4">
            <ul>
              <p v-if="practice.status !== 'Active'" class="font-bold">
                Profile
              </p>

              <li v-if="practice.manual_status !== 'Active'" class="flex px-2">
                <span class="tool flex" data-tip="Edit Profile and set the status to active." tabindex="1">
                  <span class="hover:font-bold">Practice must be set to active.</span>
                </span>
              </li>

              <li v-if="practice.manual_status === 'Active' && practice.past_actived_until" class="flex px-2">
                <span class="tool flex" data-tip="Edit Profile and change practice active until." tabindex="1">
                  <span class="hover:font-bold">Practice expires.</span>
                </span>
              </li>

              <p v-if="!practice.has_active_user" class="font-bold mt-2">
                User
              </p>

              <li v-if="!practice.has_active_user" class="flex px-2">
                <span class="tool flex" data-tip="This must be done by the user." tabindex="1">
                  <span class="hover:font-bold">The user must verify his account via email verification.</span>
                </span>
              </li>

              <template v-if="practice && !practice.complete_document">
                <p class="font-bold mt-2">
                  Documents
                </p>

                <li class="flex px-2">
                  <span class="tool flex" data-tip="Go to Documents Tab and upload the documents specified below." tabindex="1">
                    <span class="hover:font-bold">Documents must be filled out.</span>
                  </span>
                </li>

                <ul class="px-8">
                  <li v-if="practice && !practice.has_agreement_document">
                    Agreement
                  </li>

                  <li v-if="practice && !practice.has_direct_debit_document">
                    Direct Debit
                  </li>
                </ul>
              </template>

              <template v-if="practice && !practice.complete_rate">
                <p class="font-bold mt-2">
                  Rates
                </p>

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
              <p class="text-base">
                HUBZZ Billing Requirements
              </p>

              <p class="font-normal italic text-xs">
                Hover on item to for more instruction
              </p>
            </div>
          </div>
          <div class="px-1 py-4">
            <ul>
              <p class="font-bold">
                Other Information
              </p>
              <li class="flex px-2">
                <span
                  class="tool flex text-center"
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

    <transition name="drop" mode="in-out">
      <AppConfirm
        v-if="showDeletePracticeModal"
        :message="deletingPractice ? 'Deleting practice...' : 'Are you sure you want to delete this practice?'"
        :loading="deletingPractice"
        @cancel="showDeletePracticeModal = false"
        @confirm="deletePractice()"
      />
    </transition>

    <transition name="drop" mode="in-out">
      <AppConfirm
        v-if="showRejectDeletePracticeModal"
        :message="rejectingDeletePractice ? 'Rejecting request...' : 'Are you sure you want to reject this deletion request?'"
        :loading="rejectingDeletePractice"
        @cancel="showRejectDeletePracticeModal = false"
        @confirm="rejectDeletePractice()"
      />
    </transition>

    <transition name="drop" mode="in-out">
      <AppConfirm
        v-if="showDeactivatePracticeModal"
        :message="deactivatingPractice ? 'Deactivating practice...' : 'Are you sure you want to deactivate this practice?'"
        :loading="deactivatingPractice"
        @cancel="showDeactivatePracticeModal = false"
        @confirm="deactivatePractice()"
      />
    </transition>

    <transition name="drop" mode="in-out">
      <AppConfirm
        v-if="showReactivatePracticeModal"
        :message="reactivatingPractice ? 'Reactivating practice...' : 'Are you sure you want to reactivate this practice?'"
        :loading="reactivatingPractice"
        @cancel="showReactivatePracticeModal = false"
        @confirm="reactivatePractice()"
      />
    </transition>

    <transition name="fade" mode="in-out">
      <div v-if="showDeletePracticeModal" class="shield" @click="showDeletePracticeModal = false" />
    </transition>

    <transition name="fade" mode="in-out">
      <div v-if="showRejectDeletePracticeModal" class="shield" @click="showRejectDeletePracticeModal = false" />
    </transition>

    <transition name="fade" mode="in-out">
      <div v-if="showDeactivatePracticeModal" class="shield" @click="showDeactivatePracticeModal = false" />
    </transition>

    <transition name="fade" mode="in-out">
      <div v-if="showReactivatePracticeModal" class="shield" @click="showReactivatePracticeModal = false" />
    </transition>
  </div>
</template>

<script>
import AppDate from '@/components/Base/AppDate'
import AppInput from '@/components/Base/AppInput'
import AppButton from '@/components/Base/AppButton'
import AppConfirm from '@/components/Base/AppConfirm'

const PRACTICE_SOCKET_EVENTS = [
  'Admin Notification Practice Deactivated',
  'Admin Notification Practice Deactivated By Admin',
  'Admin Notification Practice Reactivated',
  'Admin Notification Practice Reactivated By Admin',
  'Admin Notification Practice Delete Requested',
  'Admin Notification Practice Delete Request Cancelled',
  'Admin Notification Practice Delete Request Rejected',
  'Admin Notification Practice Deleted'
]

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

      toPutPractice: {
        direct_debit: '',
        sage_ref: '',
        phone_number: '',
        report_to: '',
        extra_information: '',
        status: '',
        actived_until: ''
      },

      toEdit: false,
      toEditPracticeType: false,
      toPutPracticeType: {
        type: this.practice.type,
        hub_type: this.practice.hub_type
      },

      toEditPracticeStatus: false,

      hubzzPracticeNotes: '',

      showDeletePracticeModal: false,
      deletingPractice: false,

      showRejectDeletePracticeModal: false,
      rejectingDeletePractice: false,

      showDeactivatePracticeModal: false,
      deactivatingPractice: false,

      showReactivatePracticeModal: false,
      reactivatingPractice: false
    }
  },

  computed: {
    authAdminPermissions() {
      return this.$store.getters['permissions']
    },
    canEditPracticeOtherInformation() {
      return this.authAdminPermissions.includes('Edit Practice Other Information')
    },
    canChangePracticeType() {
      return this.authAdminPermissions.includes('Change Practice Type')
    },
    hasPendingDeleteRequest() {
      return this.practice && this.practice.practice_delete_status === 'Pending'
    },
    isDeactivatedPractice() {
      return this.practice && this.practice.status === 'Deactivated'
    },
    isNotDeactivatedDeletedPractice() {
      return this.practice && this.practice.status !== 'Deactivated' && this.practice.status !== 'Deleted'
    },
    canMarkBogus() {
      return this.practice && !['Bogus', 'Active', 'Dormant'].includes(this.practice.status)
    },
    isDormant() {
      return this.practice?.status === 'Dormant'
    }
  },

  watch: {
    practice() {
      this.setPracticeStatusChoices()
    }
  },

  mounted() {
    this.setPracticeStatusChoices()

    PRACTICE_SOCKET_EVENTS.forEach(eventName => {
      this.$socket.on(eventName, this.emitUpdatePractice)
    })
  },

  destroyed() {
    PRACTICE_SOCKET_EVENTS.forEach(eventName => {
      this.$socket.removeListener(eventName, this.emitUpdatePractice)
    })
  },

  created() {
    this.toPutPractice.direct_debit = this.practice.direct_debit
    this.toPutPractice.sage_ref = this.practice.sage_ref
    this.toPutPractice.phone_number = this.practice.phone_number
    this.toPutPractice.report_to = this.practice.report_to
    this.toPutPractice.extra_information = this.practice.extra_information
    this.toPutPractice.status = this.practice.status
    this.toPutPractice.actived_until = this.practice.actived_until

    this.toPutPracticeType.type = this.practice.type
    this.toPutPracticeType.hub_type = this.practice.hub_type

    this.hubzzPracticeNotes = this.practice.hubzz_practice_notes
  },

  methods: {
    setPracticeStatusChoices() {
      if (
        this.practice &&
        this.practice.complete_rate &&
        this.practice.complete_document &&
        this.practice.has_active_user &&
        this.practice.sage_ref
      ) {
        this.practiceStatusChoices = [
          { label: 'Active', value: 'Active' },
          { label: 'Inactive', value: 'Inactive' },
          { label: 'Account Suspension', value: 'Account Suspension' }
        ]
      } else {
        this.practiceStatusChoices = [
          { label: 'Inactive', value: 'Inactive' },
          { label: 'Account Suspension', value: 'Account Suspension' }
        ]
      }
    },

    emitUpdatePractice({ notification }) {
      if (notification && notification.payload_type === 'practice' && this.practice && notification.payload.id === this.practice.id) {
        this.$emit('practiceUpdated', notification.payload)
      }
    },

    errorHandler(err) {
      let message = null

      if (err.response) {
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
          text: message
        })
      }
    },

    toPutPracticeInfo() {
      if (!this.practice.complete_document || !this.practice.complete_rate) {
        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'danger',
          text: 'Upload practice documents and set the practice rates first.'
        })

        return
      }

      this.toPutPractice.status = this.toPutPractice.status === 'Dormant' ? 'Active' : this.toPutPractice.status

      if (this.practice.status !== this.toPutPractice.status && this.toPutPractice.status === 'Active' && !this.toPutPractice.actived_until) {
        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'danger',
          text: 'Actived Until is Required'
        })

        return
      }

      this.$axios
        .put(`/api/v1/admin/practices/${this.$route.params.id}`, this.toPutPractice)
        .then(response => {
          const practice = response.data.data.practice

          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'success',
            text: 'Saved'
          })

          this.$emit('practiceUpdated', practice)

          this.toEdit = false
          this.toEditPracticeStatus = false
        })
        .catch(this.errorHandler)
    },

    async toChangePracticeType(practiceID) {
      await this.$axios
        .put(`/api/v1/admin/practices/${practiceID}/practice-type`, this.toPutPracticeType)
        .then(response => {
          const practice = response.data.data.practice

          this.$emit('practiceUpdated', practice)

          this.toEdit = false

          this.toEditPracticeType = false

          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'success',
            text: 'Saved'
          })
        })
        .catch(err => {
          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'danger',
            text: err.response.data.message
          })
        })
    },

    toMarkBogus() {
      this.$axios
        .put(`/api/v1/admin/practices/${this.practice.id}/bogus`)
        .then(response => {
          const practice = response.data.data.practice

          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'success',
            text: 'Practice Successfully Marked as Bogus'
          })

          this.$emit('practiceUpdated', practice)
        })
        .catch(err => {
          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'danger',
            text: err.response.data.message
          })
        })
    },

    toUnmarkBogus() {
      this.$axios
        .put(`/api/v1/admin/practices/${this.practice.id}/unbogus`)
        .then(response => {
          const practice = response.data.data.practice

          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'success',
            text: 'Practice Successfully Unmarked Bogus'
          })

          this.$emit('practiceUpdated', practice)
        })
        .catch(err => {
          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'danger',
            text: err.response.data.message
          })
        })
    },

    deletePractice() {
      this.deletingPractice = true
      this.$axios
        .put(`/api/v1/admin/practices/${this.practice.id}/delete`)
        .then(response => {
          const practice = response.data.data.practice

          const message = response.data.message

          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'success',
            text: message || 'Practice Deleted Successfully'
          })

          this.$emit('practiceUpdated', practice)
        })
        .catch(this.errorHandler)
        .finally(() => {
          this.showDeletePracticeModal = false
          this.deletingPractice = false
        })
    },

    rejectDeletePractice() {
      this.rejectingDeletePractice = true
      this.$axios
        .put(`/api/v1/admin/practices/${this.practice.id}/reject-delete-request`)
        .then(response => {
          const practice = response.data.data.practice

          const message = response.data.message

          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'success',
            text: message || 'Delete Request Rejected Successfully'
          })

          this.$emit('practiceUpdated', practice)
        })
        .catch(this.errorHandler)
        .finally(() => {
          this.showRejectDeletePracticeModal = false
          this.rejectingDeletePractice = false
        })
    },

    deactivatePractice() {
      this.deactivatingPractice = true
      this.$axios
        .put(`/api/v1/admin/practices/${this.practice.id}/deactivate`)
        .then(response => {
          const practice = response.data.data.practice

          const message = response.data.message

          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'success',
            text: message || 'Practice Successfully Deactivated'
          })

          this.$emit('practiceUpdated', practice)
        })
        .catch(this.errorHandler)
        .finally(() => {
          this.showDeactivatePracticeModal = false
          this.deactivatingPractice = false
        })
    },

    reactivatePractice() {
      this.reactivatingPractice = true
      this.$axios
        .put(`/api/v1/admin/practices/${this.practice.id}/reactivate`)
        .then(response => {
          const practice = response.data.data.practice

          const message = response.data.message

          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'success',
            text: message || 'Practice Successfully Reactivated'
          })

          this.$emit('practiceUpdated', practice)
        })
        .catch(this.errorHandler)
        .finally(() => {
          this.showReactivatePracticeModal = false
          this.reactivatingPractice = false
        })
    },

    async toPutPracticeNotes() {
      try {
        await this.$axios
          .$put(`/api/v1/admin/practices/${this.$route.params.id}/hubzz-practice-notes`, {
            hubzz_practice_notes: this.hubzzPracticeNotes
          })
          .then(res => {
            this.hubzzPracticeNotes = res.data.practice.hubzz_practice_notes

            const practice = res.data.practice

            this.$emit('practiceUpdated', practice)

            this.$store.commit('SET_NOTIFICATION', {
              enabled: true,
              status: 'success',
              text: res.data.message || 'Saved'
            })
          })
      } catch (err) {
        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'danger',
          text: err.response.data.message
        })
      }
    },

    practiceTypeStyle(type) {
      switch (type) {
        case 'Stand Alone':
          return 'bg-indigo-500 lg:px-4 sm:px-2'
        case 'Hub':
          return 'bg-red-500 text-white lg:px-8 sm:px-2'
        case 'Spoke':
          return 'bg-blue-500 lg:px-8 sm:px-2'
        case 'Type 2':
          return 'bg-purple-500 lg:px-8 sm:px-2'
        default:
      }
    },

    edit() {
      this.toEdit = !this.toEdit
      if (this.toEdit) {
        this.toPutPractice.phone_number = this.practice.phone_number
        this.toPutPractice.report_to = this.practice.report_to
        this.toPutPractice.extra_information = this.practice.extra_information
        this.toPutPractice.status = this.practice.status
        this.toPutPractice.actived_until = this.practice.actived_until
      }
    },

    editPracticeStatus() {
      this.toEditPracticeStatus = !this.toEditPracticeStatus
    },

    editPracticeType() {
      this.toEditPracticeType = !this.toEditPracticeType
      if (this.toEditPracticeType) {
        this.toPutPracticeType.type = this.practice.type
        this.toPutPracticeType.hub_type = this.practice.hub_type
      }
    }
  }
}
</script>

<style>
.shield {
  z-index: 511;
}
</style>
