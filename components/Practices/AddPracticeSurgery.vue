<template>
  <div
    class="absolute top-0 bottom-0 right-0 left-0 flex flex-col overflow-auto"
  >
    <!-- HEADER -->
    <div class="flex justify-between text-sm text-white py-4 px-4 md:px-8">
      <div @click="$emit('close')" class="cursor-pointer">
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
      class="flex flex-wrap overflow-auto px-4 md:px-8 text-base text-white py-2"
    >
      <div class="w-full">
        <div class="flex flex-wrap justify-between items-center">
          <div class="flex flex-no-wrap w-full md:w-2/3">
            <div class="w-full md:w-auto relative">
              <input
                class="appearance-none bg-transparent border-b w-full md:w-64 text-white mr-3 p-2 leading-tight focus:outline-none focus:border-sunglow"
                type="text"
                :placeholder="
                  `${
                    !practice || (practice && practice.type == 'Hub')
                      ? 'Search for Surgery by Name, etc....'
                      : 'Search for Hub by Name, etc....'
                  }`
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
            <!-- <div class="self-end">
              <button
                class="rounded-lg text-xs text-black p-2 mx-1 my-2 bg-yellow-500"
                @click="searchSubmit()"
              >Search</button>
            </div> -->
          </div>
          <span
            class="py-2 md:px-4 text-sm whitespace-no-wrap"
            v-if="search && total !== 0"
            >{{ total }} results found.</span
          >
        </div>
      </div>
      <div v-if="total === 0" class="w-full text-center py-4 text-gray-500">
        No results found.
      </div>
      <div class="w-full overflow-hidden">
        <div>
          <!--TABLE-->
          <!-- BODY -->
          <div v-if="!practice">
            <!--IF PRACTICE IS A HUB / NEW PRACTICE IS BEING CREATED-->
            <transition-group name="slide" tag="p">
              <div
                v-for="(surgery, index) in surgeries"
                :key="`surgery-${index}`"
                @click="
                  practice && practice.type == 'Hub'
                    ? newHubOrSpoke(surgery.id)
                    : show(surgery.id)
                "
                class="flex no-underline rounded-lg shadow my-2"
                :class="
                  registeredPractice.includes(surgery.id)
                    ? 'bg-waterloo opacity-75'
                    : 'bg-waterloo hover:bg-waterloo-light cursor-pointer'
                "
              >
                <div class="flex w-full">
                  <div class="w-full text-white text-xs p-4">
                    <div class="w-full flex justify-between items-center">
                      <span class="font-bold">{{ surgery.name }}</span>
                      <span
                        v-if="registeredPractice.includes(surgery.id)"
                        class="py-1 px-2 rounded-lg text-xs md:text-sm bg-green-600 shadow"
                        >Registered</span
                      >
                    </div>
                    <span class="block w-full py-1">{{
                      surgery.address.line_1
                    }}</span>
                    <span class="block w-full py-1">{{
                      surgery.address.line_2
                    }}</span>
                    <span class="block w-full py-1">{{
                      surgery.address.line_3
                    }}</span>
                    <div class="flex items-center my-1">
                      <span
                        class="block p-2 rounded"
                        :class="
                          registeredPractice.includes(surgery.id)
                            ? 'bg-trout opacity-75'
                            : 'bg-trout '
                        "
                        >CCG</span
                      >
                      <span class="w-full px-2">{{
                        surgery.clinical_commissioning_group.name
                      }}</span>
                    </div>
                    <div class="flex items-center my-1">
                      <span
                        class="block p-2 rounded whitespace-no-wrap"
                        :class="
                          registeredPractice.includes(surgery.id)
                            ? 'bg-trout opacity-75'
                            : 'bg-trout '
                        "
                        >Practice Code</span
                      >
                      <span class="w-full px-2">{{ surgery.code }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </transition-group>
          </div>

          <div v-if="practice && practice.type == 'Spoke'">
            <!--IF PRACTICE IS A SPOKE-->
            <transition-group name="slide" tag="p">
              <div
                v-for="(hub, index) in hubzz"
                :key="`hub-${index}`"
                @click="changeParent(hub.surgery.id, hub.id)"
                class="flex no-underline rounded-lg bg-waterloo shadow hover:bg-waterloo-light my-2 p-4 cursor-pointer"
              >
                <div class="flex flex-col text-white text-xs">
                  <!-- <span class="font-hairline">{{"I AM THE ID "+hub.id}}</span> -->
                  <span class="font-bold">{{ hub.surgery.name }}</span>
                  <div class="flex items-center my-1">
                    <span class="p-2 bg-trout rounded mr-2">Practice Code</span>
                    <span>{{ hub.surgery.code }}</span>
                  </div>
                </div>
              </div>
            </transition-group>
          </div>

          <div v-if="practice && practice.type == 'Hub'">
            <!--IF PRACTICE IS A SPOKE-->
            <div
              v-for="(spoke, index) in spokes"
              :key="`spoke-${index}`"
              @click="changeParent(spoke.surgery.id, spoke.id)"
              class="flex no-underline rounded-lg bg-waterloo shadow hover:bg-waterloo-light my-2 p-4 cursor-pointer"
            >
              <div class="flex flex-col text-white text-xs">
                <!-- <span class="font-hairline">{{"I AM THE ID "+spoke.id}}</span> -->
                <span class="font-bold">{{ spoke.surgery.name }}</span>
                <div class="flex items-center my-1">
                  <span class="p-2 bg-trout rounded mr-2">Practice Code</span>
                  <span>{{ spoke.surgery.code }}</span>
                </div>
              </div>
            </div>
          </div>

          <!--TABLE ENDS HERE-->
        </div>
      </div>
    </div>
    <!-- PAGINATION -->
    <AppPagination
      :total="total"
      :totalPages="totalPages"
      :currentPage="currentPage"
      @pagechanged="pagechanged"
      :loading="loading"
    />
    <!-- PAGINATION ENDS HERE -->

    <div class="practice-user-shield" v-if="modal" @click="modal = false"></div>
    <transition name="slide" mode="out-in">
      <div
        class="shadow-lg"
        :class="practice ? 'practice-user-modal-small' : 'practice-user-modal'"
        v-if="modal"
      >
        <CreatePracticeUser
          @close="modal = false"
          @userCreated="(modal = false), $emit('close')"
          :practice="practice"
          :surgery="surgery"
        />
      </div>
    </transition>
    <nuxt-child />
  </div>
</template>

<script>
import debounce from "lodash.debounce";
import AppPagination from "@/components/Base/AppPagination";
import CreatePracticeUser from "@/components/Practices/CreatePracticeUser";
export default {
  props: ["practice", "practiceHub", "spokesCount"],
  components: {
    AppPagination,
    CreatePracticeUser
  },
  data() {
    return {
      surgeries: [],
      surgery: null,
      search: "",
      hubzz: [],
      spokes: [],
      hub: null,
      practiceCount: null,
      modal: false,
      total: 0,
      totalPages: 0,
      currentPage: 1,
      perPage: 0,
      loading: false,
      registeredPractice: []
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
      this.getAllSurgeries();
      this.getAllHubzz();
      this.getAllSpokes();
    },
    search(value) {
      this.searchSubmit();
    }
  },

  created() {
    console.log('practice hub', this.practice)
    const query = {
      ...this.$route.query,
      add_practice_page: this.$route.query.add_practice_page || 1
    };

    this.getData();
  },

  methods: {
    getPractices() {
      this.$store.dispatch("practices/fetchPractices", {
        limit: 8,
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
      const limit = this.perPage;
      let offset = 0;
      offset =
        this.perPage * (parseInt(this.$route.query.add_practice_page) - 1);
      const params = { limit, offset };
      if (this.search) {
        params.search = this.search;
      }
      if (this.practice && this.practice.type === "Spoke") {
        params.type = "Hub";
        await this.$axios
          .$get(`/api/v1/admin/practices/count`, { params })
          .then(res => {
            this.total = res.data.count;
            this.perPage = 8;
            this.totalPages = Math.ceil(this.total / this.perPage);
            this.getAllHubzz();
          });
      } else if ((this.practice && this.practice.type == "Hub")) {
        params.type = "Spoke";
        await this.$axios
          .$get(`/api/v1/admin/practices/count`, { params })
          .then(res => {
            this.total = res.data.count;
            this.perPage = 8;
            this.totalPages = Math.ceil(this.total / this.perPage);
            this.getAllSpokes();
          });
      } else if (!this.practice) {
        await this.$axios
          .$get(`/api/v1/admin/surgeries/count`, { params })
          .then(res => {
            this.total = res.data.count;
            this.perPage = 8;
            this.totalPages = Math.ceil(this.total / this.perPage);
            this.getAllSurgeries();
          });
      }
    },

    async getAllSurgeries() {
      this.loading = true;
      const limit = this.perPage;
      let offset = 0;
      offset =
        this.perPage * (parseInt(this.$route.query.add_practice_page) - 1);
      const params = { limit, offset };
      if (this.search) {
        params.search = this.search;
      }
      await this.$axios
        .$get(`/api/v1/admin/surgeries`, { params })
        .then(res => {
          this.surgeries = res.data.surgeries;
          this.surgeries.map(item => this.isRegistered(item.id));
        });
      this.loading = false;
    },

    async searchSubmit() {
      const query = {
        ...this.$route.query
      };

      query.search = this.search;
      this.getData();

      if (this.search === "") {
        delete query.search;
      }
    },

    async getAllHubzz() {
      this.loading = true;
      const limit = this.perPage;
      let offset = 0;
      let type = "Hub";
      offset =
        this.perPage * (parseInt(this.$route.query.add_practice_page) - 1);
      const params = { type, limit, offset };
      if (this.search) {
        params.search = this.search;
      }
      await this.$axios
        .$get(`/api/v1/admin/practices`, { params })
        .then(res => {
          this.hubzz = res.data.practices;
          this.hubzz.map(item => this.isRegistered(item.id));
        });
      this.loading = false;
    },

    async getAllSpokes() {
      this.loading = true;
      let offset = 0;
      offset = this.perPage * (parseInt(this.$route.query.add_practice_page) - 1);
      await this.$axios
        .$get(
          `/api/v1/admin/practices?type=Spoke&limit=${this.perPage}&offset=${offset}`
        )
        .then(res => {
          this.spokes = res.data.practices;
        });
      console.log("spokes", this.spokes);
      this.loading = false;
    },

    async newHubOrSpoke(surgeryId) {
      if (!this.practice || (this.practice && this.practice.type == "Hub")) {
        await this.$axios
          .$post(
            `/api/v1/admin/practices/${this.practice.id}/practice-surgeries`,
            {
              parent_practice_id: this.practice.id,
              surgery_id: surgeryId
            }
          )
          .then(async res => {
            await this.getPracticeSpokes(this.practice.id);
            await this.getPracticeSpokesCount(this.practice.id);
            await this.updatePracticeSpokesPageCount();
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: "Practice Child Added"
            });
          });
      }
      // else if(practice&&practice.type == 'Spoke'){
      //   if(this.practiceHub.parent_surgery){
      //     if(this.practiceHub.parent_surgery.id == surgeryId){
      //       this.$store.commit('SET_NOTIFICATION',{enabled:true, status:'danger', text:'That surgery is the current Practice Parent'})
      //     }else{
      //       await this.$axios.$post(`/api/v1/admin/practices/${this.practice.id}/parent-surgery`,{
      //         surgery_id:surgeryId
      //       }).then(async res=>{
      //         await this.getPracticeHub(this.practice.id)
      //         await this.getPracticeParent(parentId)
      //         this.$store.commit('SET_NOTIFICATION',{enabled:true, status:'success', text:'Parent Surgery Added'})
      //       })
      //     }
      //   }else{
      //     await this.$axios.$post(`/api/v1/admin/practices/${this.practice.id}/parent-surgery`,{
      //       surgery_id:surgeryId
      //     }).then(async res=>{
      //       await this.getPracticeHub(this.practice.id)
      //       await this.getPracticeParent(this.practice.id)
      //       this.$store.commit('SET_NOTIFICATION',{enabled:true, status:'success', text:'Parent Surgery Changed'})
      //     })
      //   }
      // }
    },
    async changeParent(surgeryId, parentId) {
      console.log(
        "this is the parent of the spoke",
        this.practiceHub.parent_surgery
      );
      console.log("the practice", this.practice);
      if (this.practiceHub.parent_surgery) {
        if (this.practiceHub.parent_surgery.id == surgeryId) {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: "That surgery is the current Practice Parent"
          });
        } else {
          await this.$axios
            .$post(
              `/api/v1/admin/practices/${this.practice.id}/parent-surgery`,
              {
                surgery_id: surgeryId
              }
            )
            .then(async res => {
              await this.getPracticeHub(this.practice.id);
              await this.getPracticeParent(parentId);
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: "Parent Surgery Added"
              });
            })
            .catch(err => {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: "Something went wrong!"
              });
            });
        }
      } else {
        await this.$axios
          .$post(`/api/v1/admin/practices/${this.practice.id}/parent-surgery`, {
            surgery_id: surgeryId
          })
          .then(async res => {
            await this.getPracticeHub(this.practice.id);
            await this.getPracticeParent(this.practice.id);
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: "Parent Surgery Changed"
            });
          });
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
      if (this.practiceCount > 0) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: "Surgery Already Registered"
        });
      } else {
        console.log("The surgery opened is", this.surgery);
        this.modal = true;
      }
    },
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
  border-left: solid 2px yellow;
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
