<template>
  <div>
    <div class="mt-2 md:my-0 md:mx-2 text-white font-semibold">
      Schedules
    </div>

    <div class="w-full flex flex-col m-2 mb-4 bg-waterloo">
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
            FINAL TIME
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

        <div class="text-white">
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
              {{ sched.final_time_start }} - {{ sched.final_time_end }}
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
                {{ `${isAbsent(sched) ? 'Absent' : isLate(sched) ? 'Late' : 'N/A'}` }}
              </p>
              <p
                class="flex-1 text-center"
                style="min-width:100px;max-width:500px"
              >
                {{ `${isAbsent(sched) && sched.absent_reason ? sched.absent_reason : isLate(sched) && sched.late_hours_reason ? sched.late_hours_reason : 'N/A'}` }}
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
      type: Boolean,
      default: false,
    },

    schedules: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    convertTimeToMinutes (payload) {
      let hour = parseInt(payload.split(":")[0]) * 60

      let minute = parseInt(payload.split(":")[1])

      return hour + minute
    },

    isAbsent (payload) {
      return payload.absent > 0
    },

    isLate (payload) {
      return (
        this.convertTimeToMinutes(payload.final_time_start) >
        this.convertTimeToMinutes(payload.time_start)
      )
    },
  },
}
</script>
