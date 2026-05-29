<template>
  <div>
    <JobPartModal v-if="syntheticJobPart" :specificJobPart="syntheticJobPart" :isNuxtChild="false" />
  </div>
</template>

<script>
import JobPartModal from '@/components/Base/JobPartModal'
export default {
  components: {
    JobPartModal
  },
  props: {
    job: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    syntheticJobPart() {
      if (!this.job || Object.keys(this.job).length === 0) return null
      const firstJobPart = this.job.job_parts && this.job.job_parts.length ? this.job.job_parts[0] : null
      return {
        ...this.job,
        ...firstJobPart,
        id: firstJobPart?.id || this.job.id,
        job: this.job,
        job_id: this.job.id,
        job_part_number: firstJobPart?.job_part_number || this.job.job_number || '',
        job_part_id: firstJobPart?.id || this.job.id,
        part: firstJobPart?.part || 1,
        parts: this.job.job_parts ? this.job.job_parts.length : 1,
        days: firstJobPart?.days || this.job.days,
        status: firstJobPart?.status || this.job.status,
        locum_invoiceable: firstJobPart?.locum_invoiceable || this.job.locum_invoiceable || this.job.status === 'Completed',
        schedules: firstJobPart?.schedules || this.job.schedules,
        job_part_gross_rate_formatted:
          firstJobPart?.job_part_gross_rate_formatted || this.job.job_part_gross_rate_formatted || this.job.job_rate_ranged_formatted,
        job_part_hubzz_fee_formatted: firstJobPart?.job_part_hubzz_fee_formatted || this.job.job_part_hubzz_fee_formatted || '',
        job_part_total_original_hours_in_minutes_formatted:
          firstJobPart?.job_part_total_original_hours_in_minutes_formatted ||
          this.job.job_part_total_original_hours_in_minutes_formatted ||
          this.job.total_hours,
        job_part_total_final_hours_in_minutes_formatted:
          firstJobPart?.job_part_total_final_hours_in_minutes_formatted ||
          this.job.job_part_total_final_hours_in_minutes_formatted ||
          this.job.total_hours,
        invoiced: firstJobPart?.invoiced || this.job.invoiced,
        issued: firstJobPart?.issued || this.job.issued
      }
    }
  }
}
</script>
