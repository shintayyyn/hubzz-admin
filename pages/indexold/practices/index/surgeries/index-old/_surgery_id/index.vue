<template>
	<div class="absolute top-0 bottom-0 right-0 left-0 cursor-pointer">

		<div class="sm:ml-16 h-full bg-trout shadow-lg cursor-default relative">

			<!-- DELETE MODAL -->
			<div v-if="showDeleteModal" class="flex justify-center">
				<div class="absolute py-4 px-6 bg-white rounded-lg rounded-t-none text-center bg-red-300 shadow-lg">
					<div>
						<span class="text-sm text-white">Are you sure you want to delete this Surgery?</span>
					</div>
					<div class="text-right mt-2 px-2">
						<button class="border text-sm text-white px-2 py-1 rounded-lg" @click="showDeleteModal = false">No</button>
						<button class="border text-sm text-white px-2 py-1 rounded-lg" @click="deletePracticeType">Yes</button>
					</div>
				</div>
			</div>
			<!-- DELETE MODAL -->

			<!-- HEADER -->
			<div class="flex justify-between text-sm text-white py-2 px-6">
				<nuxt-link :to="{ path: `/surgeries`, query: $route.query }" class="text-white p-1">
					<svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
				</nuxt-link>
			</div>
			<!-- HEADER -->

			<!-- TITLE -->
			<div class="px-6 text-white">
				<h3>View Surgery {{ $route.params.surgery_id }}</h3>
			</div>
			<!-- TITLE -->

			<!-- FORM -->
			<div class="w-full sm:w-5/6 md:w-4/5 lg:w-3/4 xl:w-2/3">
				<div class="bg-waterloo m-4 py-2 px-4 rounded-lg">

					<div class="flex flex-col lg:flex-row">

						<div class="w-full lg:w-3/5">
							<div class="mb-2">
								<div class="flex items-end justify-between">
									<label class="text-xs py-1 m-1" style="color: #CDD0D8;">Name</label>
								</div>
								<div class="inline-block py-1 px-2 rounded">
									<span class="text-sm text-white">{{ surgery.name }}</span>
								</div>
							</div>

							<div class="mb-2">
								<div class="flex items-end justify-between">
									<label class="text-xs py-1 m-1" style="color: #CDD0D8;">Code</label>
								</div>
								<div class="inline-block py-1 px-2 rounded">
									<span class="text-sm text-white">{{ surgery.code }}</span>
								</div>
							</div>

							<div class="mb-2">
								<div class="flex items-end justify-between">
									<label class="text-xs py-1 m-1" style="color: #CDD0D8;">Phone Number</label>
								</div>
								<div class="inline-block py-1 px-2 rounded">
									<span class="text-sm text-white" v-if="surgery.phone_number">{{ surgery.phone_number }}</span>
									<span class="text-sm text-white" v-if="!surgery.phone_number">&nbsp;</span>
								</div>
							</div>

							<div class="mb-2">
								<div class="flex items-end justify-between">
									<label class="text-xs py-1 m-1" style="color: #CDD0D8;">Clinical Commissioning Group</label>
								</div>
								<div class="inline-block py-1 px-2 rounded">
									<span class="text-sm text-white" v-if="surgery.clinical_commissioning_group">{{ surgery.clinical_commissioning_group.name }}</span>
									<span class="text-sm text-white" v-if="!surgery.clinical_commissioning_group">&nbsp;</span>
								</div>
							</div>

							<div class="mb-2">
								<div class="flex items-end justify-between">
									<label class="text-xs py-1 m-1" style="color: #CDD0D8;">Address</label>
								</div>
								<div class="inline-flex flex-col py-1 px-2 rounded">
									<span class="text-xs py-1 text-white" v-if="surgery.address && surgery.address.line_1">{{ surgery.address.line_1 }}</span>
									<span class="text-xs py-1 text-white" v-if="surgery.address && surgery.address.line_2">{{ surgery.address.line_2 }}</span>
									<span class="text-xs py-1 text-white" v-if="surgery.address && surgery.address.line_3">{{ surgery.address.line_3 }}</span>
									<span class="text-xs py-1 text-white" v-if="surgery.address && surgery.address.post_code">{{ surgery.address.post_code }}</span>
								</div>
							</div>
						</div>

						<div class="w-full lg:w-2/5">
							<div class="mb-2">
								<div class="flex items-end justify-between">
									<label class="text-xs py-1 m-1" style="color: #CDD0D8;">Created By</label>
								</div>
								<div class="inline-block py-1 px-2 rounded">
									<span class="text-sm text-white">{{ surgery.created_by_user && surgery.created_by_user.personal_detail ? surgery.created_by_user.personal_detail.name : null }}</span>
								</div>
							</div>

							<div class="mb-2">
								<div class="flex items-end justify-between">
									<label class="text-xs py-1 m-1" style="color: #CDD0D8;">Updated At</label>
								</div>
								<div class="inline-block py-1 px-2 rounded">
									<span class="text-sm text-white">{{ surgery.created_at ? $moment(surgery.created_at).format('MMM D, YYYY | hh:mm A') : null }}</span>
								</div>
							</div>

							<div class="mb-2">
								<div class="flex items-end justify-between">
									<label class="text-xs py-1 m-1" style="color: #CDD0D8;">Updated By</label>
								</div>
								<div class="inline-block py-1 px-2 rounded">
									<span class="text-sm text-white" v-if="surgery.updated_by_user && surgery.created_by_user.personal_detail">{{ surgery.created_by_user.personal_detail.name }}</span>
									<span class="text-sm text-white" v-if="!surgery.updated_by_user || !surgery.created_by_user.personal_detail">&nbsp;</span>
								</div>
							</div>

							<div class="mb-2">
								<div class="flex items-end justify-between">
									<label class="text-xs py-1 m-1" style="color: #CDD0D8;">Updated At</label>
								</div>
								<div class="inline-block py-1 px-2 rounded">
									<span class="text-sm text-white" v-if="surgery.updated_at">{{ $moment(surgery.updated_at).format('MMM D, YYYY | hh:mm A') }}</span>
									<span class="text-sm text-white" v-if="!surgery.updated_at">&nbsp;</span>
								</div>
							</div>
						</div>

					</div>

					<div class="text-right">
						<nuxt-link :to="{ path: `/surgeries/${surgery.id}/edit`, query: $route.query }" class="inline-flex no-underline py-2 px-4 my-2 bg-blue-300 text-xs text-white rounded-lg shadow">Edit</nuxt-link>
						<button class="inline-flex py-2 px-4 my-2 bg-red-300 text-xs text-white rounded-lg shadow" @click="showDeleteModal = true">Delete</button>
					</div>

				</div>
			</div>
			<!-- FORM -->

		</div>

		<nuxt-child/>

	</div>
</template>

<script>
	export default {

		transition: 'subpage',

    async asyncData ({ app, route }) {

      try {

        let response = await app.$axios.get(`/api/v1/surgeries/${route.params.surgery_id}`)

        const surgery = response.data.data.surgery

        return {
          surgery
        }

      } catch (err) {

        console.log('index surgeries index _id index asyncData err', err)

        throw err

      }

    },

		data () {

			return {
				deleting: false,
				surgery: null,
				showDeleteModal: false
			}

		},

		methods: {
			
			deletePracticeType () {

				this.showDeleteModal = false

				this.deleting = true

				this.$axios.delete(`/api/v1/surgeries/${this.surgery.id}`).then(response => {

					this.$router.push({ path: `/surgeries`, query: this.$route.query })

				}).catch(err => {

					console.log('err', err)

				}).finally(() => {

					this.deleting = false

				})

			}

		}

	}
</script>