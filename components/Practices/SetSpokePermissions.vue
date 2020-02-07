<template>
	<div class="text-white w-full">
		<div class="flex justify-between text-sm text-white py-4 px-4 md:px-8">
			<div @click="$emit('close')" class="cursor-pointer">
				<svgicon
					name="arrow-left-solid"
					height="32"
					width="32"
					class="text-white hover:text-sunglow fill-current"
				/>
			</div>
		</div>
		<div class="mx-6">
			<div class="flex flex-col flex-wrap justify-between">
				<div class="w-full p-1">
					<AppInput
						v-model="form.allow_surgery_create_sessions"
						:type="'select'"
						:name="'allow_surgery_create_sessions'"
						:label="'Allow Spoke to Create Jobs/Sessions?'"
						:error="formError.find(item => item.field === 'allow_surgery_create_sessions')"
						:placeholder="'Select...'"
						:items="[{ label: 'Yes', value: true },{ label: 'No', value: false }]"
						required
					/>
				</div>
				<!-- SET MAX RATES ;  NOT REQUIRED -->
				<div
					class="p-2 mx-2 bg-gray-500 rounded-lg"
					v-if="surgeryCreateSessions == 'true' ||form.allow_surgery_create_sessions == 'true'"
				>
					<div class="w-full p-1">
						<AppInput
							v-model="form.max_hourly_rate_limit"
							:type="'number'"
							:name="'max_hourly_rate_limit'"
							:label="'Set max hourly rate limit for Spoke'"
							:error="formError.find(item => item.field === 'max_hourly_rate_limit')"
							:inStyle="'text-align:right'"
						/>
					</div>
					<div class="w-full p-1">
						<AppInput
							v-model="form.max_halfday_rate_limit"
							:type="'number'"
							:name="'max_halfday_rate_limit'"
							:label="'Set max half day rate limit for Spoke'"
							:error="formError.find(item => item.field === 'max_halfday_rate_limit')"
							:inStyle="'text-align:right'"
						/>
					</div>
					<div class="w-full p-1">
						<AppInput
							v-model="form.max_wholeday_rate_limit"
							:type="'number'"
							:name="'max_wholeday_rate_limit'"
							:label="'Set max whole day rate limit for Spoke'"
							:error="formError.find(item => item.field === 'max_wholeday_rate_limit')"
							:inStyle="'text-align:right'"
						/>
					</div>
					<div class="w-full p-1">
						<AppInput
							v-model="form.max_ooh_rate_limit"
							:type="'number'"
							:name="'max_ooh_rate_limit'"
							:label="'Set max out-of-hours rate limit for Spoke'"
							:error="formError.find(item => item.field === 'max_ooh_rate_limit')"
							:inStyle="'text-align:right'"
						/>
					</div>
					<div class="w-full p-1">
						<AppInput
							v-model="form.max_excess_hours"
							:type="'number'"
							:name="'max_excess_hours'"
							:label="'Set max excess hours'"
							:error="formError.find(item => item.field === 'max_excess_hours')"
							:inStyle="'text-align:right'"
						/>
					</div>
				</div>
				<!-- SET MAX RATES END HERE -->
				<div class="w-full p-1">
					<AppInput
						v-model="form.allow_surgery_create_permanent_jobs"
						:type="'select'"
						:name="'allow_surgery_create_permanent_jobs'"
						:label="'Allow Spoke to create permanent jobs?'"
						:error="formError.find(item => item.field === 'allow_surgery_create_permanent_jobs')"
						:placeholder="'Select...'"
						:items="[{ label: 'Yes', value: true },{ label: 'No', value: false }]"
						required
					/>
				</div>
				<div class="w-full p-1">
					<AppInput
						v-model="form.allow_surgery_bill_locum"
						:type="'select'"
						:name="'allow_surgery_bill_locum'"
						:label="'Allow Spoke to handle its own billing for Locum?'"
						:error="formError.find(item => item.field === 'allow_surgery_bill_locum')"
						:placeholder="'Select...'"
						:items="[{ label: 'Yes', value: true },{ label: 'No', value: false }]"
						required
					/>
				</div>
				<div class="w-full p-1">
					<AppInput
						v-model="form.allow_surgery_bill_hubzz"
						:type="'select'"
						:name="'allow_surgery_bill_hubzz'"
						:label="'Allow Spoke to handle its own billing for HUBZZ?'"
						:error="formError.find(item => item.field === 'allow_surgery_bill_hubzz')"
						:placeholder="'Select...'"
						:items="[{ label: 'Yes', value: true },{ label: 'No', value: false }]"
						required
					/>
				</div>
				<div class="w-full p-1">
					<AppInput
						v-model="form.share_banks_to_other_surgeries"
						:type="'select'"
						:name="'share_banks_to_other_surgeries'"
						:label="'Share this spoke`s bank/s to other surgeries?'"
						:error="formError.find(item => item.field === 'share_banks_to_other_surgeries')"
						:placeholder="'Select...'"
						:items="[{ label: 'Yes', value: true },{ label: 'No', value: false }]"
						required
					/>
				</div>
			</div>
			<button
				class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow hover:bg-sunglow-dark text-sm text-black rounded-lg shadow float:right font-bold"
				@click.prevent="publish()"
			>Save</button>
		</div>
	</div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
export default {
	components: {
		AppInput
	},
	props: ["practice", "practiceSpokeId"],
	data() {
		return {
			form: {
				child_practice_id: this.practiceSpokeId,
				allow_surgery_create_sessions: "",
				allow_surgery_create_permanent_jobs: "",
				max_hourly_rate_limit: "",
				max_halfday_rate_limit: "",
				max_wholeday_rate_limit: "",
				max_ooh_rate_limit: "",
				max_excess_hours: "",
				allow_surgery_bill_locum: "",
				allow_surgery_bill_hubzz: "",
				share_banks_to_other_surgeries: ""
			},
			formError: []
		};
	},
	computed: {
		surgeryCreateSessions: function() {
			return this.form.allow_surgery_create_sessions;
		}
	},
	created() {},
	methods: {
		getPracticeSpokes(practiceId) {
			this.$store.dispatch("practices/fetchSpokes", {
				practice_id: practiceId
			});
		},
		publish() {
			let notRequired = [
				"max_hourly_rate_limit",
				"max_halfday_rate_limit",
				"max_wholeday_rate_limit",
				"max_ooh_rate_limit",
				"max_excess_hours"
			];
			this.Validate(this.form, notRequired);
			if (!this.formError.length) {
				this.addSpoke();
			}
		},
		async addSpoke() {
			console.log("it worked", this.form);
			if (this.practice.type == "Hub") {
				this.formError = [];
				// this.Validate(this.form);
				console.log("formerror", this.formError);
				if (!this.formError.length) {
					await this.$axios
						.post(
							`/api/v1/admin/practices/${this.practice.id}/practice-surgeries`,
							this.form
						)
						.then(res => {
							this.$store.commit("SET_NOTIFICATION", {
								enabled: true,
								status: "success",
								text: "Practice Child Added"
							});
							this.getPracticeSpokes(this.practice.id);
							this.$router.push(
								`/practices/${this.$route.params.id}/practice-surgeries`
							);
							// this.$emit("practiceSpokePosted");
						})
						.catch(err => {
							this.$store.commit("SET_NOTIFICATION", {
								enabled: true,
								status: "danger",
								text: err.response.data.message
							});
							this.formError.push(err.response.data.error_messages);
						});
					await this.$emit("close");
				}
			}
		}
	}
};
</script>

<style></style>
