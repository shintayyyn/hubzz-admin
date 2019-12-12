<template>
  <div>
    <div class="choose-job-parts-modal shadow-lg">
      <div class="m-4">
        <div @click="$emit('close')" class="text-white hover:text-sunglow p-1">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current"/>
        </div>
        <div class="max-w-2xl w-full overflow-auto my-1 mx-1 rounded-lg bg-waterloo">
        <p class="m-3 text-white text-xl font-semibold ">Approved Job Parts</p>
          <div class="m-2">
            <!-- HEADER -->
            <div class="hidden md:flex items-center text-white justify-around font-semibold">
              <div class="flex-1 align-middle px-2">Select</div>
              <div class="flex-1 align-middle px-2 text-center">Job Part Number</div>
              <div class="flex-1 align-middle px-2 text-center">Approved At</div>
              <div class="flex-1 align-middle px-2 text-center">Date Start</div>
              <div class="flex-1 align-middle px-2 text-center">Date End</div>
              <div class="flex-1 align-middle px-2 text-center">£ Amount</div>
              <div class="flex-1 align-middle px-2 text-center">Status</div>
            </div>
            <!-- HEADER ENDS HERE -->
            <div
              v-for="(approvedJobPart, index) in approvedJobParts"
              :key="`approvedJobPart-${index}`"
              class="flex flex-col cursor-pointer md:flex-row px-2 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo-light hover:bg-waterloo"
              draggable="false"
            >
              <!-- checkbox -->
              <div
                class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle leading-none"
              >
                <strong class="block md:hidden text-xs uppercase">Select</strong>
                <input
                  type="checkbox"
                  :id="approvedJobPart.id"
                  :value="approvedJobPart"
                  v-model="chosenJobParts"
                />
                <label :for="approvedJobPart.id"></label>
              </div>
              <!-- checkbox ends here -->
              <div
                class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle leading-none"
              >
                <strong class="block md:hidden text-xs uppercase">Job Part Number</strong>
                <span class="break-all">{{ approvedJobPart.job_part_number }}</span>
              </div>
              <div
                class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle md:text-center leading-none"
              >
                <strong class="block md:hidden text-xs uppercase">Date Start</strong>
                <span class="break-word">{{ $moment(approvedJobPart.approved_at).format("MMM DD, YYYY | HH:ss:mm") }}</span>
              </div>
              <div
                class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle md:text-center leading-none"
              >
                <strong class="block md:hidden text-xs uppercase">Date Start</strong>
                <span class="break-word">{{ $moment(approvedJobPart.date_start).format("MMM DD, YYYY | HH:ss:mm") }}</span>
              </div>
              <div
                class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle md:text-center leading-none"
              >
                <strong class="block md:hidden text-xs uppercase">Date End</strong>
                <span class="break-all">{{$moment(approvedJobPart.date_end).format("MMM DD, YYYY | HH:ss:mm")}}</span>
              </div>
              <div
                class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle md:text-center leading-none"
              >
                <strong class="block md:hidden text-xs uppercase">£ Amount</strong>
                <span class="break-all">{{ parseFloat(approvedJobParts.final_hours) * parseFloat(approvedJobParts.practice_rate) }}</span>
              </div>
              <div
                class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle md:text-center leading-none"
              >
                <strong class="block md:hidden text-xs uppercase">Status</strong>
                <!-- <span>{{ approvedJobPart.status }}</span> -->
                <div class="py-4" v-if="!approvedJobPart.paid && !approvedJobPart.paid_at">
                  <a
                    class="px-4 py-2 whitespace-no-wrap rounded-full bg-green-500 text-white"
                    >Mark as paid</a
                  >
                </div>
              </div>
            </div>

            <AppButton
            :label="'Confirm'"
            @click="toProcessInvoiceItems()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppTable from '@/components/Base/AppTable'
import AppButton from '@/components/Base/AppButton'
export default {
  props:['filter'],
  components:{
    AppButton
  },
  data(){
    return{
      approvedJobParts: '',
      disputedJobParts: '',
    }
  },
  created(){
    console.log('filter', this.filter)
    let params = {
      approved_at_date_start: this.filter.date_start,
      approved_at_date_end:this.filter.date_end,
      status: 'Approved'
    }
    this.$axios.$get(`/api/v1/admin/job-parts`, params).then(res => {
      this.approvedJobParts = res.data.job_parts
    })
    params = {
      approved_at_date_start: this.filter.date_start,
      approved_at_date_end:this.filter.date_end,
      status: 'Completed',
      invoice_status: 'Disputed',
    }
    this.$axios.$get(`/api/v1/admin/job-parts`, params).then(res => {
      this.disputedJobParts = res.data.job_parts
    })
  },
}
</script>

<style>

</style>