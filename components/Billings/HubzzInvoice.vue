<template>
  <div class="text-black">
    <!-- HEADER -->
    <div class="flex flex-wrap overflow-hidden md:mx-1 md:pl-3 mb-1 pb-1 text-sm">
      <AppButton
        v-if="forViewing == true"
        class="mr-2"
        :label="'Export As PDF'"
        :icon="'cloud-download'"
        @click="toPDF()"
      />
      <AppButton
        v-if="forViewing == true && practiceInvoice"
        class="mr-2"
        :label="'Export as Sage.csv'"
        :icon="'cloud-download'"
        :disabled="practice && practice.sage_ref && practice.direct_debit ? false : true"
        @click="toSageCSV()"
      />
      <div
        v-if="practice && practiceInvoice && practiceInvoice.exported_at"
        class="text-white m-2"
      >
        *This Invoice has already been exported on {{ $moment(practiceInvoice.exported_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').utc().format('DD/MM/YYYY, h:mm:ss a') }}
      </div>

      <!-- <AppButton
        v-if="forViewing == false"
        class="m-2" 
        :label="'Save as Draft'" 
        :icon="'save-icon'"
			/>-->
      <!-- <AppButton
        v-if="forViewing == false"
        class="m-2" 
        :label="'Clear Entries'" 
        :icon="'save-icon'"
        @click="clearEntries()"
			/>-->
    </div>
    <div
      v-if="practice && practiceInvoice && practice.direct_debit === false"
      class="text-white mx-4 mb-2"
    >
      *Assign a SAGE Reference Number to this Practice to proceed with the file export.
    </div>
    
    <!-- HEADER ENDS HERE -->
    <div v-if="forViewing == false">
      <div class="text-white font-bold text-xl mx-4">
        For the Period
      </div>
      <div class="w-full flex flex-col items-start md:flex-row md:items-center mx-2 text-white">
        <AppDate
          v-model="forPeriodDateStart"
          class="w-full md:w-1/2 md:mx-2"
          :name="'date_start'"
          :label="'From'"
        />
        <AppDate
          v-model="forPeriodDateEnd"
          class="w-full md:w-1/2 md:mx-2"
          :name="'date_end'"
          :label="'To'"
          :isAfterDate="forPeriodDateStart"
        />

        <AppDate 
          v-model="toPostPracticeInvoice.due_date"
          class="w-full md:w-1/2 md:mx-2"
          :name="'due_date'" 
          :label="'Due Date'" 
          is-after 
        />
      </div>
    </div>

    <!-- BODY -->
    <!-- FIRST PAGE -->
    <AppLoading :loading="loading" spinner :message="'Exporting to PDF'" />
    <div
      id="toPrint"
      class="invoice md:mx-4 max-w-xl h-full flex flex-col justify-between bg-white"
      :class="!doNotShow && 'display'"
    >
      <!--HQ INVOICE  -->
      <div>
        <div ref="pdf-header" class="flex flex-col p-4">
          <div>
            <div class="text-sm text-right">
              <p>{{ locumInvoice ? locumInvoice.locum_user.name : 'Hubzz Limited Mws,' }}</p>
              <p>{{ locumInvoice ? locumInvoice.address_line_1 : null }}</p>
              <p>{{ locumInvoice ? locumInvoice.address_line_2 : null }}</p>
              <p>{{ locumInvoice ? locumInvoice.address_line_3 : '601 London Road' }}</p>
              <p>{{ locumInvoice ? 'Tel '+locumInvoice.mobile_number : 'Westcliff-On-Sea SS0 9PE' }}</p>
              <p>{{ locumInvoice ? null :'billing@hubzz.co.uk' }}</p>
              <p v-if="!locumInvoice">
                Registered Company
              </p>
              <p>{{ locumInvoice ? locumInvoice.locum_user.email : '10832559' }}</p>
              <p>{{ locumInvoice ? 'UTR '+locumInvoice.utr_number : '10832559' }}</p>
            </div>
          </div>
          <div class="flex">
            <div class="w-full">
              <div
                class="border-2 border-gray-300 rounded-lg p-4 text-sm"
                :class="doNotShow ? 'md:w-full' : 'w-full'"
              >
                <div class="">
                  <div class="text-base py-1">To: Accounts Department</div>
                  <div class="w-full">
                    <p class="font-bold text-lg mb-2">{{ practice.surgery.name }}</p>
                    <div class="text-xs sm:text-sm">
                      <p>{{ practice.surgery.address.line_1 }}</p>
                      <p>{{ practice.surgery.address.line_2 }}</p>
                      <p>{{ practice.surgery.address.line_3 }}</p>
                    </div>

                    <div v-if="!locumInvoice" class="mt-2 flex flex-col">
                      <div>For the period</div>
                      <div>
                        <span>
                          {{ dateStart ? $moment(dateStart).format('DD/MM/YYYY') : $moment(toPostPracticeInvoice.date_start).format('DD/MM/YYYY') }} to
                          {{ dateEnd ? $moment(dateEnd).format('DD/MM/YYYY') : $moment(toPostPracticeInvoice.date_end).format('DD/MM/YYYY') }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="practiceInvoice || locumInvoice" class="w-full flex flex-col-reverse">
              <div class="flex justify-end items-center">
                <div>Invoice Number: </div>
                <div
                  class="pl-1 font-semibold"
                >
                  {{ practiceInvoice && !locumInvoice ? practiceInvoice.invoice_number : locumInvoice.invoice_number }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-------------------- FOR INVOICES - INVOICE ITEMS ------------------------>
        <div v-if="invoiceItems && invoiceItems.length > 0" class="flex flex-col overflow-x-auto" :class="doNotShow && 'mx-4'">
          <div
            :ref="'items-header'"
            :class="!doNotShow && 'px-4'"
            :style="`min-width: ${doNotShow ? '733px' : ''}`"
          >
            <div class="flex items-center justify-center py-2 bg-gray-900">
              <div :class="!byLocum ? 'w-4/6' : 'w-full'">
                <div class="text-white text-sm text-left px-4">
                  <strong>Description</strong>
                </div>
              </div>
              <div class="w-1/6">
                <div v-if="!byLocum" class="text-white text-sm text-left ">
                  <strong>Total Hours</strong>
                </div>
              </div>
              <!-- this -->
              <div v-if="!byLocum" class="w-1/6"> 
                <div class="text-white text-sm text-right px-4">
                  <strong>£ Amount</strong>
                </div>
              </div>
              <div v-if="forViewing == false">
                <div v-if="doNotShow" class="mr-2">
                  <span
                    class="bg-gray-900 hover:bg-gray-900 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
                    @click="addInvoiceItem()"
                  >+</span>
                </div>
              </div>
            </div>
          </div>
          <div
            v-for="(item, index) in invoiceItems"
            :key="`item-${index}`"
            :ref="`item-${index}`"
            :class="!doNotShow && 'px-4'"
            :style="`min-width: ${doNotShow ? '733px' : ''}`"
          > 
            <div class="flex w-full border-b border-gray-500 py-1">
              <!-- DESCRIPTION -->
              <div v-if="forViewing == false" class="w-4/6 text-sm">
                <textarea
                  v-if="doNotShow"
                  v-model="item.description"
                  rows="2"
                  class="border-b-2 border-gray-300 w-full h-full focus:outline-none resize-none py-1 px-4"
                  placeholder="Enter Description"
                />
                <p
                  v-else
                  class="text-left px-2 py-1"
                >
                  {{ item.description ? item.description : "No Description" }}
                </p>
              </div>
              <div v-else class="max-w px-2 py-1" :class="!byLocum ? 'w-4/6' : 'w-full'">
                {{ item.description }}
              </div>
              <!-- TOTAL HOURS -->
              <div v-if="forViewing == false" class="w-1/6 text-sm">
                <p
                  class="w-full text-left px-2 py-1"
                >
                  {{ item.total_hours | currency }}
                </p>
              </div>
              <div v-else class="max-w px-2 py-1 w-1/6">
                <div v-if="!byLocum">
                  {{ item.total_hours | currency }}
                </div>
              </div>
              <!-- AMOUNT TOTAL -->
              <div v-if="!byLocum" class="w-1/6 text-sm mx-1">
                <template v-if="forViewing == false">
                  <input
                    v-if="doNotShow"
                    v-model="item.total"
                    class="border-b-2 border-gray-300 w-full h-full focus:outline-none text-right"
                    :class="!doNotShow && 'pr-3'"
                    type="number"
                    step="any"
                    min="0"
                    placeholder="Enter Total"
                  >
                </template>
                <div v-else class="max-w px-2 py-1 text-right text-black ">
                  {{ item.total | currency }}
                </div>
              </div>
              <template v-if="forViewing == false">
                <div v-if="doNotShow" class="mr-2 flex items-center">
                  <span
                    class="bg-black hover:bg-gray-900 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
                    @click="deductInvoiceItem(item.id)"
                  >-</span>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!----------------------- FOR DISPUTED ITEMS --------------------------->
        <div v-if="disputedItems && disputedItems.length > 0" class="flex flex-col overflow-x-auto" :class="doNotShow && 'mx-4'">
          <div
            :ref="'items-header'"
            :class="!doNotShow && 'px-4'"
            :style="`min-width: ${doNotShow ? '733px' : ''}`"
          >
            <div class="flex items-center justify-center py-2 bg-gray-900">
              <div class="w-4/6">
                <div class="text-white text-sm text-left px-4">
                  <strong>Disputed Job Description</strong>
                </div>
              </div>
              <div class="w-2/6">
                <div class="text-white text-sm text-right px-4">
                  <strong>£ Amount</strong>
                </div>
              </div>
            </div>
          </div>
          <div
            v-for="(item, index) in disputedItems"
            :key="`item-${index}`"
            :ref="`item-${index}`"
            :class="!doNotShow && 'px-4'"
            :style="`min-width: ${doNotShow ? '733px' : ''}`"
          >
            <div class="flex w-full justify-center border-b border-gray-500 py-1">
              <!-- Description -->
              <div v-if="forViewing == false" class="w-4/6 text-sm mx-1">
                <textarea
                  v-if="doNotShow"
                  v-model="item.description"
                  rows="2"
                  class="border-b-2 border-gray-300 w-full h-full focus:outline-none resize-none py-1 px-4"
                  placeholder="Enter Description"
                />
                <p
                  v-else
                  class="text-left px-2 py-1"
                >
                  {{ item.description ? item.description : "No Description" }}
                </p>
              </div>
              <div v-else class="w-full max-w px-2 py-1">
                {{ item.description }}
              </div>
              <!-- TOTAL HOURS -->
              <div v-if="forViewing == false" class="w-1/6 text-sm">
                <p
                  class="w-full text-left px-2 py-1"
                >
                  {{ item.total_hours | currency }} Hours
                </p>
              </div>
              <div v-else class="max-w px-2 py-1 w-1/6">
                <div v-if="!byLocum">
                  {{ item.total_hours | currency }} Hours
                </div>
              </div>
              <!-- Amount -->
              <div class="w-1/6 text-sm mx-1">
                <template v-if="forViewing == false">
                  <input
                    v-if="doNotShow"
                    v-model="item.total"
                    class="border-b-2 border-gray-300 w-full h-full focus:outline-none text-right"
                    :class="!doNotShow && 'pr-3'"
                    type="number"
                    step="any"
                    min="0"
                    placeholder="Enter Total"
                  >
                </template>
                <p v-else class="px-2 py-1 text-right text-black">
                  {{ item.total | currency }}  
                </p>
              </div>
              <template v-if="forViewing == false">
                <div v-if="doNotShow" class="mr-2 flex items-center">
                  <span
                    class="bg-black hover:bg-gray-900 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
                    @click="deductDisputedItem(item.id)"
                  >-</span>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- FOR DEBITS -->
        <div v-if="!locumInvoice" class="flex flex-col overflow-x-auto" :class="doNotShow && 'mx-4'">
          <div
            :ref="'items-header'"
            :class="!doNotShow && 'px-4'"
            :style="`min-width: ${doNotShow ? '733px' : ''}`"
          >
            <div class="flex items-center justify-center py-2 bg-gray-900">
              <div class="w-4/6">
                <div class="text-white text-sm text-left px-4">
                  <strong>Debit Description</strong>
                </div>
              </div>
              <div class="w-2/6">
                <div class="text-white text-sm text-right px-4">
                  <strong>£ Amount</strong>
                </div>
              </div>
              <div v-if="forViewing == false">
                <div v-if="doNotShow" class="mr-2">
                  <span
                    class="bg-gray-900 hover:bg-gray-900 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
                    @click="addDebitItem()"
                  >+</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="createdDebitItems.length > 0">
            <div
              v-for="(item, index) in createdDebitItems"
              :key="`item-${index}`"
              :ref="`item-${index}`"
              :class="!doNotShow && 'px-4'"
              :style="`min-width: ${doNotShow ? '733px' : ''}`"
            >
              <div class="flex w-full justify-center border-b border-gray-500 py-1">
                <div v-if="forViewing == false" class="w-2/3 text-sm mx-1">
                  <textarea
                    v-if="doNotShow"
                    v-model="item.description"
                    :maxlength="maxChars"
                    rows="2"
                    class="border-b-2 border-gray-300 w-full h-full focus:outline-none resize-none py-1 px-4"
                    placeholder="Enter Description"
                  />
                  <p
                    v-else
                    class="text-left px-2 py-1"
                  >
                    {{ item.description ? item.description : "No Description" }}
                  </p>
                </div>
                <div v-else class="w-full max-w px-2 py-1">
                  {{ item.description }}
                </div>
                <div class="w-1/3 text-sm mx-1">
                  <template v-if="forViewing == false">
                    <input
                      v-if="doNotShow"
                      v-model="item.total"
                      class="border-b-2 border-gray-300 w-full h-full focus:outline-none text-right"
                      :class="!doNotShow && 'pr-3'"
                      type="number"
                      step="any"
                      min="0"
                      placeholder="Enter Total"
                    >
                  </template>
                  <p v-else class="px-2 py-1 text-right text-md font-semibold">
                    {{ item.total | currency }}
                  </p>
                </div>
                <template v-if="forViewing == false">
                  <div v-if="doNotShow" class="mr-2 flex items-center">
                    <span
                      class="bg-black hover:bg-gray-900 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
                      @click="deductDebitItem(item.id)"
                    >-</span>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="flex w-full justify-center border-b border-gray-500 py-1">
              <div class="w-full max-w px-2 py-1">
                {{ '---' }}
              </div>
              <div class="w-1/3 text-sm mx-1">
                <p class="px-2 py-1 text-right text-md">
                  {{ '0.00' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- FOR CREDITS -->
        <div v-if="!locumInvoice" class="flex flex-col overflow-x-auto" :class="doNotShow && 'mx-4'">
          <div
            :ref="'items-header'"
            :class="!doNotShow && 'px-4'"
            :style="`min-width: ${doNotShow ? '733px' : ''}`"
          >
            <div class="flex items-center justify-center py-2 bg-gray-900">
              <div class="w-4/6">
                <div class="text-white text-sm text-left px-4">
                  <strong>Credit Description</strong>
                </div>
              </div>
              <div class="w-2/6">
                <div class="text-white text-sm text-right px-4">
                  <strong>£ Amount</strong>
                </div>
              </div>
              <div v-if="forViewing == false">
                <div v-if="doNotShow" class="mr-2">
                  <span
                    class="bg-gray-900 hover:bg-gray-900 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
                    @click="addCreditItem()"
                  >+</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="createdCreditItems.length > 0">
            <div
              v-for="(item, index) in createdCreditItems"
              :key="`item-${index}`"
              :ref="`item-${index}`"
              :class="!doNotShow && 'px-4'"
              :style="`min-width: ${doNotShow ? '733px' : ''}`"
            >
              <div class="flex w-full justify-center border-b border-gray-500 py-1">
                <div v-if="forViewing == false" class="w-2/3 text-sm mx-1">
                  <textarea
                    v-if="doNotShow"
                    v-model="item.description"
                    rows="2"
                    class="border-b-2 border-gray-300 w-full h-full focus:outline-none resize-none py-1 px-4"
                    placeholder="Enter Description"
                  />
                  <p
                    v-else
                    class="text-left px-2 py-1"
                  >
                    {{ item.description ? item.description : "No Description" }}
                  </p>
                </div>
                <div v-else class="w-full max-w px-2 py-1">
                  {{ item.description }}
                </div>
                <div class="w-1/3 text-sm mx-1">
                  <template v-if="forViewing == false">
                    <input
                      v-if="doNotShow"
                      v-model="item.total"
                      class="border-b-2 border-gray-300 w-full h-full focus:outline-none text-right"
                      :class="!doNotShow && 'pr-3'"
                      type="number"
                      step="any"
                      min="0"
                      placeholder="Enter Total"
                    >
                  </template>
                  <p v-else class="px-2 py-1 text-right text-md font-semibold">
                    - {{ item.total | currency }}
                  </p>
                </div>
                <template v-if="forViewing == false">
                  <div v-if="doNotShow" class="mr-2 flex items-center">
                    <span
                      class="bg-black hover:bg-gray-900 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
                      @click="deductCreditItem(item.id)"
                    >-</span>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="flex w-full justify-center border-b border-gray-500 py-1">
              <div class="w-full max-w px-2 py-1">
                {{ '---' }}
              </div>
              <div class="w-1/3 text-sm mx-1">
                <p class="px-2 py-1 text-right text-md">
                  {{ '0.00' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- TOTALS -->
        <div v-if="!byLocum" ref="items-total" class="flex flex-col justify-between px-4 pt-2">
          <div class="flex flex-row justify-between w-full">
            <div class="my-1 px-1 font-bold">
              Total
            </div>
            <div class="my-1 px-1 text-right text-lg font-semibold">
              £ {{ forViewing === true ? practiceInvoice.total_amount : amountTotal | currency }}
            </div>
          </div>
          <div class="flex flex-row justify-between w-full">
            <span class="my-1 px-1 font-bold">
              Total Hours
            </span>
            <div class="my-1 px-1 text-right text-lg font-semibold">
              {{ totalHoursSum | currency }} Hours
            </div>
          </div>
        </div>
        <div v-else>
          <div class="flex flex-col">
            <div
              v-if="locumInvoice && locumInvoice.ir35 && locumInvoice.paid"
              :ref="'items-sub-total'"
              class="flex justify-between md:m-2 text-lg px-3 pt-3"
            >
              <span class="w-3/4 font-bold">Subtotal</span>
              <div class="w-1/4 flex justify-between">
                <div class="w-full text-right">
                  £
                </div>
                <div class="w-full text-right">
                  {{ subTotal | currency }}
                </div>
              </div>
            </div>
            <div
              v-if="locumInvoice && locumInvoice.ir35 && locumInvoice.paid"
              :ref="'items-ni-total'"
              class="flex justify-between md:mx-2 text-lg px-3"
            >
              <span class="w-3/4 pl-2 text-sm">NI amount</span>
              <div class="w-1/4 flex justify-between">
                <div class="w-full text-right text-sm">
                  £
                </div>
                <div class="w-full text-right text-sm">
                  {{ locumInvoice.ni_amount | currency }}
                </div>
              </div>
            </div>
            <div
              v-if="locumInvoice && locumInvoice.ir35 && locumInvoice.paid"
              :ref="'items-paye-total'"
              class="flex justify-between md:mx-2 text-lg px-3"
            >
              <span class="w-3/4 pl-2 text-sm">PAYE amount</span>
              <div class="w-1/4 flex justify-between">
                <div class="w-full text-right text-sm">
                  £
                </div>
                <div class="w-full text-right text-sm">
                  {{ locumInvoice.paye_amount | currency }}
                </div>
              </div>
            </div>
            <!-- ITEMS TOTAL -->
            <div :ref="'items-total'" class="flex justify-between md:m-2 text-lg px-3 py-2">
              <span class="w-3/4 font-bold">Total</span>
              <div class="w-1/4 flex justify-between">
                <div class="w-full text-right">
                  £
                </div>
                <div class="w-full text-right">
                  {{ totalAmount | currency }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- LOCUM INVOICE  -->
      <div v-if="locumInvoice" ref="pdf-footer" class="p-4">
        <!-- items days worked -->
        <div :ref="'days-worked'" class="flex flex-row flex-wrap justify-between px-2">
          <div class="w-full flex flex-row flex-wrap justify-between md:px-2">
            <div class="w-full md:w-1/2 md:pr-1">
              <AppDate v-model="dateStart" disabled :name="'date_start'" :label="'Days worked from'" />
            </div>
            <div class="w-full md:w-1/2 md:pl-1">
              <AppDate v-model="dateEnd" disabled :name="'date_end'" :label="'To'" />
            </div>
          </div>
        </div>
        <div v-if="locumInvoice.paid_under_payroll === true" class="border-2 border-gray-300 rounded-lg p-2 text-sm">
          Payment by BACS:
          <br>Account name: {{ locumInvoice && locumInvoice.payroll_account_name ? locumInvoice.payroll_account_name : 'N/A' }}
          <br>Bank: {{ locumInvoice && locumInvoice.payroll_bank_name ? locumInvoice.payroll_bank_name : 'N/A' }}
          <br>Sort code: {{ locumInvoice && locumInvoice.payroll_sort_code ? locumInvoice.payroll_sort_code : 'N/A' }}
          <br>Account number: {{ locumInvoice && locumInvoice.payroll_account_number ? locumInvoice.payroll_account_number : 'N/A' }}
          <br>
        </div>
        <div v-else class="border-2 border-gray-300 rounded-lg p-2 text-sm">
          Payment by BACS:
          <br>Account name: {{ locumInvoice && locumInvoice.account_name ? locumInvoice.account_name : 'N/A' }}
          <br>Bank: {{ locumInvoice && locumInvoice.bank_name ? locumInvoice.bank_name : 'N/A' }}
          <br>Sort code: {{ locumInvoice && locumInvoice.sort_code ? locumInvoice.sort_code : 'N/A' }}
          <br>Account number: {{ locumInvoice && locumInvoice.account_number ? locumInvoice.account_number : 'N/A' }}
          <br>
        </div>
      </div>
    </div>
    <!-- FIRST PAGE ENDS HERE -->
    <!-- BODY ENDS HERE-->
    <div class="m-4">
      <AppButton
        v-if="forViewing == false"
        :disabled="saveAsDisabled ? true : false"
        :label="'Save as Final'"
        :icon="'save-icon'"
        @click="createInvoice()"
      />
    </div>
  </div>
</template>

<script>
import AppLoading from "@/components/Base/AppLoading"
import AppButton from "@/components/Base/AppButton"
import AppDate from "@/components/Base/AppDate"
export default {
	components: {
		AppLoading,
		AppButton,
		AppDate,
	},
	props: [
		"forViewing",
		"practice",
		"practiceInvoice",
		"locumInvoice",
		"invoiceItems",
		"disputedItems",
		"debitItems",
		"creditItems",
		"dateStart",
    "dateEnd",
		"byLocum"
	],
	data () {
		return {
      saveAsDisabled: false,
      forPeriodDateStart: "",
      forPeriodDateEnd: "",
			toPostPracticeInvoice: {
				practice_id: "",
				date_start: "",
				date_end: "",
				items: [],
        total_amount: "",
        due_date: "",
      },
      form: {
        date_start: null,
        date_end: null,
        items: [],
        total_amount: 0,
        final: false,
        ir35: false,
        minutes: 0,
        hours: 0,
        late_hours: 0,
        late_minutes: 0
      },
      isAfterDate: null,
      formError: [],
			// createdInvoiceItems: [],
			// createdDisputedItems: [],
			createdDebitItems: [],
			createdCreditItems: [],
			invoice: {},
			doNotShow: true,
			practices: [],
			chosenPractice: [],
			loading: false,

			maxChars: 100
		}
	},

	computed: {
		amountTotal: function () {
			let grossSum = 0
			let invoiceItemTotal = 0
			let disputedItemTotal = 0
			let debitTotal = 0
			let creditTotal = 0
			const reducer = (accumulator, currentValue) => accumulator + currentValue

			if (this.invoiceItems && this.invoiceItems.length > 0) {
				let invoiceItems = this.invoiceItems.map(invoiceItem =>
					parseFloat(invoiceItem.total ? invoiceItem.total : 0)
				)
				invoiceItemTotal = invoiceItems.reduce(reducer)
			}
			// console.log("invoice items", this.invoiceItems);
			if (this.disputedItems && this.disputedItems.length > 0) {
				let disputedItems = this.disputedItems.map(disputedItem =>
					parseFloat(disputedItem.total ? disputedItem.total : 0)
				)
				disputedItemTotal = disputedItems.reduce(reducer)
			}
			// console.log("disputed items", this.disputedItems);
			grossSum = parseFloat(invoiceItemTotal + disputedItemTotal)

			if (this.createdDebitItems && this.createdDebitItems.length > 0) {
				let createdDebitItems = this.createdDebitItems.map(debitItem =>
					parseFloat(debitItem.total ? debitItem.total : 0)
				)
				debitTotal = createdDebitItems.reduce(reducer)
			}
			// console.log("debit items", this.createdDebitItems);
			if (this.createdCreditItems && this.createdCreditItems.length > 0) {
				let createdCreditItems = this.createdCreditItems.map(creditItem =>
					parseFloat(creditItem.total ? creditItem.total : 0)
				)
				creditTotal = createdCreditItems.reduce(reducer)
			}
			// console.log("credit items", this.createdCreditItems);
      const netSum = parseFloat(grossSum + debitTotal - creditTotal).toFixed(2)
      
			return netSum
    },
    totalHoursSum: function () {
      let totalHours = 0
      const reducer = (accumulator, currentValue) => accumulator + currentValue
      if (this.invoiceItems && this.invoiceItems.length > 0) {
        let invoiceItemHours = this.invoiceItems.map(invoiceItem => 
          parseFloat(invoiceItem.total_hours ? invoiceItem.total_hours : 0)
        )
        totalHours = invoiceItemHours.reduce(reducer)
      }
      return totalHours.toFixed(2)
    },
    subTotal () {
      if (this.locumInvoice ) {
        let type = this.locumInvoice.items[0].job_part.job.locum_detail_rate_type
          .name

        let finalHours =
          (parseInt(this.form.hours) * 60 + parseInt(this.form.minutes)) / 60

        let totalHours = this.locumInvoice.items[0].job_part.job.total_hours / 60

        let total = 0

        switch (type) {
          case "Per Hour":
            total = finalHours * this.locumInvoice.items[0].job_part.job.rate
            break
          default:
            total =
              finalHours *
              (this.locumInvoice.items[0].job_part.job.rate / totalHours)
            break
        }

        return total
      }

      return 0
    },
    totalAmount () {
      // Job Part Total Rate (Per Hour) = (Final Hours + (Final Minutes / 60)) * Rate
      // Job Part Total Rate (Per Session) = (Final Hours + (Final Minutes / 60)) * (Rate / (Total Hours + (Total Minutes / 60)))

      if (this.locumInvoice) {
        let type = this.locumInvoice.items[0].job_part.job.locum_detail_rate_type
          .name

        let finalHours =
          (parseInt(this.form.hours) * 60 + parseInt(this.form.minutes)) / 60

        let totalHours = this.locumInvoice.items[0].job_part.job.total_hours / 60

        let total = 0

        switch (type) {
          case "Per Hour":
            total = finalHours * this.locumInvoice.items[0].job_part.job.rate
            break
          default:
            total =
              finalHours *
              (this.locumInvoice.items[0].job_part.job.rate / totalHours)
            break
        }

        if (this.locumInvoice) {
          total =
            total - this.locumInvoice.ni_amount - this.locumInvoice.paye_amount
        }

        return total
      }

      return 0
    },
  },

  watch: {
    forPeriodDateStart: function (value) {
      console.log('value', value)
      if (value > this.forPeriodDateEnd) { 
        this.forPeriodDateEnd = ""
      }
    },
    forPeriodDateEnd: function (value) {
      console.log('value datend', value)
    }
  },
  
	created () {
    console.log('locumInvoice', this.locumInvoice)
		// if (this.invoiceItems) {
		//   this.createdInvoiceItems = this.invoiceItems
		// }
		// if (this.disputeditems) {
		//   this.createdDisputedItems = this.createdDisputedItems
		// }ff
		// if (this.locumInvoice) {
		// 	console.log("locum invoice", this.locumInvoice);
		// }
		// if (this.practiceInvoice) {
		// 	console.log("practice invoice", this.practiceInvoice);
    // }
    console.log('practice invoice', this.practiceInvoice)
    console.log("practice", this.practice)
    console.log("invoice items", this.invoiceItems)

    if(this.locumInvoice) {
      this.setInitialState()
    }
    
		if (this.debitItems) {
			this.createdDebitItems = this.debitItems
		}
		if (this.creditItems) {
			this.createdCreditItems = this.creditItems
		}
	},

	methods: {
		toPDF () {
			if (this.locumInvoice) {
				window.open(
					`${process.env.API_URL}/api/v1/locum-invoices/${this.locumInvoice.id}/pdf`
				)
			} else if (this.practiceInvoice) {
				window.open(
					`${process.env.API_URL}/api/v1/practice-invoices/${
						this.practiceInvoice.id
					}/pdf?filename=${"hubzz_" +
						this.$moment(this.practiceInvoice.issued_at, 'YYYY-MM-DD[T]').utc().format("DD/MM/YYYY") +
						"_" +
						this.practiceInvoice.invoice_number +
						"_" +
						this.practiceInvoice.practice.code}`
				)
			}
		},

		toSageCSV () {
			if (this.practiceInvoice) {
        this.$axios.put(`/api/v1/admin/practice-invoices/export-invoices`, {
          id: this.practiceInvoice.id,
          exported_at: this.$moment().format("YYYY-MM-DD HH:mm:ss"),
        })
				window.open(
					`${process.env.API_URL}/api/v1/admin/practice-invoices/${
						this.practiceInvoice.id
					}/sage?filename=${"sage_" +
						this.$moment(this.practiceInvoice.issued_at).format("DD/MM/YYYY") +
						"_" +
						this.practiceInvoice.invoice_number +
						"_" +
						this.practiceInvoice.practice.code}.csv`
				)
			}
		},

		async addInvoiceItem () {
			// deduct 1 when dealing with ID for array
			const newItem = {
				hours: "",
				total: 0
			}
			newItem.id = this.invoiceItems.length + 1
			await this.invoiceItems.push(newItem)
		},

		async deductInvoiceItem (itemId) {
			const mapInvoiceItems = this.invoiceItems.map(
				invoiceItem => invoiceItem.id
			)
			await this.invoiceItems.splice(mapInvoiceItems.indexOf(itemId), 1)
		},

		async deductDisputedItem (itemId) {
			const mapDisputedItems = this.disputedItems.map(
				disputedItem => disputedItem.id
			)
			await this.disputedItems.splice(mapDisputedItems.indexOf(itemId), 1)
		},

		async addDebitItem () {
			const newItem = {
				type: "Debit",
				description: "",
				total: 0
			}
			newItem.id = this.createdDebitItems.length + 1
			await this.createdDebitItems.push(newItem)
		},

		async deductDebitItem (itemId) {
			const mapDebitItems = this.createdDebitItems.map(
				debitItem => debitItem.id
			)
			await this.createdDebitItems.splice(mapDebitItems.indexOf(itemId), 1)
		},

		async addCreditItem () {
			const newItem = {
				type: "Credit",
				description: "",
				total: 0
			}
			newItem.id = this.createdCreditItems.length + 1
			await this.createdCreditItems.push(newItem)
		},

		async deductCreditItem (itemId) {
			const mapCreditItems = this.createdCreditItems.map(
				creditItem => creditItem.id
			)
			await this.createdCreditItems.splice(mapCreditItems.indexOf(itemId), 1)
		},

		async createInvoice () {
      this.saveAsDisabled = true
      this.createdDebitItems = await this.createdDebitItems.filter(disputedItem => disputedItem.total !== 0)
      this.createdCreditItems = await this.createdCreditItems.filter(creditItem => creditItem.total !== 0)
      this.toPostPracticeInvoice.items = await this.invoiceItems.concat(
				this.disputedItems,
				this.createdDebitItems,
				this.createdCreditItems
			)
      
			this.toPostPracticeInvoice.date_start = await this.dateStart ? this.dateStart : null
      this.toPostPracticeInvoice.date_end = await this.dateEnd ? this.dateEnd : null
      
			this.toPostPracticeInvoice.practice_id = (await this.practice.id)
				? this.practice.id
        : null
        
			this.toPostPracticeInvoice.items = await this.invoiceItems.concat(
				this.disputedItems,
				this.createdDebitItems,
				this.createdCreditItems
			)
			this.toPostPracticeInvoice.total_amount = await this.amountTotal
      this.toPostPracticeInvoice.date_start = this.forPeriodDateStart
      this.toPostPracticeInvoice.date_end = this.forPeriodDateEnd

			if (this.toPostPracticeInvoice.items.length > 0) {
				await this.$axios
					.post(`/api/v1/admin/practice-invoices`, this.toPostPracticeInvoice)
					.then(() => {
            this.$emit("goBack")
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "success",
							text: "Invoice Posted"
            })
					})
					.catch(err => {
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "danger",
							text: err.response.data.message
            })
            this.saveAsDisabled = false
					})
			} else {
        this.saveAsDisabled = false
				this.$emit("formError")
				this.$store.commit("SET_NOTIFICATION", {
					enabled: true,
					status: "danger",
					text: "Items to be invoiced is required"
				})
			}
    },
    
    setInitialState () {
      if (this.locumInvoice) {
        this.form.locum_invoice_id = this.locumInvoice.id
        this.form.date_start = this.locumInvoice.date_start
        this.form.date_end = this.locumInvoice.date_end

        this.form.items = [
          {
            type: "Job Part",
            job_part_id: this.locumInvoice.items[0].job_part.id,
            description: this.locumInvoice.items[0].description,
            total: this.locumInvoice.items[0].total,

            dispute: this.locumInvoice.items[0].disputed,
            absent_days: this.locumInvoice.items[0].absent_days,
            final_hours: this.locumInvoice.items[0].final_hours,
            late_hours: this.locumInvoice.items[0].late_hours,
            remarks: this.locumInvoice.items[0].remarks
          }
        ]

        this.form.total_amount = this.locumInvoice.total_amount
        this.form.final = false
        this.form.ir35 = this.locumInvoice.ir35
      }

      this.form.hours = Math.floor(this.form.items[0].final_hours / 60)
      this.form.minutes = Math.floor(this.form.items[0].final_hours % 60)
      this.form.late_hours = Math.floor(this.form.items[0].late_hours / 60)
      this.form.late_minutes = Math.floor(this.form.items[0].late_hours % 60)
    },

		async clearEntries () {}
  }
 
}
</script>
<style>
.display {
	width: 800px;
}
@media (min-width: 480px) {
	.right-side-header-content {
		width: calc(100% - 0px);
	}
}
.page-overlap {
	min-width: 100%;
}
@media screen and (min-width: 768px) {
	.page-overlap {
		min-width: calc(100% - 70px);
	}
	.invoice {
		max-width: 800px;
		min-height: 850px;
	}
}

@media screen and (min-width: 1200px) {
	.page-overlap {
		min-width: calc(100% - 200px);
	}
}

.billing-modal {
	position: fixed;
	top: 0;
	right: 0;
	margin-right: 0%;
	width: 100%;
	height: 100%;
	overflow: hidden auto;
	border-left: solid 2px #ffc72c;
	transition: all 0.3s ease-in-out;
	background-color: #505561;
	z-index: 512;
}
@media screen and (min-width: 1200px) {
	.billing-modal {
		width: 80%;
	}
}
.billing-shield {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #333;
	opacity: 0.5;
	z-index: 511;
}
</style>
