<template>
  <div class="modal-container shadow-lg">
    <div class="p-4 md:p-8">
      <div class="flex justify-between text-sm">
        <nuxt-link :to="`/practices/${$route.params.id}/practice-invitations`" class="cursor-pointer">
          <svgicon name="arrow-left-solid" height="32" width="32" class="hover:text-sunglow fill-current" />
        </nuxt-link>
      </div>

      <div class="flex flex-col flex-wrap justify-between">
        <div class="w-full p-1">
          <AppInput
            v-model="form.allow_surgery_create_sessions"
            :type="'select'"
            :name="'allow_surgery_create_sessions'"
            :label="'Allow Spoke to Create Jobs/Sessions?'"
            :error="fieldError('allow_surgery_create_sessions')"
            :placeholder="'Select...'"
            :items="selectItems"
            required
          />
        </div>
        <div class="p-2 mx-2 bg-gray-500 rounded-lg" v-if="shouldShowRateLimits">
          <div class="w-full p-1">
            <AppInput
              v-model="form.max_hourly_rate_limit"
              :type="'number'"
              :name="'max_hourly_rate_limit'"
              :label="'Set max hourly rate limit for Spoke'"
              :error="fieldError('max_hourly_rate_limit')"
              :inStyle="'text-align:right'"
            />
          </div>
          <div class="w-full p-1">
            <AppInput
              v-model="form.max_halfday_rate_limit"
              :type="'number'"
              :name="'max_halfday_rate_limit'"
              :label="'Set max half day rate limit for Spoke'"
              :error="fieldError('max_halfday_rate_limit')"
              :inStyle="'text-align:right'"
            />
          </div>
          <div class="w-full p-1">
            <AppInput
              v-model="form.max_wholeday_rate_limit"
              :type="'number'"
              :name="'max_wholeday_rate_limit'"
              :label="'Set max whole day rate limit for Spoke'"
              :error="fieldError('max_wholeday_rate_limit')"
              :inStyle="'text-align:right'"
            />
          </div>
          <div class="w-full p-1">
            <AppInput
              v-model="form.max_ooh_rate_limit"
              :type="'number'"
              :name="'max_ooh_rate_limit'"
              :label="'Set max out-of-hours rate limit for Spoke'"
              :error="fieldError('max_ooh_rate_limit')"
              :inStyle="'text-align:right'"
            />
          </div>
          <div class="w-full p-1">
            <AppInput
              v-model="form.max_excess_hours"
              :type="'number'"
              :name="'max_excess_hours'"
              :label="'Set max excess hours'"
              :error="fieldError('max_excess_hours')"
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
            :error="fieldError('allow_surgery_create_permanent_jobs')"
            :placeholder="'Select...'"
            :items="selectItems"
            required
          />
        </div>
        <div class="w-full p-1">
          <AppInput
            v-model="form.allow_surgery_bill_locum"
            :type="'select'"
            :name="'allow_surgery_bill_locum'"
            :label="'Allow Spoke to handle its own billing for Locum?'"
            :error="fieldError('allow_surgery_bill_locum')"
            :placeholder="'Select...'"
            :items="selectItems"
            required
          />
        </div>
        <div class="w-full p-1">
          <AppInput
            v-model="form.allow_surgery_bill_hubzz"
            :type="'select'"
            :name="'allow_surgery_bill_hubzz'"
            :label="'Allow Spoke to handle its own billing for HUBZZ?'"
            :error="fieldError('allow_surgery_bill_hubzz')"
            :placeholder="'Select...'"
            :items="selectItems"
            required
          />
        </div>
        <div class="w-full p-1">
          <AppInput
            v-model="form.share_banks_to_other_surgeries"
            :type="'select'"
            :name="'share_banks_to_other_surgeries'"
            :label="'Share this spoke`s bank/s to other surgeries?'"
            :error="fieldError('share_banks_to_other_surgeries')"
            :placeholder="'Select...'"
            :items="selectItems"
            required
          />
        </div>
        <div class="w-full p-1">
          <AppInput
            v-model="form.share_my_banks"
            :type="'select'"
            :name="'share_my_banks'"
            :label="'Allow Spoke to see hub banks?'"
            :error="fieldError('share_my_banks')"
            :placeholder="'Select...'"
            :items="selectItems"
            required
          />
        </div>
      </div>
      <button
        class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow hover:bg-sunglow-dark text-sm text-black rounded-lg shadow float:right font-bold"
        @click.prevent="acceptInvitation()"
      >
        Save
      </button>
    </div>
  </div>
</template>
<script>
import AppInput from '@/components/Base/AppInput'
export default {
  components: {
    AppInput
  },
  props: {
    practiceType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        child_practice_id: null,
        allow_surgery_create_sessions: '',
        allow_surgery_create_permanent_jobs: '',
        max_hourly_rate_limit: '',
        max_halfday_rate_limit: '',
        max_wholeday_rate_limit: '',
        max_ooh_rate_limit: '',
        max_excess_hours: '',
        allow_surgery_bill_locum: '',
        allow_surgery_bill_hubzz: '',
        share_banks_to_other_surgeries: '',
        share_my_banks: ''
      },
      formError: []
    }
  },
  computed: {
    shouldShowRateLimits() {
      return this.form.allow_surgery_create_sessions == 'true' || this.form.allow_surgery_create_sessions === true
    },
    selectItems() {
      return [
        { label: 'Yes', value: true },
        { label: 'No', value: false }
      ]
    }
  },
  methods: {
    fieldError(field) {
      return this.formError.find(item => item.field === field)
    },
    buildInvitationRequest() {
      if (this.practiceType === 'Hub') {
        return {
          urlPath: `/api/v1/admin/practices/${this.$route.params.id}/spoke-invitations/accept`,
          formPayload: {
            ...this.form,
            practice_id: this.$route.params.id,
            child_practice_id: this.$route.params.practiceId
          }
        }
      }

      if (this.practiceType === 'Spoke') {
        return {
          urlPath: `/api/v1/admin/practices/${this.$route.params.practiceId}/spoke-invitations/accept`,
          formPayload: {
            ...this.form,
            practice_id: this.$route.params.practiceId,
            child_practice_id: this.$route.params.id
          }
        }
      }

      return {
        urlPath: null,
        formPayload: null
      }
    },
    acceptInvitation() {
      this.formError = []

      let notRequired = [
        'max_hourly_rate_limit',
        'max_halfday_rate_limit',
        'max_wholeday_rate_limit',
        'max_ooh_rate_limit',
        'max_excess_hours',
        'child_practice_id'
      ]
      this.Validate(this.form, notRequired)

      if (!this.formError.length) {
        const { urlPath, formPayload } = this.buildInvitationRequest()

        this.$axios
          .$post(urlPath, formPayload)
          .then(res => {
            this.$store.commit('SET_NOTIFICATION', {
              enabled: true,
              status: 'sucess',
              text: 'Spoke Invitation Accepted Successfully!'
            })
            this.$router.push(`/practices/${this.$route.params.id}/practice-invitations`)
            this.$emit('acceptInvitation')
          })
          .catch(() => null)
      }
    }
  }
}
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
  background-color: white;
  z-index: 512;
}

@media screen and (min-width: 1200px) {
  .modal-container {
    width: 75%;
  }
}
</style>
