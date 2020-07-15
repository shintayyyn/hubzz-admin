<template>
	<div
		class="flex flex-col justify-between w-full h-full text-white pt-4 pb-8 md:py-8 px-4"
		:style="approveTemination || rejectTermination ? 'overflow: hidden' : 'overflow: auto'"
	>
		<!-- CONFIRM OR CANCEL MODAL -->
		<transition name="drop" mode="out-in">
			<AppConfirm
				v-if="approveTemination"
				:style="'top:35%'"
				:inClass="'rounded-lg'"
				:message="'Are you sure you want to approve this termination request?'"
				@cancel="approveTemination = false"
				@confirm="toDeleteSurgery(childSurgery.id)"
			/>
		</transition>

		<transition name="drop" mode="out-in">
			<AppConfirm
				v-if="rejectTermination"
				:inStyle="'top:35%'"
				:inClass="'rounded-lg'"
				:message="'Are you sure you want to reject this termination request'"
				@cancel="rejectTermination = false"
				@confirm="toRejectRequest(childSurgery.id)"
			/>
		</transition>
			<!-- CONFIRM OR CANCEL MODAL ENDS HERE -->
		<div
			class="shield cursor-pointer overflow-hidden"
			v-if="approveTemination || rejectTermination"
			@click="approveTemination ? approveTemination = false : rejectTermination = false"
		></div>
		<div class="w-full flex flex-wrap justify-between mb-2">
			<svgicon
				name="times-solid"
				class="text-white hover:text-sunglow fill-current w-6 md:w-8 h-6 md:h-8 cursor-pointer"
				@click="$router.go(-1)"
			/>
			<div class="py-2 font-bold text-lg leading-tight">
				{{ !childSurgery.invitation_accepted_at || childSurgery.invitataion_rejected_at ?
				'Cancellation of Invitation Request':
				'Termination Request' }}
			</div>
		</div>

		<div>
			<div class="flex flex-col md:flex-row pb-2 leading-tight">
				<span class="w-full md:w-1/4 font-bold">Date Requested:</span>
				<div>{{$moment(childSurgery.termination_requested_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY, h:mm:ss a')}}</div>
			</div>
			<div class="flex flex-col md:flex-row pb-2 leading-tight">
				<span class="w-full md:w-1/4 font-bold">Practice Name:</span>
				<div>{{ childSurgery.child_practice.surgery.name }}</div>
			</div>
			<div class="flex flex-col md:flex-row pb-2 leading-tight">
				<span class="w-full md:w-1/4 font-bold">Practice Code:</span>
				<div>{{ childSurgery.child_practice.surgery.code }}</div>
			</div>
			<div class="flex flex-col md:flex-row pb-2 leading-tight">
				<span class="w-full md:w-1/4 font-bold">Practice ID:</span>
				<div>{{ childSurgery.child_practice.id }}</div>
			</div>
			<div class="flex flex-col md:flex-row pb-2 leading-tight">
				<span class="w-full md:w-1/4 font-bold">Phone Number:</span>
				{{ childSurgery.child_practice.phone_number }}
			</div>
			<div class="flex flex-col md:flex-row pb-2 leading-tight">
				<span class="w-full md:w-1/4 font-bold">Report to:</span>
				{{ childSurgery.child_practice.report_to }}
			</div>
			<div class="flex flex-col md:flex-row pb-2 leading-tight">
				<span class="w-full md:w-1/4 font-bold">Email:</span>
				{{ childSurgery.child_practice.email }}
			</div>
			<div class="my-2">
				<span class="font-bold">Note from Practice Hub:</span>
				<div class="md:m-2 p-2 bg-charade rounded-lg overflow-y-auto">{{ childSurgery.note }}</div>
			</div>
		</div>

		<div class="flex flex-col md:flex-row justify-center cursor-pointer mb-4 md:mb-0">
			<AppButton
				class="text-white ml-2"
				:background="'green'"
				:label=" childSurgery.invitation_accepted_at || childSurgery.invitation_rejected_at ? 'Approve Termination Request' : 'Approve Cancellation Request'"
				@click="approveTemination = true"
			/>
			<AppButton
				class="text-white ml-2"
				:background="'red'"
				:label="childSurgery.invitation_accepted_at || childSurgery.invitation_rejected_at ? 'Reject Termination Request' : 'Reject Cancellation Request'"
				@click="rejectTermination = true"
			/>
		</div>
	</div>
</template>

<script>
import AppConfirm from "@/components/Base/AppConfirm"
import AppButton from "@/components/Base/AppButton"
export default {
	components: {
		AppConfirm,
		AppButton,
	},
	props: {
		practice: {
      type: Object,
      default: () => null
		},
		childSurgery: {
      type: Object,
      default: () => null
    },
	},

	data() {
		return {
			approveTemination: false,
			rejectTermination: false
		};
	},

	methods: {
		async toDeleteSurgery() {
			await this.$axios
				.delete(
					`/api/v1/admin/practices/${this.practice.id}/practice-surgeries/${this.childSurgery.id}`
				)
				.then(res => {
          this.approveTemination = false
					this.getPracticeSpokes(this.practice.id);
					this.$router.push(`/practices/${this.$route.params.id}/practice-surgeries`)
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "Spoke is Terminated Successfully"
          });
				})
				.catch(err => {
					console.log("delete children error!!!!", err);
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: err.response.data.message
					});
				});
    },

    async toRejectRequest(childId) {
			await this.$axios
				.put(
					`/api/v1/admin/practices/${this.practice.id}/practice-surgeries/${childId}/reject-termination-request`
				)
				.then(res => {
          this.rejectTermination = false
					this.getPracticeSpokes(this.practice.id);
          this.$router.push(`/practices/${this.$route.params.id}/practice-surgeries`)
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "Request is Successfully Rejected"
					});
				})
				.catch(err => {
					console.log("reject request error!", err);
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: err.response.data.message
					});
				});
    },
		getPracticeSpokes(practiceId) {
			this.$store.dispatch("practices/fetchSpokes", {
				practice_id: practiceId
			});
		}
	}
};
</script>

<style>
</style>
