<template>
  <div class="compliance-modal shadow-lg">
    <LocumComplianceFile :user="user" :complianceDoc="compliance_doc" />
  </div>
</template>
<script>
import LocumComplianceFile from "@/components/Locums/LocumComplianceFile"
export default {
	transition: {
		name: "slide",
		mode: "out-in"
	},
	components: {
		LocumComplianceFile
	},
	data () {
		return {
			compliance_doc: null
			// user:null
		}
  },
	computed: {
		user () {
			return this.$store.state.locums.locumUser
		}
	},
	async asyncData ({ app, store, route, error }) {
		try {
			let response = await app.$axios.$get(
				`/api/v1/admin/locum-users/${route.params.id}`
			)
			const user = response.data.user

			response = await app.$axios.$get(
				`/api/v1/admin/locum-users/${user.id}/locum-detail-mandatory-trainings/${route.params.docId}`
			)
			const compliance_doc = response.data.locum_detail_mandatory_training

			await store.commit("locums/SET_LOCUM_USER", user)

			return {
				compliance_doc
				// user
			}
		} catch (err) {
			error({ statusCode: 404 })
			store.commit("SET_NOTIFICATION", {
				enabled: true,
				status: "danger",
				text: "Something went wrong!"
			})
			console.log("index practices index create asyncData err", err)
		}
	},
  created (){
    console.log('route', this.$route.name)
  }
}
</script>

<style>
.compliance-modal {
	position: fixed;
	top: 0;
	right: 0;
	margin-right: 0%;
	width: 100%;
	height: 100%;
	overflow: auto;
	border-left: solid 2px #ffc72c;
	transition: all 0.3s ease-in-out;
	background-color: #505561;
	z-index: 512;
}
@media screen and (min-width: 1200px) {
	.compliance-modal {
		width: 70%;
	}
}
</style>
