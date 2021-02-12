<template>
  <div class="mt-5">
    <div class="flex flex-row justify-start overflow-x-auto border-b border-gray-500 mb-4 pt-1">
      <nuxt-link
        v-if="practice && practice.type == 'Spoke' || practiceSurgery"
        :to="getRoute(practiceSurgery ? 'surgery-pending-sessions' : 'practice-pending-sessions')"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`practice-pending-sessions`) || $route.path.includes(`surgery-pending-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Pending
      </nuxt-link>

      <nuxt-link 
        :to="getRoute(practiceSurgery ? 'surgery-live-sessions' : 'practice-live-sessions')"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`practice-live-sessions`) || $route.path.includes(`surgery-live-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Live
      </nuxt-link>

      <nuxt-link
        :to="getRoute(practiceSurgery ? 'surgery-applied-sessions' : 'practice-applied-sessions')"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`practice-applied-sessions`) || $route.path.includes(`surgery-applied-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Applied
      </nuxt-link>

      <nuxt-link
        :to="getRoute(practiceSurgery ? 'surgery-allocated-sessions' : 'practice-allocated-sessions')"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`practice-allocated-sessions` ) || $route.path.includes(`surgery-allocated-sessions`)? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Allocated
      </nuxt-link> <!--may locum na, pero hindi pa nag sstart-->

      <!--Ongoing , nag start na, by job parts -->
      <nuxt-link 
        :to="getRoute(practiceSurgery ? 'surgery-ongoing-sessions' : 'practice-ongoing-sessions')"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`practice-ongoing-sessions`) || $route.path.includes(`surgery-ongoing-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Ongoing
      </nuxt-link>

      <!--loob ng completed(specific completed), tabs: to be invoiced, disputed(na-invoice na pero may problema), invoiced--->
      <!--approved - job parts din ang naka display-->
      <nuxt-link 
        :to="getRoute(practiceSurgery ? 'surgery-completed-sessions' : 'practice-completed-sessions')"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`practice-completed-sessions`) || $route.path.includes(`surgery-completed-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Completed
      </nuxt-link>

      <nuxt-link
        :to="getRoute(practiceSurgery ? 'surgery-approved-sessions' : 'practice-approved-sessions')"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`practice-approved-sessions`) || $route.path.includes(`surgery-approved-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Approved
      </nuxt-link>

      <nuxt-link
        :to="getRoute(practiceSurgery ? 'surgery-unfilled-sessions' : 'practice-unfilled-sessions')"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`practice-unfilled-sessions`) || $route.path.includes(`surgery-unfilled-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Unfilled
      </nuxt-link>

      <nuxt-link
        :to="getRoute(practiceSurgery ? 'surgery-cancelled-sessions' : 'practice-cancelled-sessions')"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`practice-cancelled-sessions`) || $route.path.includes(`surgery-cancelled-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Cancelled
      </nuxt-link>
      
      <nuxt-link
        :to="getRoute(practiceSurgery ? 'surgery-withdrawn-sessions' : 'practice-withdrawn-sessions')"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.path.includes(`practice-withdrawn-sessions`) || $route.path.includes(`surgery-withdrawn-sessions`) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Withdrawn
      </nuxt-link>
    </div>

    <div
      v-if="$route.name.includes('spokeSessionId')"
      class="practice-shield"
      @click="$router.go(-1)"
    />

    <div
      v-if="$route.name.includes('spokeSessionPartId')"
      class="practice-shield"
      @click="$router.go(-1)"
    />

    <nuxt-child />
  </div>
</template>

<script>
import SessionsTabs from "@/components/Practices/SessionsTabs"
// import AppLoading from "@/components/Base/AppLoading"

export default {
	components: {
		SessionsTabs,
		// AppLoading,
  },
  
	data () {
		return {
			practice: "",
			practice_surgery: ""
		}
	},
	computed: {
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
          path: this.practiceSurgery
            ? `/practices/${this.$route.params.id}/practice-surgeries/${this.$route.params.practiceSurgeryId}/surgery-sessions/${tab}`
            : `/practices/${this.$route.params.id}/practice-sessions/${tab}`,
          query ,
        }
      }
    },
	},

	async asyncData ({ app, route, store }) {
		try {
			let response = await app.$axios.$get(
				`/api/v1/admin/practices/${route.params.id}`
			)
			const practice = response.data.practice
			response = await app.$axios.$get(
				`/api/v1/admin/practices/${practice.id}/practice-surgeries/${route.params.practiceSurgeryId}`
			)
			const practice_surgery = response.data.practice_surgery
			return {
				practice,
				practice_surgery
			}
		} catch (err) {
			store.commit("SET_NOTIFICATION", {
				enabled: true,
				status: "danger",
				text: "Something went wrong!"
			})
			console.log("get practice/practice surgery error", err)
		}
	},
}
</script>
