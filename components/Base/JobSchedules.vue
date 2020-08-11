<template>
  <div>
    <div class="mt-2 md:my-0 md:mx-2 text-white font-semibold">
      Schedules
    </div>

    <div class="w-full flex flex-col m-2 mb-4 bg-waterloo">
      <div class="text-xs sm:text-sm overflow-y-auto" style="max-height:205px;">
        <div style="position:sticky;top:0" class="flex">
          <p
            class="bg-gray-400 p-1 font-bold text-xs"
            :style="
              ['Completed', 'Approved'].includes(modalJobPart.status)
                ? 'min-width:100px;max-width:100px'
                : 'min-width:190px;max-width:190px'
            "
          >
            DATE
          </p>

          <p
            v-if="['Completed', 'Approved'].includes(modalJobPart.status)"
            class="text-center bg-gray-400 p-1 font-bold text-xs"
            style="min-width:100px;max-width:100px"
          >
            FINAL TIME
          </p>

          <p
            class="text-center bg-gray-400 p-1 font-bold text-xs"
            :style="
              ['Completed', 'Approved'].includes(modalJobPart.status)
                ? 'min-width:100px;max-width:100px'
                : 'min-width:180px;max-width:180px'
            "
          >
            SHIFT
          </p>

          <p
            class="text-center bg-gray-400 p-1 font-bold text-xs"
            :style="
              ['Completed', 'Approved'].includes(modalJobPart.status)
                ? 'min-width:100px;max-width:100px'
                : 'min-width:180px;max-width:180px'
            "
          >
            RATE
          </p>

          <template v-if="['Completed', 'Approved'].includes(modalJobPart.status)">
            <p
              class="text-center bg-gray-400 p-1 font-bold text-xs"
              style="min-width:100px;max-width:100px"
            >
              REMARKS
            </p>

            <p
              class="text-center bg-gray-400 p-1 font-bold text-xs"
              style="min-width:100px;max-width:100px"
            >
              REASON
            </p>
          </template>
        </div>

        <div class="text-white">
          <div v-for="(sched, index) in modalJobPart.schedules" :key="index" class="flex pb-2">
            <p
              :style="
                ['Completed', 'Approved'].includes(modalJobPart.status)
                  ? 'min-width:100px;max-width:100px'
                  : 'min-width:190px;max-width:190px'
              "
            >
              {{ $moment(sched.date, 'YYYY-MM-DD').format('DD/MM/YYYY') }} | {{ sched.time_start }}-{{ sched.time_end }}
            </p>

            <p
              v-if="['Completed', 'Approved'].includes(modalJobPart.status)"
              class="text-center"
              style="min-width:100px;max-width:100px"
            >
              {{ sched.final_time_start }} - {{ sched.final_time_end }}
            </p>

            <p
              class="text-center"
              :style="
                ['Completed', 'Approved'].includes(modalJobPart.status)
                  ? 'min-width:100px;max-width:100px'
                  : 'min-width:180px;max-width:180px'
              "
            >
              {{ sched.shift.name }}
            </p>

            <p
              class="text-center"
              :style="
                ['Completed', 'Approved'].includes(modalJobPart.status)
                  ? 'min-width:100px;max-width:100px'
                  : 'min-width:180px;max-width:180px'
              "
            >
              £{{ sched.rate }} {{ sched.locum_detail_rate_type.name }}
            </p>

            <template v-if="['Completed', 'Approved'].includes(modalJobPart.status)">
              <p
                class="text-center"
                style="min-width:100px;max-width:100px"
              >
                {{ `${isAbsent(sched) ? 'Absent' : isLate(sched) ? 'Late' : 'N/A'}` }}
              </p>
              <p
                class="text-center"
                style="min-width:100px;max-width:100px"
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
    modalJobPart: {
      type: Object,
      default: () => null,
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
