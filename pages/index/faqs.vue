<template>
	<section class="flex-1 flex flex-col overflow-hidden py-2">
		<transition name="drop" mode="out-in">
			<AppConfirm
				v-if="confirm"
				:message="'Are you sure you want to delete this FAQ?'"
				@cancel="confirm = false"
				@confirm="toDeleteFaq(toDeleteFaqId)"
			/>
		</transition>
		<div class="shield" v-if="confirm" @click="confirm = false"></div>
		<div class="px-4 md:px-6">
			<div class="text-xl md:text-4xl text-white pb-4">Frequently Asked Questions</div>
			<div class="rounded-lg text-white bg-charade shadow-lg p-3 md:p-5">
				<div class="w-full inline-flex flex-wrap justify-between font-bold mb-2">
					<div class="flex items-center mr-2">Locum</div>
					<div class="flex items-center">
						<AppButton
							v-if="authAdminPermissions.includes('Create New FAQ')"
							:label="'Add'"
							:icon="'add-rectangle'"
							:nuxtLink="{ path: `/faqs/addFaq`, query: {domain: 'Locum'}}"
							class="text-sm"
						/>
						<AppButton
							v-if="
								authAdminPermissions.includes('Delete FAQ') &&
									locumFaqs.length > 0
							"
							:label="deleteLocumFaq ? 'Done' : 'Delete'"
							:icon="deleteLocumFaq ? 'circle-check' : 'garbage'"
							:iconSize="'18'"
							:background="deleteLocumFaq ? 'green' : 'red'"
							class="text-white ml-2 text-sm"
							@click="deleteLocumFaq = !deleteLocumFaq"
						/>
					</div>
				</div>
				<!-- -------------------------------------------------------------------------- -->
				<div v-for="item in locumFaqs" :key="item.id" class="inline-flex w-full">
					<nuxt-link
						v-if="deleteLocumFaq == false && authAdminPermissions.includes('Edit FAQ')"
						:to="{ path: `/faqs/${item.id}` }"
						class="flex cursor-pointer mr-2 md:mr-4 mt-5"
					>
						<svgicon
							name="edit"
							width="21"
							height="21"
							class="fill-current text-white hover:text-sunglow"
						/>
					</nuxt-link>
					<div
						v-if="deleteLocumFaq == true && authAdminPermissions.includes('Delete FAQ')"
						@click="deleteFaq(item.id)"
						class="flex cursor-pointer mr-2 md:mr-4 mt-5"
					>
						<svgicon
							name="garbage"
							width="21"
							height="21"
							class="fill-current text-red-800 hover:text-red-600"
						/>
					</div>
					<div class="w-full my-1">
						<div
							class="flex bg-trout hover:bg-waterloo-dark transition-hover transition-hover py-2 px-4 md:py-4 flex justify-between items-center cursor-pointer"
							@click="toggleFaqOn(item)"
						>
							<div>{{item.question}}</div>
							<div>
								<svgicon
									name="arrow-right"
									height="15"
									width="15"
									:class="item.toggled ? 'rotate' : 'arrow'"
									color="white white"
								/>
							</div>
						</div>
						<transition name="slide-down" mode="out-in">
							<div v-if="item.toggled">
								<no-ssr>
									<quill-editor class="border-none" :options="options" :content="item.answer" disabled></quill-editor>
								</no-ssr>
							</div>
						</transition>
					</div>
				</div>
				<div v-if="locumFaqs.length === 0" class="text-waterloo">No Frequently Asked Questions for Locum</div>
				<!---------------------------------------------------------------------------------->
				<div class="w-full inline-flex flex-wrap justify-between font-bold my-2">
					<div class="flex items-center mr-2">Practice</div>
					<div class="flex">
						<AppButton
							v-if="authAdminPermissions.includes('Create New FAQ')"
							:label="'Add'"
							:icon="'add-rectangle'"
							:nuxtLink="{ path: `/faqs/addFaq`, query: {domain: 'Practice'}}"
							class="text-sm"
						/>
						<AppButton
							v-if="authAdminPermissions.includes('Delete FAQ') && practiceFaqs.length > 0"
							:label="deletePracticeFaq ? 'Done' : 'Delete'"
							:icon="deletePracticeFaq ? 'circle-check' : 'garbage'"
							:iconSize="'18'"
							:background="deletePracticeFaq ? 'green' : 'red'"
							class="text-white ml-2 text-sm"
							@click="deletePracticeFaq = !deletePracticeFaq"
						/>
					</div>
				</div>
				<!-- ---------------------------------------------------------------------------- -->
				<div v-for="item in practiceFaqs" :key="item.id" class="inline-flex w-full">
					<nuxt-link
						v-if="deletePracticeFaq == false && authAdminPermissions.includes('Edit FAQ')"
						:to="{ path: `/faqs/${item.id}` }"
						class="flex cursor-pointer mr-2 md:mr-4 mt-5"
					>
						<svgicon
							name="edit"
							width="21"
							height="21"
							class="fill-current text-white hover:text-sunglow"
						/>
					</nuxt-link>
					<div
						v-if="deletePracticeFaq == true && authAdminPermissions.includes('Delete FAQ')"
						@click="deleteFaq(item.id)"
						class="flex cursor-pointer mr-2 md:mr-4 mt-5"
					>
						<svgicon
							name="garbage"
							width="21"
							height="21"
							class="fill-current text-red-800 hover:text-red-600"
						/>
					</div>
					<div class="w-full my-1">
						<div
							class="flex bg-trout hover:bg-waterloo-dark transition-hover transition-hover py-2 px-4 md:py-4 flex justify-between items-center cursor-pointer"
							@click="toggleFaqOn(item)"
						>
							<div>{{item.question}}</div>
							<div>
								<svgicon
									name="arrow-right"
									height="15"
									width="15"
									:class="item.toggled ? 'rotate' : 'arrow'"
									color="white white"
								/>
							</div>
						</div>
						<transition name="slide-down" mode="out-in">
							<div v-if="item.toggled">
								<no-ssr>
									<quill-editor class="border-none" :options="options" :content="item.answer" disabled></quill-editor>
								</no-ssr>
							</div>
						</transition>
					</div>
				</div>
				<div
					v-if="practiceFaqs.length === 0"
					class="text-waterloo"
				>No Frequently Asked Questions for Practice</div>
				<div
					class="faq-shield"
					v-if="
						$route.name.includes('index-faqs-index-addFaq') ||
							$route.name.includes('index-faqs-index-id')
					"
					@click="$router.go(-1)"
				></div>
			</div>
			<nuxt-child />
		</div>
	</section>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import AppConfirm from "@/components/Base/AppConfirm";
export default {
	components: {
		AppButton,
		AppConfirm
	},
	data() {
		return {
			deleteLocumFaq: false,
			deletePracticeFaq: false,
			options: {
				modules: {
					toolbar: null
				}
			},
			showConfirmCancelModal: false,
			confirm: false,
			toDeleteFaqId: null
		};
	},
	computed: {
		locumFaqs () {
			return this.$store.state.faqs.locumFaqs
		},
		practiceFaqs () {
			return this.$store.state.faqs.practiceFaqs
		},
		authAdminPermissions () {
			return this.$store.getters["permissions"]
		}
	},
	async asyncData ({ app, store, error }) {
		try {
			let response = await app.$axios.$get(`/api/v1/admin/faqs?domain=Locum`)
			let locumFaqs = response.data.faqs

			response = await app.$axios.$get("/api/v1/admin/faqs?domain=Practice")
			let practiceFaqs = response.data.faqs

			await store.commit("faqs/SET_LOCUM_FAQS", locumFaqs)
			await store.commit("faqs/SET_PRACTICE_FAQS", practiceFaqs)

			const authAdminpermissions = store.getters["permissions"]

      if (authAdminpermissions.includes('View FAQ') === false) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })
        return
      }
		} catch (err) {
			store.commit("SET_NOTIFICATION", {
				enabled: true,
				status: "danger",
				text: err.response.data.message
			})
			console.log("faqs error!", err)
		}
	},
	methods: {
		getLocumFaqs () {
			this.$store.dispatch("faqs/fetchLocumFaqs");
		},
		getPracticeFaqs () {
			this.$store.dispatch("faqs/fetchPracticeFaqs");
		},
		async toggleFaqOn(itemFaq) {
			if (itemFaq.domain == "Locum") {
				this.$store.commit("faqs/TOGGLE_LOCUM_FAQ", itemFaq);
			}
			if (itemFaq.domain == "Practice") {
				this.$store.commit("faqs/TOGGLE_PRACTICE_FAQ", itemFaq);
			}
		},
		async toDeleteFaq(faqId) {
			await this.$axios
				.delete(`/api/v1/admin/faqs/${faqId}`)
				.then(() => {
					this.getLocumFaqs();
					this.getPracticeFaqs();
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "Delete Faq Successful"
					});
					this.confirm = false;
				})
				.catch(err => {
					console.log("delete faq error!", err);
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: err.response.data.message
					});
				});
		},
		deleteFaq(id) {
			this.toDeleteFaqId = id;
			this.confirm = true;
		}
	}
};
</script>
<style>
.item-answer-open {
	height: auto;
	transition: height 2s linear;
}
.item-answer-close {
	height: 0;
	display: none;
	transition: height 2s linear;
}
.toggled {
	transition: all 0.5s linear;
}
.faq-shield {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #333;
	opacity: 0.5;
	z-index: 511;
}
.rotate {
	transform: rotate(90deg);
	transition: transform 0.3s ease-in-out;
}

.arrow {
	transform: rotate(0deg);
	transition: transform 0.3s ease-in-out;
}
</style>
