<template>
	<div class="flex-1 flex flex-col overflow-hidden py-2 px-4 md:px-8">
		<div class="text-4xl text-white">Dashboard</div>

		<div class="text-sm font-hairline text-white">Work in progress</div>
		<div class="flex flex-wrap items-start text-white">
			<!------------------------------ Column 1 -------------------------------->
			<div class="my-1 md:w-1/3 w-full md:px-3">
				<div class="my-3">Locums</div>
				<div class="overflow-y-auto overflow-x-hidden px-2" style="max-height: 500px;">
					<nuxt-link
						v-for="(item, index) in locumDocsAlert"
						:key="`item-${index}`"
						:to="{
							path: `/locums/${item.locum_user.id}/locum-compliance/${item.compliance_document.id}`
						}"
						class="inline-block w-full p-3 mb-2 shadow-md text-white bg-waterloo hover:bg-waterloo-light transition-hover rounded-lg"
					>
						<div
							class="font-hairline text-xs uppercase"
						>{{ $moment(item.uploaded_at).format("MMMM DD, YYYY | HH:mm") }}</div>
						<div class="w-full flex flex-col leading-tight sm:my-1 pt-1">
							<span class="uppercase text-xs font-bold">Locum</span>
							<span class="pb-2">{{ item.locum_user.name }}</span>
							<span class="uppercase text-xs font-bold">Uploaded Compliance Document</span>
							<span class>{{ item.compliance_document.name }}</span>
						</div>
					</nuxt-link>
				</div>
				<div class="my-3">Activity Log</div>
				<div class="overflow-y-auto overflow-x-hidden px-2" style="max-height: 500px;">
					<div
						class="inline-block w-full p-3 mb-2 shadow-md text-white bg-waterloo hover:bg-waterloo-light transition-hover rounded-lg"
					>
						<p class="text-white text-center">Work In Progress.</p>
					</div>
				</div>
			</div>
			<!------------------------------ Column 2 ------------------------------>
			<div class="my-1 md:w-1/3 w-full md:px-3">
				<div class="my-3">Practices</div>
				<div class="border-b border-white">
					<div class="overflow-y-auto overflow-x-hidden px-2" style="max-height: 500px;">
						<div
							class="inline-block w-full p-3 mb-2 shadow-md text-white bg-waterloo hover:bg-waterloo-light transition-hover rounded-lg"
						>
							<p class="text-white text-center">Work In Progress.</p>
						</div>
					</div>
				</div>
				<div class="my-3">Activity Log</div>
				<div class="overflow-y-auto overflow-x-hidden px-2" style="max-height: 500px;">
					<div
						class="inline-block w-full p-3 mb-2 shadow-md text-white bg-waterloo hover:bg-waterloo-light transition-hover rounded-lg"
					>
						<p class="text-white text-center">Work In Progress.</p>
					</div>
				</div>
			</div>
			<!------------------------------ Column 3 ----------------------------->
			<div class="my-1 md:w-1/3 w-full md:px-3">
				<div class="my-3">Billings</div>
				<div class="border-b border-white">
					<div class="overflow-y-auto overflow-x-hidden px-2" style="max-height: 500px;">
						<div
							class="inline-block w-full p-3 mb-2 shadow-md text-white bg-waterloo hover:bg-waterloo-light transition-hover rounded-lg"
						>
							<p class="text-white text-center">Work In Progress.</p>
						</div>
					</div>
				</div>
				<div class="my-3">Activity Log</div>
				<div class="overflow-y-auto overflow-x-hidden px-2" style="max-height: 500px;">
					<div
						class="inline-block w-full p-3 mb-2 shadow-md text-white bg-waterloo hover:bg-waterloo-light transition-hover rounded-lg"
					>
						<p class="text-white text-center">Work In Progress.</p>
					</div>
				</div>
			</div>
		</div>

		<div class="shield" v-if="promptModal" @click="closeModals()"></div>
		<transition name="slide" mode="out-in">
			<div
				class="confirm-termination-modal flex items-center border-l-4 border-r-4 border-sunglow shadow-lg"
				v-if="promptModal"
			>
				<ChangePasswordPrompt @close="promptModal = false" />
			</div>
		</transition>
	</div>
</template>
<script>
import ChangePasswordPrompt from "@/components/UserManagement/ChangePasswordPrompt";
export default {
	components: {
		ChangePasswordPrompt
	},
	data() {
		return {
			me: "",
			promptModal: false
		};
	},
	async created() {
		console.log('meee', this.me)
		if (!this.me.password_updated_at) {
			this.promptModal = true;
		}
	},
	computed: {
		locumDocsAlert() {
			return this.$store.state.locums.locumDocAlert;
		}
	},
	async asyncData({ app, store, route }) {
		try {
			let response = await app.$axios.$get(
				`/api/v1/admin/locum-detail-compliance-documents`
			);
			const locumDocAlert = response.data.locum_detail_compliance_documents;

			await store.commit("locums/SET_LOCUM_DOC_ALERT", locumDocAlert);

			response = await app.$axios.$get(`/api/v1/admin/me`);
			const me = response.data.user;
			return {
				me
			};
		} catch (err) {
			// store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
			console.log("Get locums error! 111", err);
		}
	},
	methods: {
		closeModals() {
			this.promptModal = false;
		}
	}
};
</script>
<style>
.shield {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #333;
	opacity: 0.5;
	z-index: 511;
}
.confirm-termination-modal {
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	border-radius: 25px;
	width: 800px;
	max-width: 95%;
	/* max-height: 80%; */
	min-height: 50%;
	overflow: auto;
	transition: all 0.3s ease-in-out;
	background-color: #505561;
	z-index: 512;
}

@media screen and (min-width: 1200px) {
	.confirm-termination-modal {
		max-height: 50%;
		min-height: 50%;
	}
}
</style>
