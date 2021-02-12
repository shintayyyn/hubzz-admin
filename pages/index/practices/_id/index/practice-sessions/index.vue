<template>
  <div class="mt-5">
    <div class="flex flex-row justify-start overflow-x-auto border-b border-gray-500 mb-4 pt-1">
      <nuxt-link
        v-if="practice && practice.type == 'Spoke'"
        :to="getRoute('practice-pending-sessions')"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`practice-pending-sessions`) || $route.path.includes(`surgery-pending-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Pending
      </nuxt-link>

      <nuxt-link 
        :to="getRoute('practice-live-sessions')"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`practice-live-sessions`) || $route.path.includes(`surgery-live-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Live
      </nuxt-link>

      <nuxt-link
        :to="getRoute('practice-applied-sessions')"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`practice-applied-sessions`) || $route.path.includes(`surgery-applied-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Applied
      </nuxt-link>

      <nuxt-link
        :to="getRoute('practice-allocated-sessions')"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`practice-allocated-sessions` ) || $route.path.includes(`surgery-allocated-sessions`)? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Allocated
      </nuxt-link> <!--may locum na, pero hindi pa nag sstart-->

      <!--Ongoing , nag start na, by job parts -->
      <nuxt-link 
        :to="getRoute('practice-ongoing-sessions')"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`practice-ongoing-sessions`) || $route.path.includes(`surgery-ongoing-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Ongoing
      </nuxt-link>

      <!--loob ng completed(specific completed), tabs: to be invoiced, disputed(na-invoice na pero may problema), invoiced--->
      <!--approved - job parts din ang naka display-->
      <nuxt-link 
        :to="getRoute('practice-completed-sessions')"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`practice-completed-sessions`) || $route.path.includes(`surgery-completed-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Completed
      </nuxt-link>

      <nuxt-link
        :to="getRoute('practice-approved-sessions')"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`practice-approved-sessions`) || $route.path.includes(`surgery-approved-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Approved
      </nuxt-link>

      <nuxt-link
        :to="getRoute('practice-unfilled-sessions')"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`practice-unfilled-sessions`) || $route.path.includes(`surgery-unfilled-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Unfilled
      </nuxt-link>

      <nuxt-link
        :to="getRoute('practice-cancelled-sessions')"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`practice-cancelled-sessions`) || $route.path.includes(`surgery-cancelled-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Cancelled
      </nuxt-link>
      
      <nuxt-link
        :to="getRoute('practice-withdrawn-sessions')"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`practice-withdrawn-sessions`) || $route.path.includes(`surgery-withdrawn-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Withdrawn
      </nuxt-link>
    </div>

    <div class="py-4">
      <nuxt-child :practice="practice" />
    </div>
  </div>
</template>

<script>
export default {
	transition: {
		name: "fade",
		mode: "out-in"
  },

  props: {
    practice: {
      type: Object,
      default: () => null,
    },
  },
  
	computed: {
		loadingJobs () {
			return this.$store.state.jobs.loading_jobs
		},
    getRoute () {
      return(tab) => {
        if(!tab){
          tab = ''
        }

        const query = {
          ...this.$route.query,
        }

        delete query.order_by

        delete query.status

        return {
          path: `/practices/${this.$route.params.id}/practice-sessions/${tab}`,
          query ,
        }
      }
    },
  },

  async asyncData ({ store, error }) {
    const authAdminPermissions = store.getters["permissions"]

    if (authAdminPermissions.includes('View Practice Sessions') === false) {
      error({
        statusCode: 403,
        message: 'You are not authorized to view this page.',
      })
      return
    }
  },
  
	created () {
    this.$store.commit("jobs/SET_SESSIONS_PRACTICE_ID_VIEWER", parseInt(this.$route.params.id))
      
		if (
			this.$route.name == "index-practices-id-index-practice-sessions-index"
		) {
			this.$router.push({
				path: `/practices/${this.practice.id}/practice-sessions/practice-live-sessions`,
				query: this.$route.query
			})
    }
  },
  
}
</script>
