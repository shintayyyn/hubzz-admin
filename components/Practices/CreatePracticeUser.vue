<template>
  <div class="absolute top-0 bottom-0 right-0 left-0 flex flex-col">
    <div class="flex justify-between text-sm text-white py-2 px-6">
      <div @click="$emit('close')" class="cursor-pointer">
        <svgicon name="arrow-left-solid" height="32" width="32" class="text-white hover:text-sunglow fill-current" />
      </div>
    </div>
    <div class="ml-4">
      <div class="text-white pl-4 pt-2">
        <div class="text-lg font-bold" v-if="practice && practice.type=='Hub'">Create Spoke User</div>
        <div class="text-lg font-bold" v-else>Create User</div>
        <div v-if="surgery" class="text-xs font-hairline">Surgery: {{surgery.name}}</div>
      </div>

      <div
        class="flex text-white bg-waterloo m-4 py-2 px-3 shadow rounded-lg text-sm sm:w-max lg:w-1/2"
      >
        <div class="w-full overflow-hidden text-gray-300 text-sm p-2">
          <div v-if="errors[0]" class="p-2 rounded text-black bg-sunglow mb-2">{{errors[0]}}</div>
          <p class="flex">Title</p>
          <input
            class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none focus:border-yellow"
            type="text"
            placeholder="Mr. / Mrs. / Dr. / etc....."
            v-model="toPostUser.title"
            aria-label="Title"
          />
          <div class="flex items-center py-1">
            First Name
            <span v-if="firstNameError" class="bg-red-600 p-1 ml-4 rounded">{{firstNameError}}</span>
          </div>
          <input
            class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
            :class="`${toPostUser.first_name !== '' ? 'focus:border-yellow' :'focus:border-red'}`"
            type="text"
            placeholder="Jane"
            v-model="toPostUser.first_name"
            @blur="verifyFirstName(toPostUser.first_name)"
            aria-label="First Name"
          />
          <div class="flex items-center py-1">
            Last Name
            <span v-if="lastNameError" class="bg-red-600 p-1 ml-4 rounded">{{lastNameError}}</span>
          </div>
          <input
            class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
            :class="`${toPostUser.last_name !== '' ? 'focus:border-yellow' :'focus:border-red'}`"
            type="text"
            v-model="toPostUser.last_name"
            @blur="verifyLastName(toPostUser.last_name)"
            placeholder="Doe"
            aria-label="Last Name"
          />
          <p class="flex">Suffix</p>
          <input
            class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Ph.D"
            v-model="toPostUser.suffix"
            aria-label="Suffix"
          />

          <div v-if="surgery && surgery.practice_count<1" class="w-full">
            <span>Practice Types</span>
            <span class="text-xs">(hold ctrl + click to choose)</span>
            <select
              class="w-full text-black focus:outline-none"
              multiple="true"
              v-bind:class="{ 'fix-height': multiple === 'true' }"
              v-model="toPostUser.practice_type_id"
            >
              <option class="px-2 py-1" v-for="item in practiceTypes" :key="item.id" :value="item">{{item.label}}</option>
            </select>
            <div
              v-for="(practice_type, index) in toPostUser.practice_type_id"
              :key="`practice_type-${index}`"
              class="inline-flex my-2 mr-2"
            >
              <span
                class="bg-yellow-500 rounded-lg p-2 text-black"
              >{{toPostUser.practice_type_id[index].label}}</span>
            </div>
          </div>

          <div v-if="surgery" class="flex items-center py-1">
            Role
            <span v-if="!toPostUser.practice_role" class="bg-red-600 p-1 ml-4 rounded">Required</span>
          </div>
          <select
            v-if="surgery"
            class="appearance-none w-full mb-4 bg-white border-b border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 text-gray-800 rounded shadow leading-tight focus:outline-none"
            :class="`${toPostUser.practice_role !== '' ? 'focus:border-yellow-500' :'focus:border-red-600'}`"
            v-model="toPostUser.practice_role"
          >
            <option>Partner</option>
            <option>Practice Manager</option>
            <option>Practice Staff</option>
          </select>
          <div v-if="surgery && surgery.practice_count<1" class="flex py-1">Type</div>
          <select
            v-if="surgery && surgery.practice_count<1"
            class="appearance-none w-full mb-4 bg-white border-b border-gray-300 hover:border-gray-500 text-gray-800 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none"
            :class="`${toPostUser.type !== '' ? 'focus:border-yellow-600' :'focus:border-red-600'}`"
            v-model="toPostUser.type"
          >
            <option>Hub</option>
            <option>Stand Alone</option>
            <option>Spoke</option>
          </select>
          <div v-if="toPostUser.type == 'Spoke'" class="py-1">
            Parent Surgery ID
            <input
              class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
              :class="`${toPostUser.parent_surgery_id !== '' ? 'focus:border-yellow' :'focus:border-red'}`"
              id="parent"
              type="text"
              v-model="toPostUser.parent_surgery_id"
              placeholder="Parent ID"
            />
          </div>

          <div class="flex items-center py-1">
            E-Mail Address
            <span
              v-if="emailError"
              class="bg-red-600 p-1 ml-4 -mt-1 rounded"
            >{{emailError}}</span>
          </div>
          <input
            class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
            :class="`${toPostUser.email !== '' ? 'focus:border-yellow' :'focus:border-red'}`"
            id="email"
            type="text"
            v-model="toPostUser.email"
            @blur="verifyEmail(toPostUser.email)"
            placeholder="example@example.com"
          />
          <div class="flex items-center py-1">
            Password
            <span v-if="passwordError" class="bg-red-600 p-1 ml-4 rounded">{{passwordError}}</span>
          </div>
          <input
            class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
            :class="`${toPostUser.password !== '' ? 'focus:border-yellow' :'focus:border-red'}`"
            type="password"
            v-model="toPostUser.password"
            @blur="verifyPassword(toPostUser.password)"
            placeholder="Password"
          />
          <div class="flex items-center py-1">
            Confirm Password
            <span
              v-if="confirmPasswordError"
              class="bg-red-600 p-1 ml-4 rounded"
            >{{confirmPasswordError}}</span>
          </div>
          <input
            class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
            :class="`${toPostUser.password_confirmation !== '' ? 'focus:border-yellow' :'focus:border-red'}`"
            type="password"
            v-model="toPostUser.password_confirmation"
            @blur="verifyConfirmPassword(toPostUser.password, toPostUser.password_confirmation)"
            placeholder="Password"
          />
          <div v-if="adminCreate">
            <div class="flex items-center justify-between py-1">Role
              <span v-if="!toPostUser.role_id" class="bg-red-500 p-1 ml-4 rounded">Required</span>
            </div>
            <select 
              v-model="toPostUser.role_id"
              class="appearance-none w-full mb-4 bg-white border-b border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 text-gray-800 rounded shadow leading-tight focus:outline-none"
              :class="`${toPostUser.role_id !== '' ? 'focus:border-yellow-500' :'focus:border-red-600'}`"
            >
              <option value disabled selected>Select Role</option>
              <option v-for="(role, index) in adminRoles "
              :key="index"
              :value="role.id">
                {{ role.name }}
              </option>
            </select>
          </div>
          <button
            class="inline-flex font-semibold no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg float-left"
            @click.prevent="checkForm(toPostUser,toPostUser.surgery_id)"
          >Create</button>
        </div>
      </div>
    </div>
    <nuxt-child />
  </div>
</template>

<script>
import AppFilterSearch from "@/components/Base/AppFilterSearch";
export default {
  components: {
    AppFilterSearch
  },
  props: ["practice", "surgery", "user", "adminCreate", "userCount"],
  data() {
    return {
      emailError: "",
      firstNameError: "",
      lastNameError: "",
      passwordError: "",
      confirmPasswordError: "",
      errors: [],
      specificSurgery: [],
      specificPractice: [],
      practiceTypes: "",
      multiple: "true",
      adminRoles:[],
      toPostUser: {
        email: "",
        password: "",
        password_confirmation: "",
        title: "",
        first_name: "",
        last_name: "",
        suffix: "",
        practice_role: "Partner",
        type: "Hub",
        practice_type_id: [],
        parent_surgery_id: "",
        surgery_id: `${this.surgery ? this.surgery.id : ""}`,
        role_id: ''
      }
    };
  },
  async created() {
    console.log("Route name: ",this.$route.name) 
    console.log("surgery", this.surgery);
    console.log("practice", this.practice);
    await this.$axios
      .$get(`/api/v1/admin/practice-types`)
      .then(res => {
        this.practiceTypes = [];
        res.data.practice_types.forEach(item => {
          this.practiceTypes.push({ value: item.id, label: item.name });
        });
      })
      .catch(err => {
        store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: "Something went wrong!"
        });
      });
    await this.$axios
      .$get(`/api/v1/admin/admin-roles`)
      .then(res => {
        this.adminRoles = res.data.roles
      })
    console.log("prac types", this.practiceTypes);
    if (this.practice) {
      console.log("Practice to be created is a spoke");
    }
  },

  methods: {
    getQuery() {
      const query = {
        ...this.$route.query
      };
      const offset = parseInt(query.page) * 8 - 8;
      return offset;
    },
    getPractices() {
      this.$store.dispatch("practices/fetchPractices", {
        limit: 8,
        order_by: "created_at:desc"
      });
    },
    getPracticeUsers() {
      this.$store.dispatch("practices/fetchPractices", {
        countOnly: true,
        limit: 5,
        practice_id: this.practice ? this.practice.id : ""
      });
      this.$store.dispatch("practices/fetchPracticeUsers", {
        limit: 5,
        practice_id: this.practice ? this.practice.id : "",
        order_by: "created_at:desc"
      });
    },
    getAdminUsers() {
      this.$store.dispatch("adminusers/fetchAdminUsersCount", {});
      this.$store.dispatch("adminusers/fetchAdminUsers", {
        limit: 8
      });
      this.$store.commit("adminusers/ADD_ADMIN_USER", this.toPostUser);
    },
    updatePracticeUsersPageCount() {
      let payload = {
        userCount: this.userCount,
        perPage: 5
      };
      console.log("payload", payload);
      this.$store.commit("practices/UPDATE_PRACTICE_USERS_PAGE_COUNT", payload);
    },
    verifyEmail: function(inputEmail) {
      this.emailError = "";

      if (!inputEmail) {
        this.emailError = "Required";
      } else if (!this.validEmail(inputEmail)) {
        this.emailError = "Please input a Valid E-Mail Address";
      }
    },
    verifyFirstName: function(inputFirstName) {
      this.firstNameError = "";

      if (!inputFirstName) {
        this.firstNameError = "Required";
      }
    },
    verifyLastName: function(inputLastName) {
      this.lastNameError = "";

      if (!inputLastName) {
        this.lastNameError = "Required";
      }
    },

    verifyPassword: function(inputPassword) {
      this.passwordError = "";

      if (!inputPassword) {
        this.passwordError = "Please type your password.";
      } else if (inputPassword < 6) {
        this.passwordError = "Password must be at least 6 characters";
      }
    },

    verifyConfirmPassword: function(inputPassword, inputConfirmPassword) {
      this.confirmPasswordError = "";

      if (!inputConfirmPassword) {
        this.confirmPasswordError = "Please type again your new password.";
      } else if (inputConfirmPassword !== inputPassword) {
        this.confirmPasswordError = "Passwords do not match";
      } else if (inputPassword < 6 || inputConfirmPassword < 6) {
        this.confirmPasswordError = "Password must be at least 6 characters";
      }
    },

    checkForm: function(userInfo, surgID) {
      this.errors = [];
      if (!userInfo.first_name) {
        this.errors.push("Please input your First Name.");
      }

      if (!userInfo.last_name) {
        this.errors.push("Please input your Last Name");
      }

      if (!userInfo.email) {
        this.errors.push("Please input your E-mail");
      } else if (!this.validEmail(userInfo.email)) {
        this.errors.push("Please input a Valid E-Mail Address");
      }

      if (!userInfo.password) {
        userInfo.password = "";
        this.errors.push("Please type your new password.");
      }

      if (!userInfo.password_confirmation) {
        userInfo.password_confirmation = "";
        this.errors.push("Please type again your new password.");
      }

      if (userInfo.password_confirmation !== userInfo.password) {
        this.errors.push("Please ensure that inputted passwords match.");
      }

      if (userInfo.password.length < 6 || userInfo.password_confirmation < 6) {
        this.errors.push("Password must be at least 6 characters");
      }

      if (!this.errors.length) {
        this.toPostUserInfo(userInfo, surgID);
      }
    },

    validEmail: function(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    async getPracticeTypes() {
      await this.$axios.$get(`/api/v1/admin/practice-types`).then(res => {
        this.practiceTypes = [];
        res.data.practice_types.forEach(item => {
          this.practiceTypes.push({ label: item.name, value: item.id });
        });
      });
      console.log("practice types", this.practiceTypes);
    },

    async toPostUserInfo(toPostUser, toPostSurgeryID) {
      try {
        if (
          (this.surgery && this.surgery.practice_count < 1) ||
          (this.practice && this.practice.user_count < 1)
        ) {
          //Create new practice
          console.log("this surgery is new");
          this.toPostUser.practice_type_id = await this.toPostUser.practice_type_id.map(
            item => item.value
          );
          await this.$axios
            .post(`/api/v1/admin/practices`, toPostUser)
            .then(res => {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: "New Practice User Created"
              });
            this.$emit('userCreated')
            })
            .catch(err => {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: "Something Went Wrong!"
              });
            });
          await this.getPractices();
        } else if (
          (this.surgery && this.surgery.practice_count > 0) ||
          (this.practice && this.practice.user_count > 0)
        ) {
          //Add user to the practice
          console.log("this surgery is registered. user is being added");
          await this.$axios
            .post(`/api/v1/admin/practice-users`, toPostUser)
            .then(res => {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: "Added new user"
              });
            this.$emit('userCreated')
            })
            .catch(err => {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: "Something Went Wrong!"
              });
            });
          await this.getPracticeUsers();
          await this.updatePracticeUsersPageCount();
        } else if (this.adminCreate == true) {
          //Create New Admin
          console.log("new admin is being created");
          await this.$axios
            .post(`/api/v1/admin/admin-users`, toPostUser)
            .then(res => {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: "New Admin Account Successfully Created"
              });
            this.$emit('userCreated')
            })
            .catch(err => {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: "Something Went Wrong!"
              });
            });
          await this.getAdminUsers();
        }
      } catch (err) {
        store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: "Something went wrong!"
        });
        console.log("index put locum detail compliance documents error.", err);
      }
    }
  }
};
</script>

<style>
</style>
