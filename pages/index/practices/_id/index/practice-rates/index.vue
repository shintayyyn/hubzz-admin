<template>
	<div class="mt-5">
		<PracticeRates :practice="practice" @update="updatePractice()" />
	</div>
</template>
<script>
import PracticeRates from "@/components/Practices/PracticeRates";
export default {
	transition: {
		name: "fade",
		mode: "out-in"
	},
	components: {
		PracticeRates
	},
	data() {
		return {
			// practice:null
		};
	},
	computed: {
		practice() {
			return this.$store.state.practices.practice;
		}
	},
	async asyncData({ app, store, route }) {
		try {
			let response = await app.$axios.$get(
				`/api/v1/admin/practices/${route.params.id}`
			);
			const practice = response.data.practice;
			store.commit("practices/SET_SPECIFIC_PRACTICE", practice);
			return {
				// practice
			};
		} catch (err) {
			store.commit("SET_NOTIFICATION", {
				enabled: true,
				status: "danger",
				text: "Something went wrong!"
			});
			console.log("get practice error!!!!", err);
		}
	},
	methods: {
		updatePractice() {
			this.$axios
				.$get(`/api/v1/admin/practices/${this.$route.params.id}`)
				.then(res => {
					const practice = response.data.practice;
					this.$store.commit("practices/SET_SPECIFIC_PRACTICE", practice);
					console.log("qweqwe");
				})
				.catch(err => {
					store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: "Something went wrong!"
					});
					console.log("get practice error!!!!", err);
				});
		}
	}
};
</script>
<style>
</style>