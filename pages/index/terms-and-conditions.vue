<template>
	<div class="flex-1 flex flex-col overflow-hidden py-2" ref="wrapper">
		<div class="px-4 md:px-6">
			<div class="flex justify-start overflow-x-auto">
				<div
					style="font-family:Nunito"
					@click.prevent="goTo('termsAndConditions')"
					class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
					:class="$route.query.active_tab === 'termsAndConditions' ? 'border rounded-lg text-black border-sunglow bg-sunglow' : 'text-white'"
				>Terms & Conditions</div>
				<div
					style="font-family:Nunito"
					@click.prevent="goTo('privacyPolicy')"
					class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
					:class="$route.query.active_tab === 'privacyPolicy' ? 'border rounded-lg text-black border-sunglow bg-sunglow' : 'text-white'"
				>Privacy Policy</div>
			</div>
		</div>

		<div class="px-4 md:px-6 mt-5">
			<transition name="slide" mode="out-in">
				<component 
					:is="activeComponent" 
					:terms="terms" 
					@formError="errorHandler()" />
			</transition>
		</div>
	</div>
</template>
<script>
import TermsAndConditions from "@/components/TermsAndConditions/TermsAndConditions";
import PrivacyPolicy from "@/components/TermsAndConditions/PrivacyPolicy";
export default {
	components: {
		TermsAndConditions,
		PrivacyPolicy,
	},
	computed: {
		activeComponent () {
			return this.$route.query.active_tab
		},
		authAdminPermissions () {
			return this.$store.getters["permissions"]
		}
	},
	data () {
		return {
			terms: null,
			tnc: null,
			privacypolicy: null
		}
	},
	watch:{
		"$route.query.active_tab" (newTab, oldTab){
			this.$axios.$get(`/api/v1/admin/terms-and-conditions`)
				.then(res => {
					this.terms = res.data.terms
					this.tnc = res.data.terms.terms_and_conditions,
					this.privacypolicy = res.data.terms.privacy_policy
				})
				.catch(err => {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: "Something went wrong!"
					});
					console.log("get TNCS error!!!!", err);
				})
		}
	},
	async asyncData ({ app, store, error }) {
		try {
			let response = await app.$axios.$get(
				`/api/v1/admin/terms-and-conditions`
			);
			const terms = response.data.terms
			const tnc = response.data.terms.terms_and_conditions
			const privacypolicy = response.data.terms.privacy_policy

			const authAdminPermissions = store.getters["permissions"]

      if (authAdminPermissions.includes('View Terms and Conditions & Privacy Policy') === false) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })
        return
      }
			return {
				terms,
				tnc,
				privacypolicy
			}
		} catch (err) {
			store.commit("SET_NOTIFICATION", {
				enabled: true,
				status: "danger",
				text: "Something went wrong!"
			});
			console.log("get terms and conditions error!!!!", err);
		}
	},
	created() {
		const query = {
			...this.$route.query,
			active_tab: this.$route.query.active_tab || "termsAndConditions"
		};
		this.$router.push({ query });
	},
	methods: {
		goTo(type) {
      const query = {
        ...this.$route.query,
        active_tab: type
      }
      this.$router.push({ query })
    },
		errorHandler() {
			this.$nextTick(() => {
				this.$refs.wrapper.scrollTop = 0;
			});
		}
	}
};
</script>
<style></style>
