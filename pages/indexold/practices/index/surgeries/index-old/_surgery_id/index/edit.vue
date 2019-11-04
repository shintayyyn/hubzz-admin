<template>
	<div class="absolute top-0 bottom-0 right-0 left-0 cursor-pointer">

		<div class="sm:ml-32 h-full bg-trout shadow-lg cursor-default">

			<!-- HEADER -->
			<div class="flex justify-between text-sm text-white py-2 px-6">
				<nuxt-link :to="{ path: `/surgeries/${surgery.id}`, query: $route.query }" class="text-white p-1">
					<svgicon name="arrow-left-solid" height="32" width="32" class="text-white hover:text-sunglow fill-current"/>
				</nuxt-link>
			</div>
			<!-- HEADER -->

			<!-- TITLE -->
			<div class="px-6 text-white">
				<h3>Edit Practice Type {{ $route.params.surgery_id }}</h3>
			</div>
			<!-- TITLE -->

			<!-- FORM -->
			<div class="w-full sm:w-5/6 md:w-4/5 lg:w-3/4 xl:w-2/3">
				<div class="bg-waterloo m-4 py-2 px-4 rounded-lg">

					<div class="mb-2">
						<div class="flex items-end justify-between">
							<label class="text-xs py-1 m-1 text-white">Name</label>
							<span class="text-xs py-1 m-1 text-red" v-if="nameErrorMessage">{{ nameErrorMessage }}</span>
						</div>
						<input class="w-full py-1 px-2 rounded text-sm" v-model="name" placeholder="Name">
					</div>

					<div class="mb-2">
						<div class="flex items-end justify-between">
							<label class="text-xs py-1 m-1 text-white">Code</label>
							<span class="text-xs py-1 m-1 text-red" v-if="nameErrorMessage">{{ codeErrorMessage }}</span>
						</div>
						<input class="w-full py-1 px-2 rounded text-sm" v-model="code" placeholder="Code">
					</div>

					<div class="mb-2">
						<div class="flex items-end justify-between">
							<label class="text-xs py-1 m-1 text-white">Phone Number</label>
							<span class="text-xs py-1 m-1 text-red" v-if="phoneNumberErrorMessage">{{ phoneNumberErrorMessage }}</span>
						</div>
						<input class="w-full py-1 px-2 rounded text-sm" v-model="phone_number" placeholder="Phone Number">
					</div>

					<div class="mb-2">
						<div class="flex items-end justify-between">
							<label class="text-xs py-1 m-1 text-white">Clinical Commissioning Group</label>
							<span class="text-xs py-1 m-1 text-red" v-if="clinicalCommissioningGroupIdErrorMessage">{{ clinicalCommissioningGroupIdErrorMessage }}</span>
						</div>
						<input class="w-full py-1 px-2 rounded text-sm" v-model="clinical_commissioning_group_id" placeholder="Clinical Commissioning Group">
					</div>

					<div class="mb-2">
						<div class="flex items-end justify-between">
							<label class="text-xs py-1 m-1 text-white">Address Line 1</label>
							<span class="text-xs py-1 m-1 text-red" v-if="addressLine1ErrorMessage">{{ addressLine1ErrorMessage }}</span>
						</div>
						<input class="w-full py-1 px-2 rounded text-sm" v-model="address_line_1" placeholder="Address Line 1">
					</div>

					<div class="mb-2">
						<div class="flex items-end justify-between">
							<label class="text-xs py-1 m-1 text-white">Address Line 2</label>
							<span class="text-xs py-1 m-1 text-red" v-if="addressLine2ErrorMessage">{{ addressLine2ErrorMessage }}</span>
						</div>
						<input class="w-full py-1 px-2 rounded text-sm" v-model="address_line_2" placeholder="Address Line 2">
					</div>

					<div class="mb-2">
						<div class="flex items-end justify-between">
							<label class="text-xs py-1 m-1 text-white">Address Line 3</label>
							<span class="text-xs py-1 m-1 text-red" v-if="addressLine3ErrorMessage">{{ addressLine3ErrorMessage }}</span>
						</div>
						<input class="w-full py-1 px-2 rounded text-sm" v-model="address_line_3" placeholder="Address Line 3">
					</div>

					<div class="mb-2">
						<div class="flex items-end justify-between">
							<label class="text-xs py-1 m-1 text-white">Post Code</label>
							<span class="text-xs py-1 m-1 text-red" v-if="postCodeErrorMessage">{{ postCodeErrorMessage }}</span>
						</div>
						<input class="w-full py-1 px-2 rounded text-sm" v-model="post_code" placeholder="Post Code">
					</div>

					<div class="text-right">
						<button class="inline-flex py-2 px-4 my-2 bg-blue-300 text-xs text-white rounded-lg shadow" v-if="!updating" @click="updatePracticeType">Update</button>
						<button class="inline-flex py-2 px-4 my-2 bg-blue-300 text-xs text-white rounded-lg shadow" v-if="updating">Updating...</button>
					</div>
				</div>
			</div>
			<!-- FORM -->

		</div>

	</div>
</template>

<script>
	export default {

		transition: 'subpage',

    async asyncData({ app, route }) {

      try {

        let response = await app.$axios.get(`/api/v1/surgeries/${route.params.surgery_id}`)

        const surgery = response.data.data.surgery

        return {
          surgery,
          name: surgery.name,
          code: surgery.code,
          phone_number: surgery.phone_number,
          clinical_commissioning_group_id: surgery.clinical_commissioning_group ? surgery.clinical_commissioning_group.id : '',
          address_line_1: surgery.address ? surgery.address.line_1 : null,
          address_line_2: surgery.address ? surgery.address.line_2 : null,
          address_line_3: surgery.address ? surgery.address.line_3 : null,
          post_code: surgery.address ? surgery.address.post_code : null
        }

      } catch (err) {

        console.log('index surgeries index _id index asyncData err', err)

        throw err

      }

    },

		data () {

			return {
				surgery: null,
				updating: false,
				name: '',
				code: '',
				phone_number: '',
				clinical_commissioning_group_id: '',
				address_line_1: '',
				address_line_2: '',
				address_line_3: '',
				post_code: '',
				errorMessages: []
			}

		},

		computed: {

			nameErrorMessage () {

				const nameErrorMessages = this.errorMessages.filter(errorMessage => errorMessage.field === 'name')

				return nameErrorMessages.length > 0 ? nameErrorMessages[0].message : ''

			},

			codeErrorMessage () {

				const codeErrorMessages = this.errorMessages.filter(errorMessage => errorMessage.field === 'code')

				return codeErrorMessages.length > 0 ? codeErrorMessages[0].message : ''

			},

			phoneNumberErrorMessage () {

				const phoneNumberErrorMessages = this.errorMessages.filter(errorMessage => errorMessage.field === 'phone_number')

				return phoneNumberErrorMessages.length > 0 ? phoneNumberErrorMessages[0].message : ''

			},

			addressLine1ErrorMessage () {

				const addressLine1ErrorMessages = this.errorMessages.filter(errorMessage => errorMessage.field === 'address_line_1')

				return addressLine1ErrorMessages.length > 0 ? addressLine1ErrorMessages[0].message : ''

			},

			addressLine2ErrorMessage () {

				const addressLine2ErrorMessages = this.errorMessages.filter(errorMessage => errorMessage.field === 'address_line_2')

				return addressLine2ErrorMessages.length > 0 ? addressLine2ErrorMessages[0].message : ''

			},

			addressLine3ErrorMessage () {

				const addressLine3ErrorMessages = this.errorMessages.filter(errorMessage => errorMessage.field === 'address_line_3')

				return addressLine3ErrorMessages.length > 0 ? addressLine3ErrorMessages[0].message : ''

			},

			postCodeErrorMessage () {

				const postCodeErrorMessages = this.errorMessages.filter(errorMessage => errorMessage.field === 'post_code')

				return postCodeErrorMessages.length > 0 ? postCodeErrorMessages[0].message : ''

			},

			clinicalCommissioningGroupIdErrorMessage () {

				const clinicalCommissioningGroupIdErrorMessages = this.errorMessages.filter(errorMessage => errorMessage.field === 'clinical_commissioning_group_id')

				return clinicalCommissioningGroupIdErrorMessages.length > 0 ? clinicalCommissioningGroupIdErrorMessages[0].message : ''

			},

		},

		watch: {

			name () {

				this.errorMessages = this.errorMessages.filter(errorMessage => errorMessage.field !== 'name')

			},

			code () {

				this.errorMessages = this.errorMessages.filter(errorMessage => errorMessage.field !== 'code')

			},

			phone_number () {

				this.errorMessages = this.errorMessages.filter(errorMessage => errorMessage.field !== 'phone_number')

			},

			address_line_1 () {

				this.errorMessages = this.errorMessages.filter(errorMessage => errorMessage.field !== 'address_line_1')

			},

			address_line_2 () {

				this.errorMessages = this.errorMessages.filter(errorMessage => errorMessage.field !== 'address_line_2')

			},

			address_line_3 () {

				this.errorMessages = this.errorMessages.filter(errorMessage => errorMessage.field !== 'address_line_3')

			},

			post_code () {

				this.errorMessages = this.errorMessages.filter(errorMessage => errorMessage.field !== 'post_code')

			},

			clinical_commissioning_group_id () {

				this.errorMessages = this.errorMessages.filter(errorMessage => errorMessage.field !== 'clinical_commissioning_group_id')

			},

		},

		methods: {

			updatePracticeType () {

				this.updating = true

				this.$axios.put(`/api/v1/surgeries/${this.surgery.id}`, {
					name: this.name,
					code: this.code,
					phone_number: this.phone_number,
					address_line_1: this.address_line_1,
					address_line_2: this.address_line_2,
					address_line_3: this.address_line_3,
					post_code: this.post_code,
					clinical_commissioning_group_id: this.clinical_commissioning_group_id
				}).then(response => {


				}).catch(err => {

					if (err.response && err.response.data && err.response.data && err.response.data.error_messages) {
						
						this.errorMessages = err.response.data.error_messages

					}

				}).finally(() => {
					
					this.updating = false

				})

			}

		}

	}
</script>