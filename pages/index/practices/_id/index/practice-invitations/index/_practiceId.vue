<template>
  <div class="modal-container shadow-lg">
    <div class="p-4 md:p-8">
      <div class="flex justify-between text-sm text-white">
        <nuxt-link
          :to="`/practices/${$route.params.id}/practice-invitations`"
          class="cursor-pointer"
        >
          <svgicon
            name="arrow-left-solid"
            height="32"
            width="32"
            class="text-white hover:text-sunglow fill-current"
          />
        </nuxt-link>
      </div>
      <div class="mx-6 mt-5 bg-white rounded-lg px-4 pt-8 pb-4 shadow-lg">
        <div class="flex flex-col flex-wrap justify-between">
          <div class="w-full p-1">
            <AppInput
              v-model="form.allow_surgery_create_sessions"
              :type="'select'"
              :name="'allow_surgery_create_sessions'"
              :label="'Allow Spoke to Create Jobs/Sessions?'"
              :error="formError.find(item => item.field === 'allow_surgery_create_sessions')"
              :placeholder="'Select...'"
              :items="[{ label: 'Yes', value: true },{ label: 'No', value: false }]"
              required
            />
          </div>
          <div
            class="p-2 mx-2 bg-gray-500 rounded-lg"
            v-if="surgeryCreateSessions == 'true' ||form.allow_surgery_create_sessions == 'true'"
          >
            <div class="w-full p-1">
              <AppInput
                v-model="form.max_hourly_rate_limit"
                :type="'number'"
                :name="'max_hourly_rate_limit'"
                :label="'Set max hourly rate limit for Spoke'"
                :error="formError.find(item => item.field === 'max_hourly_rate_limit')"
                :inStyle="'text-align:right'"
              />
            </div>
            <div class="w-full p-1">
              <AppInput
                v-model="form.max_halfday_rate_limit"
                :type="'number'"
                :name="'max_halfday_rate_limit'"
                :label="'Set max half day rate limit for Spoke'"
                :error="formError.find(item => item.field === 'max_halfday_rate_limit')"
                :inStyle="'text-align:right'"
              />
            </div>
            <div class="w-full p-1">
              <AppInput
                v-model="form.max_wholeday_rate_limit"
                :type="'number'"
                :name="'max_wholeday_rate_limit'"
                :label="'Set max whole day rate limit for Spoke'"
                :error="formError.find(item => item.field === 'max_wholeday_rate_limit')"
                :inStyle="'text-align:right'"
              />
            </div>
            <div class="w-full p-1">
              <AppInput
                v-model="form.max_ooh_rate_limit"
                :type="'number'"
                :name="'max_ooh_rate_limit'"
                :label="'Set max out-of-hours rate limit for Spoke'"
                :error="formError.find(item => item.field === 'max_ooh_rate_limit')"
                :inStyle="'text-align:right'"
              />
            </div>
            <div class="w-full p-1">
              <AppInput
                v-model="form.max_excess_hours"
                :type="'number'"
                :name="'max_excess_hours'"
                :label="'Set max excess hours'"
                :error="formError.find(item => item.field === 'max_excess_hours')"
                :inStyle="'text-align:right'"
              />
            </div>
          </div>
          <div class="w-full p-1">
            <AppInput
              v-model="form.allow_surgery_create_permanent_jobs"
              :type="'select'"
              :name="'allow_surgery_create_permanent_jobs'"
              :label="'Allow Spoke to create permanent jobs?'"
              :error="formError.find(item => item.field === 'allow_surgery_create_permanent_jobs')"
              :placeholder="'Select...'"
              :items="[{ label: 'Yes', value: true },{ label: 'No', value: false }]"
              required
            />
          </div>
          <div class="w-full p-1">
            <AppInput
              v-model="form.allow_surgery_bill_locum"
              :type="'select'"
              :name="'allow_surgery_bill_locum'"
              :label="'Allow Spoke to handle its own billing for Locum?'"
              :error="formError.find(item => item.field === 'allow_surgery_bill_locum')"
              :placeholder="'Select...'"
              :items="[{ label: 'Yes', value: true },{ label: 'No', value: false }]"
              required
            />
          </div>
          <div class="w-full p-1">
            <AppInput
              v-model="form.allow_surgery_bill_hubzz"
              :type="'select'"
              :name="'allow_surgery_bill_hubzz'"
              :label="'Allow Spoke to handle its own billing for HUBZZ?'"
              :error="formError.find(item => item.field === 'allow_surgery_bill_hubzz')"
              :placeholder="'Select...'"
              :items="[{ label: 'Yes', value: true },{ label: 'No', value: false }]"
              required
            />
          </div>
          <div class="w-full p-1">
            <AppInput
              v-model="form.share_banks_to_other_surgeries"
              :type="'select'"
              :name="'share_banks_to_other_surgeries'"
              :label="'Share this spoke`s bank/s to other surgeries?'"
              :error="formError.find(item => item.field === 'share_banks_to_other_surgeries')"
              :placeholder="'Select...'"
              :items="[{ label: 'Yes', value: true },{ label: 'No', value: false }]"
              required
            />
          </div>
          <div class="w-full p-1">
            <AppInput
              v-model="form.share_my_banks"
              :type="'select'"
              :name="'share_my_banks'"
              :label="'Allow Spoke to see hub banks?'"
              :error="formError.find(item => item.field === 'share_my_banks')"
              :placeholder="'Select...'"
              :items="[{ label: 'Yes', value: true },{ label: 'No', value: false }]"
              required
            />
          </div>
        </div>
        <button
          class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow hover:bg-sunglow-dark text-sm text-black rounded-lg shadow float:right font-bold"
          @click.prevent="acceptInvitation()"
        >Save</button>
      </div>
    </div>
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
export default {
  components: {
    AppInput
  },
  data() {
    return {
      form: {
        child_practice_id: this.$route.params.practiceId,
        allow_surgery_create_sessions: "",
        allow_surgery_create_permanent_jobs: "",
        max_hourly_rate_limit: "",
        max_halfday_rate_limit: "",
        max_wholeday_rate_limit: "",
        max_ooh_rate_limit: "",
        max_excess_hours: "",
        allow_surgery_bill_locum: "",
        allow_surgery_bill_hubzz: "",
        share_banks_to_other_surgeries: "",
        share_my_banks: ""
      },
      formError: []
    };
  },
  computed: {
    surgeryCreateSessions: function() {
      return this.form.allow_surgery_create_sessions;
    }
  },
  methods: {
    acceptInvitation() {
      let notRequired = [
        "max_hourly_rate_limit",
        "max_halfday_rate_limit",
        "max_wholeday_rate_limit",
        "max_ooh_rate_limit",
        "max_excess_hours"
      ];
      this.Validate(this.form, notRequired);
      if (!this.formError.length) {
        this.$axios
          .$post(
            `/api/v1/admin/practices/${this.$route.params.id}/spoke-invitations/accept`,
            {
              ...this.form,
              practice_id: this.$route.params.id,
              child_practice_id: this.$route.params.practiceId
            }
          )
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "sucess",
              text: "Spoke Invitation Accepted Successfully!"
            });
            this.$router.push(
              `/practices/${this.$route.params.id}/practice-invitations`
            );
            this.$emit("acceptInvitation");
          })
          .catch(err => {
            console.log("err", err.response || err);
          });
      }
    }
  }
};
</script>
<style scoped>
.modal-container {
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
  .modal-container {
    width: 75%;
  }
}
</style>