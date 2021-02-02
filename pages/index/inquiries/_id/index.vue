<template>
  <div class="support-modal p-4 md:p-8 shadow-lg">
    <transition name="fade" mode="out-in">
      <div>
        <div class="flex justify-between text-sm text-white">
          <div class="text-white mb-3 cursor-pointer" @click="goBack()">
            <svgicon
              name="arrow-left-solid"
              height="32"
              width="32"
              class="text-white hover:text-sunglow fill-current"
            />
          </div>
        </div>

        <div class="flex flex-wrap overflow-hidden border-b border-sunglow">
          <div class="flex-col text-white w-full mb-2 m-2 pb-3 text-sm md:text-base">
            <div class="flex justify-between my-1">
              <div>
                <span class="w-24 pr-3">Date Sent:</span>
                <span class="font-bold">
                  {{ email && email.created_at_in_gb_formatted ? email.created_at_in_gb_formatted : null }}
                </span>
              </div>

              <AppButton
                v-if="
                  !email.acknowledged_by_user_id 
                    && !email.acknowledged_at
                    && authAdminPermissions.includes('Acknowledge Inquiries Messages')
                "
                class="cursor-pointer"
                :label="'Acknowledge'"
                @click="acknowledgeInquiry()"
              />
              <div v-else class="-my-1 text-white font-semibold">
                <div class="flex p-2 m-2 bg-green-500 rounded-lg">
                  <div class="flex mr-2">
                    <svgicon name="circle-check" width="23" height="23" color="white" />
                  </div>

                  <div class="flex">
                    Acknowledged By: {{ email ? email.acknowledged_by_user.email : null }}
                  </div>
                </div>
              </div>
            </div>

            <div class="flex my-1">
              <span class="w-24 pr-3">From:</span>

              <span class="font-bold">
                {{ email.sender ? email.sender.email : null }}
              </span>
            </div>

            <div class="flex my-1">
              <div class="w-24 pr-3">
                Domain:
              </div>

              <div class="font-bold">
                {{ email.sender ? email.sender.domain : null }}
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col rounded-lg bg-waterloo text-white py-2 px-4 w-full h-full break-words my-2 md:mx-2">
          <span class="message whitespace-pre-line">
            {{ email.message }}
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import AppButton from "@/components/Base/AppButton"

export default {
  components: {
		AppButton
	},

  data (){
    return{
      email: null,
    }
  },

  computed : {
    authAdminPermissions () {
			return this.$store.getters["permissions"]
    },
  },

  async asyncData ({ app, route }){
    try{
      let response =  await app.$axios.$get(`/api/v1/admin/supports/${route.params.id}`)

      const email = response.data.email

      return {
        email
      }
    }catch(err){
      console.log('getSupportinfo error!',err)
    }
  },

  methods:{
    getQuery () {
			const query = {
				...this.$route.query
			}
			const offset = parseInt(query.page) * 10 - 10
			return offset
		},

		getSupportEmails () {
			this.$store.dispatch("supports/fetchUnacknowledgedSupports", {
				acknowledged: false,
				countOnly: true
			})

			this.$store.dispatch("supports/fetchSupports", {
				limit: 10,
				offset: this.getQuery()
			})
		},

		async acknowledgeInquiry () {
      const query = {
        ...this.$route.query
      }
			await this.$axios
				.$put(`/api/v1/admin/supports/${this.email.id}`)
				.then(res => {
          console.log('res', res.data.email)
          this.email = res.data.email
          
          this.getSupportEmails()

          this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "Successfully Acknowledged"
          })

          this.$router.push({ path:'/inquiries', query })
				})
		},
    goBack (){
      const query = {
        ...this.$route.query
      }
      if(query.session_tab){
        delete query.session_tab
      }
      this.$router.push({path:'/inquiries',query})
    },
  },
}
</script>

<style>
  .message {
    word-wrap: wrap;
    word-break: break-word;
  }

  .invoice{
    width: 100%;
  }

  .card {
    min-width: 100px;
    height: 250px;
    box-sizing: content-box;
  }

  .support-shield {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #333;
    opacity: 0.5;
    z-index: 511;
  }

  .support-modal {
    position: fixed;
    top: 0;
    right: 0;
    margin-right: 0%;
    width: 100%;
    height: 100%;
    overflow: auto;
    border-left: solid 2px #FFC72C;
    transition: all 0.3s ease-in-out;
    background-color:#505561;
    z-index: 512;
  }

  @media screen and (min-width: 1200px) {
    .support-modal {
      width: 80%;
    }
  }
</style>
