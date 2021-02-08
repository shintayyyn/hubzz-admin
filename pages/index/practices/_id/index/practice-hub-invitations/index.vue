<template>
  <div class="mt-5">
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
            class="text-white ml-2 px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700"
            @click="$router.push(`/practices/${$route.params.id}/practice-invitations/${slotProps.item.id}`)"
          >Accept</div>
          <div
            class="text-white ml-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-yellow-700"
            @click="toggleRejectModal(slotProps.item.id)"
          >Reject</div>
        </div>
      </template>
    </AppTable>
    <div
      class="text-center text-white text-lg font-bold"
      v-if="spokes.length === 0"
    >No invitations from spokes.</div>
    <AppConfirm
      v-if="toggle_reject_modal"
      :message="'Reject this spoke invitation to this Practice?'"
      @cancel="toggle_reject_modal = false"
      @confirm="rejectInvitation()"
    />
    <transition name="fade" mode="out-in">
      <div
        v-if="['index-practices-id-index-practice-invitations-index-practiceId'].includes($route.name) || toggle_reject_modal"
        class="shield"
        @click="$router.push(`/practices/${$route.params.id}/practice-invitations`), toggle_reject_modal = false"
      />
    </transition>
    <nuxt-child @acceptInvitation="getSpokeInvitationsPromiseAll" />
  </div>
</template>
<script>
import AppTable from "@/components/Base/AppTable";
import AppConfirm from "@/components/Base/AppConfirm";
export default {
  middleware: "changedPracticeType",
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
  async asyncData ({ app, store, route, error }) {
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
        `/api/v1/admin/practices/${route.params.id}/spoke-invitations/count`
      );
      const total = response.data.count;

      response = await app.$axios.$get(
        `/api/v1/admin/practices/${route.params.id}/spoke-invitations`
      );
      const spokes = response.data.spokes;
      return {
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
        .finally(() => {
          this.toggle_reject_modal = false;
          this.selectedSpokeId = null;
        });
    },
    async getSpokeInvitationsPromiseAll() {
      let response = await this.$axios.$get(
        `/api/v1/admin/practices/${route.params.id}/spoke-invitations/count`
      );
      this.total = response.data.count;
      response = await this.$axios.$get(
        `/api/v1/admin/practices/${route.params.id}/spoke-invitations`
      );
      this.spokes = response.data.spokes;
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
