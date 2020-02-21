<template>
	<div>
		<!-- HEADER -->
		<div class="flex justify-between text-sm text-white">
			<div @click="goBack()" class="text-white mb-3 cursor-pointer">
				<svgicon
					name="arrow-left-solid"
					height="32"
					width="32"
					class="text-white hover:text-sunglow fill-current"
				/>
			</div>
		</div>
		<!-- HEADER -->

		<div class="flex flex-wrap overflow-hidden border-b border-sunglow">
			<div
				class="flex-col text-white w-full mb-2 m-2 pb-3 text-sm md:text-base"
			>
				<div class="flex justify-between my-1">
					<div class="">
						<span class="w-24 pr-3">Date Sent:</span>
						<span class="font-bold">{{
							inquiryEmail.sender
								? $moment(inquiryEmail.sender.created_at).format(
										"MMM DD, YYYY | HH:MM:ss"
								  )
								: null
						}}</span>
					</div>
					<AppButton
						v-if="
							!inquiryEmail.acknowledged_by_user_id &&
								!inquiryEmail.acknowledged_at
						"
						:label="'Acknowledge'"
						@click="acknowledgeInquiry()"
					/>
					<div v-else class="-my-1 text-white font-semibold">
						<div class="flex p-2 m-2 bg-green-500 rounded-lg">
							<div class="flex mr-2">
								<svgicon
									name="circle-check"
									width="23"
									height="23"
									color="white"
								/>
							</div>
							<div class="flex">
								Acknowledged By: {{ admin ? admin.email : null }}
							</div>
						</div>
					</div>
				</div>
				<div class="flex my-1">
					<span class="w-24 pr-3">From: </span>
					<span class="font-bold">{{
						inquiryEmail.sender ? inquiryEmail.sender.email : null
					}}</span>
				</div>
				<div class="flex my-1">
					<div class="w-24 pr-3">Domain:</div>
					<div class="font-bold">
						{{ inquiryEmail.sender ? inquiryEmail.sender.domain : null }}
					</div>
				</div>
			</div>
		</div>

		<div class="my-2 md:mx-2">
			<div
				class="flex flex-col rounded-lg bg-waterloo text-white py-2 px-4 w-full h-full break-words"
			>
				{{ inquiryEmail.message }}
			</div>
		</div>
	</div>
</template>

<script>
import AppButton from "@/components/Base/AppButton";
export default {
	components: {
		AppButton
	},
	props: ["email"],
	data() {
		return {
			admin: this.email ? this.email.acknowledged_by_user : "",
			inquiryEmail: this.email
		};
	},
	async created() {
		// if (
		// 	this.inquiryEmail.acknowledged_by_user_id &&
		// 	this.inquiryEmail.acknowledged_at
		// ) {
		// 	await this.$axios
		// 		.$get(
		// 			`/api/v1/admin/admin-users/${this.inquiryEmail.acknowledged_by_user_id}`
		// 		)
		// 		.then(res => {
		// 			this.admin = res.data.user;
		// 		});
		// }
	},
	methods: {
		getQuery() {
			const query = {
				...this.$route.query
			};
			const offset = parseInt(query.page) * 10 - 10;
			return offset;
		},
		getSupportEmails() {
      this.$store.dispatch("supports/fetchUnacknowledgedSupports", {
        acknowledged: false,
        countOnly: true
      });

			this.$store.dispatch("supports/fetchSupports", {
				limit: 10,
				offset: this.getQuery()
      });

		},
		async acknowledgeInquiry() {
			await this.$axios
				.$put(`/api/v1/admin/supports/${this.email.id}`)
				.then(res => {
          this.inquiryEmail = res.data.email;
          this.admin = res.data.acknowledged_by_user
        });
        
			await this.getSupportEmails();
		},
		goBack() {
			const query = {
				...this.$route.query
			};
			this.$router.push({ path: "/inquiries", query });
		}
	}
};
</script>
<style></style>
