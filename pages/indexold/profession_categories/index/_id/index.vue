<template>
	<div class="absolute top-0 bottom-0 right-0 left-0 flex flex-col">
		<div class="page-overlap flex-1 flex flex-col self-end bg-trout shadow-lg">

			<!-- HEADER -->
			<div class="flex justify-between text-sm text-white py-2 px-6">
				<nuxt-link to="/profession_categories" class="text-white p-1">
					<svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
				</nuxt-link>
			</div>
			<!-- HEADER -->

			<div class="flex-1 flex flex-col bg-waterloo m-4 py-2 px-4 rounded-lg overflow-auto">
				<div class="flex flex-col mb-4" style="max-width: 400px;">
					<label class="text-xs py-1 text-gray">Name</label>
					<input class="p-2 rounded" v-model="name">
				</div>

				<div class="flex flex-col mb-4">
					<label class="text-xs py-1 text-gray">Qualifications</label>
					<div class="flex items-center" v-for="qualification in qualifications">
						<input class="m-1" type="checkbox" v-model="qualification_id" name="qualification_id" :value="qualification.id">
						<label class="text-white">{{ qualification.name }}</label>
					</div>
				</div>

				<div class="flex flex-col">
					<label class="text-xs py-1 text-gray">Mandatory Compliance Documents</label>
					<div class="flex items-center" v-for="complianceDocument in complianceDocuments">
						<input class="m-1" type="checkbox" v-model="mandatory_compliance_document_id" name="mandatory_compliance_document_id" :value="complianceDocument.id">
						<label class="text-white">{{ complianceDocument.name }}</label>
					</div>
				</div>

				<div class="self-end">
					<button class="inline-flex py-2 px-4 my-2 bg-sunglow text-xs text-black rounded-lg shadow" @click="updateProfessionCategory">Save</button>
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
				const getQualificationsPromise = app.$axios.get(`/api/v1/qualifications`)

				const getComplianceDocumentsPromise = app.$axios.get(`/api/v1/compliance_documents`)

				const getProfessionCategoryPromise = app.$axios.get(`/api/v1/profession_categories/${route.params.id}`)

				const qualifications = (await getQualificationsPromise).data.data.qualifications

				const complianceDocuments = (await getComplianceDocumentsPromise).data.data.compliance_documents

				const professionCategory = (await getProfessionCategoryPromise).data.data.profession_category

				return {
					qualifications,
					complianceDocuments,
					professionCategory,
					name: professionCategory.name,
					qualification_id: professionCategory.qualifications.map(v => v.id),
					mandatory_compliance_document_id: professionCategory.mandatory_compliance_documents.map(v => v.id),
				}

			} catch (err) {
				console.log('index profession_categories index _id index asyncData err', err)
			}
		},

		data() {
			return {
				loading: false,
				qualifications: [],
				complianceDocuments: [],
				professionCategory: null,
				name: '',
				qualification_id: [],
				mandatory_compliance_document_id: []
			}
		},

		methods: {
			updateProfessionCategory() {
				this.loading = true
				this.$axios.put(`/api/v1/profession_categories/${this.professionCategory.id}`, {
					name: this.name
				}).then(response => {
					console.log('response', response)
				}).catch(err => {
					console.log('err', err)
				}).finally(() => {
					this.loading = false
				})
			}
		}
	}
</script>
<style>
.page-overlap{
    width: calc(100% - 70px);
  }

  @media screen and (min-width: 1200px) {
    .page-overlap{
      width: calc(100% - 200px);
    }
  }
</style>
