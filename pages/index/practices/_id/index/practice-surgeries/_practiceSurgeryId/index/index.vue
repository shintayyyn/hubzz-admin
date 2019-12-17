<template>
  <div class="max-w-xl bg-waterloo rounded-lg text-white my-4 mx-1">
    <div class="p-4 md:p-8">
      <div class="flex flex-row items-center mb-4">
        <div class="leading-loose font-bold text-md sm:text-lg">{{practice_surgery.child_practice.surgery.name}}</div>
        <div
          class="mx-2 text-sm sm:text-sm p-2 text-white-700 font-bold bg-blue-400 rounded-lg"
        >{{practice_surgery.child_practice.surgery.code}}</div>
      </div>

      <div class="flex flex-col">
        <!--------------PAY FOR SURGERY-------------->
        <div class="flex flex-row items-center">
          <div class="text-lg text-white font-semibold"> Pay for Surgery / Job Creation</div>
          <div
            @click="editPermissions = !editPermissions" 
            class="text-sm font-semibold bg-yellow-500 px-3 py-1 mx-2 rounded-lg cursor-pointer"
            :class="`${editPermissions == false ? 'text-black bg-yellow-500 hover:bg-yellow-400' : 'text-white bg-green-500 hover:bg-green-600'}`">
            {{editPermissions == false ? 'Edit' : 'Done'}}</div>
        </div>
        <div v-if="editPermissions === false" class="mt-2 mb-4 mx-2">
          <div class="">
            <div class="flex items-center pb-2">
              <span class="mr-2">
                <svgicon :name="practice_surgery.allow_surgery_create_sessions === true ? 'circle-check' : 'times-solid'" 
                  class="fill-current w-5 h-5 rounded-full"
                  :class="practice_surgery.allow_surgery_create_sessions ? 'bg-green-500' : 'text-white bg-red-500 p-1'"/>
              </span>
              <p class="font-semibold">Does Hub allow creation of Jobs/Sessions?</p>
              <!-- <p class="text-sm mx-6">{{practice_surgery.allow_surgery_create_sessions === true ? 'Yes':'No'}}</p> -->
            </div>
            <div class="bg-waterloo-dark p-2 rounded-lg mb-2" v-if="practice_surgery.allow_surgery_create_sessions === true">
              <p class="font-semibold pt-2">Rate Limits(Only effective when allowed to create jobs)</p>
              <div class="p-2">
                <div class="flex flex-col md:flex-row">
                  <p class="font-semibold md:w-1/2">Maximum Hourly Rate Limit</p>
                  <p class="">{{practice_surgery.max_hourly_rate_limit ?'£ '+  practice_surgery.max_hourly_rate_limit : 'N/A'}}</p>
                </div>
                <div class="flex flex-col md:flex-row">
                  <p class="font-semibold md:w-1/2">Maximum Half Day Rate Limit</p>
                  <p class="">{{practice_surgery.max_halfday_rate_limit ?'£ '+  practice_surgery.max_halfday_rate_limit : 'N/A'}}</p>
                </div>

                <div class="flex flex-col md:flex-row">
                  <p class="font-semibold md:w-1/2">Maximum Whole Day Rate Limit</p>
                  <p class="">{{practice_surgery.max_wholeday_rate_limit ?'£ '+  practice_surgery.max_wholeday_rate_limit : 'N/A'}}</p>
                </div>

                <div class="flex flex-col md:flex-row">
                  <p class="font-semibold md:w-1/2">Maximum Out-of-Hours Rate Limit</p>
                  <p class="">{{practice_surgery.max_ooh_rate_limit ?'£ '+  practice_surgery.max_ooh_rate_limit : 'N/A'}}</p>
                </div>

                <div class="flex flex-col md:flex-row">
                  <p class="font-semibold md:w-1/2">Maximum Excess Hours</p>
                  <p class="">{{practice_surgery.max_ooh_rate_limit ?'£ '+ practice_surgery.max_ooh_rate_limit : 'N/A'}}</p>
                </div>
              </div>
              
            </div>
            <div class="flex items-center pb-2">
              <span class="mr-2">
                <svgicon :name="practice_surgery.allow_surgery_bill_locum === true ? 'circle-check' : 'times-solid'" 
                  class="fill-current w-5 h-5 rounded-full"
                  :class="practice_surgery.allow_surgery_bill_locum ? 'bg-green-500' : 'text-white bg-red-500 p-1'"/>
              </span>
              <p class="font-semibold">Does Hub permit billing of Locums?</p>
            </div>

            <div class="flex items-center pb-2">
              <span class="mr-2">
                <svgicon :name="practice_surgery.allow_surgery_bill_hubzz === true ? 'circle-check' : 'times-solid'" 
                  class="fill-current w-5 h-5 rounded-full"
                  :class="practice_surgery.allow_surgery_bill_hubzz ? 'bg-green-500' : 'text-white bg-red-500 p-1'"/>
              </span>
              <p class="font-semibold">Does Hub permit billing for Hubzz?</p>
            </div>

            <div class="flex items-center pb-2">
              <span class="mr-2">
                <svgicon :name="practice_surgery.share_banks_to_other_surgeries === true ? 'circle-check' : 'times-solid'" 
                  class="fill-current w-5 h-5 rounded-full"
                  :class="practice_surgery.share_banks_to_other_surgeries ? 'bg-green-500' : 'text-white bg-red-500 p-1'"/>
              </span>
              <p class="font-semibold">Can other Spokes see your Banks?</p>
            </div>

            
            
            
          </div>
        </div>
        <!--------------EDIT PERMISSIONS------------------>
        <div v-if="editPermissions === true" class="bg-waterloo-dark rounded-lg shadow-md p-2 my-4">
          <div class="flex flex-col flex-wrap justify-between">
            <div class="w-full p-1">
              <AppInput
                v-model="form.allow_surgery_create_sessions"
                :type="'select'"
                :name="'allow_surgery_create_sessions'"
                :label="'Allow Spoke to Create Jobs/Sessions?'"
                :placeholder="'Select...'"
                :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
              />
            </div>
            <!-- SET MAX RATES ;  NOT REQUIRED -->
            <div class="p-2 mx-2 bg-gray-500 rounded-lg" v-if="surgeryCreateSessions == 'true' || form.allow_surgery_create_sessions == 'true'" >
              <div class="w-full p-1">
                <AppInput
                  v-model="form.max_hourly_rate_limit"
                  :type="'number'"
                  :name="'max_hourly_rate_limit'"
                  :label="'Set max hourly rate limit for Spoke'"
                  :inStyle="'text-align:right'"
                />
              </div>
              <div class="w-full p-1">
                <AppInput
                  v-model="form.max_halfday_rate_limit"
                  :type="'number'"
                  :name="'max_halfday_rate_limit'"
                  :label="'Set max half day rate limit for Spoke'"
                  :inStyle="'text-align:right'"
                />
              </div>
              <div class="w-full p-1">
                <AppInput
                  v-model="form.max_wholeday_rate_limit"
                  :type="'number'"
                  :name="'max_wholeday_rate_limit'"
                  :label="'Set max whole day rate limit for Spoke'"
                  :inStyle="'text-align:right'"
                />
              </div>
              <div class="w-full p-1">
                <AppInput
                  v-model="form.max_ooh_rate_limit"
                  :type="'number'"
                  :name="'max_ooh_rate_limit'"
                  :label="'Set max out-of-hours rate limit for Spoke'"
                  :inStyle="'text-align:right'"
                />
              </div>
              <div class="w-full p-1">
                <AppInput
                  v-model="form.max_excess_hours"
                  :type="'number'"
                  :name="'max_excess_hours'"
                  :label="'Allow Spoke to Create Jobs/Sessions?'"
                  :inStyle="'text-align:right'"
                />
              </div>
            </div>
            <!-- SET MAX RATES END HERE -->
            <div class="w-full p-1">
              <AppInput
                v-model="form.allow_surgery_bill_locum"
                :type="'select'"
                :name="'allow_surgery_bill_locum'"
                :label="'Allow Spoke to handle its own billing for Locum?'"
                :placeholder="'Select...'"
                :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
              />
            </div>
            <div class="w-full p-1">
              <AppInput
                v-model="form.allow_surgery_bill_hubzz"
                :type="'select'"
                :name="'allow_surgery_bill_hubzz'"
                :label="'Allow Spoke to handle its own billing for HUBZZ?'"
                :placeholder="'Select...'"
                :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
              />
            </div>
            <div class="w-full p-1">
              <AppInput
                v-model="form.share_banks_to_other_surgeries"
                :type="'select'"
                :name="'share_banks_to_other_surgeries'"
                :label="'Share Banks to Other Surgeries'"
                :placeholder="'Select...'"
                :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
              />
            </div>
          </div>
          <div class="flex flex-row justify-start px-2 mb-2 md:px-4 md:mb-4">
            <AppButton :label="'Save'" @click="save" :inStyle="'padding:5px 10px'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import AppInput from "@/components/Base/AppInput";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppButton,
    AppInput
  },
  data(){
    return{
      practice: '',
      practice_surgery: '',
      editPermissions: false,
      form: {
        allow_surgery_create_sessions: "",
        max_hourly_rate_limit: "",
        max_halfday_rate_limit: "",
        max_wholeday_rate_limit: "",
        max_ooh_rate_limit: "",
        max_excess_hours: "",
        allow_surgery_bill_locum: "",
        allow_surgery_bill_hubzz: "",
        share_banks_to_other_surgeries: "",
      },
    }
  },
  computed:{
    surgeryCreateSessions: function () {
      return this.form.allow_surgery_create_sessions
    }
  },
  async asyncData({ app, route, }){
    try{
      let response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}`)
      const practice = response.data.practice
      response = await app.$axios.$get(`/api/v1/admin/practices/${practice.id}/practice-surgeries/${route.params.practiceSurgeryId}`)
      const practice_surgery = response.data.practice_surgery
      console.log('pracsurg', practice_surgery)
      return{
        practice,
        practice_surgery
      }
    }catch(err){
      store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text: err.response.data.message})
      console.log('get practice/practice surgery error', err)
    }
  },
  async created() {
    this.form.allow_surgery_create_sessions = this.practice_surgery.allow_surgery_create_sessions
    this.form.max_hourly_rate_limit = this.practice_surgery.max_hourly_rate_limit
    this.form.max_halfday_rate_limit = this.practice_surgery.max_halfday_rate_limit
    this.form.max_wholeday_rate_limit = this.practice_surgery.max_wholeday_rate_limit
    this.form.max_ooh_rate_limit = this.practice_surgery.max_ooh_rate_limit
    this.form.max_excess_hours = this.practice_surgery.max_excess_hours
    this.form.allow_surgery_bill_locum = this.practice_surgery.allow_surgery_bill_locum
    this.form.allow_surgery_bill_hubzz = this.practice_surgery.allow_surgery_bill_hubzz
    this.form.share_banks_to_other_surgeries = this.practice_surgery.share_banks_to_other_surgeries
  },
  
  methods:{
    save() {
      this.$axios.$put(`/api/v1/admin/practices/${this.practice.id}/practice-surgeries/${this.practice_surgery.id}`,this.form)
        .then(res => {
          console.log('res', res)
          this.practice_surgery.allow_surgery_create_sessions = res.data.practice_surgery.allow_surgery_create_sessions
          this.practice_surgery.max_hourly_rate_limit = res.data.practice_surgery.max_hourly_rate_limit
          this.practice_surgery.max_halfday_rate_limit = res.data.practice_surgery.max_halfday_rate_limit
          this.practice_surgery.max_wholeday_rate_limit = res.data.practice_surgery.max_wholeday_rate_limit
          this.practice_surgery.max_ooh_rate_limit = res.data.practice_surgery.max_ooh_rate_limit
          this.practice_surgery.max_excess_hours = res.data.practice_surgery.max_excess_hours
          this.practice_surgery.allow_surgery_bill_locum = res.data.practice_surgery.allow_surgery_bill_locum
          this.practice_surgery.allow_surgery_bill_hubzz = res.data.practice_surgery.allow_surgery_bill_hubzz
          this.practice_surgery.share_banks_to_other_surgeries = res.data.practice_surgery.share_banks_to_other_surgeries
          this.$store.commit(
            "profile/UPDATE_SURGERY",
            res.data.practice_surgery
          );
          this.$store.commit("SET_NOTIFICATION", { enabled: true, status: "success", text: "Successfully Updated Spoke Permissions"});
          this.editPermissions = false
        });
    }
  }
} 
</script>
<style>

</style>