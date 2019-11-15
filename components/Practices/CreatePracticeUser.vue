<template>
  <div class="absolute top-0 bottom-0 right-0 left-0 flex flex-col">
    <div class="flex justify-between text-sm text-white py-2 px-6">
      <div @click="$emit('close')" class="cursor-pointer">
        <svgicon
          name="arrow-left-solid"
          height="32"
          width="32"
          class="text-white hover:text-sunglow fill-current"
        />
      </div>
    </div>
    <div class="">
      <div class="text-white pl-4 pt-2">
        <div
          class="text-lg font-bold"
          v-if="practice && practice.type == 'Hub'"
        >
          Create Spoke User
        </div>
        <div class="text-lg font-bold" v-else>Create User</div>
        <div v-if="surgery" class="text-xs font-hairline">
          Surgery: {{ surgery.name }}
        </div>
      </div>

      <div
        class="flex text-white m-4 py-2 px-3 bg-waterloo-dark shadow rounded-lg text-sm max-w-lg"
      >
        <div class="w-full overflow-hidden text-gray-300 text-sm p-2">
          <AppInput 
            v-model="toPostUser.title"
            :type="'text'"
            :label="'Title'"
            :placeholder="'Mr. / Mrs. / Dr. / etc.....'"
          />
          <AppInput 
            v-model="toPostUser.first_name"
            :type="'text'"
            :label="'First Name'"
            :placeholder="'Jane'"
            :error="formError.find(item => item.field === 'first_name')"
            @blur="CheckEmptyField(toPostUser.first_name, 'first_name')"
          />
          <AppInput 
            v-model="toPostUser.last_name"
            :type="'text'"
            :label="'Last Name'"
            :placeholder="'Doe'"
            :error="formError.find(item => item.field === 'last_name')"
            @blur="CheckEmptyField(toPostUser.last_name, 'last_name')"
          />
          <AppInput 
            v-model="toPostUser.suffix"
            :type="'text'"
            :label="'Suffix'"
            :placeholder="'Ph.D'"
          />
          <div
            v-if="surgery && surgery.practice_count < 1"
            class="flex flex-col py-1 mt-2"
          >
            <div class="relative pb-1">
              <span>Practice Types </span>
              <span class="text-xs">(hold ctrl + click to choose)</span>
            </div>
            <select
              class="w-full text-black focus:outline-none"
              multiple="true"
              v-bind:class="{ 'fix-height': multiple === 'true' }"
              v-model="toPostUser.practice_type_id"
              @blur="
                CheckEmptyField(toPostUser.practice_type_id, 'practice_type_id')
              "
            >
              <option
                class="px-2 py-1"
                v-for="item in practiceTypes"
                :key="item.id"
                :value="item"
                >{{ item.label }}</option
              >
            </select>
            <div
              v-if="formError.filter(item => item.field === 'practice_type_id')"
              class="text-red-500 text-xs pt-1"
            >
              {{ errorMessage("practice_type_id") }}
            </div>
            <div class="flex items-start flex-wrap py-1">
              <div
                v-for="(practice_type, index) in toPostUser.practice_type_id"
                :key="`practice_type-${index}`"
                class="inline-flex items-center mt-1 mr-2 bg-yellow-500 rounded-lg p-2 text-black"
              >
                <!-- {{toPostUser.practice_type_id[index].label}} -->
              </div>
            </div> 
          </div>

          <template v-if="surgery">
            <AppInput 
              v-model="toPostUser.practice_role"
              :type="'select'"
              :label="'Role'"
              :items="[{label: 'Partner', value: 'Partner'}, {label: 'Practice Manager', value: 'Practice Manager'}, {label: 'Practice Staff', value: 'Practice Staff'}]"
              :error="formError.find(item => item.field === 'practice_role')"
              @blur="CheckEmptyField(toPostUser.practice_role, 'practice_role')"
            />
          </template>
          <template v-if="surgery && surgery.practice_count < 1">
            <AppInput 
              v-model="toPostUser.type"
              :type="'select'"
              :label="'Type'"
              :items="[{label: 'Hub', value: 'Hub'}, {label: 'Stand Alone', value: 'Stand Alone'}, {label: 'Spoke', value: 'Spoke'}]"
            />
          </template>
          <AppInput
            v-model="toPostUser.email"
            :type="'email'"
            :label="'E-Mail Address'"
            :placeholder="'example@example.com'"
            :error="formError.find(item => item.field === 'email')"
            @blur="CheckEmptyField(toPostUser.email, 'email')"
          />

          <AppInput
            v-model="toPostUser.password"
            :type="'password'"
            :label="'Password'"
            :placeholder="'Password'"
            :error="formError.find(item => item.field === 'password')"
            @blur="CheckEmptyField(toPostUser.password, 'password')"
          />

          <AppInput
            v-model="toPostUser.password_confirmation"
            :type="'password'"
            :label="'Confirm Password'"
            :placeholder="'Confirm Password'"
            :error="formError.find(item => item.field === 'password_confirmation')"
            @blur="CheckEmptyField(toPostUser.password_confirmation, 'password_confirmation')"
          />
          <AppInput 
            v-if="adminCreate"
            v-model="toPostUser.role_id"
            :type="'select'"
            :label="'Type'"
            :items="adminRoles"
            :error="formError.find(item => item.field === 'role_id')"
            @blur="CheckEmptyField(toPostUser.role_id, 'role_id')"
          />
          <button
            class="inline-flex font-semibold no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg float-left"
            @click.prevent="checkForm(toPostUser, toPostUser.surgery_id)"
          >
            Create
          </button>
        </div>
      </div>
    </div>
    <nuxt-child />
  </div>
</template>

<script>
import AppInput from "@/components/Base/AppInput";
import AppFilterSearch from "@/components/Base/AppFilterSearch";
export default {
  components: {
    AppFilterSearch,
    AppInput
  },
  props: ["practice", "surgery", "user", "adminCreate", "userCount"],
  data() {
    return {
      formError: [],
      specificSurgery: [],
      specificPractice: [],
      practiceTypes: "",
      multiple: "true",
      adminRoles: [],
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
        surgery_id: `${this.surgery ? this.surgery.id : ""}`,
        role_id: ""
      }
    };
  },
  async created() {
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
    await this.$axios.$get(`/api/v1/admin/admin-roles`).then(res => {
      this.adminRoles = res.data.roles;
    });
    console.log("prac types", this.practiceTypes);
    if (this.practice) {
      console.log("Practice to be created is a spoke");
    }
  },

  watch: {
    "toPostUser.email"(value) {
      const error = this.ValidateEmail(value);
      if (error) {
        this.formError.push(error);
      } else {
        let index = this.formError.findIndex(item => item.field === "email");
        let errors = this.formError.filter(item => item.field === "email");
        if (index >= 0) {
          this.formError.splice(index, errors.length);
        }
      }
    },
    "toPostUser.password"(value) {
      if (value && value.length < 6) {
        this.formError.push({
          field: "password",
          message: "Password Must Be Atleast 6 Characters"
        });
      } else {
        let index = this.formError.findIndex(
          item => item.message === "Password Must Be Atleast 6 Characters"
        );
        let error = this.formError.filter(
          item => item.message === "Password Must Be Atleast 6 Characters"
        );
        if (index >= 0) {
          this.formError.splice(index, error.length);
        }
      }
    },
    "toPostUser.password_confirmation"(value) {
      const error = this.ValidateSamePassword(this.toPostUser.password, value);
      if (error) {
        this.formError.push(error);
      } else {
        let index = this.formError.findIndex(
          item => item.field === "password_confirmation"
        );
        let errors = this.formError.filter(
          item => item.field === "password_confirmation"
        );
        if (index >= 0) {
          this.formError.splice(index, errors.length);
        }
      }
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
    errorMessage(field) {
      if (this.formError.find(error => error.field === field.toString())) {
        let error = this.formError.find(
          error => error.field === field.toString()
        );
        return error.message.charAt(0).toUpperCase() + error.message.slice(1).replace(/_/g, " ")
      }
      return;
    },
    checkForm: function(userInfo, surgID) {
      this.formError = [];
      let list = ["title", "suffix"];
      !this.adminCreate && list.push("role_id");
      this.adminCreate && list.push("practice_type_id", "surgery_id");
      this.Validate(this.toPostUser, list);
      console.log(userInfo.type, this.formError);
      if (!this.formError.length) {
        this.toPostUserInfo(userInfo, surgID);
      }
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
              this.$emit("userCreated");
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
              this.$emit("userCreated");
              this.$emit("close");
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
              this.$emit("userCreated");
              this.$emit("close");
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

<style></style>
