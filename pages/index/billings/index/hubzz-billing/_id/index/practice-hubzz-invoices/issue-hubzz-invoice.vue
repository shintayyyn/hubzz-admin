<template>
  <div ref="modalContainer" class="issue-hubzz-invoice-modal p-4 md:p-8 shadow-lg">
    <div class="flex items-center text-sm text-white py-2">
      <nuxt-link 
        :to="{path: `/billings/hubzz-billing/${$route.params.id}/practice-hubzz-invoices`, query: $route.query}"
      >
        <svgicon
          name="arrow-left-solid"
          height="40"
          width="40"
          class="fill-current text-white hover:text-sunglow p-1 cursor-pointer"
        />
      </nuxt-link>
    </div>
    <section class="max-w-lg">
      <div class="flex lg:flex-row flex-col justify-center">
        <div class="flex flex-col justify-between md:items-center text-white">
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
          </div>
          
          <div class="flex flex-row md:justify-center p-1 md:p-2 align-middle text-white leading-none">
            <div class="m-1">
              <input id="disputed" v-model="showDisputed" type="checkbox" value="true">
              <label for="disputed">Include Disputed Invoices</label>
            </div>
            <div class="m-1">
              <input id="completed" v-model="showCompleted" type="checkbox" value="true">
              <label for="completed">Include Completed Invoices</label>
            </div>
            <div class="m-1">
              <input id="cancelled" v-model="showCancelled" type="checkbox" value="true">
              <label for="cancelled">Include Cancelled Invoices</label>
            </div>
            <div class="m-1">
              <input id="invoiced" v-model="showInvoiced" type="checkbox" value="true">
              <label for="invoiced">Include Invoiced Invoices</label>
            </div>
          </div>
        </div>
        <div class="pt-12">
          <AppButton
            class="whitespace-no-wrap"
            :disabled="approvedAtDateStart && approvedAtDateEnd ? false : true"
            :label="'Search for Invoices'"
            :icon="'search'"
            @click="chooseJobPartsModal = true"
          />
        </div>
      </div>
      
      <!-- v-if="invoiceItems.length > 0 || disputedItems.length > 0"  -->
      <HubzzInvoice
        :forViewing="false"
        :practice="practice"
        :invoiceItems="invoiceItems"
        :disputedItems="disputedItems"
        @formError="scrollToTop"
        @goBack="goBack"
      />
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
          :showCancelled="showCancelled"
          :showInvoiced="showInvoiced"
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
      showCancelled: false,
      showInvoiced: false,
			approvedAtDateStart: "",
      approvedAtDateEnd: "",
			toFilter: {
				job_practice_id: this.$route.params.id,
				practice_billable_date_start: null,
				practice_billable_date_end: null,
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
      this.toFilter.practice_billable_date_start = value
    },
    approvedAtDateEnd: function (value) {
      this.toFilter.practice_billable_date_end = value
      console.log('value datend', value)
    }
  },

	async asyncData ({ app, route, error }) {
		try {
      let response = await app.$axios.$get(
				`/api/v1/admin/practices/${route.params.id}`
			)
      const practice = response.data.practice
      
      if (practice.sage_ref === null) {
        error({
          statusCode: 403,
          message: 'That function is not available on this practice.',
        })

        return
      }
			
			return {
				practice
			}
		} catch (err) {
			console.log("get practice error", err)
		}
	},
	methods: {
		scrollToTop () {
			this.$nextTick(() => {
				this.$refs.modalContainer.scrollTop = 0
			})
		},
		toProcessInvoiceItems (chosenJobParts) {
      console.log('banmana', chosenJobParts)
			this.chooseJobPartsModal = false
      this.disputedItems = []
      this.invoiceItems = []

			for (let i = 0; i < chosenJobParts.length; i++) {
        const roundedHours = Math.floor((chosenJobParts[i].final_hours)/60)
        const minutes = Math.round(((chosenJobParts[i].final_hours/60) - roundedHours) * 60)
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
        
        console.log('chosenJobPart',chosenJobParts[i].invoice_status )

				if (chosenJobParts[i].invoice_status === "Invoiced" || chosenJobParts[i].invoice_status === "Approved" || chosenJobParts[i].invoice_status === "To Be Invoiced") {
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
				path: `/billings/hubzz-billing/${this.$route.params.id}/practice-hubzz-invoices`,
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