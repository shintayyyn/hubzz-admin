<template>
  <div class="fixed inset-y-0 right-0 m-0 w-full h-full xl:w-4/5 z-512 overflow-auto border-l-2 border-sunglow bg-trout p-2 md:p-4 shadow-lg" style="transition: all 0.3s ease-in-out;">
    <div class="flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm text-white">
        <nuxt-link to="/content-management/job-parts" class="text-white hover:text-sunglow p-1">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="flex-1 flex flex-col py-2">
        <div class="text-xl md:text-2xl text-white">
          <span>View Job</span>
        </div>
    
        <div class="flex text-white my-4 py-2 px-3 bg-waterloo-dark shadow rounded-lg text-sm max-w-lg">
          <div class="w-full text-gray-300 text-sm p-2">
            <div class="flex flex-col py-2">
              <div class="relative flex justify-between flex-wrap leading-none">
                <label class="text-xs sm:text-sm py-1 pr-2 font-bold">
                  <span>Job Part ID</span>
                </label>
              </div>
      
              <div class="flex flex-row justify-start">
                <div class="flex flex-col w-full">
                  <span class="pl-4 py-2 font-bold text-xs sm:text-sm">
                    <span>{{ jobPartSchedule ? jobPartSchedule.id : null }}</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="flex flex-col py-2">
              <div class="relative flex justify-between flex-wrap leading-none">
                <label class="text-xs sm:text-sm py-1 pr-2 font-bold">
                  <span>Job ID</span>
                </label>
              </div>
      
              <div class="flex flex-row justify-start">
                <div class="flex flex-col w-full">
                  <span class="pl-4 py-2 font-bold text-xs sm:text-sm">
                    <span>{{ jobPartSchedule ? jobPartSchedule.job_id : null }}</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="flex flex-col py-2">
              <div class="relative flex justify-between flex-wrap leading-none">
                <label class="text-xs sm:text-sm py-1 pr-2 font-bold">
                  <span>Job Type</span>
                </label>
              </div>
      
              <div class="flex flex-row justify-start">
                <div class="flex flex-col w-full">
                  <span class="pl-4 py-2 font-bold text-xs sm:text-sm">
                    <span>{{ jobPartSchedule && jobPartSchedule.job ? jobPartSchedule.job.type : null }}</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="flex flex-col py-2">
              <div class="relative flex justify-between flex-wrap leading-none">
                <label class="text-xs sm:text-sm py-1 pr-2 font-bold">
                  <span>Job Part Number</span>
                </label>
              </div>
      
              <div class="flex flex-row justify-start">
                <div class="flex flex-col w-full">
                  <span class="pl-4 py-2 font-bold text-xs sm:text-sm">
                    <span>{{ jobPartSchedule ? jobPartSchedule.job_part_number : null }}</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="flex flex-col py-2">
              <div class="relative flex justify-between flex-wrap leading-none">
                <label class="text-xs sm:text-sm py-1 pr-2 font-bold">
                  <span>Status</span>
                </label>
              </div>
      
              <div class="flex flex-row justify-start">
                <div class="flex flex-col w-full">
                  <span class="pl-4 py-2 font-bold text-xs sm:text-sm">
                    <span>{{ jobPartSchedule ? jobPartSchedule.status : null }}</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="flex flex-col py-2">
              <div class="relative flex justify-between flex-wrap leading-none">
                <label class="text-xs sm:text-sm py-1 pr-2 font-bold">
                  <span>Created At</span>
                </label>
              </div>
      
              <div class="flex flex-row justify-start">
                <div class="flex flex-col w-full">
                  <span class="pl-4 py-2 font-bold text-xs sm:text-sm">
                    <span>{{
                      jobPartSchedule && jobPartSchedule.created_at
                        ? $moment(jobPartSchedule.created_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS').format('DD/MM/YYYY | HH:mm')
                        : null
                    }}</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="flex flex-col py-2">
              <div class="relative flex justify-between flex-wrap leading-none">
                <label class="text-xs sm:text-sm py-1 pr-2 font-bold">
                  <span>Job Part</span>
                </label>
              </div>
      
              <div class="flex flex-row justify-start">
                <div class="flex flex-col w-full">
                  <span class="pl-4 py-2 font-bold text-xs sm:text-sm overflow-auto bg-trout" style="height: 300px;">
                    <span class="whitespace-pre-wrap">{{ jobPartSchedule ? JSON.stringify(jobPartSchedule, null, 4) : null }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loading: false,
        jobPartSchedule: null,
      }
    },

    mounted () {
      this.loading = true
      this.$axios.get(`/api/v1/admin/job-part-schedules/${this.$route.params.id}`).then((response) => {
        this.jobPartSchedule = response.data.data.job_part_schedule
      }).catch((err) => {
        console.log('err', err)
        this.$nuxt.error(err)
      }).finally(() => {
        this.loading = true
      })
    },
  }
</script>
