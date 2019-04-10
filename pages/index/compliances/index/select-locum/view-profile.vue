<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
    <div style="width: calc(100% - 140px);" class="flex-1 flex-col self-end bg-trout overflow-auto">
      <!-- HEADER -->
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link to="/compliances/select-locum" class="text-white hover:text-yellow-dark p-1">
          <svgicon
            name="arrow-left-solid"
            height="22"
            width="22"
            class="hover:text-yellow-dark fill-current"
          />
        </nuxt-link>
      </div>
      <!-- HEADER -->
      <!-- BODY -->

      <div class="mx-6">
        <div>
          <button
            @click="profileTab = true, jobTab = false"
            class="rounded-lg border-2 border-transparent text-xs text-white p-3 mr-2 focus:bg-waterloo"
          >Profile</button>
          <button
            @click="jobTab = true, profileTab = false"
            class="rounded-lg border-2 border-transparent text-xs text-white p-3 focus:bg-waterloo"
          >Jobs</button>
        </div>

        <div class="flex-col mt-3 text-xs no-underline shadow-lg rounded-lg bg-waterloo">
          <div v-if="profileTab" class="inline-flex m-4">
            <div class="text-grey mx-5">
              <p class="m-2">Name</p>
              <p class="m-2 text-white">Ms Marie Rochelle RN</p>
              <p class="m-2 mt-5 mr-20">Email address</p>
              <p class="m-2 text-white underline">rorieee95@gmail.com</p>
              <p class="m-2 mt-5 mr-20">Mobile phone number</p>
              <p class="m-2 text-white">454284664</p>
              <p class="m-2 mt-5 mr-20">Home / landline number</p>
              <p class="m-2 text-white">845484</p>
              <p class="m-2 mt-5 mr-20">Postal Address</p>
              <p class="ml-2 text-white">Abbeydale Road</p>
              <p class="ml-2 mt-1 text-white">Wembley</p>
              <p class="ml-2 mt-1 text-white">HA0 1TW</p>
              <p class="m-2 mt-5 mr-20">GMC Number</p>
              <p class="m-2 text-white">12648</p>
              <p class="m-2 mt-5 mr-20">MPL / NPL Number</p>
              <p class="m-2 text-white">173836</p>
              <p class="m-2 mt-5 mr-20">NHS Smart Card ID Number</p>
              <p class="m-2 text-white">(none)</p>
              <p class="m-2 mt-5 mr-20">Profession</p>
              <p class="m-2 text-white">GP</p>
              <p class="m-2 mt-5 mr-20">Speciality</p>
              <p class="inline-flex ml-2 rounded-lg text-xs text-black p-2 bg-yellow-dark">A&E</p>
              <p class="m-2 mt-5 mr-20">Clinical Systems</p>
              <p class="inline-flex ml-2 rounded-lg text-xs text-black p-2 bg-yellow-dark">Adastra</p>
              <p class="m-2 mt-5 mr-20">Spoken Languages</p>
              <p class="inline-flex ml-2 rounded-lg text-xs text-black p-2 bg-yellow-dark">English</p>
            </div>
            <div class="text-grey mx-10">
              <p class="m-2 mr-20">Headline</p>
              <p class="m-2 text-white">s</p>
              <p class="m-2 mt-5 mr-20">Short Biography</p>
              <p class="m-2 text-white">a</p>
              <p class="m-2 mt-5 mr-20">Special requirements</p>
              <p class="ml-2 text-white">a</p>
              <p class="m-2 mt-5 mr-20">Preferred rates</p>
              <p class="ml-2 text-white">Per hour £ (none)</p>
              <p class="ml-2 mt-1 text-white">Per session £ (none)</p>
            </div>
            <div class="mx-20">
              <img src="~/assets/images/default-user-image.png" width="200" height="100">
              <p class="m-2 text-grey">Sign-up verified by email</p>
              <p class="m-2 text-white">24/01/2019</p>
              <select
                class="outline-none border-2 border-transparent text-xs text-black pr-6"
                id="grid-state"
              >
                <option>Active</option>
                <option>Disabled</option>
              </select>
              <button
                to="/practices/add-practice"
                class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-xs text-black rounded-lg shadow"
              >Save</button>
            </div>
          </div>
        </div>
        <!-- TABLE -->
        <div style="w-full">
          <div v-if="jobTab" class="flex flex-col">
            <!-- HEADER -->
            <div class="flex my-2">
              <div style="width: 20%;">
                <div class="flex text-white text-xs p-4">
                  <strong>Job number</strong>
                </div>
              </div>
              <div style="width: 15%;">
                <div class="flex text-white text-xs p-4">
                  <strong>Practice / Surgery</strong>
                </div>
              </div>
              <div style="width: 15%;">
                <div class="flex text-white text-xs p-4">
                  <strong>Title</strong>
                </div>
              </div>
              <div style="width: 16%;">
                <div class="flex text-white text-xs p-4">
                  <strong>From</strong>
                </div>
              </div>
              <div style="width: 16%;">
                <div class="flex text-white text-xs p-4">
                  <strong>To</strong>
                </div>
              </div>
              <div style="width: 16%;">
                <div class="flex text-white text-xs p-4">
                  <strong>Created</strong>
                </div>
              </div>
            </div>
            <!-- HEADER -->

            <!-- BODY -->
            <nuxt-link
              v-for="(job, index) in jobs"
              :key="`compliance-${index}`"
              :to="`/compliances/select-locum`"
              class="flex no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light mt-2"
            >
              <div style="width: 20%;">
                <div class="flex text-white text-xs p-4">
                  <span>{{ job.number }}</span>
                </div>
              </div>
              <div style="width: 15%;">
                <div class="flex text-white text-xs p-4">
                  <span>{{ job.practice }}</span>
                </div>
              </div>
              <div style="width: 15%;">
                <div class="flex text-white text-xs p-4">
                  <span>{{ job.title }}</span>
                </div>
              </div>
              <div style="width: 16%;">
                <div class="flex text-white text-xs p-4">
                  <span>{{ job.from }}</span>
                </div>
              </div>
              <div style="width: 16%;">
                <div class="flex text-white text-xs p-4">
                  <span>{{ job.to }}</span>
                </div>
              </div>
              <div style="width: 16%;">
                <div class="flex text-white text-xs p-4">
                  <span>{{ job.createdAt }}</span>
                </div>
              </div>
            </nuxt-link>
            <!-- BODY -->
          </div>
        </div>
        <!-- TABLE -->
      </div>
      <!-- BODY -->
    </div>
  </div>
</template>

<script>
export default {
  transition: "subpage",

  async asyncData({ app, route }) {
    try {
    } catch (err) {
      console.log("index practices index create asyncData err", err);
    }
  },

  data() {
    return {
      profileTab: true,
      jobTab: false,
      jobs: [
        {
          number: "P0000000095",
          practice: "THE IVY MEDICAL GROUP",
          title: "Private appointment",
          from: "12/03/2019",
          to: "12/03/2019",
          createdAt: "11/03/2019"
        },
        {
          number: "H0000000246",
          practice: "VILLAGE SURGERY",
          title: "Weavy",
          from: "12/03/2019",
          to: "12/03/2019",
          createdAt: "11/03/2019"
        },
        {
          number: "P0000000094",
          practice: "THE IVY MEDICAL GROUP",
          title: "Private appointment",
          from: "06/03/2019",
          to: "06/03/2019",
          createdAt: "06/03/2019"
        }
      ]
    };
  }
};
</script>
