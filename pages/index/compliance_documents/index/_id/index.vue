<template>
	<div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
		<div style="width: calc(100% - 70px);" class="flex-1 flex flex-col self-end bg-trout shadow-lg">

			<!-- HEADER -->
			<div class="flex justify-between text-sm text-white py-2 px-6">
				<nuxt-link :to="{ path: `/compliance_documents`, query: $route.query }" class="text-white p-1">
					<svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
				</nuxt-link>
			</div>
			<!-- HEADER -->

			<div class="flex flex-col bg-waterloo m-4 py-2 px-4 rounded-lg overflow-auto" style="max-width: 400px;">
				<div class="flex flex-col mb-4">
					<label class="text-xs py-1 text-grey">Name</label>
					<input class="p-2 rounded" v-model="name">
				</div>

				<div class="self-end">
					<button class="inline-flex py-2 px-4 my-2 bg-sunglow text-xs text-black rounded-lg shadow" @click="updateComplianceDocument">Save</button>
				</div>

				<div class="self-end">
					<button class="inline-flex py-2 px-4 my-2 bg-sunglow text-xs text-black rounded-lg shadow" @click="deleteComplianceDocument">Delete</button>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	export default {
		transition: 'subpage',

		async asyncData({ app, route }) {
			try {
				const getComplianceDocumentPromise = app.$axios.get(`/api/v1/compliance_documents/${route.params.id}`)

				const complianceDocument = (await getComplianceDocumentPromise).data.data.compliance_document

				return {
					complianceDocument,
					name: complianceDocument.name
				}

			} catch (err) {
				console.log('index compliance_documents index _id index asyncData err', err)
			}
		},

		data() {
			return {
				loading: false,
				complianceDocument: null,
				name: ''
			}
		},

		methods: {
			updateComplianceDocument() {
				this.loading = true

				this.$axios.put(`/api/v1/compliance_documents/${this.complianceDocument.id}`, {
					name: this.name
				}).then(response => {
					console.log('response', response)

					this.$emit('updateComplianceDocument', this.complianceDocument.id, response.data.data.compliance_document)

					this.$router.push({ path: `/compliance_documents`, query: this.$route.query })
				}).catch(err => {
					console.log('err', err)
				}).finally(() => {
					this.loading = false
				})
			},

			deleteComplianceDocument() {
				this.loading = true
				
				this.$axios.delete(`/api/v1/compliance_documents/${this.complianceDocument.id}`).then(response => {
					console.log('response', response)

					this.$emit('deleteComplianceDocument', this.complianceDocument.id)

					this.$router.push({ path: `/compliance_documents`, query: this.$route.query })
				}).catch(err => {
					console.log('err', err)
				}).finally(() => {
					this.loading = false
				})
			}
		}
	}
</script>