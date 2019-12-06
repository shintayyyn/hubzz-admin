<template>
	<div
		class="flex flex-col justify-between w-full h-full text-white pt-4 pb-8 md:py-8 sm:py-4 px-4"
	>
		<div class="w-full flex flex-wrap justify-between mb-2">
			<svgicon
				name="arrow-left-solid"
				class="text-white hover:text-sunglow fill-current w-6 md:w-8 h-6 md:h-8 cursor-pointer"
				@click="$emit('close')"
			/>
			<div class="py-2 font-bold text-lg leading-tight">
				Hub Requested Termination for this Spoke
			</div>
		</div>
		<div>
			<div class="flex flex-col md:flex-row pb-2 leading-tight">
				<span class="w-full md:w-1/4 font-bold">Date Requested:</span>
				<div>
					{{
						$moment(
							childSurgery ? childSurgery.termination_requested_at : null
						).format("MMM D, YYYY | HH:MM:ss")
					}}
				</div>
			</div>
			<div class="flex flex-col md:flex-row pb-2 leading-tight">
				<span class="w-full md:w-1/4 font-bold">Practice Name:</span>
				<div>{{ childSurgery ? childSurgery.surgery.name : null }}</div>
			</div>
			<div class="flex flex-col md:flex-row pb-2 leading-tight">
				<span class="w-full md:w-1/4 font-bold">Practice Code:</span>
				<div>{{ childSurgery ? childSurgery.surgery.code : null }}</div>
			</div>
			<div class="flex flex-col md:flex-row pb-2 leading-tight">
				<span class="w-full md:w-1/4 font-bold">Practice ID:</span>
				<div>
					{{ childSurgery ? childSurgery.surgery.practice.id : null }}
				</div>
			</div>
			<div class="flex flex-col md:flex-row pb-2 leading-tight">
				<span class="w-full md:w-1/4 font-bold">Phone Number:</span>
				{{ childSurgery ? childSurgery.surgery.practice.phone_number : null }}
			</div>
			<div class="flex flex-col md:flex-row pb-2 leading-tight">
				<span class="w-full md:w-1/4 font-bold">Report to:</span>
				{{ childSurgery ? childSurgery.surgery.practice.report_to : null }}
			</div>
			<div class="flex flex-col md:flex-row pb-2 leading-tight">
				<span class="w-full md:w-1/4 font-bold">Email:</span>
				{{ childSurgery ? childSurgery.surgery.practice.email : null }}
			</div>
			<div class="my-2">
				<span class="font-bold">Note from Practice Hub:</span>
				<div class="md:m-2 p-2 bg-charade rounded-lg overflow-y-auto">
					{{ childSurgery ? childSurgery.note : null }}
				</div>
			</div>
		</div>
		<div
			class="flex flex-col md:flex-row justify-center cursor-pointer mb-4 md:mb-0"
		>
			<div
				class="flex-1 p-2 my-2 md:mt-3 md:mt-0 rounded-lg text-center hover:bg-red-700 bg-red-600"
				@click="toDeleteSurgery(childSurgery.id)"
			>
				Delete Entire Surgery
			</div>
			<div
				class="flex-1 p-2 md:ml-2 my-2 md:mt-3 md:mt-0 rounded-lg text-center hover:bg-yellow-700 bg-yellow-600"
				@click="toDeleteParent(childSurgery.practice_id)"
			>
				Terminate from Parent
			</div>
			<div
				class="flex-1 p-2 md:ml-2 my-2 md:mt-3 md:mt-0 rounded-lg text-center hover:bg-green-700 bg-green-600"
				@click="toRejectRequest(childSurgery.id)"
			>
				Reject Termination Request
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: ["practice", "childSurgery"],

	data() {
		return {
			// childSurgery: null
		};
	},

	created() {},

	methods: {
		async toDeleteSurgery() {
			await this.$axios
				.delete(
					`/api/v1/admin/practices/${this.practice.id}/practice-surgeries/${this.childSurgery.id}`
				)
				.then(res => {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "Spoke is terminated and Invitation is Successfully Deleted"
					});
					this.getPracticeSpokes(this.practice.id);
					this.$emit("close");
				})
				.catch(err => {
					console.log("delete children error!!!!", err);
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: "Something went wrong!"
					});
				});
		},
		async toDeleteParent(childPracId) {
			await this.$axios
				.delete(`/api/v1/admin/practices/${this.practice.id}/parent-surgery`, {
					practice_id: childPracId
				})
				.then(res => {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "Spoke is Successfully Terminated"
					});
					this.getPracticeSpokes(this.practice.id);
					this.$emit("close");
				})
				.catch(err => {
					console.log("remove parent error!!!!", err);
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: "Something went wrong!"
					});
				});
		},
		async toRejectRequest(childId) {
			await this.$axios
				.put(
					`/api/v1/admin/practices/${this.practice.id}/practice-surgeries/${childId}/reject-termination-request`
				)
				.then(res => {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "Request is Successfully Rejected"
					});
					this.getPracticeSpokes(this.practice.id);
					this.$emit("close");
				})
				.catch(err => {
					console.log("reject request error!", err);
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: "Something went wrong!"
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

<style></style>
