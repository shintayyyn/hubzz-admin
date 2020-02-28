<template>
  <div class="flex flex-col rounded-lg">
    <div class="flex overflow-hidden">
      <div class="flex overflow-x-auto mb-2">
        <div v-if="practice.status === 'Active'" class="flex-3 mx-1 whitespace-no-wrap">
          <AppButton :label="'Add Spoke for this Hub'" :icon="'add-rectangle'" @click="show()" />
          <!-- <button
						@click="show()"
						class="inline-flex items-center no-underline py-2 px-4 bg-sunglow hover:bg-sunglow-dark text-sm font-semibold text-black rounded-lg shadow float-right"
					>
						Add Spoke for this Hub
						<svgicon
							name="add-rectangle"
							width="21"
							height="21"
							color="black black"
							class="mx-1 -my-1"
						/>
					</button>-->
        </div>
        <div v-if="deleteSurgery == true" class="flex-3 mx-1 whitespace-no-wrap">
          <button
            class="inline-flex items-center no-underline py-2 px-4 bg-green-500 hover:bg-green-600 text-sm font-semibold text-white rounded-lg shadow float-right"
            @click="deleteSurgery = false"
          >
            Done
            <svgicon name="circle-check" width="21" height="21" color="white white" class="mx-1 -my-1" />
          </button>
        </div>
      </div>
    </div>
    <template v-if="practiceChildren.length > 0">
      <AppTable
        :total="total"
        :items="practiceChildren"
        :current-page="currentPage"
        :per-page="perPage"
        :columns="columns"
        :loading="loadingSurgeries"
        :loading-message="'Loading Surgeries'"
        :router-link="`/practices/${practice.id}/practice-surgeries`"
        @pagechanged="pagechanged"
        @limitchanged="limitchanged"
      >
        <template v-slot:type_slot="slotProps">
          <div class="flex justify-center">
            <div
              class="rounded-full text-center py-2 px-4 md:px-8"
              :class="statusStyle(slotProps.item)"
            >
              {{ checkStatus(slotProps.item) }}
            </div>
            <div
              v-if="slotProps.item.termination_requested_at"
              class="flex items-center w-10 ml-2 md:ml-2 md:ml-0 cursor-pointer text-red-600 hover:text-red-700"
              @click.prevent.stop="viewTerminationModal(slotProps.item.id)"
            >
              <div class="p-1 bg-white rounded-lg">
                <svgicon name="exclamation-circle-solid" width="22" height="22" class="fill-current" />
              </div>
            </div>
          </div>
        </template>
      </AppTable>
    </template>

    <div v-else>
      <div class="mt-10 text-white w-full text-center" style="font-family: Nunito">
        <p>This practice has no children.</p>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <div
        v-if="terminationModal"
        class="termination-modal h-full flex border-l-4 border-r-4 border-sunglow shadow-lg"
      >
        <TerminateSurgery
          :practice="practice"
          :child-surgery="specificChildSurgery"
          @close="terminationModal = false"
        />
      </div>
    </transition>
    <!-- END TABLE -->

    <div v-if="terminationModal" class="add-practice-shield" @click="closeModals()" />
    <transition name="slide" mode="out-in">
      <div v-if="modal" class="add-practice-modal shadow-lg">
        <AddPracticeSurgery :practice="practice" :spokes-count="total" @close="modal = false" />
      </div>
    </transition>
  </div>
</template>
<script>
import AddPracticeSurgery from "@/components/Practices/AddPracticeSurgery"
import AppPagination from "@/components/Base/AppPagination"
import AppLoading from "@/components/Base/AppLoading"
import TerminateSurgery from "@/components/Practices/TerminateSurgery"
import AppTable from "@/components/Base/AppTable"
import AppButton from "@/components/Base/AppButton"
export default {
	components: {
		AddPracticeSurgery,
		TerminateSurgery,
		AppTable,
		AppButton
	},
	props: ["practice"],
	data () {
		return {
			// practiceChildren:{},
			// total:0,
			// totalPages:0,
			deleteSurgery: false,
			currentPage: 1,
			perPage: 0,
			modal: false,
			loadingSurgeries: false,
			terminationModal: false,
			specificChildSurgery: "",
			columns: [
				{
					name: "Practice Name",
					dataIndex: "child_practice.surgery.name"
				},
				{
					name: "Practice Code",
					dataIndex: "child_practice.surgery.code",
					class: "text-center"
				},
				{
					name: "Invited at",
					dataIndex: "created_at",
					class: "localDate text-center"
				},
				{
					name: "Status",
					slot: true,
					slotName: "type_slot",
					dataIndex: "",
					class: "text-center"
				}
			]
		}
	},
	computed: {
		total () {
			return this.$store.state.practices.practiceSpokesCount
		},
		practiceChildren () {
			return this.$store.state.practices.practiceSpokes
		},
		totalPages () {
			return this.$store.state.practices.practiceSpokesPageCount
		}
	},
	watch: {
		$route (to, from) {
			this.currentPage = parseInt(to.query.practice_children_page)
			this.getChildren()
		}
	},
	beforeDestroy () {
		let query = Object.assign({}, this.$route.query)
		delete query.practice_children_page
		this.$router.push({ query })
	},
	async created () {
		const query = {
			...this.$route.query,
			practice_children_page: this.$route.query.practice_children_page || 1
		}
		try {
			this.loadingSurgeries = true
			await this.$axios
				.$get(
					`/api/v1/admin/practices/${this.practice.id}/practice-surgeries/count`
				)
				.then(res => {
					this.$store.commit(
						"practices/SET_PRACTICE_SPOKES_COUNT",
						res.data.count
					) //quantity of spokes
					this.perPage = 5
					let pageCount = Math.ceil(this.total / this.perPage)
					this.$store.commit(
						"practices/SET_PRACTICE_SPOKES_PAGE_COUNT",
						pageCount
					) //number of pages
					this.getChildren()
				})
		} catch (err) {
			this.$store.commit("SET_NOTIFICATION", {
				enabled: true,
				status: "danger",
				text: err.response.data.message
			})
			console.log("get practice surgeries error!!!!", err)
		}
	},
	methods: {
		show () {
			this.$router.push(
				`/practices/${this.$route.params.id}/practice-surgeries/add-spoke`
			)
		},
		async viewTerminationModal (childId) {
			console.log("id", childId)

			await this.$axios
				.$get(
					`/api/v1/admin/practices/${this.practice.id}/practice-surgeries/${childId}`
				)
				.then(res => {
					this.specificChildSurgery = res.data.practice_surgery
				})

			this.$router.push(
				`/practices/${this.$route.params.id}/practice-surgeries/${this.specificChildSurgery.id}/terminate-spoke`
			)
			// this.terminationModal = true;
		},
		closeModals () {
			this.modal = false
			this.terminationModal = false
		},
		async getChildren () {
			let limit = 5
			let offset = 0
			offset = this.perPage * (parseInt(this.$route.query.practice_children_page) - 1)
			let params = { limit, offset }

			await this.$axios
				.$get(
					`/api/v1/admin/practices/${this.practice.id}/practice-surgeries`,
					{ params }
				)
				.then(res => {
					this.$store.commit(
						"practices/SET_PRACTICE_SPOKES",
						res.data.practice_surgeries
					)
				})
				.catch(err => {
					console.log("get children error!!!!", err)
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: err.response.data.message
					})
				})
			this.loadingSurgeries = false
		},

		goToChild (link) {
			this.$router.push()
		},
		pagechanged (e) {
			const query = {
				...this.$route.query,
				practice_children_page: e || 1
			}
			this.$router.push({ query })
			this.getChildren()
		},
		statusStyle (status) {
			this.checkStatus(status)
			switch (this.checkStatus(status)) {
				case "Active":
					return "bg-green-500 text-white"
					break
				case "Rejected":
					return "bg-gray-500 text-gray-700"
					break
				case "Termination Requested":
					return "bg-orange-500 text-white"
					break
				case "Terminated":
					return "bg-red-800 text-red-400"
					break
				default:
					return "bg-yellow-400 text-black"
			}
		},
		checkStatus (invitation) {
			let result = "Invited"
			if (invitation.invitation_accepted_at) {
				result = "Active"
			}

			if (invitation.invitation_rejected_at) {
				result = "Rejected"
			}

			if (invitation.termination_requested_at) {
				if (invitation.invitation_accepted_at) {
					result = "Termination Requested"
				} else {
					result = "Cancellation Requested"
				}
			}

			if (invitation.terminated_at) {
				result = "Terminated"
			}
			return result
		},
		async limitchanged (limit) {
			this.currentPage = 1
			this.itemsPerPage = limit
			await this.getChildren(this.paramSort)
		},
		sorted (order_by) {
			this.currentPage = 1
			this.paramSort.order_by = order_by
			this.getChildren(this.paramSort)
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
.add-practice-shield {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #333;
	opacity: 0.5;
	z-index: 511;
}
.add-practice-modal {
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

.termination-modal {
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	border-radius: 25px;
	width: 800px;
	max-width: 95%;
	max-height: 80%;
	overflow: auto;
	transition: all 0.3s ease-in-out;
	background-color: #505561;
	z-index: 512;
}

@media screen and (min-width: 1200px) {
	.add-practice-modal {
		width: 70%;
	}
}
@media screen and (min-width: 768px) {
	.termination-modal {
		max-height: 60%;
	}
}
</style>
