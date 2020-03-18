<template>
  <div>
    <!--GMC / NMC NUMBER-->
    <div class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center mx-4 md:mx-8 px-6 py-4 text-sm text-white shadow-lg rounded-lg bg-waterloo mt-3">
      <div class="flex flex-col md:flex-row w-full sm:w-1/2 justify-between">
        <p class="text-gray-400">GMC / NMC / HCPC Number</p>
        <p class="mx-3 sm:mx-0">{{ user.locum_detail.gmc_or_nmc_number ? user.locum_detail.gmc_or_nmc_number.number : null }}</p>
      </div>
      <div class="flex w-full sm:w-1/2 justify-end mt-2 sm:m-0">
        <button
          v-if="user.locum_detail.gmc_or_nmc_number"
          class="w-1/2 sm:w-auto text-white text-sm mr-2 py-2 px-4 border border-white focus:bg-green-500 rounded-full hover:bg-green-500 focus:outline-none"
          :class="`${user.locum_detail.gmc_or_nmc_number.status === 'Verified' ? 'bg-green-500 border-green-500 text-white px-4 hover:bg-green-600 text-center ' : 'bg-transparent px-2 hover:bg-green-500'}`"
          @click.prevent="toPutGmcNmc(user.locum_detail.gmc_or_nmc_number.status,user.id,'Verified')"
        >{{user.locum_detail.gmc_or_nmc_number.status == 'Verified' ? 'Verified' : 'Verify' }}</button>
        <button
          v-if="user.locum_detail.gmc_or_nmc_number"
          class="w-1/2 sm:w-auto text-white text-sm ml-2 py-2 px-4 border border-white focus:bg-yellow-500 rounded-full hover:bg-yellow-500 focus:outline-none"
          :class="`${user.locum_detail.gmc_or_nmc_number.status === 'Rejected' ? 'bg-yellow-500 border-yellow-500 text-white px-4 hover:bg-yellow-600 ' : 'bg-transparent px-2 hover:bg-yellow-500'}`"
          @click.prevent="toRejectGmcNmc()"
        >{{user.locum_detail.gmc_or_nmc_number.status == 'Rejected' ? 'Rejected' : 'Reject' }}</button>
      </div>
      <div v-if="rejectGmcNmc == true" class="flex w-full justify-end mt-2 sm:m-0">
        <div class="flex flex-col md:flex-row w-full md:w-auto items-center my-2">
          <div class="border rounded-lg mx-2 p-2 h-full w-full md:w-auto">
            <textarea
              v-model="notes" 
              placeholder="Reason for Rejection" 
              class="flex-1 bg-transparent overflow-auto resize-none text-white focus:outline-none" 
              name="complianceNote"
            />
          </div>
          <div class="flex md:flex-col mt-2">
            <button @click.prevent="toPutGmcNmc(user.locum_detail.gmc_or_nmc_number.status,user.id,'Rejected')" class="my-1 mx-1 md:mx-0 py-2 px-8 rounded-full rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none">
              <span>{{user.locum_detail.gmc_or_nmc_number.status == 'Rejected' ? 'Revert' : 'Confirm'}}</span>
            </button>
            <button @click.prevent="rejectGmcNmc = false" class="my-1 mx-1 md:mx-0 py-2 px-8 rounded-full rounded-lg text-white bg-gray-500 hover:bg-gray-600 focus:outline-none">
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center mx-4 md:mx-8 px-6 py-4 text-sm text-white shadow-lg rounded-lg bg-waterloo mt-3">
      <div class="flex flex-col md:flex-row w-full sm:w-1/2 justify-between">
        <p class="text-gray-400">MPL / NPL Number</p>
        <p class="mx-3 sm:mx-0">{{ user.locum_detail.mpl_or_npl_number ? user.locum_detail.mpl_or_npl_number.number : null }}</p>
      </div>
      <div class="flex w-full sm:w-1/2 justify-end mt-2 sm:m-0">
        <button
          class="w-1/2 sm:w-auto text-white text-sm mr-2 py-2 px-4 border border-white rounded-full hover:bg-green-500 focus:outline-none"
          :class="`${user.locum_detail.mpl_or_npl_number.status === 'Verified' ? 'bg-green-500 border-green-500 text-white px-4 hover:bg-green-600' : 'bg-transparent px-2 hover:bg-green-300'}`"
          v-if="user.locum_detail.mpl_or_npl_number"
          @click.prevent="toPutMplNpl(user.locum_detail.mpl_or_npl_number.status,user.id,'Verified')"
          >{{user.locum_detail.mpl_or_npl_number.status == 'Verified' ? 'Verified' : 'Verify' }}
        </button>
        <button
          class="w-1/2 sm:w-auto text-white text-sm ml-2 py-2 px-4 border border-white rounded-full hover:bg-yellow-500 focus:outline-none"
          :class="`${user.locum_detail.mpl_or_npl_number.status === 'Rejected' ? 'bg-yellow-500 border-yellow-500 text-white px-4 hover:bg-yellow-300' : 'bg-transparent px-2 hover:bg-yellow-300'}`"
          v-if="user.locum_detail.mpl_or_npl_number"
          @click.prevent="toRejectMplNpl()"
          >{{user.locum_detail.mpl_or_npl_number.status == 'Rejected' ? 'Rejected' : 'Reject' }}
        </button>
      </div>
      <div v-if="rejectMplNpl == true" class="flex w-full justify-end mt-2 sm:m-0">
        <div class="flex flex-col md:flex-row w-full md:w-auto items-center my-2">
          <div class="border rounded-lg mx-2 p-2 h-full w-full md:w-auto">
            <textarea
              v-model="notes" 
              placeholder="Reason for Rejection" 
              class="flex-1 bg-transparent overflow-auto resize-none text-white focus:outline-none" 
              name="complianceNote"
            />
          </div>
          
          <div class="flex md:flex-col mt-2">
            <button @click.prevent="toPutMplNpl(user.locum_detail.mpl_or_npl_number.status,user.id,'Rejected')" class="my-1 mx-1 md:mx-0 py-2 px-8 rounded-full rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none">
              <span>{{user.locum_detail.mpl_or_npl_number.status == 'Rejected' ? 'Revert' : 'Confirm'}}</span>
            </button>
            <button @click.prevent="rejectMplNpl = false" class="my-1 mx-1 md:mx-0 py-2 px-8 rounded-full rounded-lg text-white bg-gray-500 hover:bg-gray-600 focus:outline-none">
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--GMC / NMC NUMBER ENDS HERE-->
    
    <!-- MANDATORY -->
    <p class="text-sm text-white px-4 md:px-8 pt-8 font-semibold">Mandatory</p>
    <!-- TABLE RESPONSIVE-->
    <div class="w-full overflow-x-auto p-4 md:px-8 md:py-2"> 
      <!-- HEADER -->
      <div class="hidden md:flex items-center text-white justify-around font-semibold"> 
        <div class="align-middle pl-6 pr-2 w-1/6">Title</div> 
        <div class="align-middle px-2 text-center w-1/6">File size</div>
        <div class="align-middle px-2 text-center w-1/6">File uploaded</div>
        <div class="align-middle px-2 text-center w-1/6">Expiry Date</div>
        <div class="align-middle px-2 text-center w-1/6">Days to expire</div>
        <div class="align-middle px-2 text-center w-1/6">Status</div>
      </div>
      <!-- END HEADER -->
      <!-- BODY -->
      <nuxt-link
        v-for="(item, index) in mandatoryComplianceDocuments" :key="`item-${index}`"
        :event="item.locumMandatoryComplianceDocument==null ? disabled :'click'" 
        :class="item.locumMandatoryComplianceDocument==null ? 'cursor-auto':' hover:bg-waterloo-light transition-hover ' "
        :to="{path:`/locums/${user.id}/locum-compliance/${item.locumMandatoryComplianceDocument ? item.locumMandatoryComplianceDocument.id : null }`, query: $route.query}"
        class="flex flex-col md:flex-row px-4 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo" 
        draggable="false"
      >
        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 xl:pl-6 py-2 align-middle">
          <strong class="block md:hidden text-sm uppercase">Title</strong>
          <span :class="item && item.locumMandatoryComplianceDocument ? 'truncate' : 'break-word'">{{ item && item.mandatoryComplianceDocument ? item.mandatoryComplianceDocument.name : null }}</span>
        </div>

        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
          <strong class="block md:hidden text-sm uppercase">File size</strong>
          <span>{{ item.locumMandatoryComplianceDocument ? 
            (item.locumMandatoryComplianceDocument.file.size / 1048576).toFixed(2) + 'Mb' : null }}
          </span>
        </div>

        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
          <strong class="block md:hidden text-sm uppercase">File uploaded</strong>
          <span>{{ item.locumMandatoryComplianceDocument &&
            item.locumMandatoryComplianceDocument.file &&
            item.locumMandatoryComplianceDocument.file.created_at ? 
            $moment(item.locumMandatoryComplianceDocument.file.created_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY, h:mm:ss a') : null }}
          </span>
        </div>

        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
          <strong class="block md:hidden text-sm uppercase">Expiry Date</strong>
          <span class="break-all">{{ item.locumMandatoryComplianceDocument && 
            item.locumMandatoryComplianceDocument.expired_at ? 
            $moment(item.locumMandatoryComplianceDocument.expired_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY, h:mm:ss a'): null }}
          </span>
        </div>

        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
          <strong class="block md:hidden text-sm uppercase">Days to expire</strong>
          <span class="break-all">{{ item.locumMandatoryComplianceDocument && 
            item.locumMandatoryComplianceDocument.expired_at ? 
            $moment(item.locumMandatoryComplianceDocument.expired_at)
            .diff($moment(), 'days')  : null }}</span>
        </div>

        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 xl:pr-4 py-2 align-middle md:text-center">
          <strong class="block md:hidden">Status</strong>
          <div v-if="item.locumMandatoryComplianceDocument == null"
            class="text-center text-white text-sm py-2 px-8 sm:mx-2 border border-white bg-transparent rounded-full">
            <span>Empty</span>
          </div>
          <div
            v-if="item.locumMandatoryComplianceDocument"
            class="text-center text-black text-sm py-2 sm:mx-2 border border-white rounded-full"
            :class="statusStyle(item.locumMandatoryComplianceDocument && item.locumMandatoryComplianceDocument.status ? item.locumMandatoryComplianceDocument.status:null)">
            <span>
              {{item.locumMandatoryComplianceDocument && item.locumMandatoryComplianceDocument.status ? item.locumMandatoryComplianceDocument.status:null}}
            </span>
          </div>
        </div>
      </nuxt-link>
    </div>
    <!-- END TABLE -->  

    <!-- TABLE RESPONSIVE OPTIONAL COMPLIANCE DOCUMENTS -->
    <p class=" text-sm text-white px-4 md:px-8 pt-8 font-semibold">Optional</p>
    <div class="w-full overflow-x-auto p-4 md:px-8 md:py-2" > 
      <div class="hidden md:flex items-center text-white justify-around font-semibold"> 
        <div class="align-middle pl-6 pr-2 w-1/4">Title</div> 
        <div class="align-middle px-2 text-center w-1/4">File size</div>
        <div class="align-middle px-2 text-center w-1/4">File uploaded</div>
        <div class="w-1/4"></div>
      </div>
      <nuxt-link
        v-for="(item, index) in optionalComplianceDocuments" :key="`optionalComplianceDocument-${index}`"
        :event="item.locumOptionalComplianceDocument==null ? disabled :'click'"
        :class="item.locumOptionalComplianceDocument==null ? 'cursor-auto':'hover:bg-waterloo-light transition-hover '"
        :to="{path:`/locums/${user.id}/locum-compliance/${item.locumOptionalComplianceDocument ? item.locumOptionalComplianceDocument.id : null }`, query}"
        class="flex flex-col md:flex-row px-4 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo" 
        draggable="false"
      >
        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/4 px-1 xl:px-2 xl:pl-6 py-2 align-middle">
          <strong class="block md:hidden text-sm uppercase">Title</strong>
          <span :class="item.locumOptionalComplianceDocument ? 'truncate' : 'break-word leading-none'">{{ item.optionalComplianceDocument.name }}</span>
        </div>

        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/4 px-1 xl:px-2 py-2 align-middle md:text-center">
          <strong class="block md:hidden text-sm uppercase">File size</strong>
          <span>
            {{ item.locumOptionalComplianceDocument ? (item.locumOptionalComplianceDocument.file.size / 1048576).toFixed(2) + 'Mb' : null }}
          </span>
        </div>

        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/4 px-1 xl:px-2 py-2 align-middle md:text-center">
          <strong class="block md:hidden text-sm uppercase">File uploaded</strong>
          <span>
            {{ item.locumOptionalComplianceDocument ? $moment(item.locumOptionalComplianceDocument.file.created_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY, h:mm:ss a') : null }}
          </span>
        </div>
        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/4 px-1 xl:px-2 xl:pr-4 py-2 align-middle md:text-center">
          <strong class="block md:hidden">Status</strong>
          <div
            v-if="item.locumOptionalComplianceDocument == null"
            class="text-center text-white text-sm py-2 sm:mx-2 border border-white rounded-full">
            <span>Empty</span>
          </div>
          <div
            v-if="item.locumOptionalComplianceDocument"
            class="text-center text-white text-sm py-2 sm:mx-2 border border-white rounded-full">
            <span>Present</span>
          </div>
        </div>
      </nuxt-link>
    </div>
    <!-- END TABLE -->

    <!-- MANDATORY TRAININGS -->
    <p class=" text-sm text-white px-4 md:px-8 md:pt-8 font-semibold">Mandatory Trainings </p>
    <div v-if="locumMandatoryTrainings.length === 0">
      <div class="w-full text-white font-bold text-gray-500 text-sm leading-tight py-2 px-4 md:px-8">
        This locum has not uploaded any Mandatory Training Documents.
      </div>
    </div>
    <!-- TABLE RESPONSIVE MANDATORY TRAININGS-->
    <div class="w-full overflow-x-auto p-4 md:px-8 md:py-2" v-if="locumMandatoryTrainings.length > 0"> 
      <div class="hidden md:flex items-center text-white justify-around font-semibold"> 
        <div class="align-middle pl-6 pr-2 text-left w-1/4">Title</div> 
        <div class="align-middle px-2 text-center w-1/4">File size</div>
        <div class="align-middle px-2 text-center w-1/4">File uploaded</div>
        <div class="w-1/4"></div>
      </div>
        <!-- BODY -->
      <nuxt-link
        v-for="(item, index) in locumMandatoryTrainings" :key="`item-${index}`"
        :event="item.file==null ? disabled :'click'"
        :to="{path:`/locums/${user.id}/locum-compliance/mandatory-training/${item ? item.id : null }`, query: $route.query}"
        class="flex flex-col md:flex-row px-4 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo" 
        :class="item.file==null ? 'cursor-auto':' hover:bg-waterloo-light transition-hover ' "
        draggable="false"
      >
        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/4 px-1 xl:px-2 xl:pl-6 py-2 align-middle">
          <strong class="block md:hidden text-sm uppercase">Title</strong>
          <span :class="item.mandatory_training ? 'truncate' : 'break-word leading-none'">{{ item.mandatory_training.name }}</span>
        </div>

        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/4 px-1 xl:px-2 py-2 align-middle md:text-center">
          <strong class="block md:hidden text-sm uppercase">File size</strong>
          <span>
            {{( item.file ? item.file.size : 0 / 1048576).toFixed(2) + 'Bytes'}}
          </span>
        </div>
              <!-- $moment(document.practiceSpecificDoc.updated_at 
          ? document.practiceSpecificDoc.updated_at
          : document.practiceSpecificDoc.created_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYYY, h:mm:ss a'):null }} -->
        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/4 px-1 xl:px-2 xl:pr-4 py-2 align-middle md:text-center">
          <strong class="block md:hidden text-sm uppercase">File uploaded</strong>
          <span class="break-all">{{ item.file ? $moment(item.file.created_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY, h:mm:ss a'): null }}</span>
        </div>

        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/4 px-1 xl:px-2 xl:pr-4 py-2 align-middle md:text-center">
          <strong class="block md:hidden">Status</strong>
          <div class="text-center text-white text-sm py-2 px-8 sm:mx-2 border border-white bg-transparent rounded-full">
            {{ item.file ? 'Present' : 'Empty'}}
          </div>
        </div>
      </nuxt-link>
      <!-- END BODY -->
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>