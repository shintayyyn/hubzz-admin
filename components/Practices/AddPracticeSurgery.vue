<template>
  <div>
    <div class="flex flex-col text-base py-2" style="min-height: 70vh">
      <div class="w-full md:w-1/2">
        <AppInputSmall
          v-model="search"
          :type="'text'"
          :name="'search'"
          :button="true"
          :buttonLabel="'Search'"
          :placeholder="searchPlaceholder"
          @click="searchSubmit()"
        />
      </div>

      <div class="w-full overflow-y-auto px-2">
        <div>
          <!--TABLE-->
          <!-- BODY -->
          <template v-if="!practice">
            <!--IF NEW PRACTICE IS BEING CREATED-->
            <p v-if="!surgeries.length" class="text-gray-500 py-2 -mx-2">
              No Surgeries Found
            </p>
            <transition-group name="slide" tag="p">
              <div
                v-for="(surgery, index) in surgeries"
                :key="`surgery-${index}`"
                class="flex no-underline rounded-lg shadow-md my-2 transition-hover  hover:bg-gray-300 cursor-pointer"
                @click="show(surgery.id)"
              >
                <div class="flex w-full">
                  <div class="w-full text-xs p-4">
                    <div class="w-full flex justify-between items-center">
                      <span class="font-bold">{{ surgery.name }}</span>
                    </div>
                    <span class="block w-full py-1">{{ surgery.address.line_1 }}</span>
                    <span class="block w-full py-1">{{ surgery.address.line_2 }}</span>
                    <span class="block w-full py-1">{{ surgery.address.line_3 }}</span>
                    <div class="flex items-center my-1">
                      <span class="block p-2 rounded" :class="registeredPractice.includes(surgery.id) ? 'bg-gray-500 opacity-75' : 'bg-gray-500 '"
                        >CCG</span
                      >
                      <span class="w-full px-2">
                        {{ surgery.clinical_commissioning_group.name }}
                      </span>
                    </div>
                    <div class="flex items-center my-1">
                      <span
                        class="block p-2 rounded whitespace-no-wrap"
                        :class="registeredPractice.includes(surgery.id) ? 'bg-gray-500 opacity-75' : 'bg-gray-500'"
                        >Practice Code</span
                      >
                      <span class="w-full px-2">{{ surgery.code }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </transition-group>
          </template>

          <template v-if="isHubPractice">
            <!--IF PRACTICE IS A HUB-->
            <p v-if="!practiceSpokes.length" class="text-gray-500 py-2 -mx-2">
              No Spoke Found
            </p>
            <transition-group name="slide" tag="p">
              <div
                v-for="(spoke, index) in practiceSpokes"
                :key="`spoke-${index}`"
                class="flex no-underline rounded-lg shadow my-2 transition-hover"
                :class="spoke.invited ? ' opacity-75' : ' hover:bg-gray-300 cursor-pointer'"
                @click="newChildSpoke(spoke.id, spoke.invited)"
              >
                <div class="flex w-full">
                  <div class="w-full text-xs p-4">
                    <div class="flex justify-between">
                      <span class="font-bold">{{ spoke.surgery.name }}</span>
                      <span v-if="spoke.invited" class="py-1 px-2 rounded-lg text-xs md:text-sm bg-green-600 shadow">Invited</span>
                    </div>
                    <span class="block w-full py-1">{{ spoke.address_line_1 }}</span>
                    <span class="block w-full py-1">{{ spoke.address_line_2 }}</span>
                    <span class="block w-full py-1">{{ spoke.address_line_3 }}</span>
                    <div class="flex items-center my-1">
                      <span class="p-2 bg-gray-500 rounded mr-2">Practice Code</span>
                      <span>{{ spoke.surgery.code }}</span>
                    </div>
                    <div class="flex items-center my-1">
                      <span class="p-2 bg-gray-500 rounded mr-2">CCG</span>
                      <span>{{ spoke.clinical_commissioning_group_name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </transition-group>
          </template>

          <!--TABLE ENDS HERE-->
        </div>
      </div>
    </div>

    <!-- PAGINATION -->
    <AppPagination
      class="px-4 md:px-6"
      :total="total"
      :totalPages="totalPages"
      :currentPage="currentPage"
      :perPage="perPage"
      :loading="loading"
      @pagechanged="pagechanged"
    />
    <!-- PAGINATION ENDS HERE -->

    <div v-if="createPracticeModal || setSpokePermissionModal" class="practice-user-shield" @click="shieldClickaway()" />
    <transition name="slide" mode="out-in">
      <CreateUser
        v-if="createPracticeModal"
        :practice="practice"
        :surgery="surgery"
        :registeeType="'newPractice'"
        @close="createPracticeModal = false"
        @userCreated=";(createPracticeModal = false), $emit('close')"
      />
      <!-- ===================SET PERMISSIONS OF PRACTICE SPOKE=================== -->
      <div v-if="setSpokePermissionModal" class="practice-user-modal shadow-lg">
        <SetSpokePermissions :practice="practice" :practiceSpokeId="practiceSpokeId" @close="setSpokePermissionModal = false" />
      </div>
    </transition>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import AppPagination from '@/components/Base/AppPagination'
import CreateUser from '@/components/UserManagement/CreateUser'
import SetSpokePermissions from '@/components/Practices/SetSpokePermissions'
import AppInputSmall from '@/components/Base/AppInputSmall'
export default {
  components: {
    AppPagination,
    CreateUser,
    SetSpokePermissions,
    AppInputSmall
  },
  props: {
    practice: {
      type: Object,
      default: () => null
    }
  },

  data() {
    return {
      surgeries: [],
      surgery: null,
      search: '',

      practiceSpokes: [],
      createPracticeModal: false,
      setSpokePermissionModal: false,
      practiceSpokeId: '',
      practiceSurgeries: [],

      total: 0,
      totalPages: 0,
      currentPage: 1,
      perPage: 10,
      loading: false,
      registeredPractice: []
    }
  },

  computed: {
    isHubPractice() {
      return this.practice && this.practice.type === 'Hub'
    },
    currentAddPracticePage() {
      return parseInt(this.$route.query.add_practice_page) || 1
    },
    searchPlaceholder() {
      return !this.practice || this.isHubPractice ? 'Search for Surgery by Name, etc...' : 'Search for Hub by Name, etc...'
    }
  },

  watch: {
    $route() {
      this.currentPage = this.currentAddPracticePage

      this.getData()
    },

    search() {
      this.searchSubmit()
    }
  },

  beforeDestroy() {
    let query = {
      ...this.$route.query
    }

    delete query.add_practice_page

    this.$router.push({
      query
    })
  },

  created() {
    this.getData()
  },

  methods: {
    getOffset() {
      return this.perPage * (this.currentAddPracticePage - 1)
    },

    setPagination(total) {
      this.total = total
      this.perPage = 10
      this.totalPages = Math.ceil(this.total / this.perPage)
    },

    async getData() {
      this.loading = true

      const limit = this.perPage

      const params = {
        limit,
        offset: this.getOffset()
      }

      if (this.search) {
        params.search = this.search
      }

      if (this.isHubPractice) {
        this.practiceSurgeries = await this.$axios
          .get(`/api/v1/admin/practices/${this.practice.id}/practice-surgeries`)
          .then(response => response.data.data.practice_surgeries)

        params.status = ['Active', 'Dormant']

        params.type = ['Stand Alone', 'Spoke']

        params.has_parent = false

        const total = await this.$axios.get(`/api/v1/admin/practices/count`, { params }).then(response => response.data.data.count)
        this.setPagination(total)

        this.getOrphanSpokes(params)
      } else if (!this.practice) {
        const total = await this.$axios.get(`/api/v1/admin/surgeries/count`, { params }).then(response => response.data.data.count)
        this.setPagination(total)

        this.getAllSurgeries()
      }
    },

    async getAllSurgeries() {
      const limit = this.perPage

      const params = {
        limit,
        offset: this.getOffset()
      }

      if (this.search) {
        params.search = this.search
      }

      const response = await this.$axios.get(`/api/v1/admin/surgeries`, {
        params
      })

      this.surgeries = response.data.data.surgeries

      this.loading = false
    },

    async getOrphanSpokes(params) {
      if (this.search) {
        params.search = this.search
      }

      this.practiceSpokes = []

      const response = await this.$axios.$get(`/api/v1/admin/practices/${this.$route.params.id}/spoke-invitations`)
      const invitedSpokes = response.data.spokes || []

      await this.$axios.$get(`/api/v1/admin/practices/`, { params }).then(res => {
        res.data.practices.forEach(spoke => {
          const invited = invitedSpokes.find(invitation => invitation.id === spoke.id)
          this.practiceSpokes.push({
            ...spoke,
            invited: !!invited
          })
        })
      })

      this.loading = false
    },

    async newChildSpoke(practiceId, invited) {
      if (invited) {
        this.$store.commit('SET_NOTIFICATION', {
          enabled: true,
          status: 'danger',
          text: 'This Spoke already sent an invitation.'
        })
      } else {
        this.practiceSpokeId = practiceId
        this.setSpokePermissionModal = true
      }
    },

    async show(id) {
      const response = await this.$axios.get(`/api/v1/admin/surgeries/${id}`)

      this.surgery = response.data.data.surgery

      this.createPracticeModal = true
    },

    shieldClickaway() {
      this.createPracticeModal = false
      this.setSpokePermissionModal = false
    },

    searchSubmit: debounce(function() {
      this.pagechanged(0)

      this.getData()
    }, 500),

    pagechanged(page) {
      const query = {
        ...this.$route.query
      }

      if (page && page > 1) {
        query.add_practice_page = page
      } else {
        delete query.add_practice_page
      }

      this.$router.replace({ query })
    }
  }
}
</script>

<style>
.card {
  min-width: 100px;
  height: 250px;
  box-sizing: content-box;
}

.practice-user-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
</style>
