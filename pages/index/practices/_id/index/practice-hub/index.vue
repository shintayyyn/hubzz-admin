<template>
  <div>
    <div class="mt-5">
      <div v-if="practiceHub">
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
                  {{ practiceHub ? practiceHub.name : null }}
                </p>
                <p class="flex">
                  Practice Code
                </p>
                <p
                  class="flex text-white text-sm p-2 font-semibold"
                >
                  {{ practiceHub ? practiceHub.code : null }}
                </p>
                <p class="flex">
                  Address
                </p>
                <p class="flex text-white text-sm p-2 font-semibold">
                  {{ practiceHub.address_line_1 ? practiceHub.address_line_1 : null }}
                  <br>
                  {{ practiceHub.address_line_2 ? practiceHub.address_line_2 : null }}
                  <br>
                  {{ practiceHub.address_line_3 ? practiceHub.address_line_3 : null }}
                  <br>
                </p>
                <p class="flex">
                  CCG
                </p>
                <p
                  class="flex text-white text-sm p-2 font-semibold"
                >
                  {{ practiceHub.clinical_commissioning_group_name ? practiceHub.clinical_commissioning_group_name:null }}
                </p>
              </div>
            </div>
            <!-- SPOKE PERMISSIONS - PERMISSIONS OF THE SPOKE BEING VIEWED. -->
            <div class="w-1/2 text-white my-2">
              <div class="flex flex-row items-center">
                <div class="text-lg text-white font-semibold">
                  Spoke Permissions
                </div>
                <!-- <div
                  @click="edit()"
                  class="text-sm font-semibold px-3 py-1 mx-2 rounded-lg cursor-pointer"
                  :class="`${editPermissions == false ? 'text-black bg-yellow-500 hover:bg-yellow-400' : 'text-white bg-red-600 hover:bg-red-700'}`"
                >{{editPermissions == false ? 'Edit' : 'Cancel Editing'}}</div>-->
              </div>

              <div class="mt-2 mb-4 mx-2">
                <div>
                  <div class="flex items-center pb-2">
                    <span class="mr-2">
                      <svgicon
                        :name="practice.allow_surgery_create_sessions === true ? 'circle-check' : 'times-solid'"
                        class="fill-current w-5 h-5 rounded-full"
                        :class="practice.allow_surgery_create_sessions ? 'bg-green-500' : 'text-white bg-red-500 p-1'"
                      />
                    </span>
                    <p class="font-semibold">
                      Does Hub allow creation of Jobs/Sessions?
                    </p>
                    <!-- <p class="text-sm mx-6">{{practice.allow_surgery_create_sessions === true ? 'Yes':'No'}}</p> -->
                  </div>
                  <div
                    v-if="practice.allow_surgery_create_sessions === true"
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
                          {{ practice.max_hourly_rate_limit ?'£ '+ practice.max_hourly_rate_limit : 'N/A' }}
                        </p>
                      </div>
                      <div class="flex flex-col md:flex-row">
                        <p class="font-semibold md:w-1/2">
                          Maximum Half Day Rate Limit
                        </p>
                        <p
                          class
                        >
                          {{ practice.max_halfday_rate_limit ?'£ '+ practice.max_halfday_rate_limit : 'N/A' }}
                        </p>
                      </div>

                      <div class="flex flex-col md:flex-row">
                        <p class="font-semibold md:w-1/2">
                          Maximum Whole Day Rate Limit
                        </p>
                        <p
                          class
                        >
                          {{ practice.max_wholeday_rate_limit ?'£ '+ practice.max_wholeday_rate_limit : 'N/A' }}
                        </p>
                      </div>

                      <div class="flex flex-col md:flex-row">
                        <p class="font-semibold md:w-1/2">
                          Maximum Out-of-Hours Rate Limit
                        </p>
                        <p
                          class
                        >
                          {{ practice.max_ooh_rate_limit ?'£ '+ practice.max_ooh_rate_limit : 'N/A' }}
                        </p>
                      </div>

                      <div class="flex flex-col md:flex-row">
                        <p class="font-semibold md:w-1/2">
                          Maximum Excess Hours
                        </p>
                        <p
                          class
                        >
                          {{ practice.max_excess_hours ? practice.max_excess_hours+' Hrs' : 'N/A' }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center pb-2">
                    <span class="mr-2">
                      <svgicon
                        :name="practice.allow_surgery_create_permanent_jobs === true ? 'circle-check' : 'times-solid'"
                        class="fill-current w-5 h-5 rounded-full"
                        :class="practice.allow_surgery_create_permanent_jobs ? 'bg-green-500' : 'text-white bg-red-500 p-1'"
                      />
                    </span>
                    <p class="font-semibold">
                      Does Hub allow the creation of Permanent Jobs?
                    </p>
                  </div>

                  <div class="flex items-center pb-2">
                    <span class="mr-2">
                      <svgicon
                        :name="practice.allow_surgery_bill_locum === true ? 'circle-check' : 'times-solid'"
                        class="fill-current w-5 h-5 rounded-full"
                        :class="practice.allow_surgery_bill_locum ? 'bg-green-500' : 'text-white bg-red-500 p-1'"
                      />
                    </span>
                    <p class="font-semibold">
                      Does Hub permit billing of Locums?
                    </p>
                  </div>

                  <div class="flex items-center pb-2">
                    <span class="mr-2">
                      <svgicon
                        :name="practice.allow_surgery_bill_hubzz === true ? 'circle-check' : 'times-solid'"
                        class="fill-current w-5 h-5 rounded-full"
                        :class="practice.allow_surgery_bill_hubzz ? 'bg-green-500' : 'text-white bg-red-500 p-1'"
                      />
                    </span>
                    <p class="font-semibold">
                      Does Hub permit billing for Hubzz?
                    </p>
                  </div>

                  <div class="flex items-center pb-2">
                    <span class="mr-2">
                      <svgicon
                        :name="practice.share_banks_to_other_surgeries === true ? 'circle-check' : 'times-solid'"
                        class="fill-current w-5 h-5 rounded-full"
                        :class="practice.share_banks_to_other_surgeries ? 'bg-green-500' : 'text-white bg-red-500 p-1'"
                      />
                    </span>
                    <p class="font-semibold">
                      Can other Spokes see your Banks?
                    </p>
                  </div>
                  <div class="flex items-center pb-2">
                    <span class="mr-2">
                      <svgicon
                        :name="practice.share_my_banks === true ? 'circle-check' : 'times-solid'"
                        class="fill-current w-5 h-5 rounded-full"
                        :class="practice.share_my_banks ? 'bg-green-500' : 'text-white bg-red-500 p-1'"
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

        <!-- <div
          class="w-full sm:w-1/4 p-2 mt-4 text-white rounded-lg bg-red-700 hover:bg-red-800 text-center cursor-pointer"
          @click="confirm=true"
        >Terminate this spoke from Hub</div> -->
        <AppButton
          class="text-white mt-4"
          :background="'red'"
          :label="'Terminate this spoke from Hub'"
          @click="confirm=true"
        />
      </div>
      <div v-else-if="hubInvitations && hubInvitations.length > 0">
        <AppTable
          :total="hubInvitationsCount"
          :items="hubInvitations"
          :current-page="currentPage"
          :per-page="params.limit"
          :columns="columns"
          :router-link="`/practices/${practice.id}/practice-hub`"
          :loading="loadingSurgeries"
          :loading-message="'Loading Surgeries'"
          @pagechanged="pagechanged"
        >
          <template v-slot:actions="slotProps">
            <div v-if="!slotProps.item.invitation_rejected" class="flex justify-center">
              <AppButton
                class="text-white ml-2"
                :background="'green'"
                :label="'Accept'"
                @click="toAcceptInvitation(slotProps.item.id)"
              />

              <AppButton
                class="text-white ml-2"
                :background="'red'"
                :label="'Reject'"
                @click="toRejectInvitation(slotProps.item.id)"
              />
            </div>
            
            <div v-if="slotProps.item.invitation_rejected" class="flex justify-center">
              <div class="bg-red-500 rounded-lg shadow-lg px-2 py-1">
                Rejected
              </div>
            </div>
          </template>
        </AppTable>
      </div>

      <div v-else>
        <form
          class="flex flex-col bg-waterloo py-2 px-4 text-white text-sm shadow rounded-lg sm:w-full lg:w-2/3"
        >
          <div class="m-4">
            <div class="inline-flex text-lg">
              <div class="flex">
                <svgicon name="alert" width="48" height="48" color="white" />
              </div>
              <div class="flex">
                <p>This practice has no any invitation.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <transition name="drop" mode="out-in">
      <AppConfirm
        v-if="confirm"
        :message="'Are you sure you want to terminate this spoke from hub?'"
        @cancel="confirm = false"
        @confirm="toTerminateFromHub()"
      />
    </transition>

    <div v-if="confirm" class="shield" />

    <nuxt-child />
  </div>
</template>
<script>
import AppConfirm from "@/components/Base/AppConfirm"
import AppTable from "@/components/Base/AppTable"
import AppButton from "@/components/Base/AppButton"
export default {
  middleware: "changedPracticeType",
  components: {
    AppConfirm,
    AppTable,
    AppButton
  },
  data () {
    return {
      // practice:'',
      // practiceHub:'',
      // practiceHub:'',
      confirm: false,
      confirmAccept: false,
      confirmReject: false,
      currentPage: 1,
      params: {
        limit: 10,
        offset: 0,
        order_by: "created_at:desc"
      },
      columns: [
        {
          name: "Practice Name",
          dataIndex: "practice.surgery.name"
        },
        {
          name: "Practice Code",
          dataIndex: "practice.surgery.code",
          class: "text-center"
        },
        {
          name: "Invited at",
          dataIndex: "created_at",
          class: "localDate text-center"
        },
        {
          name: "Actions",
          slot: true,
          slotName: "actions",
          dataIndex: "",
          class: "text-center"
        }
      ]
    }
  },
  computed: {
    loadingSurgeries () {
      return this.$store.state.practices.loading_practices
    },
    practice () {
      return this.$store.state.practices.practice
    },
    practiceHub () {
      return this.$store.state.practices.practiceHub
    },
    hubInvitationsCount () {
      return this.$store.state.practices.hubInvitationsCount
    },
    hubInvitations () {
      return this.$store.state.practices.hubInvitations
    }
  },

  async asyncData ({ app, store, route, error }) {
    try {
      const limit = 10
      const offset = 0
      const order_by = "created_at:desc"
      let params = { limit, offset, order_by }

      await store.commit("practices/TOGGLE_LOADING", true)

      let response = await app.$axios.$get(
        `/api/v1/admin/practices/${route.params.id}`
      )
      const practice = response.data.practice

      let practiceHub = null
      
      if (practice.type === 'Hub') {
        error({
          statusCode: 403,
          message: 'That function is not available on this practice.',
        })

        return
      }

      if (practice.type === 'Spoke') {
        response = await app.$axios.$get(
          `/api/v1/admin/practices/${route.params.id}/parent-surgery`
        )

        practiceHub = response.data.practice.parent_practice
      }

      let practiceInvitationsCount = 0
      let practiceInvitations = []

      if (practice.type === 'Spoke' || practice.type === 'Stand Alone') {
        response = await app.$axios.$get(
          `/api/v1/admin/practices/${route.params.id}/parent-surgery/invitations-count`
        )

        practiceInvitationsCount = response.data.count

        response = await app.$axios.$get(
          `/api/v1/admin/practices/${route.params.id}/parent-surgery/invitations`,
          { params }
        )

        practiceInvitations = response.data.practice_surgeries
      }

      await store.commit("practices/SET_SPECIFIC_PRACTICE", practice)

      await store.commit("practices/SET_PRACTICE_HUB", practiceHub)

      await store.commit("practices/SET_HUBZZ_INVITATIONS_COUNT", practiceInvitationsCount)

      await store.commit("practices/SET_HUBZZ_INVITATIONS", practiceInvitations)

      await store.commit("practices/TOGGLE_LOADING", false)
    } catch (err) {
      error({ statusCode: 404 })
      store.commit("SET_NOTIFICATION", {
        enabled: true,
        status: "danger",
        text: "Something went wrong!"
      })
      console.log("get parent practice error!!", err)
    }
  },

  methods: {
    getHubInvitations () {
      this.$store
        .dispatch("practices/fetchHubInvitations", {
          practice_id: this.$route.params.id,
          countOnly: true
        })
        .then(() => {
          this.$store.dispatch("practices/fetchHubInvitations", {
            practice_id: this.$route.params.id,
            limit: this.params.limit,
            offset: this.params.offset
          })
        })
    },

    pagechanged (page) {
      const query = {
        ...this.$route.query,
        practice_children_page: page || 1
      }
      this.params.offset = this.params.limit * (page - 1)
      this.$router.push({ query })
      this.getHubInvitations()
    },

    // async limitchanged(limit) {
    // 	this.currentPage = 1
    // 	this.itemsPerPage = limit
    // 	await this.getHubInvitations(this.paramSort)
    // },
    async toTerminateFromHub () {
      await this.$axios
        .$delete(
          `/api/v1/admin/practices/${this.$route.params.id}/parent-surgery`
        )
        .then(() => {
          this.$store.commit("practices/SET_PRACTICE_HUB", null)
          this.$store.commit("practices/SET_PRACTICE_PARENT", null)
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: "Successfully Terminated Spoke"
          })
          this.confirm = false
        })
        .catch(err => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: err.response.data.message
          })
        })
    },

    async toAcceptInvitation (id) {
      await this.$axios
        .$put(
          `/api/v1/admin/practices/${this.$route.params.id}/parent-surgery/invitations/${id}/accept-invitation`
        )
        .then(() => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: "Successfully Accepted Invitation"
          })
        })
        .catch(err => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: err.response.data.message
          })
        })
    },

    async toRejectInvitation (id) {
      await this.$axios
        .$put(
          `/api/v1/admin/practices/${this.$route.params.id}/parent-surgery/invitations/${id}/reject-invitation`
        )
        .then(() => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: "Successfully Rejected Invitation"
          })
        })
        .catch(err => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: err.response.data.message
          })
        })
    }
  }
}
</script>
<style>
</style>