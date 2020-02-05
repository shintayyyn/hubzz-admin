<template>
	<div class="locum-modal shadow-lg">
		<div class="px-4 md:px-8">
			<div class="py-4">
				<svgicon
					@click="$router.push('/locums')"
					name="arrow-left-solid"
					height="32"
					widht="32"
					class="text-white hover:text-sunglow fill-current cursor-pointer"
				/>
			</div>
			<LocumTabs :user="user" />
			<!-- <div class="locum-shield" v-if="$route.name.includes('index-locum-compliance-docId')" /> -->
			<div class="locum-shield" v-if="$route.name.includes('locumJobPartId')" @click="$router.go(-1)"></div>
			<div
				class="locum-shield"
				v-if="$route.name.includes('index-locum-compliance-docId')"
				@click="$router.go(-1)"
			/>
			<div class="locum-shield" v-if="$route.name.includes('locumJobId')" @click="$router.go(-1)"></div>
		</div>
		<nuxt-child />
	</div>
</template>
<script>
import LocumTabs from "@/components/Locums/LocumTabs";
export default {
	components: {
		LocumTabs
	},
	computed: {
		user() {
			return this.$store.state.locums.locumUser;
		}
	},
	async asyncData({ app, store, route, error }) {
		try {
			let response = await app.$axios.$get(
				`/api/v1/admin/locum-users/${route.params.id}`
			);
			const user = response.data.user;

			await store.commit("locums/SET_LOCUM_USER", user);

			return {};
		} catch (err) {
			error({ statusCode: 404 });
			store.commit("SET_NOTIFICATION", {
				enabled: true,
				status: "danger",
				text: "Something went wrong!"
			});
			console.log("Get specific locum error!", err);
		}
	},
	methods: {
		goBack() {
			const query = {
				...this.$route.query
			};
			if (query.job_status) {
				delete query.job_status;
			}
			this.$router.push({ path: "/locums", query });
		}
	}
};
</script>
<style>
.locum-shield {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #333;
	opacity: 0.5;
	z-index: 511;
}
.locum-modal {
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
	.locum-modal {
		width: 80%;
	}
}
</style>
