<template>
  <div class="hub-invitation-modal p-4 md:p-8 shadow-lg">
    <nuxt-link
      :to="{ path: `/practices/${$route.params.id}/practice-hub`, query }"
      class="text-white hover:text-yellow-500 "
    >
      <svgicon
        name="arrow-left-solid"
        height="32"
        width="32"
        class="hover:text-yellow-500 fill-current"
      />
    </nuxt-link>
    <div class="mt-4">
      <form class="flex flex-col bg-waterloo p-2 md:px-4 shadow rounded-lg sm:w-full lg:w-2/3">
        <div class="flex flex-wrap">
          <div class="w-1/2">
            <div class="text-gray-300 text-sm p-2">
              <p class="flex">
                Practice Name
              </p>
              <p
                class="flex items-center text-white text-sm p-2 font-semibold"
              >
                {{ practiceInvitation.practice ? practiceInvitation.practice.name : null }}
              </p>
              <p class="flex">
                Practice Code
              </p>
              <p
                class="flex text-white text-sm p-2 font-semibold"
              >
                {{ practiceInvitation.practice ? practiceInvitation.practice.code : null }}
              </p>
              <p class="flex">
                Address
              </p>
              <p class="flex text-white text-sm p-2 font-semibold">
                {{ practiceInvitation.practice.address_line_1 ? practiceInvitation.practice.address_line_1 : null }}
                <br>
                {{ practiceInvitation.practice.address_line_2 ? practiceInvitation.practice.address_line_2 : null }}
                <br>
                {{ practiceInvitation.practice.address_line_3 ? practiceInvitation.practice.address_line_3 : null }}
                <br>
              </p>
              <p class="flex">
                CCG
              </p>
              <p
                class="flex text-white text-sm p-2 font-semibold"
              >
                {{ practiceInvitation.practice.clinical_commissioning_group_name ? practiceInvitation.practice.clinical_commissioning_group_name:null }}
              </p>
            </div>
          </div>
          <!-- SPOKE PERMISSIONS - PERMISSIONS OF THE SPOKE BEING VIEWED. -->
          <div class="w-1/2 text-white my-2">
            <div class="flex flex-row items-center">
              <div class="text-lg text-white font-semibold">
                Spoke Permissions
              </div>
            </div>

            <div class="mt-2 mb-4 mx-2">
              <div>
                <div class="flex items-center pb-2">
                  <span class="mr-2">
                    <svgicon
                      :name="practiceInvitation.allow_surgery_create_sessions === true ? 'circle-check' : 'times-solid'"
                      class="fill-current w-5 h-5 rounded-full"
                      :class="practiceInvitation.allow_surgery_create_sessions ? 'bg-green-500' : 'text-white bg-red-500 p-1'"
                    />
                  </span>
                  <p class="font-semibold">
                    Does Hub allow creation of Jobs/Sessions?
                  </p>
                  <!-- <p class="text-sm mx-6">{{practiceInvitation.allow_surgery_create_sessions === true ? 'Yes':'No'}}</p> -->
                </div>
                <div
                  v-if="practiceInvitation.allow_surgery_create_sessions === true"
                  class="bg-waterloo-dark p-2 rounded-lg mb-2"
                >
                  <p
                    class="font-semibold pt-2"
                  >
                    Rate Limits(Only effective when allowed to create jobs)
                  </p>
                  <div class="p-2">
                    <div class="flex flex-col md:flex-row">
                      <p class="font-semibold md:w-1/2">
                        Maximum Hourly Rate Limit
                      </p>
                      <p
                        class
                      >
                        {{ practiceInvitation.max_hourly_rate_limit ?'£ '+ practiceInvitation.max_hourly_rate_limit : 'N/A' }}
                      </p>
                    </div>
                    <div class="flex flex-col md:flex-row">
                      <p class="font-semibold md:w-1/2">
                        Maximum Half Day Rate Limit
                      </p>
                      <p
                        class
                      >
                        {{ practiceInvitation.max_halfday_rate_limit ?'£ '+ practiceInvitation.max_halfday_rate_limit : 'N/A' }}
                      </p>
                    </div>

                    <div class="flex flex-col md:flex-row">
                      <p class="font-semibold md:w-1/2">
                        Maximum Whole Day Rate Limit
                      </p>
                      <p
                        class
                      >
                        {{ practiceInvitation.max_wholeday_rate_limit ?'£ '+ practiceInvitation.max_wholeday_rate_limit : 'N/A' }}
                      </p>
                    </div>

                    <div class="flex flex-col md:flex-row">
                      <p class="font-semibold md:w-1/2">
                        Maximum Out-of-Hours Rate Limit
                      </p>
                      <p
                        class
                      >
                        {{ practiceInvitation.max_ooh_rate_limit ?'£ '+ practiceInvitation.max_ooh_rate_limit : 'N/A' }}
                      </p>
                    </div>

                    <div class="flex flex-col md:flex-row">
                      <p class="font-semibold md:w-1/2">
                        Maximum Excess Hours
                      </p>
                      <p
                        class
                      >
                        {{ practiceInvitation.max_excess_hours ? practiceInvitation.max_excess_hours+' Hrs' : 'N/A' }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="flex items-center pb-2">
                  <span class="mr-2">
                    <svgicon
                      :name="practiceInvitation.allow_surgery_create_permanent_jobs === true ? 'circle-check' : 'times-solid'"
                      class="fill-current w-5 h-5 rounded-full"
                      :class="practiceInvitation.allow_surgery_create_permanent_jobs ? 'bg-green-500' : 'text-white bg-red-500 p-1'"
                    />
                  </span>
                  <p class="font-semibold">
                    Does Hub allow the creation of Permanent Jobs?
                  </p>
                </div>

                <div class="flex items-center pb-2">
                  <span class="mr-2">
                    <svgicon
                      :name="practiceInvitation.allow_surgery_bill_locum === true ? 'circle-check' : 'times-solid'"
                      class="fill-current w-5 h-5 rounded-full"
                      :class="practiceInvitation.allow_surgery_bill_locum ? 'bg-green-500' : 'text-white bg-red-500 p-1'"
                    />
                  </span>
                  <p class="font-semibold">
                    Does Hub permit billing of Locums?
                  </p>
                </div>

                <div class="flex items-center pb-2">
                  <span class="mr-2">
                    <svgicon
                      :name="practiceInvitation.allow_surgery_bill_hubzz === true ? 'circle-check' : 'times-solid'"
                      class="fill-current w-5 h-5 rounded-full"
                      :class="practiceInvitation.allow_surgery_bill_hubzz ? 'bg-green-500' : 'text-white bg-red-500 p-1'"
                    />
                  </span>
                  <p class="font-semibold">
                    Does Hub permit billing for Hubzz?
                  </p>
                </div>

                <div class="flex items-center pb-2">
                  <span class="mr-2">
                    <svgicon
                      :name="practiceInvitation.share_banks_to_other_surgeries === true ? 'circle-check' : 'times-solid'"
                      class="fill-current w-5 h-5 rounded-full"
                      :class="practiceInvitation.share_banks_to_other_surgeries ? 'bg-green-500' : 'text-white bg-red-500 p-1'"
                    />
                  </span>
                  <p class="font-semibold">
                    Can other Spokes see your Banks?
                  </p>
                </div>
                <div class="flex items-center pb-2">
                  <span class="mr-2">
                    <svgicon
                      :name="practiceInvitation.share_my_banks === true ? 'circle-check' : 'times-solid'"
                      class="fill-current w-5 h-5 rounded-full"
                      :class="practiceInvitation.share_my_banks ? 'bg-green-500' : 'text-white bg-red-500 p-1'"
                    />
                  </span>
                  <p class="font-semibold">
                    Does Spoke allow to see hub banks?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      practiceInvitation: '',
      practiceHub: '',
    }
  },

  async asyncData ({app, store, route, error}) {
    try {
      let practiceInvitation = null

      await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}/parent-surgery/invitations/${route.params.invitationId}`).then(res => {
        practiceInvitation = res.data.practice_surgery
      })

      
      return {
        practiceInvitation
      }
    } catch (err) {
      error({ statusCode: 404 })
      store.commit("SET_NOTIFICATION", {
        enabled: true,
        status: "danger",
        text: "Something went wrong!"
      })
      console.log("get parent practice error!!", err)
    }
  }


}
</script>

<style>
.hub-invitation-modal {
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
	.hub-invitation-modal {
		width: 70%;
	}
}
</style>