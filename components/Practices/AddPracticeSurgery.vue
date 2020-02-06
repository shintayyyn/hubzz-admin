<template>
  <div>
    <!-- HEADER -->
    <div v-if="practice" class="flex justify-between text-sm text-white py-4 px-4 md:px-8">
      <div @click="goBack()" class="cursor-pointer">
        <svgicon
          name="arrow-left-solid"
          height="32"
          width="32"
          class="text-white hover:text-sunglow fill-current"
        />
      </div>
    </div>
    <!-- HEADER -->
    <div
      class="flex flex-col px-4 md:px-8 text-base text-white py-2"
      style="min-height: 70vh"
    >
      <div class="w-full">
        <div class="flex justify-between items-center">
          <div class="flex flex-no-wrap w-full md:w-auto">
            <div class="w-full md:w-auto relative">
              <input
                class="appearance-none bg-transparent border-b w-full md:w-64 text-white mr-3 mb-2 p-2 leading-tight focus:outline-none focus:border-sunglow transition-hover"
                type="text"
                :placeholder="
                    !practice || (practice && practice.type == 'Hub')
                      ? 'Search for Surgery by Name, etc....'
                      : 'Search for Hub by Name, etc....'
                "
                v-model="search"
                @keyup.enter="searchSubmit()"
              />
              <button
                v-if="search"
                class="absolute top-0 right-0 bottom-0 mr-3 md:mr-1"
                @click="(search = ''), searchSubmit()"
              >
                <svgicon
                  name="times-solid"
                  height="12"
                  width="12"
                  class="text-white hover:text-sunglow fill-current -mx-2 md:-mx-6"
                />
              </button>
            </div>
          </div>
          <div class="flex items-center">
            <div v-if="total === 0 && search" class="py-2 md:px-2 text-sm whitespace-no-wrap text-gray-500">
              No results found.
            </div>
            <span
              class="py-2 md:px-2 text-sm whitespace-no-wrap"
              v-if="search && total !== 0"
              >{{ total }} results found.</span>
            </div>
        </div>
      </div>
      
      <div class="w-full overflow-y-auto px-2">
        <div>
          <!--TABLE-->
          <!-- BODY -->
          <div v-if="!practice">
            <!--IF NEW PRACTICE IS BEING CREATED-->
            <transition-group name="slide" tag="p">
              <div
                v-for="(surgery, index) in surgeries"
                :key="`surgery-${index}`"
                @click="show(surgery.id)"
                class="flex no-underline rounded-lg shadow my-2 transition-hover bg-waterloo hover:bg-waterloo-light cursor-pointer"
                
              >
              <!-- :class="
                  [registeredPractice.includes(surgery.id)
                    ? 'bg-waterloo opacity-75'
                    : 'bg-waterloo hover:bg-waterloo-light cursor-pointer', 
                    toggleRegisteredPractice && registeredPractice.includes(surgery.id) && 'hidden']
                " -->
                <div class="flex w-full">
                  <div class="w-full text-white text-xs p-4">
                    <div class="w-full flex justify-between items-center">
                      <span class="font-bold">{{ surgery.name }}</span>
                      <!-- <span
                        v-if="registeredPractice.includes(surgery.id)"
                        class="py-1 px-2 rounded-lg text-xs md:text-sm bg-green-600 shadow"
                        >Registered</span> -->
                    </div>
                    <span class="block w-full py-1">{{surgery.address.line_1}}</span>
                    <span class="block w-full py-1">{{surgery.address.line_2}}</span>
                    <span class="block w-full py-1">{{surgery.address.line_3}}</span>
                    <div class="flex items-center my-1">
                      <span class="block p-2 rounded"
                        :class="registeredPractice.includes(surgery.id) ? 'bg-trout opacity-75' : 'bg-trout '">
                        CCG
                      </span>
                      <span class="w-full px-2">{{
                        surgery.clinical_commissioning_group.name
                      }}</span>
                    </div>
                    <div class="flex items-center my-1">
                      <span class="block p-2 rounded whitespace-no-wrap" 
                        :class="registeredPractice.includes(surgery.id)? 'bg-trout opacity-75': 'bg-trout'">
                        Practice Code
                      </span>
                      <span class="w-full px-2">{{ surgery.code }}</span>
                    </div>
                  </div>
                </div>

              </div>
            </transition-group>
          </div>
          
          <div v-if="practice && practice.type == 'Hub'">
            <!--IF PRACTICE IS A HUB-->
            <transition-group name="slide" tag="p">
              <div
                v-for="(spoke, index) in practiceSpokes"
                :key="`spoke-${index}`"
                @click="newChildSpoke(spoke.id, spoke.invited)"
                class="flex no-underline rounded-lg shadow my-2 transition-hover"
                :class="spoke.invited ? 'bg-waterloo opacity-75' : 'bg-waterloo hover:bg-waterloo-light cursor-pointer'"
              >
                <div class="flex w-full">
                  <div class="w-full text-white text-xs p-4">
                    <div class="flex justify-between">
                      <span class="font-bold">{{ spoke.surgery.name }}</span>
                      <span
                        v-if="spoke.invited"
                        class="py-1 px-2 rounded-lg text-xs md:text-sm bg-green-600 shadow"
                        >Invited</span
                      >
                    </div>
                    <!-- <span class="font-bold">{{ spoke.surgery.name }}</span> -->
                    <span class="block w-full py-1">{{spoke.address_line_1}}</span>
                    <span class="block w-full py-1">{{spoke.address_line_2}}</span>
                    <span class="block w-full py-1">{{spoke.address_line_3}}</span>
                    <div class="flex items-center my-1">
                      <span class="p-2 bg-trout rounded mr-2">Practice Code</span>
                      <span>{{ spoke.surgery.code }}</span>
                    </div>
                    <div class="flex items-center my-1">
                      <span class="p-2 bg-trout rounded mr-2">CCG</span>
                      <span>{{ spoke.clinical_commissioning_group_name }}</span>
                    </div>
                  </div>
                </div>
                
              </div>
            </transition-group>
          </div>

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
      @pagechanged="pagechanged"
      :loading="loading"
    />
    <!-- PAGINATION ENDS HERE -->

    <div class="practice-user-shield" v-if="createPracticeModal || setSpokePermissionModal" @click="shieldClickaway()"></div>
    <transition name="slide" mode="out-in">
      <div
        class="shadow-lg"
        :class="practice ? 'practice-user-modal-small' : 'practice-user-modal'"
        v-if="createPracticeModal"
      >
        <CreateUser
          @close="createPracticeModal = false"
          @userCreated="(createPracticeModal = false), $emit('close')"
          :practice="practice"
          :surgery="surgery"
          :registeeType="'newPractice'"
        />
      </div>
      <!-- ===================SET PERMISSIONS OF PRACTICE SPOKE=================== -->
      <div
        class="practice-user-modal-small shadow-lg"
        v-if="setSpokePermissionModal"
      >
        <SetSpokePermissions
          @close="setSpokePermissionModal = false"
          @practiceSpokeCreated="(setSpokePermissionModal = false), $emit('close')"
          :practice="practice"
          :practiceSpokeId="practiceSpokeId"
        />
      </div>
    </transition>

    <nuxt-child />
  </div>
</template>

<script>
import debounce from "lodash.debounce";
import AppPagination from "@/components/Base/AppPagination";
import CreateUser from "@/components/UserManagement/CreateUser";
import SetSpokePermissions from "@/components/Practices/SetSpokePermissions"
export default {
  props: ["practice", "practiceHub", "spokesCount"],
  components: {
    AppPagination,
    CreateUser,
    SetSpokePermissions
  },
  data() {
    return {
      surgeries: [],
      surgery: null,
      search: "",
      
      practiceSpokes: [],
      hub: null,
      practiceCount: null,
      createPracticeModal: false,
      setSpokePermissionModal:false,
      practiceSpokeId:'',
      practiceSurgeries: [],

      total: 0,
      totalPages: 0,
      currentPage: 1,
      perPage: 10,
      loading: false,
      registeredPractice: [],

      toggleRegisteredPractice: false
      
    };
  },

  beforeDestroy() {
    let query = Object.assign({}, this.$route.query);
    delete query.add_practice_page;
    this.$router.push({ query });
  },
  watch: {
    $route(to, from) {
      this.currentPage = parseInt(to.query.add_practice_page);
      this.getData()
    },
    search(value) {
      this.searchSubmit();
    }
  },

  created() {
    const query = {
      ...this.$route.query,
      add_practice_page: this.$route.query.add_practice_page || 1
    };
    this.getData();
  },

  methods: {
    goBack() {
      if(this.practice){
        this.$router.push(`/practices/${this.$route.params.id}/practice-surgeries`)
      }else{
        this.$router.push(`/practices`)
      }

    },
    getPractices() {
      this.$store.dispatch("practices/fetchPractices", {
        limit: 10,
        order_by: "created_at:desc"
      });
    },
    getPracticeHub(practiceId) {
      this.$store.dispatch("practices/fetchHub", {
        practice_id: practiceId
      });
    },
    getPracticeParent(parentId) {
      this.$store.dispatch("practices/fetchPracticeParent", {
        practice_parent_id: parentId
      });
    },
    getPracticeSpokesCount(practiceId) {
      this.$store.dispatch("practices/fetchSpokes", {
        countOnly: true,
        practice_id: practiceId
      });
    },
    getPracticeSpokes(practiceId) {
      this.$store.dispatch("practices/fetchSpokes", {
        practice_id: practiceId
      });
    },
    updatePracticeSpokesPageCount() {
      let payload = {
        spokesCount: this.spokesCount,
        perPage: 5
      };
      console.log("payload", payload);
      this.$store.commit(
        "practices/UPDATE_PRACTICE_SPOKES_PAGE_COUNT",
        payload
      );
    },

    async getData() {
      this.loading = true;
      const limit = this.perPage;
      let offset = 0;
      offset = this.perPage * (parseInt(this.$route.query.add_practice_page) - 1);
      
      const params = { limit, offset };

      if (this.search) {
        params.search = this.search;
      }

      if (this.practice && this.practice.type == "Hub") {
        await this.$axios
        .$get(`/api/v1/admin/practices/${this.practice.id}/practice-surgeries`)
        .then(res => {
          this.practiceSurgeries = res.data.practice_surgeries
          console.log(res.data.practice_surgeries)
        })
        params.status = 'Active',
        params.type = ['Stand Alone', 'Spoke'],
        params.has_parent = false
        await this.$axios
          .$get(`/api/v1/admin/practices/count`, { params })
          .then(res => {
            this.total = res.data.count;
            this.perPage = 10;
            this.totalPages = Math.ceil(this.total / this.perPage);
            this.getOrphanSpokes(params);
          });
      } else if (!this.practice) {
        await this.$axios
          .$get(`/api/v1/admin/surgeries/count`, { params }) 
          .then(res => {
            this.total = res.data.count;
            this.perPage = 10;
            this.totalPages = Math.ceil(this.total / this.perPage);
            this.getAllSurgeries();
          });
      }
    },

    async getAllSurgeries() {
      const limit = this.perPage;
      let offset = 0;
      offset =
        this.perPage * (parseInt(this.$route.query.add_practice_page) - 1);
      const params = { limit, offset };
      if (this.search) {
        params.search = this.search;
        params.offset = 0;
      }
      await this.$axios
        .$get(`/api/v1/admin/surgeries`, { params })
        .then(res => {
          this.surgeries = res.data.surgeries;
          this.surgeries.map(item => this.isRegistered(item.id));
        });
      this.loading = false;
    },

    async getOrphanSpokes(params) {
      let offset = 0;
      offset = this.perPage * (parseInt(this.$route.query.add_practice_page) - 1);
      if (this.search) {
        params.search = this.search;
        params.offset = 0;
      }
      this.practiceSpokes = []
      await this.$axios
        .$get(`/api/v1/admin/practices/`,{ params })
        .then(res => {
          let invited = ''
          res.data.practices.forEach(spoke => {
            invited = this.practiceSurgeries.find(invitation => 
              invitation.child_practice_id === spoke.id)
            if(invited) {
              this.practiceSpokes.push({
                ...spoke,
                invited:true
              })
            }else{
              this.practiceSpokes.push({
                ...spoke,
                invited:false
              })
            }
          });
        });
      this.loading = false
    },

    async newChildSpoke(practiceId, invited) {
      if (invited) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: "Spoke is Invited"
        });
      } else {
        this.practiceSpokeId = practiceId
        this.setSpokePermissionModal = true
      }
      
    },

    async show(id) {
      await this.$axios.$get(`/api/v1/admin/surgeries/${id}`).then(res => {
        this.surgery = res.data.surgery;
      }),
      await this.$axios
        .$get(`/api/v1/admin/practices/count/?search=${this.surgery.name}`)
        .then(res => {
          this.practiceCount = res.data.count;
        });
      this.createPracticeModal = true;
      // if (this.practiceCount > 0) {
      //   this.$store.commit("SET_NOTIFICATION", {
      //     enabled: true,
      //     status: "danger",
      //     text: "Surgery Already Registered"
      //   });
      // } else {
        
      // }
    },

    shieldClickaway(){
      this.createPracticeModal = false,
      this.setSpokePermissionModal = false
    },

    searchSubmit: debounce(async function() {
      const query = {
        ...this.$route.query
      };

      query.search = this.search;
      this.getData();

      if (this.search === "") {
        delete query.search;
      }
    }, 500),

    pagechanged(e) {
      const query = {
        ...this.$route.query,
        add_practice_page: e || 1
      };
      this.$router.push({ query });
    },

    isRegistered(id) {
      this.$axios.get(`/api/v1/admin/surgeries/${id}`).then(res => {
        if (res.data.data.surgery.practice_count > 0) {
          this.registeredPractice.push(id);
        }
      });
    }
  }
};
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
.practice-user-modal,
.practice-user-modal-small {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #FFC72C;
  transition: all 0.3s ease-in-out;
  background-color: #505561;
  z-index: 512;
}

@media screen and (min-width: 1200px) {
  .practice-user-modal {
    width: 70%;
  }
  .practice-user-modal-small {
    width: 60%;
  }
}
</style>
