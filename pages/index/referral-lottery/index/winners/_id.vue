<template>
  <div class="relative modal-container shadow-lg">
    <div class="p-4 md:p-8 relative">
      <div class="flex justify-between text-sm text-white">
        <nuxt-link :to="{path: `/referral-lottery`, query: {...$route.query}}" class="cursor-pointer">
          <svgicon
            name="arrow-left-solid"
            height="32"
            width="32"
            class="text-white hover:text-sunglow fill-current"
          />
        </nuxt-link>
      </div>
      <AppButton v-if="!raffle.winner_notified" label="Notify" class="flex justify-start mt-4" @click="modal = true" />
      <div class="flex flex-col bg-gray-400 rounded-lg p-4 mt-4">
        <div class="flex justify-start items-center font-bold my-2">
          <div class="text-xl mr-1">
            Name:
          </div>
          <div class="text-lg">
            {{ raffle.winner_user.name }}
          </div>
        </div>
        <div class="flex justify-start items-center font-bold my-2">
          <div class="text-xl mr-1">
            Winning Date:
          </div>
          <div class="text-lg">
            {{ $moment(raffle.date_created).format('DD/MM/YYYY') }}
          </div>
        </div>
        <div class="flex justify-start items-center font-bold my-2">
          <div class="text-xl mr-1">
            Prize:
          </div>
          <div class="text-lg" />
        </div>
      </div>
      <div v-if="modal" class="wrapper absolute mx-auto rounded-b-lg p-4 bg-waterloo-dark text-white shadow-lg">
        <AppInput
          v-model="description"
          :type="'textarea'"
          :name="'description'"
          :label="'Description'"
          :resize="false"
          :rows="3"
          required
        />
        <div class="flex justify-start">
          <AppButton :label="'Notify'" class="mt-4 mx-1" :disabled="loading" @click="notifyWinner" />
        </div>
      </div>
    </div>
    <div
      v-if="modal"
      class="shield"
      @click="modal = false"
    />
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput"
import AppButton from "@/components/Base/AppButton"
import AppConfirm from "@/components/Base/AppConfirm"
export default {
    components: {
        AppInput,
        AppButton,
        AppConfirm
    },
    data () {
        return {
            loading: false,
            raffle: null,
            description: '',
            modal: false
        }
    },
    async asyncData ({ app, params, query, error }) {
        try {
            const response = await app.$axios.$get(`/api/v1/admin/raffles/${params.id}`)
            const raffle = response.data && response.data.raffle ? response.data.raffle : null
            return {
                raffle,
            }
        } catch (error) {
            console.log('error', error || error.response)
            return error({ status: 400, message: error.response.message })
        }
    },
    methods: {
        notifyWinner () {
            if (!this.description) {
                this.$store.commit("SET_NOTIFICATION", {
                    enabled: true,
                    status: "danger",
                    text: "Description is required",
                })
                return
            }
            this.loading = true
            this.$axios.$post(`/api/v1/admin/raffles/${this.raffle.id}/notify-winner`, { description: this.description })
                .then(res => {
                    this.$store.commit("SET_NOTIFICATION", {
                        enabled: true,
                        status: "success",
                        text: res.message,
                    })
                    this.raffle.winner_notified = true
                    this.$emit('notify', this.raffle.id)
                }).catch(err => {
                    console.log('err', err || err.response)
                }).finally(() => {
                    this.modal = false
                })
            this.loading = false
        },
    }
}
</script>
<style scoped>
.modal-container {
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
	.modal-container {
		width: 80%;
	}
}
</style>