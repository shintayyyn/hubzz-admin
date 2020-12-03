<template>
  <div class="flex-1 flex flex-col overflow-hidden py-2 px-4 md:px-8 text-white">
    <div
      class="flex flex-wrap justify-between items-start w-full shadow-lg p-3 rounded-lg flex bg-charade text-white my-2"
    >
      <div class="flex flex-row w-full">
        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppDate
            v-model="filter.registered_at_date_start"
            label="Date Start"
            format="YYYY-MM-DD"
          />
        </div>

        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppDate
            v-model="filter.registered_at_date_end"
            label="Date End"
            format="YYYY-MM-DD"
          />
        </div>
        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3 ">
          <AppPostCode
            v-model="filter.post_code"
            :url-index="'/api/v1/postcode-coordinates'"
            :name="'postcode'"
            :label="'Post Code'"
          />
        </div>
        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="filter.proximity"
            placeholder="Proximity"
            type="number"
            label="Proximity"
          />
        </div>
      </div>

      <div class="flex flex-wrap w-full justify-end">
        <!-- <AppButton
          class="mx-2"
          label="Submit"
          :in-style="'padding:5px 14px;margin-bottom:5px'"
          @click="filterSearch"
        />
         
        <AppButton
          label="Reset"
          :in-style="'padding:5px 14px;margin-bottom:5px'"
          @click="filterReset"
        />         -->
      </div>
    </div>
    <div class="flex flex-col">
      <div class="flex flex-row w-full ">
        <div class="flex-1 rounded m-2 bg-charade">
          <div class="m-2">
            Locum Registrations
          </div>
        </div>
        <div class="flex-1 rounded m-2 bg-charade">
          <div class="m-2">
            Practice Registrations
          </div>
        </div>
        <div class="flex-1 rounded m-2 bg-charade">
          <div class="m-2">
            Referrers with Successful Referrals
          </div>
        </div>
        <div class="flex-1 rounded m-2 bg-charade">
          <div class="m-2">
            Billing
          </div>
        </div>
      </div>
      <div class="flex flex-row w-full ">
        <div class="flex-1 rounded m-2 bg-charade">
          <div class="m-2">
            <div class="text-xs text-gray-500">
              Locums
            </div>
            <div>

            </div>
          </div>
        </div>
        <div class="flex-1 rounded m-2 bg-charade">
          <div class="m-2">
            <div class="text-xs text-gray-500">
              Practices
            </div>
            <div class="font-bold">
              <span>
                Active Practices
              </span>
              <span class="text-orange-400">
                {{ practice_counts.active_practices }}
              </span>
            </div>
            <div class="mx-2">
              <div class="">
                <span>
                  Stand Alone
                </span>
                <span class="text-orange-400">
                  {{ practice_counts.active_stand_alone }}
                </span>
              </div>
              <div class="">
                <span>
                  Hub I
                </span>
                <span class="text-orange-400">
                  {{ practice_counts.active_hub_type_1 }}
                </span>
              </div>
              <div class="">
                <span>
                  Hub II
                </span>
                <span class="text-orange-400">
                  {{ practice_counts.active_hub_type_2 }}
                </span>
              </div>
              <div class="">
                <span>
                  Spokes
                </span>
                <span class="text-orange-400">
                  {{ practice_counts.active_spokes }}
                </span>
              </div>
              <div class="">
                <span>
                  Inactive Practices
                </span>
                <span class="text-orange-400">
                  {{ practice_counts.inactive_practices }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-1 rounded m-2 bg-charade">
          <div class="m-2">
            Jobs
          </div>
        </div>
        <div class="flex-1 rounded m-2 bg-charade">
          <div class="m-2">
            Disputes
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppInput from "@/components/Base/AppInput"
import AppButton from "@/components/Base/AppButton"
import AppDate from "@/components/Base/AppDate"
import AppPostCode from "@/components/Base/AppPostCode"

export default {
  components: {
    AppInput,
    AppButton,
    AppDate,
    AppPostCode,
  },
  data () {
    return {
      filter: {
        registered_at_date_start:'',
        registered_at_date_end: '',
        post_code: '',
        proximity: '',
      },
      locum_counts: '',
      practice_counts: '',
    }
  },
  async asyncData ({ app }) {
    try {
      let response = await app.$axios.get(`/api/v1/admin/locum-counts`)

      const locum_counts = response.data.data.all_locums

      response = await app.$axios.get(`/api/v1/admin/practice-counts`)
      
      const practice_counts = response.data.data.all_practices
      return {
        locum_counts,
        practice_counts,
      }
    } catch (err) {
      console.log('something went wrong', err)
    }
  }

}
</script>

<style>

</style>