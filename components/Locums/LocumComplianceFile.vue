<template>
  <div class="absolute page-overlap flex-1 flex flex-col self-end bg-trout w-full max-w-2xl">
    <div class="flex items-center text-sm text-white py-6 px-4 md:px-8">
      <div class="cursor-pointer" @click="goBack()">
        <svgicon
          name="arrow-left-solid"
          height="32"
          width="32"
          class="text-white hover:text-sunglow fill-current"
        />
      </div>

      <!-- <button
				class="inline-flex items-center cursor-pointer text-white hover:text-black hover:bg-yellow-500 rounded-lg p-2 m-1"
				@click.prevent="publish()"
			>
				<svgicon name="save-icon" width="21" height="21" class="fill-current"></svgicon>
				<span class="px-1 font-semibold">Save</span>
			</button>-->

      <button
        class="inline-flex items-center cursor-pointer text-white hover:text-black hover:bg-yellow-500 rounded-lg p-2 m-1"
        @click.prevent="downloadItem(complianceDoc.file.url,complianceDoc.file.filename)"
      >
        <svgicon name="cloud-download" width="21" height="21" class="fill-current" />
        <span class="px-1 font-semibold">Download</span>
      </button>
    </div>
    <div class="shadow-lg rounded-lg bg-waterloo mx-4 md:mx-12 mb-6 p-4">
      <div class="w-full inline-flex flex-wrap md:flex-no-wrap md:flex-row flex-col-reverse text-sm">
        <div class="text-gray-300 m-2 md:w-1/3 lg:w-1/3">
          <div class="leading-tight pb-4">
            <p class="font-bold text-base">
              Title
            </p>
            <p
              class="text-white"
            >
              {{ complianceDoc.compliance_document ? complianceDoc.compliance_document.name: null }}
            </p>
          </div>
          <div class="leading-tight pb-4">
            <p class="font-bold text-base">
              Locum
            </p>
            <p class="text-white">
              {{ user.personal_detail ? user.personal_detail.name: null }}
            </p>
          </div>
          <div class="leading-tight pb-4">
            <p class="font-bold text-base">
              File last uploaded
            </p>
            <p
              class="text-white"
            >
              {{ complianceDoc.file ? $moment(complianceDoc.file.created_at).utc().format('DD/MM/YYYY | HH:mm') : null }}
            </p>
          </div>
          <div class="leading-tight pb-4">
            <p class="font-bold text-base">
              Mobile phone number
            </p>
            <p class="text-white">
              {{ user.contact_detail ? user.contact_detail.mobile_number : null }}
            </p>
          </div>

          <div
            v-if="(complianceDoc.type === 'Mandatory' || complianceDoc.type !== 'Optional') && !complianceDoc.mandatory_training"
            class="w-full"
          >
            <div class="leading-tight pb-4">
              <p class="font-bold">
                Expired At
              </p>
              <p
                :class="complianceDoc && complianceDoc.expired_at ? 'text-white' : 'text-gray-400'"
              >
                {{ complianceDoc && complianceDoc.expired_at ? $moment(complianceDoc.expired_at).utc().format('DD/MM/YYYY | HH:mm') : 'No expiration date set.' }}
              </p>
            </div>
            <div v-if="complianceDoc.status == 'Rejected'" class="pb-2 mb-2">
              <p class="font-bold">
                Note
              </p>
              <p
                class="text-white break-words"
              >
                {{ complianceDoc && complianceDoc.note ? complianceDoc.note : 'N/A' }}
              </p>
            </div>

            <div>
              <AppInput
                v-model="toPutLocumDetailCompliance.status"
                class="w-full mr-2"
                :type="'select'"
                :name="'status'"
                :placeholder="'Select...'"
                :items="[{label: 'Approve', value: 'Approved'}, {label: 'Reject', value: 'Rejected'}]"
                :error="formError.find(item => item.field === 'status')"
                :label="'Status'"
                required
                @change="setStatusData($event)"
              />
            </div>

            <div v-if="notesAreVisible" class="w-full">
              <AppInput
                v-model="toPutLocumDetailCompliance.note"
                :name="'complianceNote'"
                :placeholder="'Type Here'"
                :type="'textarea'"
                :label="'Reason for Rejection'"
                :rows="2"
                :class="'font-normal'"
                :error="formError.find(item => item.field === 'note')"
                required
              />
            </div>

            <div v-else class="pb-4">
              <AppDate
                v-model="toPutLocumDetailCompliance.expired_at"
                :name="'expired_at'"
                :label="'Change Expiration Date'"
                :error="formError.find(item => item.field === 'expired_at')"
                required
              />
            </div>
            <div class="flex">
              <AppButton class="mr-2" :label="'Save'" @click="publish()" />
              <AppButton
                v-if="['Expiring', 'Expired'].includes(complianceDoc.status)"
                class="mr-2"
                :label="'Notify Locum'"
                @click="emailModal=true"
              />
            </div>
          </div>
        </div>
        <div class="flex flex-col text-gray-400 md:m-2 md:w-2/3 lg:w-2/3">
          <p class="font-bold pb-2">
            File
          </p>
          <div class="w-full">
            <embed
              class="object-contain object-left-top w-full"
              :class="complianceDoc.file.type == 'image' ? 'image' : 'document h-full'"
              :src="getFileUrl(complianceDoc.file)"
            >
            <!-- :src="
								complianceDoc.file.subtype === 'tiff' ||
								complianceDoc.file.subtype === 'msword' ||
								complianceDoc.file.subtype === 'vnd.openxmlformats-officedocument.wordprocessingml.document' ||
								complianceDoc.file.subtype === 'vnd.openxmlformats-officedocument.wordprocessingml.template' ||
								complianceDoc.file.subtype === 'vnd.ms-word.document.macroEnabled.12' ||
								complianceDoc.file.subtype === 'vnd.ms-word.template.macroEnabled.12'
									? convertDoc(complianceDoc.file.url)
									: complianceDoc.file.url
						"-->
          </div>
        </div>
      </div>
    </div>
    <transition name="slide" mode="out-in">
      <div v-if="emailModal" class="confirm-termination-modal p-4 md:p-6">
        <no-ssr placeholder="Loading...">
          <quill-editor
            ref="myTextEditor"
            v-model="emailContent"
            class="bg-white text-black"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)"
          />
        </no-ssr>
        <div class="flex">
          <AppButton
            :label="'Send to Locum'"
            class="my-2 mr-2"
            :disabled="!emailContent"
            @click="sendEmail(complianceDoc.id, emailContent)"
          />
          <AppButton :label="'Cancel'" class="my-2 mr-2" @click="emailModal = false, emailContent=''" />
        </div>
      </div>
    </transition>
    <transition name="fade" mode="out-in">
      <div v-if="emailModal" class="shield" @click="emailModal = false, emailContent=''" />
    </transition>
  </div>
</template>

<script>
import AppDate from "@/components/Base/AppDate"
import AppInput from "@/components/Base/AppInput"
import AppButton from "@/components/Base/AppButton"
export default {
	components: {
		AppDate,
		AppInput,
		AppButton
	},
	props: {
    user: {
      type: Object,
      required: true,
    },
    complianceDoc: {
      type: Object,
      required: true,
    },
  },
	data () {
		return {
			toPutLocumDetailCompliance: {
				expired_at: null,
				status: "",
				note: ""
			},
			emailContent: "",
			notesAreVisible: false,
			formError: [],
			emailModal: false,
			editorOption: {
				placeholder: "Type your message here",
				modules: {
					toolbar: [
						["bold", "italic", "underline", "strike"],
						["blockquote", "code-block"],
						[{ header: 1 }, { header: 2 }],
						[{ list: "ordered" }, { list: "bullet" }],
						[{ script: "sub" }, { script: "super" }],
						[{ indent: "-1" }, { indent: "+1" }],
						[{ direction: "rtl" }],
						[{ size: ["small", false, "large", "huge"] }],
						[{ header: [1, 2, 3, 4, 5, 6, false] }],
						[{ font: [] }],
						[{ color: [] }, { background: [] }],
						[{ align: [] }],
						["clean"],
						["link"]
					]
				}
			}
		}
	},

	created () {
		this.toPutLocumDetailCompliance.expired_at = this.complianceDoc.expired_at
		this.toPutLocumDetailCompliance.status = this.complianceDoc.status
		this.toPutLocumDetailCompliance.note = this.complianceDoc.note
		console.log("to put locum compliance", this.toPutLocumDetailCompliance)
		if (this.complianceDoc.status === "Expiring") {
			this.toPutLocumDetailCompliance.status = "Approved"
		}
		if (this.complianceDoc.status === "Expired") {
			this.toPutLocumDetailCompliance.status = "Rejected"
		}
		if (this.complianceDoc.status === "Pending") {
			this.toPutLocumDetailCompliance.status = null
		}

		this.setStatusData(this.toPutLocumDetailCompliance.status)
	},
  
	methods: {
		onEditorBlur (editor) {
			console.log("editor blur!", editor)
		},

		onEditorFocus (editor) {
			console.log("editor focus!", editor)
		},

		onEditorReady (editor) {
			console.log("editor ready!", editor)
		},

		publish () {
			this.formError = []

			console.log(
				"toPutLocumDetailCompliance",
				this.toPutLocumDetailCompliance
			)

			let notRequired = []

			if (this.toPutLocumDetailCompliance.status === "Approved") {
				// notRequired.push("status");
				this.toPutLocumDetailCompliance.note = ""
				notRequired.push("note")
			}

			if (this.toPutLocumDetailCompliance.status === "Rejected") {
				// notRequired.push("note");
				this.toPutLocumDetailCompliance.expired_at = null
				notRequired.push("expired_at")
			}

			this.Validate(this.toPutLocumDetailCompliance, notRequired)
			console.log(this.toPutLocumDetailCompliance)
			console.log("errors", this.formError)
			if (!this.formError.length) {
				this.toPutLocumDetailComplianceDocs()
			}
		},

		setStatusData (incomingStatus) {
			this.toPutLocumDetailCompliance.status = incomingStatus
			if (incomingStatus === "Rejected") {
				this.notesAreVisible = true
			} else {
				this.notesAreVisible = false
			}
		},

		downloadItem (fileUrl, fileFilename) {
			const axios = require("axios")
			axios({
				url: fileUrl,
				method: "GET",
				responseType: "blob" // important
			}).then(response => {
				const url = window.URL.createObjectURL(new Blob([response.data]))
				const link = document.createElement("a")
				link.href = url
				link.setAttribute("download", fileFilename)
				document.body.appendChild(link)
				link.click()
			})
		},

    getFileUrl (file) {
      console.log('getFileUrl', file)

      const {
        type,
        subtype,
        url,
      } = file

      if (
        type === 'application'
        && subtype === 'pdf'
      ) {
        return url
      }

      if (
        type === 'image'
      ) {
        if (subtype === 'tiff') {
          return this.convertDoc(url)
          // return `${process.env.API_URL}/image-to-jpeg?url=${url}` 
        }

        return url
      }

      return this.convertDoc(url)
      // return url
    },

		convertDoc (document) {
			return `https://docs.google.com/gview?url=${document}&embedded=true`
		},

		getQuery () {
			const query = {
				...this.$route.query
			}
			const offset = parseInt(query.page) * 10 - 10
			return offset
		},

		sendEmail (id, body) {
			this.$axios
				.post(`/api/v1/admin/locum-compliance-documents/${id}/send-email`, {
					body: body
				})
				.then(res => {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: res.data.message
					})
					setTimeout(() => {
						this.emailModal = false
					}, 200)
				})
		},

		async toPutLocumDetailComplianceDocs () {
			console.log(this.toPutLocumDetailCompliance)
			try {
				if (this.toPutLocumDetailCompliance.status == "Rejected") {
					if (this.toPutLocumDetailCompliance.note) {
						await this.$axios.put(
							"/api/v1/admin/locum-detail-compliance-documents/" +
								this.complianceDoc.id,
							{
								status:
									this.toPutLocumDetailCompliance.status == "Expiring"
										? "Approved"
										: this.toPutLocumDetailCompliance.status,
								expired_at: this.toPutLocumDetailCompliance.expired_at,
								note: this.toPutLocumDetailCompliance.note
							}
						)
						// await this.getLocums();
						this.$emit('complianceUpdated')
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "success",
							text: "Saved"
						})
					} else if (this.toPutLocumDetailCompliance.note == "") {
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "danger",
							text: "Notes are required"
						})
					}
				} else if (
					this.toPutLocumDetailCompliance.status == "Approved" ||
					this.toPutLocumDetailCompliance.status == "Expired" ||
					this.toPutLocumDetailCompliance.status == ""
				) {
					await this.$axios.put(
						"/api/v1/admin/locum-detail-compliance-documents/" +
							this.complianceDoc.id,
						{
							status:
								this.toPutLocumDetailCompliance.status == "Expiring"
									? "Approved"
									: this.toPutLocumDetailCompliance.status,
							expired_at: this.toPutLocumDetailCompliance.expired_at
						}
					)
					this.$emit('complianceUpdated')
					// await this.getLocums();
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "Saved"
					})
				}

				this.goBack()
			} catch (err) {
				console.log("compliance file verification error", err)
				this.$store.commit("SET_NOTIFICATION", {
					enabled: true,
					status: "danger",
					text: err.response.data.message
				})
			}
		},

		goBack () {
			const query = {
				...this.$route.query
			}
			if (query.job_status) {
				delete query.job_status
			}
			this.$router.push({
				path: `/locums/${this.user.id}/locum-compliance`,
				query
			})
		},

	},
}
</script>

<style>
.document {
	width: 100%;
	min-height: 50vh;
}

.image {
	min-height: 100%;
	max-height: 100%;
}

@media screen and (min-width: 768px) {
	.document {
		min-height: 70vh;
	}

	.image {
		min-height: 60vh;
		max-height: 60vh;
	}
}
</style>
