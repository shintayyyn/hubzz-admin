<template>
	<div
		class="flex xs:flex-col my-3 text-sm no-underline shadow-lg rounded-lg bg-waterloo shadow mx-4 md:mx-8"
	>
		<div class="inline-flex">
			<div class="w-full flex flex-wrap overflow-hidden text-gray-300 py-4 md:py-0">
				<!--COLUMN 1-->
				<div class="flex flex-col order-2 md:order-1 w-full md:w-1/3 overflow-hidden md:mb-2 md:px-4">
					<div class="mx-3 md:my-6">
						<p class="mt-2">Name</p>
						<p
							class="font-bold pl-2"
							:class="!user.personal_detail.name && 'opacity-75'"
						>{{ user.personal_detail.name ? user.personal_detail.name : 'N/A' }}</p>

						<p class="mt-2">Email address</p>
						<p
							class="font-bold pl-2"
							:class="!user.email && 'opacity-75'"
						>{{ user.email ? user.email : 'N/A' }}</p>

						<p class="mt-2">Mobile phone number</p>
						<p
							class="font-bold pl-2"
							:class="!user.contact_detail.mobile_number && 'opacity-75'"
						>{{ user.contact_detail && user.contact_detail.mobile_number ? user.contact_detail.mobile_number : 'N/A' }}</p>

						<p class="mt-2">Home / landline number</p>
						<p
							class="font-bold pl-2"
							:class="!user.contact_detail.home_number && 'opacity-75'"
						>{{ user.contact_detail && user.contact_detail.home_number ? user.contact_detail.home_number : 'N/A' }}</p>

						<p class="mt-2">Work Number</p>
						<p
							class="font-bold pl-2"
							:class="!user.contact_detail.work_number && 'opacity-75'"
						>{{ user.contact_detail && user.contact_detail.work_number ? user.contact_detail.work_number : 'N/A' }}</p>

						<p class="mt-2">Postal Address</p>
						<p
							class="font-bold pl-2"
							:class="!user.address_detail.address.line_1 && 'opacity-75'"
						>{{ user.address_detail ? user.address_detail.address.line_1 : 'N/A' }}</p>
						<p
							class="font-bold pl-2"
							:class="!user.address_detail.address.line_2 && 'opacity-75'"
						>{{ user.address_detail ? user.address_detail.address.line_2 : 'N/A' }}</p>
						<p
							class="font-bold pl-2"
							:class="!user.address_detail.address.line_3 && 'opacity-75'"
						>{{ user.address_detail ? user.address_detail.address.line_3 : 'N/A' }}</p>

						<p class="mt-2">GMC / NMC Number</p>
						<p
							class="font-bold pl-2"
							:class="!locumDetails.gmc_or_nmc_number && 'opacity-75'"
						>{{ locumDetails.gmc_or_nmc_number ? locumDetails.gmc_or_nmc_number.number : 'N/A' }}</p>

						<p class="mt-2">MPL / NPL Number</p>
						<p
							class="font-bold pl-2"
							:class="!locumDetails.mpl_or_npl_number && 'opacity-75'"
						>{{ locumDetails.mpl_or_npl_number ? locumDetails.mpl_or_npl_number.number : 'N/A' }}</p>

						<p class="mt-2">NHS Smart Card ID Number</p>
						<p
							class="font-bold pl-2"
							:class="!locumDetails.nhs_smart_card_id_number && 'opacity-75'"
						>{{ locumDetails.nhs_smart_card_id_number ? locumDetails.nhs_smart_card_id_number : 'N/A' }}</p>

						<p class="mt-2">Profession</p>
						<p
							class="font-bold pl-2"
							:class="!locumDetails.profession && 'opacity-75'"
						>{{ locumDetails.profession ? locumDetails.profession.name : 'N/A' }}</p>

						<p class="mt-2">Speciality</p>
						<p
							:class="!user.locum_detail.qualifications && 'opacity-75'"
							class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-500"
							v-for="specialty in user.locum_detail.qualifications"
							:key="specialty.id + '-name'"
						>{{specialty ? specialty.name:'N/A'}}</p>
						<p class="mt-2">Clinical Systems</p>
						<p
							class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-500"
							:class="!user.locum_detail.clinical_systems && 'opacity-75'"
							v-for="clinicalSystem in user.locum_detail.clinical_systems"
							:key="clinicalSystem.id + '-name1'"
						>{{clinicalSystem ? clinicalSystem.name:'N/A'}}</p>

						<p class="mt-2">Spoken Languages</p>
						<p class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-500">English</p>
						<p
							class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-500"
							:class="!user.locum_detail.spoken_languages && 'opacity-75'"
							v-for="spokenLanguage in user.locum_detail.spoken_languages"
							:key="spokenLanguage.id + '-name2'"
						>{{spokenLanguage ? spokenLanguage.name:'N/A'}}</p>
					</div>
				</div>
				<!--COLUMN 2-->
				<div class="flex flex-col order-3 md:order-2 w-full md:w-1/3 overflow-hidden md:mb-2 md:px-4">
					<div class="mx-3 md:my-6">
						<p class="mt-2">Headline</p>
						<p
							class="font-bold pl-2"
							:class="!user.locum_detail.headline && 'opacity-75'"
						>{{user.locum_detail.headline?user.locum_detail.headline:'N/A'}}</p>
						<p class="mt-2">Short Biography</p>
						<p
							class="font-bold pl-2"
							:class="!user.locum_detail.short_biography && 'opacity-75'"
						>{{user.locum_detail.short_biography?user.locum_detail.short_biography:'N/A'}}</p>
						<p class="mt-2">Special requirements</p>
						<p
							class="font-bold pl-2"
							:class="!user.locum_detail.special_requirements && 'opacity-75'"
						>{{user.locum_detail.special_requirements?user.locum_detail.special_requirements:'N/A'}}</p>
						<p class="mt-2">Preferred rates</p>
						<p
							class="font-bold pl-2"
						>{{user.locum_detail.rates[0].min && user.locum_detail.rates[0].max ? 'Per Hour: £'+user.locum_detail.rates[0].min+' - £'+user.locum_detail.rates[0].max : '(none)'}}</p>
						<p
							class="font-bold pl-2"
						>{{user.locum_detail.rates[1].min && user.locum_detail.rates[1].max ? 'Per Half Day Session: £'+user.locum_detail.rates[1].min+' - £'+user.locum_detail.rates[1].max : '(none)'}}</p>

						<div v-if="userComplianceDocuments">
							<p class="my-2">Compliance Documents</p>
							<span
								v-if="userComplianceDocuments.length == 0"
								class="opacity-75"
							>No Mandatory Training Documents</span>
							<div
								v-for="(userComplianceDoc, index) in user.locum_detail.compliance_documents"
								:key="`${index}-${userComplianceDoc.id}-`"
								class="ml-2 pb-1"
							>
								<a
									class="text-gray-300 flex items-center cursor-pointer hover:text-yellow-500"
									@click.prevent="downloadItem(userComplianceDoc.file.url,userComplianceDoc.file.filename)"
									title="Click to download"
								>
									<svgicon name="cloud-download" width="21" height="21" color="white"></svgicon>
									<span
										class="w-full pl-2 leading-tight"
									>{{ userComplianceDoc.file ? userComplianceDoc.compliance_document.name:null }}</span>
								</a>
							</div>
						</div>
						<div v-if="userMandatoryTrainings">
							<p class="my-2">Mandatory Training Documents</p>
							<span
								v-if="userMandatoryTrainings.length == 0"
								class="opacity-75"
							>No Mandatory Training Documents</span>
							<div
								v-for="(userMandatoryTraining, index) in user.locum_detail.mandatory_trainings"
								:key="`${index}-${userMandatoryTraining.id}-`"
								class="mx-4"
							>
								<a
									class="text-gray-300 flex items-center cursor-pointer hover:text-yellow-500"
									@click.prevent="downloadItem(userMandatoryTraining.file.url,userMandatoryTraining.file.filename)"
									title="Click to download"
								>
									<svgicon name="cloud-download" width="21" height="21" color="white"></svgicon>
									<span
										class="w-full pl-2 leading-tight"
									>{{userMandatoryTraining.mandatory_training && userMandatoryTraining.file ? userMandatoryTraining.mandatory_training.name:null}}</span>
								</a>
							</div>
						</div>
					</div>
				</div>
				<!--COLUMN 3-->
				<div class="flex flex-col order-1 md:order-3 w-full md:w-1/3 overflow-hidden md:mb-2 md:px-4">
					<div class="mx-3 md:my-6 border-b text-center pb-3">
						<embed
							class="object-cover w-48 h-48 rounded-full mx-auto"
							:src="user.avatar ? user.avatar.file.url:null"
						/>
						<img
							v-if="!user.avatar"
							class="w-48 rounded-full mx-auto"
							src="~/assets/images/default-user-image.png"
						/>
						<p class="m-2 text-gray">Sign-up verified by email</p>
						<p
							class="mx-4 font-semibold"
						>{{user.is_email_verified ? "Account is E-Mail Verified":"Account is not E-Mail Verified"}}</p>
						<!-- <p class="m-2 text-gray">Active at </p> -->
						<div class="my-4">
							<span class="m-2">Account is</span>
							<span class="rounded p-1 px-3" :class="statusStyle(user.status)">{{user.status}}</span>
						</div>
					</div>
					<div class="mx-3 mt-4">
						<span class="text-lg font-semibold font-semibold">Change Locum Status</span>
						<span
							class="tool inline-block"
							data-tip="Locum is automatically 'Active' once passed the Verification Process. You cannot set the Locum to 'Active' if the Locum is not Compliant."
							tabindex="1"
						>
							<svgicon
								name="info"
								width="21"
								height="21"
								color="white transparent black"
								class="-mb-1 ml-2"
							></svgicon>
						</span>
						<div class="flex items-center">
							<AppInput
								class="w-full mr-2"
								v-model="selectedStatus"
								:type="'select'"
								:name="'status'"
								:placeholder="'Select...'"
								:items="[
                  { label: 'Active', value: 'Active' },
                  { label: 'Inactive', value: 'Inactive' },
                  { label: 'Deactivated', value: 'Deactivated' }
                ]"
							/>
							<AppButton :label="'Save'" @click="changeLocumUserStatus(user.id,selectedStatus)" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
export default {
	props: ["user"],
	components: {
		AppButton,
		AppInput
	},
	data() {
		return {
			disabled: "true",
			locumDetails: "",
			selectedStatus: "",
			profileTab: true,
			jobTab: false,
			userComplianceDocuments: [],
			userCurrentJobs: [],
			qualifications: [],
			clinicalSystems: [],
			spokenLanguages: [],
			specificLocumCompDocs: [],
			userMandatoryTrainings: []
		};
	},

	created() {
		console.log("locum", this.user);
		this.locumDetails = this.user.locum_detail;
		this.userComplianceDocuments = this.user.locum_detail.compliance_documents;
		this.qualifications = this.user.locum_detail.qualifications;
		this.clinicalSystems = this.user.locum_detail.clinical_systems;
		this.spokenLanguages = this.user.locum_detail.spoken_languages;
	},

	methods: {
		getLocums() {
			this.$store.dispatch("locums/fetchLocums", {
				limit: 8,
				order_by: "created_at:desc",
				offset: this.getQuery()
			});
		},
		getQuery() {
			const query = {
				...this.$route.query
			};
			const offset = parseInt(query.page) * 8 - 8;
			return offset;
		},
		downloadItem(imgUrl, imgFilename) {
			const axios = require("axios");
			axios({
				url: imgUrl,
				method: "GET",
				responseType: "blob" // important
			}).then(response => {
				const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute("download", imgFilename);
				document.body.appendChild(link);
				link.click();
			});
		},

		async changeLocumUserStatus(locumID, activeDisabled) {
			try {
				console.log("locum details", this.user);
				const response = await this.$axios.put(
					`/api/v1/admin/locum-users/${locumID}/status`,
					{ status: activeDisabled }
				);
				console.log("response", response);
				await this.getLocums();
				if (this.user.compliance_status !== "Compliant") {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "alert",
						text:
							"You cannot make a Locum 'Active' if the Locum is not Compliant"
					});
				} else {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "Saved"
					});
				}
			} catch (err) {
				console.log("index practices index put status err", err);
				this.$store.commit("SET_NOTIFICATION", {
					enabled: true,
					status: "danger",
					text: err.response.data.message
				});
			}
		},
		statusStyle(status) {
			switch (status) {
				case "Active":
					return "bg-green-500";
					break;
				case "Inactive":
					return "bg-yellow-500 text-black";
					break;
				case "Deactivated":
					return "bg-gray-500 text-black";
					break;
				case "Suspended":
					return "bg-red-500";
					break;
				case "Dormant":
					return "bg-green-600";
					break;
				default:
					return;
			}
		}
	}
};
</script>
