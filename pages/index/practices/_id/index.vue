<template>
	<div class="practice-modal p-4 md:p-8 shadow-lg">
		<nuxt-link :to="{path:'/practices', query:$route.query}">
			<div class="mb-4">
				<svgicon
					name="arrow-left-solid"
					height="32"
					width="32"
					class="cursor-pointer text-white hover:text-sunglow fill-current"
				/>
			</div>
		</nuxt-link>
		<PracticeTabs :practice="practice" />
		<nuxt-child />
		<div 
      class="practice-shield" 
      v-if="$route.name.includes('pracUserId')"
       @click="$router.go(-1)"></div>

		<div 
      class="practice-shield" 
      v-if="$route.name.includes('pracDocId')" 
      @click="$router.go(-1)"></div>

		<div
			class="practice-shield"
			v-if="$route.name.includes('practiceSessionId')"
			@click="$router.go(-1)"
		></div>

		<div
			class="practice-shield"
			v-if="$route.name.includes('practiceSurgeryId')"
			@click="$router.push(`/practices/${$route.params.id}/practice-surgeries`)"
		></div>

		<div 
      class="practice-shield" 
      v-if="$route.name.includes('practiceSessionPartId')" 
      @click="$router.go(-1)"></div>

    <div 
      class="practice-shield" 
      v-if="$route.name.includes('add-spoke')" 
      @click="$router.go(-1)"></div>
	</div>
</template>
<script>
import PracticeTabs from "@/components/Practices/PracticeTabs";
export default {
	components: {
		PracticeTabs
	},
	computed: {
		practice() {
			return this.$store.state.practices.practice;
		}
	},
	async asyncData({ app, store, route, error }) {
		try {
			let response = await app.$axios.$get(
				`/api/v1/admin/practices/${route.params.id}`
			);
			const practice = response.data.practice;
			await store.commit("practices/SET_SPECIFIC_PRACTICE", practice);
			return {};
		} catch (err) {
			error({ statusCode: 404 });
			store.commit("SET_NOTIFICATION", {
				enabled: true,
				status: "danger",
				text: "Something went wrong!"
			});
			console.log("get practice error!!!!", err);
		}
	},
	methods: {
		goBack() {
			const query = {
				...this.$route.query
			};
			this.$router.push({ path: "/practices", query });
		}
	}
};
</script>
<style>
.card {
	min-width: 100px;
	height: 250px;
	box-sizing: content-box;
}
.practice-shield {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #333;
	opacity: 0.5;
	z-index: 511;
}
.practice-modal {
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
	.practice-modal {
		width: 80%;
	}
}
</style>
