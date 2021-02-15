<template>
  <div class="mt-5">
    <div class="flex flex-row justify-start overflow-x-auto border-b border-gray-500 mb-4 pt-1">
      <nuxt-link
        :to="`/practices/${this.$route.params.id}/practice-surgeries/${this.$route.params.practiceSurgeryId}/surgery-sessions/surgery-pending-sessions`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`surgery-pending-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Pending
      </nuxt-link>

      <nuxt-link 
        :to="`/practices/${this.$route.params.id}/practice-surgeries/${this.$route.params.practiceSurgeryId}/surgery-sessions/surgery-live-sessions`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`surgery-live-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Live
      </nuxt-link>

      <nuxt-link
        :to="`/practices/${this.$route.params.id}/practice-surgeries/${this.$route.params.practiceSurgeryId}/surgery-sessions/surgery-applied-sessions`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`surgery-applied-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Applied
      </nuxt-link>

      <nuxt-link
        :to="`/practices/${this.$route.params.id}/practice-surgeries/${this.$route.params.practiceSurgeryId}/surgery-sessions/surgery-allocated-sessions`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`surgery-allocated-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Allocated
      </nuxt-link> <!--may locum na, pero hindi pa nag sstart-->

      <!--Ongoing , nag start na, by job parts -->
      <nuxt-link 
        :to="`/practices/${this.$route.params.id}/practice-surgeries/${this.$route.params.practiceSurgeryId}/surgery-sessions/surgery-ongoing-sessions`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`surgery-ongoing-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Ongoing
      </nuxt-link>

      <!--loob ng completed(specific completed), tabs: to be invoiced, disputed(na-invoice na pero may problema), invoiced--->
      <!--approved - job parts din ang naka display-->
      <nuxt-link 
        :to="`/practices/${this.$route.params.id}/practice-surgeries/${this.$route.params.practiceSurgeryId}/surgery-sessions/surgery-completed-sessions`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`surgery-completed-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Completed
      </nuxt-link>

      <nuxt-link
        :to="`/practices/${this.$route.params.id}/practice-surgeries/${this.$route.params.practiceSurgeryId}/surgery-sessions/surgery-approved-sessions`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`surgery-approved-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Approved
      </nuxt-link>

      <nuxt-link
        :to="`/practices/${this.$route.params.id}/practice-surgeries/${this.$route.params.practiceSurgeryId}/surgery-sessions/surgery-unfilled-sessions`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`surgery-unfilled-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Unfilled
      </nuxt-link>

      <nuxt-link
        :to="`/practices/${this.$route.params.id}/practice-surgeries/${this.$route.params.practiceSurgeryId}/surgery-sessions/surgery-cancelled-sessions`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`surgery-cancelled-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Cancelled
      </nuxt-link>
      
      <nuxt-link
        :to="`/practices/${this.$route.params.id}/practice-surgeries/${this.$route.params.practiceSurgeryId}/surgery-sessions/surgery-withdrawn-sessions`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`surgery-withdrawn-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Withdrawn
      </nuxt-link>
    </div>
    <nuxt-child
      :practice="practice"
      :practiceSurgery="practiceSurgery" 
    />
  </div>
</template>

<script>
export default {
  props: {
    practice: {
      type: Object,
      default: () => null,
    },

    practiceSurgery: {
      type: Object,
      default: () => null,
    },
  },
}
</script>
