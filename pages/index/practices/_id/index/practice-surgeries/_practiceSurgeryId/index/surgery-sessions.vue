<template>
  <div class="mt-5">
    <SessionsTabs
      :practice="practice"
      :practiceSurgery="practice_surgery"
    />

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
