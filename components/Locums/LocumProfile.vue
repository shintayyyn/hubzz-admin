<template>
  <div class="flex xs:flex-col my-3 text-sm no-underline shadow-lg rounded-lg bg-waterloo shadow">
    <div class="inline-flex">
      <div class="w-full flex flex-wrap overflow-hidden text-gray-300">
        <!--COLUMN 1-->
        <div class="w-full md:w-1/3 overflow-hidden mb-2 md:px-10">
          <div class="mx-3 my-4 md:my-6">
            <p class="m-2">Name</p>
            <p class="mx-4 font-semibold" :class="!user.personal_detail.name && 'opacity-75'">{{ user.personal_detail.name ? user.personal_detail.name : 'N/A' }}</p>

            <p class="m-2 mt-5 mr-20">Email address</p>
            <p class="mx-4 font-semibold" :class="!user.email && 'opacity-75'">{{ user.email ? user.email : 'N/A' }}</p>

            <p class="m-2 mt-5 mr-20">Mobile phone number</p>
            <p
              class="mx-4 font-semibold"
              :class="!user.contact_detail.mobile_number && 'opacity-75'"
            >{{ user.contact_detail && user.contact_detail.mobile_number ? user.contact_detail.mobile_number : 'N/A' }}</p>

            <p class="m-2 mt-5 mr-20">Home / landline number</p>
            <p
              class="mx-4 font-semibold"
              :class="!user.contact_detail.home_number && 'opacity-75'"
            >{{ user.contact_detail && user.contact_detail.home_number ? user.contact_detail.home_number : 'N/A' }}</p>

            <p class="m-2 mt-5 mr-20">Work Number</p>
            <p
              class="mx-4 font-semibold"
              :class="!user.contact_detail.work_number && 'opacity-75'"
            >{{ user.contact_detail && user.contact_detail.work_number ? user.contact_detail.work_number : 'N/A' }}</p>

            <p class="m-2 mt-5 mr-20 ">Postal Address</p>
            <p
              class="mx-4 font-semibold"
              :class="!user.address_detail.address.line_1 && 'opacity-75'"
            >{{ user.address_detail ? user.address_detail.address.line_1 : 'N/A' }}</p>
            <p
              class="mx-4 mt-1 font-semibold"
              :class="!user.address_detail.address.line_2 && 'opacity-75'"
            >{{ user.address_detail ? user.address_detail.address.line_2 : 'N/A' }}</p>
            <p
              class="mx-4 mt-1 font-semibold"
              :class="!user.address_detail.address.line_3 && 'opacity-75'"
            >{{ user.address_detail ? user.address_detail.address.line_3 : 'N/A' }}</p>

            <p class="m-2 mt-5 mr-20 ">GMC / NMC Number</p>
            <p
              class="mx-4 font-semibold"
              :class="!locumDetails.gmc_or_nmc_number && 'opacity-75'"
            >{{ locumDetails.gmc_or_nmc_number ? locumDetails.gmc_or_nmc_number.number : 'N/A' }}</p>

            <p class="m-2 mt-5 mr-20 ">MPL / NPL Number</p>
            <p
              class="mx-4 font-semibold"
              :class="!locumDetails.mpl_or_npl_number && 'opacity-75'"
            >{{ locumDetails.mpl_or_npl_number ? locumDetails.mpl_or_npl_number.number : 'N/A' }}</p>

            <p class="m-2 mt-5 mr-20 ">NHS Smart Card ID Number</p>
            <p
              class="mx-4 font-semibold"
              :class="!locumDetails.nhs_smart_card_id_number && 'opacity-75'"
            >{{ locumDetails.nhs_smart_card_id_number ? locumDetails.nhs_smart_card_id_number : 'N/A' }}</p>

            <p class="m-2 mt-5 mr-20 ">Profession</p>
            <p
              class="mx-4 font-semibold"
              :class="!locumDetails.profession && 'opacity-75'"
            >{{ locumDetails.profession ? locumDetails.profession.name : 'N/A' }}</p>

            <p class="m-2 mt-5 mr-20 ">Speciality</p>
            <p
              :class="!user.locum_detail.qualifications && 'opacity-75'"
              class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-500"
              v-for="specialty in user.locum_detail.qualifications"
              :key="specialty.id + '-name'"
            >{{specialty ? specialty.name:'N/A'}}</p>
            <p class="m-2 mt-5 mr-20">Clinical Systems</p>
            <p
              class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-500"
              :class="!user.locum_detail.clinical_systems && 'opacity-75'"
              v-for="clinicalSystem in user.locum_detail.clinical_systems"
              :key="clinicalSystem.id + '-name1'"
            >{{clinicalSystem ? clinicalSystem.name:'N/A'}}</p>

            <p class="m-2 mt-5 mr-20">Spoken Languages</p>
            <p class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-500">English</p>
            <p
              class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-500"
              :class="!user.locum_detail.spoken_languages && 'opacity-75'"
              v-for="spokenLanguage in user.locum_detail.spoken_languages"
              :key="spokenLanguage.id + '-name2'"
            >{{spokenLanguage ? spokenLanguage.name:'N/A'}}</p>
          </div>
        </div>
        <!--COLUMN 2-->
        <div class="w-full md:w-1/3 overflow-hidden mb-2 md:px-10">
          <div class="mx-3 my-4 md:my-6">
            <p class="m-2 mr-20 ">Headline</p>
            <p class="mx-4 font-semibold" :class="!user.locum_detail.headline && 'opacity-75'">{{user.locum_detail.headline?user.locum_detail.headline:'N/A'}}</p>
            <p class="m-2 mt-5 mr-20 ">Short Biography</p>
            <p class="mx-4 font-semibold" :class="!user.locum_detail.short_biography && 'opacity-75'">{{user.locum_detail.short_biography?user.locum_detail.short_biography:'N/A'}}</p>
            <p class="m-2 mt-5 mr-20 ">Special requirements</p>
            <p
              class="mx-4 font-semibold"
              :class="!user.locum_detail.special_requirements && 'opacity-75'"
            >{{user.locum_detail.special_requirements?user.locum_detail.special_requirements:'N/A'}}</p>
            <p class="m-2 mt-5 mr-20 ">Preferred rates</p>
            <p
              class="mx-4 font-semibold"
            >{{user.locum_detail.rates[0].min && user.locum_detail.rates[0].max ? 'Per Hour: £'+user.locum_detail.rates[0].min+' - £'+user.locum_detail.rates[0].max : '(none)'}}</p>
            <p
              class="mx-4 mt-1 font-semibold"
            >{{user.locum_detail.rates[1].min && user.locum_detail.rates[1].max ? 'Per Half Day Session: £'+user.locum_detail.rates[1].min+' - £'+user.locum_detail.rates[1].max : '(none)'}}</p>

            <div v-if="userComplianceDocuments">
              <p class="m-2 mt-5 mr-20 ">Compliance Documents</p>
              <div
                v-for="(userComplianceDoc, index) in user.locum_detail.compliance_documents"
                :key="`${index}-${userComplianceDoc.id}-`"
                class="mx-4"
              >
                <a
                  class="m-2 text-gray-300 flex cursor-pointer items-center hover:text-yellow-500"
                  @click.prevent="downloadItem(userComplianceDoc.file.url,userComplianceDoc.file.filename)"
                  title="Click to download file"
                >
                  <svgicon
                    name="cloud-download"
                    width="21"
                    height="21"
                    color="transparent white"
                    class="w-3/4"
                  ></svgicon>
                  <span
                    class="w-full flex px-2"
                  >{{ userComplianceDoc.file ? userComplianceDoc.compliance_document.name:null }}</span>
                </a>
              </div>
            </div>
            <div v-if="userMandatoryTrainings">
              <p class="m-2 mt-5 mr-20 ">Mandatory Training Documents</p>
              <span v-if="userMandatoryTrainings.length == 0" class="mx-4 px-2 opacity-75">No Mandatory Training Documents</span>
              <div
                v-for="(userMandatoryTraining, index) in user.locum_detail.mandatory_trainings"
                :key="`${index}-${userMandatoryTraining.id}-`"
                class="mx-4"
              >
                <a
                  class="m-2 font-semibold flex cursor-pointer items-center hover:text-yellow-500"
                  :event="userMandatoryTraining.file === null ? disabled:'click'"
                  @click.prevent="downloadItem(userMandatoryTraining.file.url,userMandatoryTraining.file.filename)"
                  title="Click to download file"
                >
                  <svgicon
                    v-if="userMandatoryTraining.file"
                    name="cloud-download"
                    width="21"
                    height="21"
                    color="transparent white"
                    class="w-3/4"
                  ></svgicon>
                  <span
                    class="w-full flex px-2"
                  >{{userMandatoryTraining.mandatory_training && userMandatoryTraining.file ? userMandatoryTraining.mandatory_training.name:null}}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <!--COLUMN 3-->
        <div class="w-full md:w-1/3 overflow-hidden mb-2 md:px-10">
          <div class="mx-3 my-4 md:my-6 border-b text-center pb-3">
            <embed
              class="object-cover w-48 h-48 rounded-full mx-auto"
              :src="user.avatar ? user.avatar.file.url:null"
            />
            <img
              v-if="!user.avatar"
              class="w-48 rounded-full mr-4"
              src="~/assets/images/default-user-image.png"
            />
            <p class="m-2 text-gray">Sign-up verified by email</p>
            <p
              class="mx-4 font-semibold"
            >{{user.is_email_verified ? "Account is E-Mail Verified":"Account is not E-Mail Verified"}}</p>
            <!-- <p class="m-2 text-gray">Active at </p> -->
            <div class="my-4">
              <span class="m-2 ">Account is</span>
              <span class="rounded p-1 px-3" :class="statusStyle(user.status)">{{user.status}}</span>
            </div>
          </div>
          <div class="mx-3 my-4">
            <span class="text-lg font-semibold font-semibold">Change Locum Status</span>
            <span
              class="tool inline-block"
              data-tip="Locum is automatically 'Active' once passed the Verification Process. You cannot set the Locum to 'Active' if the Locum is not Compliant."
              tabindex="1"
            >
              <svgicon
                name="info"
                width="21"
                height="21"
                color="white transparent black"
                class="-mb-1 ml-2"
              ></svgicon>
            </span>
            <br/>
            <div class="flex items-center">
              <select
                class="outline-none border-2 border-transparent text-sm text-black w-full mr-2"
                id="grid-state"
                v-model="selectedStatus"
              >
                <option>Active</option>
                <option>Inactive</option>
                <option>Deactivated</option>
              </select>
              <button
                class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-sm font-semibold text-black rounded-lg shadow"
                @click.prevent="changeLocumUserStatus(user.id,selectedStatus)"
              >Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["user"],
  components: {},
  data() {
    return {
      disabled: "true",
      locumDetails: "",
      selectedStatus: "",
      profileTab: true,
      jobTab: false,
      userComplianceDocuments: [],
      userCurrentJobs: [],
      qualifications: [],
      clinicalSystems: [],
      spokenLanguages: [],
      specificLocumCompDocs: [],
      userMandatoryTrainings: []
    };
  },

  created() {
    this.locumDetails = this.user.locum_detail;
    this.userComplianceDocuments = this.user.locum_detail.compliance_documents;
    this.qualifications = this.user.locum_detail.qualifications;
    this.clinicalSystems = this.user.locum_detail.clinical_systems;
    this.spokenLanguages = this.user.locum_detail.spoken_languages;
    console.log("qweqwe", this.getLocums)
  },

  methods: {
    getLocums() {
      this.$store.dispatch("locums/fetchLocums", {
        limit: 8,
        order_by: "created_at:desc",
        offset: this.getQuery()
      });
    },
    getQuery() {
      const query = {
        ...this.$route.query
      };
      const offset = parseInt(query.page) * 8 - 8;
      return offset;
    },
    downloadItem(imgUrl, imgFilename) {
      const axios = require("axios");
      axios({
        url: imgUrl,
        method: "GET",
        responseType: "blob" // important
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", imgFilename);
        document.body.appendChild(link);
        link.click();
      });
    },

    async changeLocumUserStatus(locumID, activeDisabled) {
      try {
        const response = await this.$axios.put(
          "/api/v1/admin/locum-users/" + locumID + "/status",
          {
            status: activeDisabled
          }
        );
        await this.getLocums();
        // this.user.status = response.data.data.user.status
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "success",
          text: "Saved"
        });
      } catch (err) {
        console.log("index practices index put status err", err);
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: "Something went wrong!!"
        });
      }
    },
    statusStyle(status) {
      switch (status) {
        case "Active":
          return "bg-green-500";
          break;
        case "Inactive":
          return "bg-yellow-500 text-black";
          break;
        case "Deactivated":
          return "bg-gray-500 text-black";
          break;
        case "Suspended":
          return "bg-red-500";
          break;
        case "Dormant":
          return "bg-green-600";
          break;
        default:
          return;
      }
    }
  }
};
</script>
