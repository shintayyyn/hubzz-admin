<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
    <div style="width: calc(100% - 70px);" class="flex-1 flex flex-col self-end bg-trout shadow-lg">
      <!-- HEADER -->
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link to="/practices" class="text-white p-1">
          <svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
        </nuxt-link>
      </div>
      <!-- HEADER -->
      <div class="flex flex-col rounded-lg p-6" style="width: 800px;">
        <b-tabs pills v-model="practiceTabs">
          <!--TAB 1-->
          <b-tab title="Practice" :title-link-class="linkClass(0)" active>
            <div>
              <form class="flex flex-col bg-waterloo m-4 py-2 px-4 shadow rounded-lg">
                <div class="flex flex-wrap overflow-hidden">
                  <div class="w-1/2 overflow-hidden text-grey-light text-xs p-2">
                    <p class="flex">Practice Name</p>
                    <p class="flex text-white text-xs p-2 font-semibold">BARROW HEALTH CENTRE</p>
                    <p class="flex">Practice Code</p>
                    <p class="flex text-white text-xs p-2 font-semibold">C82062</p>
                    <p class="flex">Address</p>
                    <p
                      class="flex text-white text-xs p-2 font-semibold"
                    >HEALTH CTR, 27 HIGH ST BARROW-UPON-SOAR LOUGHBOROUGH LE12 8PY</p>
                    <p class="flex">CCG</p>
                    <p class="flex text-white text-xs p-2 font-semibold">West Leicestershire</p>
                    <p class>Compliance Requirements for GPs:</p>
                    <p class="flex text-grey-light text-xs p-2 font-semibold">(none)</p>
                    <p class>For Nurses, et al:</p>
                    <p class="flex text-grey-light text-xs p-2 font-semibold">(none)</p>
                    <p class="flex">Mandatory Training</p>
                    <p class="flex text-grey-light text-xs p-2 font-semibold">(none)</p>
                  </div>
                  <div class="w-1/2 overflow-hidden">
                    <p class="flex text-grey-light text-xs p-2">Phone Number</p>
                    <input
                      class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
                      type="text"
                      placeholder="0844 4770922"
                      aria-label="phonnumber"
                    >
                    <p class="flex text-grey-light text-xs p-2">Full name to report to</p>
                    <input
                      class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
                      type="text"
                      placeholder
                      aria-label="Full name"
                    >
                    <p
                      class="flex text-grey-light text-xs p-2"
                    >Extra information (Parking restrictions, transport links, etc.)</p>
                    <input
                      class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
                      type="text"
                      placeholder
                      aria-label="extrainfo"
                    >
                    <p class="flex text-grey-light text-xs p-2">Status</p>
                    <select
                      class="blockPractice Manage-none w-full bg-white border border-grey-light hover:border-grey px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option>Active</option>
                      <option>Disabled</option>
                    </select>
                    <p class="flex text-grey-light text-xs p-2">Active Until</p>
                    <input
                      class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
                      type="text"
                      placeholder="dd/mm/yyyy"
                      aria-label="Full name"
                    >
                    <button
                      class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-xs text-black rounded-lg shadow float:right"
                    >Save</button>
                  </div>
                </div>
              </form>
            </div>
          </b-tab>
          <!--TAB 2-->
          <b-tab title="Surgeries" :title-link-class="linkClass(1)">
            <div class="flex flex-wrap overflow-hidden">
              <div class="w-full overflow-hidden">
                <div>
                  <button
                    class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow float-right"
                  >Add Surgery</button>
                </div>
              </div>

              <div class="w-full overflow-hidden">
                <!--TABLE-->
                <div style="width:900px;">
                  <div class="flex flex-col">
                    <!--HEADERS-->
                    <div class="flex">
                      <div style="width:25%">
                        <div class="flex text-white text-xs p-2">
                          <strong>Practice Name</strong>
                        </div>
                      </div>
                      <div style="width:25%">
                        <div class="flex text-white text-xs p-2">
                          <strong>Practice Code</strong>
                        </div>
                      </div>
                      <div style="width:25%">
                        <div class="flex text-white text-xs p-2">
                          <strong>Practice Location</strong>
                        </div>
                      </div>
                    </div>
                    <!--HEADERS END HERE-->
                    <div
                      v-for="(surgery,index) in surgeries"
                      :key="`surgery-${index}`"
                      class="flex no-underline rounded-lg bg-waterloo my-2"
                    >
                      <div style="width: 25%;">
                        <div class="flex text-white text-xs p-4">
                          <span>{{ surgery.practiceName }}</span>
                        </div>
                      </div>
                      <div style="width: 20%;">
                        <div class="flex text-white text-xs p-4">
                          <span>{{ surgery.practiceCode }}</span>
                        </div>
                      </div>
                      <div style="width: 30%;">
                        <div class="flex text-white text-xs p-4">
                          <span>{{ surgery.practiceLocation }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!--TABLE ENDS HERE-->
              </div>
            </div>
          </b-tab>
          <!--TAB 3-->
          <b-tab title="Sessions" :title-link-class="linkClass(2)">
            <div>
              <b-tabs pills v-model="sessionTabs">
                <b-tab title="Available" :title-link-class="linkClass2(0)" active>
                  <div class="flex text-white text-xs p-4">
                    <span>Not available</span>
                  </div>
                </b-tab>
                <b-tab title="Applied" :title-link-class="linkClass2(1)">
                  <div class="flex text-white text-xs p-4">
                    <span>Not available</span>
                  </div>
                </b-tab>
                <b-tab title="Current" :title-link-class="linkClass2(2)">
                  <div class="flex text-white text-xs p-4">
                    <span>Not available</span>
                  </div>
                </b-tab>
                <b-tab title="Completed" :title-link-class="linkClass2(3)">
                  <div class="flex text-white text-xs p-4">
                    <span>Not available</span>
                  </div>
                </b-tab>
                <b-tab title="Unfilled" :title-link-class="linkClass2(4)">
                  <div class="flex text-white text-xs p-1">
                    <div class="w-full overflow-hidden">
                      <div class="flex flex-col">
                        <!-- HEADER -->
                        <div class="flex">
                          <div style="width: 25%;">
                            <div class="flex text-white text-xs p-2">
                              <strong>Job Number</strong>
                            </div>
                          </div>
                          <div style="width: 33%;">
                            <div class="flex text-white text-xs p-2">
                              <strong>Practice/Surgery</strong>
                            </div>
                          </div>
                          <div style="width: 22%">
                            <div class="flex text-white text-xs p-2">
                              <strong>Title</strong>
                            </div>
                          </div>
                          <div style="width: 20%;">
                            <div class="flex text-white text-xs p-2">
                              <strong>Created</strong>
                            </div>
                          </div>
                          <div style="width: 20%;">
                            <div class="flex text-white text-xs p-2">
                              <strong>From</strong>
                            </div>
                          </div>
                          <div style="width: 20%;">
                            <div class="flex text-white text-xs p-2">
                              <strong>To</strong>
                            </div>
                          </div>
                        </div>
                        <!-- HEADER -->

                        <!-- BODY -->
                        <nuxt-link
                          v-for="(unfilled, index) in unfilleds"
                          :key="`unfilled-${index}`"
                          :to="`/practices/_id/unfilled`"
                          class="flex no-underline rounded-lg bg-waterloo hover:bg-waterloo-light my-2"
                        >
                          <div style="width: 20%;">
                            <div class="flex text-white text-xs p-4">
                              <span>{{ unfilled.jobNum }}</span>
                            </div>
                          </div>
                          <div style="width: 30%;">
                            <div class="flex text-white text-xs p-4">
                              <span>{{ unfilled.practice }}</span>
                            </div>
                          </div>
                          <div style="width: 20%;">
                            <div class="flex text-white text-xs p-4">
                              <span>{{ unfilled.title }}</span>
                            </div>
                          </div>
                          <div style="width: 20%;">
                            <div class="flex text-white text-xs p-4">
                              <span>{{ unfilled.created }}</span>
                            </div>
                          </div>
                          <div style="width: 20%;">
                            <div class="flex text-white text-xs p-4">
                              <span>{{ unfilled.from }}</span>
                            </div>
                          </div>
                          <div style="width: 20%;">
                            <div class="flex text-white text-xs p-4">
                              <span>{{ unfilled.to }}</span>
                            </div>
                          </div>
                        </nuxt-link>
                        <!-- BODY -->
                      </div>
                    </div>
                  </div>
                </b-tab>
                <b-tab title="Cancelled" :title-link-class="linkClass2(5)">
                  <div class="flex text-white text-xs p-4"></div>
                </b-tab>
                <b-tab title="Declined" :title-link-class="linkClass2(6)">
                  <div class="flex text-white text-xs p-4">
                    <span>Not available</span>
                  </div>
                </b-tab>
              </b-tabs>
            </div>
          </b-tab>
          <!--TAB 4-->
          <b-tab title="Users" :title-link-class="linkClass(3)">
            <div class="flex flex-wrap overflow-hidden">
              <div class="w-full overflow-hidden">
                <nuxt-link :to="`/practices/_id/adduser`">
                  <button
                    class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow float-left"
                  >Add User</button>
                </nuxt-link>
              </div>

              <div class="w-full overflow-hidden">
                <div class="flex flex-col">
                  <!-- HEADER -->
                  <div class="flex">
                    <div style="width: 20%;">
                      <div class="flex text-white text-xs p-4">
                        <strong>Full Name</strong>
                      </div>
                    </div>
                    <div style="width: 30%;">
                      <div class="flex text-white text-xs p-4">
                        <strong>Email Address</strong>
                      </div>
                    </div>
                    <div style="width: 20%">
                      <div class="flex text-white text-xs p-4">
                        <strong>Role</strong>
                      </div>
                    </div>
                    <div style="width: 20%;">
                      <div class="flex text-white text-xs p-4">
                        <strong>Sign-Up Verified</strong>
                      </div>
                    </div>
                    <div style="width: 20%;">
                      <div class="flex text-white text-xs p-4">
                        <strong>Status</strong>
                      </div>
                    </div>
                  </div>
                  <!-- HEADER -->

                  <!-- BODY -->
                  <nuxt-link
                    v-for="(user, index) in users"
                    :key="`user-${index}`"
                    :to="`/practices/_id/edituser`"
                    class="flex no-underline rounded-lg bg-waterloo hover:bg-waterloo-light my-2"
                  >
                    <div style="width: 20%;">
                      <div class="flex text-white text-xs p-4">
                        <span>{{ user.fullName }}</span>
                      </div>
                    </div>
                    <div style="width: 30%;">
                      <div class="flex text-white text-xs p-4">
                        <span>{{ user.emailAddr }}</span>
                      </div>
                    </div>
                    <div style="width: 20%;">
                      <div class="flex text-white text-xs p-4">
                        <span>{{ user.role }}</span>
                      </div>
                    </div>
                    <div style="width: 20%;">
                      <div class="flex text-white text-xs p-4">
                        <span>{{ user.signUpVerified }}</span>
                      </div>
                    </div>
                    <div style="width: 20%; padding-top:15px">
                      <div
                        class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-xs text-black rounded-full shadow"
                      >
                        <span>{{ user.status }}</span>
                      </div>
                    </div>
                  </nuxt-link>
                  <!-- BODY -->
                </div>
              </div>
            </div>
          </b-tab>
          <!--TAB 5-->
          <b-tab title="Documents" :title-link-class="linkClass(4)">
            <div class="flex flex-col">
              <!-- HEADER -->
              <div class="flex my-2">
                <div style="width: 20%;">
                  <div class="flex text-white text-xs p-4">
                    <strong>Title</strong>
                  </div>
                </div>
                <div style="width: 20%;">
                  <div class="flex text-white text-xs p-4">
                    <strong>File Size</strong>
                  </div>
                </div>
                <div style="width: 20%">
                  <div class="flex text-white text-xs p-4">
                    <strong>Last Upload Date</strong>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-for="(document,index) in documents"
              :key="`surgery-${index}`"
              class="flex no-underline rounded-lg bg-waterloo my-2"
            >
              <div style="width: 25%;">
                <div class="flex text-white text-xs p-4">
                  <span>{{ document.title }}</span>
                </div>
              </div>
              <div style="width: 25%;">
                <div class="flex text-white text-xs p-4">
                  <span>{{document.fileSize }}</span>
                </div>
              </div>
              <div style="width: 25%;">
                <div class="flex text-white text-xs p-4">
                  <span>{{ document.lastUploadDate }}</span>
                </div>
              </div>
              <div style="width:25%;">
                <div class="flex text-white text-xs p-4">
                  <a>
                    <i class="material-icons" style="padding:-5px font-size:18px; ">cloud_upload</i>
                    Upload
                  </a>
                </div>
              </div>
            </div>
          </b-tab>
        </b-tabs>
      </div>
    </div>
    <nuxt-child/>
  </div>
</template>

<script>
export default {
  transition: "subpage",
  //PROMISES CODES
  // async asyncData({ app, route }) {
  //   try {
  //     let response = await app.$axios.get(
  //       `/api/v1/practices/${route.params.id}`
  //     );

  //     const practab,

  //     return {
  //       practicetab,
  //     };
  //   } catch (err) {
  //     console.log("index practices index _id index asyncData err", err);
  //   }
  // },

  data() {
    return {
      practice: null,
      practiceTabs: 0,
      sessionTabs: 0,
      surgeries: [
        {
          practiceName: "OLDHAM FAMILY PRACTICE",
          practiceCode: "P85007",
          practiceLocation:
            "1ST FLOOR INTEGRATED CC NEW RADCLIFFE STREET OLDHAM OL1 1NL"
        },
        {}
      ],
      users: [
        {
          fullName: "Mr. Alvin Abad Ph.D",
          emailAddr: "kpabad.halcyondigital@gmail.com",
          role: "Practice Manager",
          signUpVerified: "01/04/2019",
          status: "Disabled"
        },
        {}
      ],
      documents: [
        {
          title: "Agreement",
          fileSize: "46.67 kB",
          lastUploadDate: "1/23/2019"
        },
        {
          title: "Direct Debit",
          fileSize: "46.67 kB",
          lastUploadDate: "1/23/2019"
        }
      ],
      unfilleds: [
        {
          jobNum: "H0000000252",
          practice: "OLDHAM FAMILY PRACTICE",
          title: "qwe",
          created: "18/03/2019",
          from: "20/03/2019",
          to: "20/03/2019"
        },
        {
          jobNum: "H0000000252",
          practice: "OLDHAM FAMILY PRACTICE",
          title: "qwe",
          created: "18/03/2019",
          from: "20/03/2019",
          to: "20/03/2019"
        }
      ]
    };
  },
  methods: {
    linkClass(idx) {
      if (this.practiceTabs === idx) {
        return ["bg-secondary", "text-xs"];
      } else {
        return ["bg-transparent", "text-light", "text-xs"];
      }
    },
    linkClass2(idx) {
      if (this.sessionTabs === idx) {
        return ["bg-secondary", "text-xs"];
      } else {
        return ["bg-transparent", "text-light", "text-xs"];
      }
    }
  }
};
</script>
