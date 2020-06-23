<template>
  <div ref="modalContainer" class="issue-hubzz-invoice-modal p-4 md:p-8 shadow-lg">
    <div class="flex items-center text-sm text-white py-2">
      <nuxt-link 
        :to="{path: `/billings/hubzz-billing/${$route.params.id}/practice-hubzz-invoices`, query: $route.query}">
        <svgicon
          name="arrow-left-solid"
          height="40"
          width="40"
          class="fill-current text-white hover:text-sunglow p-1 cursor-pointer"
        />
      </nuxt-link>
    </div>
    <section class="max-w-lg">
      <div class="flex flex-col md:flex-row justify-between md:items-center text-white">
        <div class="w-full flex flex-col items-start md:flex-row md:items-center mx-2">
          <AppDate
            v-model="approvedAtDateStart"
            class="w-full md:w-1/2 md:mx-2"
            :name="'approved_at_date_start'"
            :label="'From'"
          />
          <AppDate
            v-model="approvedAtDateEnd"
            class="w-full md:w-1/2 md:mx-2"
            :name="'approved_at_date_end'"
            :label="'To'"
            :isAfterDate="approvedAtDateStart"
          />
          <div class="w-full flex flex-col justify-center items-start">
            <AppButton
              class="whitespace-no-wrap"
              :disabled="approvedAtDateStart && approvedAtDateEnd ? false : true"
              :label="'Search for Invoices'"
              :icon="'search'"
              @click="chooseJobPartsModal = true"
            />

            <div class="flex flex-col md:justify-center p-1 md:p-2 align-middle text-white leading-none">
              <input id="disputed" v-model="showDisputed" type="checkbox" value="true">
              <label for="disputed">Show Disputed Invoices</label>
              <input id="completed" v-model="showCompleted" type="checkbox" value="true">
              <label for="completed">Show Completed Invoices</label>
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
        v-if="chooseJobPartsModal == true"
        class="issue-hubzz-invoice-shield"
        @click="chooseJobPartsModal = false"
      />
    </section>
    <transition name="slide" mode="out-in">
      <div 
        v-if="chooseJobPartsModal" 
        class="choose-job-parts-modal shadow-lg"
      >
        <ChooseJobParts
          :filter="toFilter"
          :showDisputed="showDisputed"
          :showCompleted="showCompleted"
          @close="chooseJobPartsModal = false"
          @chosenJobParts="toProcessInvoiceItems"
        />
        <div
          v-if="$route.name.includes('approvedJobPartId')"
          class="issue-hubzz-invoice-shield"
          @click="chooseJobPartsModal = false"
        />
        <nuxt-child />
      </div>
    </transition>
  </div>
</template>
<script>
import AppButton from "@/components/Base/AppButton"
import AppDate from "@/components/Base/AppDate"
import HubzzInvoice from "@/components/Billings/HubzzInvoice"
import ChooseJobParts from "@/components/Billings/ChooseJobParts"
export default {
	components: {
		AppButton,
    AppDate,
		HubzzInvoice,
		ChooseJobParts
	},
	data () {
		return {
			loading: false,
			chooseJobPartsModal: false,
      showDisputed: false,
      showCompleted: false,
			approvedAtDateStart: "",
      approvedAtDateEnd: "",
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
		}
  },
  
  watch: {
    approvedAtDateStart: function (value) {
      console.log('value', value)
      if (value > this.approvedAtDateEnd) { 
        this.approvedAtDateEnd = ""
      }
      this.toFilter.approved_at_date_start = value
    },
    approvedAtDateEnd: function (value) {
      this.toFilter.approved_at_date_end = value
      console.log('value datend', value)
    }
  },

	async asyncData ({ app, route }) {
		try {
			let response = await app.$axios.$get(
				`/api/v1/admin/practices/${route.params.id}`
			)
			const practice = response.data.practice
			return {
				practice
			}
		} catch (err) {
			console.log("get practice error", err)
		}
	},

	created () {
		if (this.showDisputed) {
			this.toFilter.status = ""
			this.toFilter.invoice_status = ["Disputed", "Invoiced"]
			this.toFilter.locum_invoiceable = null
    } else if (this.showCompleted) {
      this.toFilter.status = ["Completed"]
			this.toFilter.locum_invoiceable = null
    } else if (this.showDisputed && this.showCompleted) {
      this.toFilter.status = ["Completed", "Approved"]
      this.toFilter.invoice_status = ["Disputed", "Invoiced"]
      this.toFilter.invoice_status = null
			this.toFilter.locum_invoiceable = null
    } else {
			this.toFilter.status = ["Approved"]
			this.toFilter.invoice_status = null
			this.toFilter.locum_invoiceable = true
		}
	},
	methods: {
		scrollToTop () {
			this.$nextTick(() => {
				this.$refs.modalContainer.scrollTop = 0
			})
		},
		toProcessInvoiceItems (chosenJobParts) {
			this.chooseJobPartsModal = false
      this.disputedItems = []
      this.invoiceItems = []

			for (let i = 0; i < chosenJobParts.length; i++) {
        console.log("chosenJobPart", chosenJobParts[i])
        const roundedHours = Math.floor((chosenJobParts[i].final_hours)/60)
        const minutes = Math.round(((chosenJobParts[i].final_hours/60) - roundedHours) * 60)
        console.log("minutes "+minutes)
				const newItem = {
					type: "Job Part - " + chosenJobParts[i].invoice_status,
          job_part_id: chosenJobParts[i].id,
          total_hours: parseFloat((chosenJobParts[i].final_hours)/60).toFixed(2),
					description:
						chosenJobParts[i].job_part_number +
						" for £" +
            chosenJobParts[i].practice_rate +
            " for a total time of " +
            roundedHours +
            " hours " + 
            (minutes > 0 ? " and " + minutes + " minutes " : "") +
						" from " +
						this.$moment(chosenJobParts[i].date_start).format('DD/MM/YYYY') +
						" to " +
						this.$moment(chosenJobParts[i].date_end).format('DD/MM/YYYY'),
						// divided by 60 to convert field "final_hours", from minutes to hours
					total: parseFloat(
						(chosenJobParts[i].final_hours/60).toFixed(2) * chosenJobParts[i].practice_rate.toFixed(2)
					).toFixed(2)
				}

				if (chosenJobParts[i].invoice_status === "Invoiced") {
          newItem.id = this.invoiceItems.length + 1
					this.invoiceItems.push(newItem)
        } 
        if (chosenJobParts[i].invoice_status === "Disputed") {
          newItem.id = this.disputedItems.length + 1
					this.disputedItems.push(newItem)
				}
      }
		},

		async goBack () {
			const query = {
				...this.$route.query
      }
      console.log('go back params id',this.$route.params.id)
			await this.$router.push({
				path: `/billings/${this.$route.params.id}/hubzz-invoices`,
				query
			})
		}
	}
}
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