<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col overflow-auto">
    <div style="width: calc(100% - 70px);" class="flex-1 flex flex-col self-end bg-trout shadow-lg">
      <!-- HEADER -->
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link :to="{path:`/practices`,query: $route.query }" class="text-white p-1">
          <svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
        </nuxt-link>
      </div>
      <!-- HEADER -->
      <div class="flex flex-col rounded-lg pl-6 " >
        <div class="w-full overflow-hidden">
          <div class="flex flex-wrap -mx-1 overflow-hidden">
            <div class="my-1 px-1 overflow-hidden">
              <button
                class="bg-grey-dark hover:bg-grey-darker rounded-lg py-3 px-4 text-white text-xs"
                @click="tab1=true,tab2=false,tab3=false,tab4=false,tab5=false"
              >
                <strong>Practice</strong>
              </button>
            </div>
            <div class="my-1 px-1 overflow-hidden">
              <button
                class="bg-grey-dark hover:bg-grey-darker rounded-lg py-3 px-4 text-white text-xs"
                @click="tab2=true,tab1=false,tab3=false,tab4=false,tab5=false"
              >
                <strong>Surgeries</strong>
              </button>
            </div>
            <div class="my-1 px-1 overflow-</b-tabs>hidden">
              <button
                class="bg-grey-dark hover:bg-grey-darker rounded-lg py-3 px-4 text-white text-xs"
                @click="tab3=true,tab1=false,tab2=false,tab4=false,tab5=false"
              >
                <strong>Sessions</strong>
              </button>
            </div>
            <div s class="my-1 px-1 overflow-hidden">
              <button
                class="bg-grey-dark hover:bg-grey-darker rounded-lg py-3 px-4 text-white text-xs"
                @click="tab4=true,tab1=false,tab2=false,tab3=false,tab5=false"
              >
                <strong>Users</strong>
              </button>
            </div>
            <div class="my-1 px-1 overflow-hidden">
              <button
                class="bg-grey-dark hover:bg-grey-darker rounded-lg py-3 px-4 text-white text-xs"
                @click="tab5=true,tab1=false,tab2=false,tab3=false,tab4=false"
              >
                <strong>Documents</strong>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col rounded-lg p-6 sm:p-4">
        <!--TAB 1-->
        <div v-if="tab1">
          <form class="flex flex-col bg-waterloo  py-2 px-4 shadow rounded-lg sm:w-full lg:w-1/2">
            <div class="flex flex-wrap">
              <div class="w-1/2 sm:w-full lg:w-1/2 text-grey-light text-xs p-2">
                <p class="flex">Practice Name</p>
                <p class="flex text-white text-xs p-2 font-semibold">{{specificPractice.surgery ? specificPractice.surgery.name : null}}</p>
                <p class="flex">Practice Code</p>
                <p class="flex text-white text-xs p-2 font-semibold">{{specificPractice.surgery ? specificPractice.surgery.code : null}}</p>
                <p class="flex">Address</p>
                <p class="flex text-white text-xs p-2 font-semibold">
                  {{specificPractice.surgery.address ? specificPractice.surgery.address.line_1 : null}} <br>
                  {{specificPractice.surgery.address ? specificPractice.surgery.address.line_2 : null}} <br>
                  {{specificPractice.surgery.address ? specificPractice.surgery.address.line_3 : null}} <br>
                </p>
                <p class="flex">CCG</p>
                <p class="flex text-white text-xs p-2 font-semibold">{{specificPractice.surgery.clinical_commissioning_group ? specificPractice.surgery.clinical_commissioning_group.name:null}}</p>
                <p class>Compliance Requirements for GPs:</p>
                <p class="flex text-grey-light text-xs p-2 font-semibold">(none)</p>
                <p class>For Nurses, et al:</p>
                <p class="flex text-grey-light text-xs p-2 font-semibold">(none)</p>
                <p class="flex">Mandatory Training</p>
                <p class="flex text-grey-light text-xs p-2 font-semibold">(none)</p>
              </div>
              <div class="w-1/2 sm:w-full  lg:w-1/2 ">
                <p class="flex text-grey-light text-xs p-2">Phone Number</p>
                <input
                  class="appearance-none bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none focus:border-orange"
                  type="text"
                  aria-label="phonenumber"
                  :placeholder="specificPractice.phone_number"
                  v-model="toPutPractice.phone_number"
                >
                <p class="flex text-grey-light text-xs p-2">Full name to report to</p>
                <input
                  class="appearance-none bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none focus:border-orange"
                  type="text"
                  placeholder
                  aria-label="fullName"
                  v-model='toPutPractice.report_to'
                >
                <p
                  class="flex text-grey-light text-xs p-2"
                >Extra information (Parking restrictions, transport links, etc.)</p>
                 <textarea  
                  placeholder="Type Here" 
                  class="text-grey-lightest text-xs w-full bg-transparent overflow-auto resize border-b focus:border-orange" 
                  name="practiceNote"
                  v-model='toPutPractice.extra_information'>
                </textarea>

                <p class="flex text-grey-light text-xs p-2">Status</p>
                <select
                  class="outline-none border-2 border-transparent text-xs text-black pr-6"
                  v-model='toPutPractice.status'
                >
                  <option>Active</option>
                  <option>Disabled</option>
                </select>
                <p class="flex text-grey-light text-xs p-2">Active Until</p>
                  <input
                    type="date"
                    class="date-picker hasDatepicker valid"
                    name="expiryDate"
                    disable-min-date
                    placeholder="dd/mm/yyyy"
                    aria-invalid="false"
                    v-model='toPutPractice.actived_until'
                  >
                <button
                  class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-xs text-black rounded-lg shadow float:right"
                  @click.prevent="toPutPracticeInfo(specificPractice.id,toPutPractice)"
                >Save</button>
              </div>
            </div>
          </form>
        </div>
        <!--TAB 2-->
        <div v-if="tab2" class="flex flex-wrap overflow-hidden">
          <div class="flex w-full overflow-hidden">
            <div>
              <button
                class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow float-right"
              >Add Surgery
              </button>
            </div>
          </div>
            <!--TABLE-->
            <div>
              <div class="flex flex-col ">
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
                      <span>{{ surgery ? surgery.name :null }}</span>
                    </div>
                  </div>
                  
                  <div style="width: 20%;">
                    <div class="flex text-white text-xs p-4">
                      <span>{{ surgery ? surgery.code :null }}</span>
                    </div>
                  </div>
                  
                  
                </div>
              </div>
            <!--TABLE ENDS HERE-->
          </div>
        </div>
        <!--TAB 3-->
        <div v-if="tab3">
          <div class="flex flex-col rounded-lg">
            <div class="flex w-full overflow-hidden">
              <div class="flex flex-wrap -mx-1 overflow-hidden">
                <div class="my-1 px-1 overflow-hidden">
                  <button
                    class="bg-grey-dark hover:bg-grey-darker rounded-lg py-3 px-4 text-white text-xs"
                    @click="tab6=true,tab7=false,tab8=false,tab9=false,tab10=false,tab11=false,tab12=false"
                  >
                    <strong>Available</strong>
                  </button>
                </div>
                <div class="my-1 px-1 overflow-hidden">
                  <button
                    class="bg-grey-dark hover:bg-grey-darker rounded-lg py-3 px-4 text-white text-xs"
                    @click="tab7=true,tab6=false,tab8=false,tab9=false,tab10=false,tab11=false,tab12=false"
                  >
                    <strong>Applied</strong>
                  </button>
                </div>
                <div class="my-1 px-1 overflow-</b-tabs>hidden">
                  <button
                    class="bg-grey-dark hover:bg-grey-darker rounded-lg py-3 px-4 text-white text-xs"
                    @click="tab8=true,tab6=false,tab7=false,tab9=false,tab10=false,tab11=false,tab12=false"
                  >
                    <strong>Current</strong>
                  </button>
                </div>
                <div s class="my-1 px-1 overflow-hidden">
                  <button
                    class="bg-grey-dark hover:bg-grey-darker rounded-lg py-3 px-4 text-white text-xs"
                    @click="tab9=true,tab6=false,tab7=false,tab8=false,tab10=false,tab11=false,tab12=false"
                  >
                    <strong>Completed</strong>
                  </button>
                </div>
                <div class="my-1 px-1 overflow-hidden">
                  <button
                    class="bg-grey-dark hover:bg-grey-darker rounded-lg py-3 px-4 text-white text-xs"
                    @click="tab10=true,tab6=false,tab7=false,tab8=false,tab9=false,tab11=false,tab12=false"
                  >
                    <strong>Unfilled</strong>
                  </button>
                </div>
                <div class="my-1 px-1 overflow-hidden">
                  <button
                    class="bg-grey-dark hover:bg-grey-darker rounded-lg py-3 px-4 text-white text-xs"
                    @click="tab11=true,tab6=false,tab7=false,tab8=false,tab9=false,tab10=false,tab12=false"
                  >
                    <strong>Cancelled</strong>
                  </button>
                </div>
                <div class="my-1 px-1 overflow-hidden">
                  <button
                    class="bg-grey-dark hover:bg-grey-darker rounded-lg py-3 px-4 text-white text-xs"
                    @click="tab12=true,tab6=false,tab7=false,tab8=false,tab9=false,tab10=false,tab11=false"
                  >
                    <strong>Declined</strong>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="tab6" class="flex text-white text-xs p-4">
            <span>Available tab</span>
          </div>

          <div v-if="tab7" class="flex text-white text-xs p-4">
            <span>Applied Tab</span>
          </div>

          <div v-if="tab8" class="flex text-white text-xs p-4">
            <span>Current Tab</span>
          </div>

          <div v-if="tab9" class="flex text-white text-xs p-4">
            <span>Completed Tab</span>
          </div>

          <div v-if="tab10" class="flex text-white text-xs p-1">
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

          <div v-if="tab11" class="flex text-white text-xs p-4">
            <span>Cancelled Tab</span>
          </div>

          <div v-if="tab12" class="flex text-white text-xs p-4">
            <span>Declined Tab</span>
          </div>
        </div>
        <!--TAB 4-->
        <div v-if="tab4" class="flex flex-wrap overflow-hidden">
          <div class="w-full overflow-hidden">
            <nuxt-link :to="`/practices/${specificPractice.id}/new-practice-user/${surgeries.id}`">
              <button
                class="inline-flex no-underline  py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow float-left"
              >Add User
              </button>
              
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

        <!--TAB 5-->
        <div v-if="tab5">
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
            <div style="width: 20%;">
              <div class="flex text-white text-xs p-4">
                <span>{{ document.title }}</span>
              </div>
            </div>
            <div style="width: 20%;">
              <div class="flex text-white text-xs p-4">
                <span>{{document.fileSize }}</span>
              </div>
            </div>
            <div style="width: 20%;">
              <div class="fl</b-tab>ex text-white text-xs p-4">
                <span>{{ document.lastUploadDate }}</span>
              </div>
            </div>
            <div style="width:25%;">
              <div class="flex text-white text-xs p-4">
                <a>
                  <svgicon
          name="cloud-upload"
          width="21"
          height="21"
          color="transparent white"
        ></svgicon> 
                  Upload
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nuxt-child/>
  </div>
</template>

<script>
export default {
  transition: "subpage",

  data() {
    return {
      specificPractice:[],
      surgeries:[],
      tab1: true,
      tab2: false,
      tab3: false,
      tab4: false,
      tab5: false,
      tab6: true,
      tab7: false,
      tab8: false,
      tab9: false,
      tab10: false,
      tab11: false,
      tab12: false,
      practiceTabs: 0,
      sessionTabs: 0,
      users: [],
      documents: [],
      unfilleds: [],
      toPutPractice:{
        phone_number:'',
        report_to:'',
        email:'',
        extra_information:'',
        status:'',
        actived_until:''
      }
    };
  },

  async asyncData({ app, route }) {
    try {
      let response = await app.$axios.get(`/api/v1/admin/practices/${route.params.id}`)
      const specificPractice = response.data.data.practice
      const surgeries = response.data.data.practice.surgery

      console.log(surgeries)

      return{
        specificPractice,
        surgeries
      }
    } catch (err) {
      console.log("index practices index _id index asyncData err", err);
    }
  },

  methods: {
    async toPutPracticeInfo(practiceID,toPutPractice){
      try{
        const response = this.$axios.put(`/api/v1/admin/practices/${practiceID}`,{
        phone_number:toPutPractice.phone_number,
        report_to:toPutPractice.report_to,
        extra_information:toPutPractice.extra_information,
        status:toPutPractice.status,
        actived_until:toPutPractice.actived_until
        })
        alert('Saved')
      }catch(err){
        console.log("index put locum detail compliance documents error");
        alert('Something went wrong!')
      }

    }
  }

};
</script>
<style>
@media(min-width: 450px){

 .right-side-header-content{

  width: calc(100% - 0px);

 }

}
</style>
