<template>
  <div>
    <div class="mt-2 md:my-0 md:mx-2 font-semibold">
      Schedules
    </div>

    <div class="w-full flex flex-col m-2 mb-4 ">
      <div class="text-xs sm:text-sm overflow-y-auto" style="max-height:205px;">
        <div style="position:sticky;top:0" class="flex">
          <p
            class="flex-1 bg-gray-400 p-1 font-bold text-xs"
            :style="
              locumInvoiceable
                ? 'min-width:100px;max-width:200px'
                : 'min-width:190px;max-width:450px'
            "
          >
            DATE
          </p>

          <p
            v-if="locumInvoiceable"
            class="flex-1 text-center bg-gray-400 p-1 font-bold text-xs"
            style="min-width:100px;max-width:200px"
          >
            {{ status === 'Approved' ? 'FINAL TIME' : 'COMPLETED TIME' }}
          </p>

          <p
            class="flex-1 text-center bg-gray-400 p-1 font-bold text-xs"
            :style="
              locumInvoiceable
                ? 'min-width:100px;max-width:200px'
                : 'min-width:180px;max-width:280px'
            "
          >
            SHIFT
          </p>

          <p
            class="flex-1 text-center bg-gray-400 p-1 font-bold text-xs"
            :style="
              locumInvoiceable
                ? 'min-width:100px;max-width:200px'
                : 'min-width:180px;max-width:280px'
            "
          >
            RATE
          </p>

          <template v-if="locumInvoiceable">
            <p
              class="flex-1 text-center bg-gray-400 p-1 font-bold text-xs"
              style="min-width:100px;max-width:500px"
            >
              REMARKS
            </p>

            <p
              class="flex-1 text-center bg-gray-400 p-1 font-bold text-xs"
              style="min-width:100px;max-width:500px"
            >
              REASON
            </p>
          </template>
        </div>

        <div>
          <div v-for="(sched, index) in schedules" :key="index" class="flex px-1 pt-1 pb-2">
            <p
              class="flex-1"
              :style="
                locumInvoiceable
                  ? 'min-width:100px;max-width:200px'
                  : 'min-width:190px;max-width:450px'
              "
            >
              {{ $moment(sched.date, 'YYYY-MM-DD').format('DD/MM/YYYY') }} | {{ sched.time_start }}-{{ sched.time_end }}
            </p>

            <p
              v-if="locumInvoiceable"
              class="flex-1 text-center"
              style="min-width:100px;max-width:200px"
            >
              {{ status === 'Approved' ? `${sched.approved_time_start} - ${sched.approved_time_end}` : `${sched.final_time_start} - ${sched.final_time_end}` }}
            </p>

            <p
              class="flex-1 text-center"
              :style="
                locumInvoiceable
                  ? 'min-width:100px;max-width:200px'
                  : 'min-width:180px;max-width:280px'
              "
            >
              {{ sched.shift.name }}
            </p>

            <p
              class="flex-1 text-center"
              :style="
                locumInvoiceable
                  ? 'min-width:100px;max-width:200px'
                  : 'min-width:180px;max-width:280px'
              "
            >
              £{{ sched.rate }} {{ sched.locum_detail_rate_type.name }}
            </p>

            <template v-if="locumInvoiceable">
              <p
                class="flex-1 text-center"
                style="min-width:100px;max-width:500px"
              >
                {{ status === 'Approved' ? sched.approved_remarks : sched.completed_remarks }}
              </p>
              <p
                class="flex-1 text-center"
                style="min-width:100px;max-width:500px"
              >
                {{ status === 'Approved' ? sched.approved_reason : sched.completed_reason }}
              </p>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    locumInvoiceable: {
      type: [Boolean, Number],
      default: false,
    },

    status: {
      type: String,
      default: null,
    },

    schedules: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
