<template>
  <div class="mt-5">
    <template v-if="practice && practice.type === 'Hub'">
      <AppTable
        v-if="spokes.length > 0"
        :total="total"
        :items="spokes"
        :current-page="currentPage"
        :perPage="perPage"
        :columns="columns"
        :loading="loading"
        :loading-message="'Loading Invitations'"
        @pagechanged="pagechanged"
        @limitchanged="limitchanged"
      >
        <template v-slot:actions="slotProps">
          <div class="flex justify-center">
            <div
              class="text-white ml-2 px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 cursor-pointer"
              @click="$router.push(`/practices/${$route.params.id}/practice-invitations/${slotProps.item.id}`)"
            >Accept</div>
            <div
              class="text-white ml-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 cursor-pointer"
              @click="toggleRejectModal(slotProps.item.id)"
            >Reject</div>
          </div>
        </template>
      </AppTable>
      <div
        class="text-center text-white text-lg font-bold"
        v-if="spokes.length === 0"
      >No invitations from spokes.</div>
    </template>

    <template v-if="practice && practice.type === 'Spoke'">
      <div
        v-if="practice.hub_practice"
        class="flex flex-col mx-4 bg-gray-600 rounded-lg p-4 max-w-sm text-white"
      >
        <div class="font-bold text-xl mb-4">Practice Hub</div>
        <div>Practice Name</div>
        <div
          class="font-bold text-lg mb-2"
        >{{practice.hub_practice.name ? practice.hub_practice.name : 'N/A'}}</div>
        <div>Practice Code</div>
        <div
          class="font-bold text-lg mb-2"
        >{{practice.hub_practice.code ? practice.hub_practice.code : 'N/A'}}</div>
        <div>CCG</div>
        <div
          class="font-bold text-lg mb-2"
        >{{practice.hub_practice.clinical_commissioning_group_name ? practice.hub_practice.clinical_commissioning_group_name : 'N/A'}}</div>
        <div>Contact Number</div>
        <div
          class="font-bold text-lg mb-2"
        >{{practice.hub_practice.phone_number ? practice.hub_practice.phone_number : 'N/A'}}</div>
        <div>Address</div>
        <div
          class="font-bold text-lg"
          v-if="practice.hub_practice.address_line_1"
        >{{practice.hub_practice.address_line_1}}</div>
        <div
          class="font-bold text-lg"
          v-if="practice.hub_practice.address_line_2"
        >{{practice.hub_practice.address_line_2}}</div>
        <div
          class="font-bold text-lg"
          v-if="practice.hub_practice.address_line_3"
        >{{practice.hub_practice.address_line_3}}</div>
        <div
          class="font-bold text-lg"
          v-if="practice.hub_practice.address_line_4"
        >{{practice.hub_practice.address_line_4}}</div>
        <div
          class="font-bold text-lg"
          v-if="practice.hub_practice.address_line_5"
        >{{practice.hub_practice.address_line_5}}</div>
        <div class="mb-2"></div>
        <div>Report To</div>
        <div
          class="font-bold text-lg mb-2"
        >{{practice.hub_practice.report_to ? practice.hub_practice.report_to : 'N/A'}}</div>
        <div>Email Address</div>
        <div
          class="font-bold text-lg mb-2"
        >{{practice.hub_practice.email ? practice.hub_practice.email : 'N/A'}}</div>
        <div
          class="text-white mt-4 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 cursor-pointer text-center md:w-48"
          @click="toggle_cancel_modal = true"
        >Cancel Invitation</div>
        <div class="my-2"></div>
        <div
          class="text-white mb-4 px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 cursor-pointer text-center md:w-48"
          @click="$router.push(`/practices/${$route.params.id}/practice-invitations/${practice.hub_practice_id}`)"
        >Accept Invitation</div>
      </div>
      <div
        class="text-center text-white text-lg font-bold"
        v-if="!practice.hub_practice"
      >This practice did not invite any Hub.</div>
    </template>

    <AppConfirm
      v-if="toggle_reject_modal"
      :message="'Reject this spoke invitation to this Practice?'"
      @cancel="toggle_reject_modal = false"
      @confirm="rejectInvitation()"
    />
    <AppConfirm
      v-if="toggle_cancel_modal"
      :message="'Cancel this spoke invitation to this Practice?'"
      @cancel="toggle_cancel_modal = false"
      @confirm="cancelInvitation()"
    />
    <transition name="fade" mode="out-in">
      <div
        v-if="['index-practices-id-index-practice-invitations-index-practiceId'].includes($route.name) || toggle_reject_modal || toggle_cancel_modal"
        class="shield"
        @click="$router.push(`/practices/${$route.params.id}/practice-invitations`), toggle_reject_modal = false, toggle_cancel_modal = false"
      />
    </transition>
    <nuxt-child @acceptInvitation="getInit" :practiceType="practice.type" />
  </div>
</template>
<script>
import AppTable from "@/components/Base/AppTable";
import AppConfirm from "@/components/Base/AppConfirm";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppTable,
    AppConfirm
  },
  data() {
    return {
      toggle_cancel_modal: false,
      toggle_reject_modal: false,
      selectedSpokeId: null,
      loading: false,
      total: 0,
      currentPage: 1,
      perPage: 5,
      columns: [
        {
          name: "Practice Name",
          dataIndex: "name"
        },
        {
          name: "Practice Code",
          dataIndex: "code",
          class: "text-center"
        },
        {
          name: "Actions",
          slot: true,
          slotName: "actions",
          dataIndex: "",
          class: "text-center"
        }
      ]
    };
  },
  async asyncData({ app, store, params, error }) {
    try {

      const authAdminPermissions = store.getters["permissions"]

      if (authAdminPermissions.includes('View Surgery Management') === false) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })
        return
      }

      let response = await app.$axios.$get(
        `/api/v1/admin/practices/${params.id}`
      );
      let practice = response.data.practice;
      let total;
      let spokes;

      if (practice.type === "Hub") {
        response = await app.$axios.$get(
          `/api/v1/admin/practices/${params.id}/spoke-invitations/count`
        );
        total = response.data.count;

        response = await app.$axios.$get(
          `/api/v1/admin/practices/${params.id}/spoke-invitations`
        );
        spokes = response.data.spokes;
      }

      console.log(practice);
      return {
        practice,
        total,
        spokes
      };
    } catch (err) {
      store.commit("SET_NOTIFICATION", {
        enabled: true,
        status: "danger",
        text: "Something went wrong!"
      });
      console.log("err", err.response || err);
    }
  },
  methods: {
    toggleRejectModal(spokeId) {
      this.toggle_reject_modal = true;
      this.selectedSpokeId = spokeId;
    },
    rejectInvitation() {
      this.$axios
        .$delete(
          `/api/v1/admin/practices/${this.$route.params.id}/spoke-invitations/reject/${this.selectedSpokeId}`
        )
        .then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "sucess",
            text: "Spoke Invitation Rejected Successfully!"
          });

          let index = this.spokes.findIndex(
            spoke => spoke.id === this.selectedSpokeId
          );
          if (index >= 0) {
            this.spokes.splice(index, 1);
          }
        })
        .catch(err => {
          console.log("err", err.response || err);
        })
        .finally(() => {
          this.toggle_reject_modal = false;
          this.selectedSpokeId = null;
        });
    },
    cancelInvitation() {
      this.$axios
        .$delete(
          `/api/v1/admin/practices/${this.practice.hub_practice_id}/spoke-invitations/reject/${this.$route.params.id}`
        )
        .then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "sucess",
            text: "Spoke Invitation Cancelled Successfully!"
          });

          this.practice.hub_practice = null;
          this.practice.hub_practice_id = null;
        })
        .catch(err => {
          console.log("err", err.response || err);
        })
        .finally(() => {
          this.toggle_cancel_modal = false;
        });
    },
    async getInit() {
      try {
        let response = await this.$axios.$get(
          `/api/v1/admin/practices/${this.$route.params.id}`
        );
        this.practice = response.data.practice;

        if (this.practice.type === "Hub") {
          response = await this.$axios.$get(
            `/api/v1/admin/practices/${this.$route.params.id}/spoke-invitations/count`
          );
          this.total = response.data.count;

          response = await this.$axios.$get(
            `/api/v1/admin/practices/${this.$route.params.id}/spoke-invitations`
          );
          this.spokes = response.data.spokes;
        }
      } catch (err) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: "Something went wrong!"
        });
        console.log("err", err.response || err);
      }
    },
    pagechanged(e) {
      const query = {
        ...this.$route.query,
        page: e || 1
      };
      this.$router.push({ query });
      this.getSpokeInvitation();
    },
    async limitchanged(limit) {
      this.currentPage = 1;
      this.perPage = limit;
      await this.getSpokeInvitation();
    }
  }
};
</script>
