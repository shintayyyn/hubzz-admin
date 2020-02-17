<template>
	<div class="issue-hubzz-invoice-modal p-4 md:p-8 shadow-lg" ref="modalContainer">
		<div class="flex items-center text-sm text-white py-2">
			<div>
				<svgicon
					name="arrow-left-solid"
					height="40"
					width="40"
					class="fill-current text-white hover:text-sunglow p-1 cursor-pointer"
					@click="goBack()"
				/>
			</div>
		</div>
		<section class="max-w-lg">
			<div class="flex flex-col md:flex-row justify-between md:items-center text-white">
				<div class="w-full flex flex-col items-start md:flex-row md:items-center mx-2">
					<AppDate
						class="w-full md:w-1/2 md:mx-2"
						v-model="toFilter.approved_at_date_start"
						:name="'approved_at_date_start'"
						:label="'From'"
					/>
					<AppDate
						class="w-full md:w-1/2 md:mx-2"
						v-model="toFilter.approved_at_date_end"
						:name="'approved_at_date_end'"
						:label="'To'"
					/>
					<div class="w-full flex flex-col justify-center items-start">
						<AppButton
							class="whitespace-no-wrap"
							:disabled="toFilter.approved_at_date_start && toFilter.approved_at_date_end ? false : true"
							:label="'Search for Invoices'"
							:icon="'search'"
							@click="chooseJobPartsModal = true"
						/>

						<div class="flex flex-col md:justify-center p-1 md:p-2 align-middle text-white leading-none">
							<input type="checkbox" id="disputed" value="true" v-model="showDisputed" />
							<label for="disputed">Show Disputed Invoices</label>
						</div>
					</div>
				</div>
			</div>
			<!-- v-if="invoiceItems.length > 0 || disputedItems.length > 0"  -->
			<HubzzInvoice
				:forViewing="false"
				:practice="practice"
				:invoiceItems="invoiceItems"
				:disputedItems="disputedItems"
				@formError="scrollToTop"
			/>
			<!-- :dateStart="date_start"
			:dateEnd="date_end"-->

			<!-- :filterDateStart="toFilter.approved_at_date_start"
			:filterDateEnd="toFilter.approved_at_date_end"-->
			<div
				class="issue-hubzz-invoice-shield"
				v-if="chooseJobPartsModal == true"
				@click="chooseJobPartsModal = false"
			></div>
		</section>
		<transition name="slide" mode="out-in">
			<div class="choose-job-parts-modal shadow-lg" v-if="chooseJobPartsModal">
				<ChooseJobParts
					:filter="toFilter"
					:showDisputed="showDisputed"
					@close="chooseJobPartsModal = false"
					@chosenJobParts="toProcessInvoiceItems"
				/>
			</div>
		</transition>
	</div>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import AppDate from "@/components/Base/AppDate";
import AppLoading from "@/components/Base/AppLoading";
import HubzzInvoice from "@/components/Billings/HubzzInvoice";
import ChooseJobParts from "@/components/Billings/ChooseJobParts";
export default {
	components: {
		AppButton,
		AppDate,
		HubzzInvoice,
		ChooseJobParts
	},
	data() {
		return {
			loading: false,
			chooseJobPartsModal: false,
			showDisputed: false,
			date_start: "",
			date_end: "",
			toFilter: {
				job_practice_id: this.$route.params.id,
				approved_at_date_start: null,
				approved_at_date_end: null,
				status: null,
				invoice_status: null,
				locum_invoiceable: null,
				practice_invoiced: false
			},

			practice: "",
			chosenJobParts: [],
			invoiceItems: [],
			disputedItems: []
		};
	},

	created() {
		if (this.showDisputed) {
			this.toFilter.status = "";
			this.toFilter.invoice_status = "Disputed";
			this.toFilter.locum_invoiceable = null;
		} else {
			this.toFilter.status = "Approved";
			this.toFilter.invoice_status = null;
			this.toFilter.locum_invoiceable = true;
		}
	},

	async asyncData({ app, route, store }) {
		try {
			let response = await app.$axios.$get(
				`/api/v1/admin/practices/${route.params.id}`
			);
			const practice = response.data.practice;
			return {
				practice
			};
		} catch (err) {
			console.log("get practice error", err);
		}
	},
	methods: {
		scrollToTop() {
			this.$nextTick(() => {
				this.$refs.modalContainer.scrollTop = 0;
			});
		},
		toProcessInvoiceItems(chosenJobParts, isDisputed) {
			this.chooseJobPartsModal = false;

			if (isDisputed == true) {
				this.disputedItems = [];
			} else {
				this.invoiceItems = [];
			}

			for (let i = 0; i < chosenJobParts.length; i++) {
				console.log("chosenJobPart", chosenJobParts[i]);
				const newItem = {
					type: "Job Part - " + chosenJobParts[i].invoice_status,
					job_part_id: chosenJobParts[i].id,
					description:
						"Job Number " +
						chosenJobParts[i].job_part_number +
						" for £" +
						chosenJobParts[i].practice_rate +
						" from " +
						chosenJobParts[i].date_start +
						" to " +
						chosenJobParts[i].date_end,
					total: parseFloat(
						chosenJobParts[i].final_hours * chosenJobParts[i].practice_rate
					).toFixed(2)
				};

				if (isDisputed == true) {
					newItem.id = this.disputedItems.length + 1;
					this.disputedItems.push(newItem);
				} else {
					newItem.id = this.invoiceItems.length + 1;
					this.invoiceItems.push(newItem);
				}
			}
		},

		goBack() {
			const query = {
				...this.$route.query
			};
			this.$router.push({
				path: `/billings/${this.$route.params.id}/hubzz-invoices`,
				query
			});
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
.issue-hubzz-invoice-shield {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #333;
	opacity: 0.5;
	z-index: 511;
}
.choose-job-parts-modal,
.issue-hubzz-invoice-modal {
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
	.issue-hubzz-invoice-modal {
		width: 70%;
	}
	.choose-job-parts-modal {
		width: 60%;
	}
}
</style>