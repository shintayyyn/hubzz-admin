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
						:placeholder="'Select...'"
						:items="[
							{ label: 'Yes', value: true },
							{ label: 'No', value: false }
						]"
						:error="
							formError.find(
								item => item.field === 'allow_surgery_create_sessions'
							)
						"
						@blur="
							CheckEmptyField(
								form.allow_surgery_create_sessions,
								'allow_surgery_create_sessions'
							)
						"
					/>
				</div>
				<!-- SET MAX RATES ;  NOT REQUIRED -->
				<div
					class="p-2 mx-2 bg-gray-500 rounded-lg"
					v-if="
						surgeryCreateSessions == 'true' ||
							form.allow_surgery_create_sessions == 'true'
					"
				>
					<div class="w-full p-1">
						<AppInput
							v-model="form.max_hourly_rate_limit"
							:type="'number'"
							:name="'max_hourly_rate_limit'"
							:label="'Set max hourly rate limit for Spoke'"
							:inStyle="'text-align:right'"
						/>
					</div>
					<div class="w-full p-1">
						<AppInput
							v-model="form.max_halfday_rate_limit"
							:type="'number'"
							:name="'max_halfday_rate_limit'"
							:label="'Set max half day rate limit for Spoke'"
							:inStyle="'text-align:right'"
						/>
					</div>
					<div class="w-full p-1">
						<AppInput
							v-model="form.max_wholeday_rate_limit"
							:type="'number'"
							:name="'max_wholeday_rate_limit'"
							:label="'Set max whole day rate limit for Spoke'"
							:inStyle="'text-align:right'"
						/>
					</div>
					<div class="w-full p-1">
						<AppInput
							v-model="form.max_ooh_rate_limit"
							:type="'number'"
							:name="'max_ooh_rate_limit'"
							:label="'Set max out-of-hours rate limit for Spoke'"
							:inStyle="'text-align:right'"
						/>
					</div>
					<div class="w-full p-1">
						<AppInput
							v-model="form.max_excess_hours"
							:type="'number'"
							:name="'max_excess_hours'"
							:label="'Set max excess hours'"
							:inStyle="'text-align:right'"
						/>
					</div>
				</div>
				<!-- SET MAX RATES END HERE -->
				<div class="w-full p-1">
					<AppInput
						v-model="form.allow_surgery_bill_locum"
						:type="'select'"
						:name="'allow_surgery_bill_locum'"
						:label="'Allow Spoke to handle its own billing for Locum?'"
						:placeholder="'Select...'"
						:items="[
							{ label: 'Yes', value: true },
							{ label: 'No', value: false }
						]"
						:error="
							formError.find(item => item.field === 'allow_surgery_bill_locum')
						"
						@blur="
							CheckEmptyField(
								form.allow_surgery_bill_locum,
								'allow_surgery_bill_locum'
							)
						"
					/>
				</div>
				<div class="w-full p-1">
					<AppInput
						v-model="form.allow_surgery_bill_hubzz"
						:type="'select'"
						:name="'allow_surgery_bill_hubzz'"
						:label="'Allow Spoke to handle its own billing for HUBZZ?'"
						:placeholder="'Select...'"
						:items="[
							{ label: 'Yes', value: true },
							{ label: 'No', value: false }
						]"
						:error="
							formError.find(item => item.field === 'allow_surgery_bill_hubzz')
						"
						@blur="
							CheckEmptyField(
								form.allow_surgery_bill_hubzz,
								'allow_surgery_bill_hubzz'
							)
						"
					/>
				</div>
				<div class="w-full p-1">
					<AppInput
						v-model="form.share_banks_to_other_surgeries"
						:type="'select'"
						:name="'share_banks_to_other_surgeries'"
						:label="'Share Banks to Other Surgeries'"
						:placeholder="'Select...'"
						:items="[
							{ label: 'Yes', value: true },
							{ label: 'No', value: false }
						]"
						:error="
							formError.find(
								item => item.field === 'share_banks_to_other_surgeries'
							)
						"
						@blur="
							CheckEmptyField(
								form.share_banks_to_other_surgeries,
								'share_banks_to_other_surgeries'
							)
						"
					/>
				</div>
			</div>
			<button
				class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow hover:bg-sunglow-dark text-sm text-black rounded-lg shadow float:right font-bold"
				@click.prevent="newChildSpoke()"
			>
				Save
			</button>
		</div>
	</div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
export default {
	components: {
		AppInput
	},
	props: ["practice", "surgeryId"],
	data() {
		return {
			form: {
				surgery_id: this.surgeryId,
				allow_surgery_create_sessions: "",
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
		async newChildSpoke() {
			if (this.practice.type == "Hub") {
				this.formError = [];
				this.Validate(this.form);
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
							this.$emit("practiceSpokePosted");
						})
						.catch(err => {
							this.formError.push(err.response.data.error_messages);
						});
				}
			}
		}
	}
};
</script>

<style></style>
