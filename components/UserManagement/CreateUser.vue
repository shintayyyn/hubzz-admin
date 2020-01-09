<template>
  <div class="absolute top-0 bottom-0 right-0 left-0 flex flex-col p-4 md:p-8">
    <div class="flex justify-between text-sm text-white">
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
      <div class="text-white pt-2">
        <div class="text-lg font-bold">Create User</div>
        <div v-if="surgery" class="text-xs font-hairline">
          Surgery: {{ surgery.name }}
        </div>
      </div>

      <div class="flex text-white my-4 py-2 px-3 bg-waterloo-dark shadow rounded-lg text-sm max-w-lg">
        <div class="w-full text-gray-300 text-sm p-2">
          <!-- USER PERSONAL DETAILS -->
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
          <!-- USER PERSONAL DETAILS ENDS HERE -->

          <!-- PRACTICE DETAILS ; IF PRACTICE IS BEING CREATED -->
          <template v-if="surgery && !practice">
            <template v-if="surgery && surgery.practice_count < 1">
              <AppInput 
                v-model="toPostUser.type"
                :type="'select'"
                :label="'Type'"
                :items="[{label: 'Hub', value: 'Hub'}, {label: 'Stand Alone', value: 'Stand Alone'}, {label: 'Spoke', value: 'Spoke'}]"
              />
              <template v-if="toPostUser.type == 'Hub'">
                <AppInput 
                  v-model="toPostUser.hub_type"
                  :type="'select'"
                  :label="'Hub Type'"
                  :items="[{label: 'Type 1', value: 'Type 1'}, {label: 'Type 2', value: 'Type 2'}]"
                />
              </template>
            </template>
            <AppInput 
              v-model="toPostUser.code"
              :type="'text'"
              :label="'Surgery Code'"
              :placeholder="'Surgery Code'"
              :error="formError.find(item => item.field === 'code')"
              @blur="CheckEmptyField(toPostUser.code, 'code')"
            />
            <AppInput 
              v-model="toPostUser.name"
              :type="'text'"
              :label="'Surgery Name'"
              :placeholder="'Surgery Name'"
              :error="formError.find(item => item.field === 'name')"
              @blur="CheckEmptyField(toPostUser.name, 'name')"
            />
            <AppInput 
              v-model="toPostUser.phone_number"
              :type="'text'"
              :label="'Phone Number'"
              :placeholder="'Phone Number'"
              :error="formError.find(item => item.field === 'phone_number')"
              @blur="CheckEmptyField(toPostUser.phone_number, 'phone_number')"
            />
            <AppInput 
              v-model="toPostUser.address_line_1"
              :type="'text'"
              :label="'Surgery Address - Line 1'"
              :placeholder="'Surgery Address - Line 1'"
              :error="formError.find(item => item.field === 'address_line_1')"
              @blur="CheckEmptyField(toPostUser.address_line_1, 'address_line_1')"
            />
            <AppInput 
              v-model="toPostUser.address_line_2"
              :type="'text'"
              :label="'Surgery Address - Line 2'"
              :placeholder="'Surgery Address - Line 2'"
              :error="formError.find(item => item.field === 'address_line_2')"
              @blur="CheckEmptyField(toPostUser.address_line_2, 'address_line_2')"
            />
            <AppInput 
              v-model="toPostUser.address_line_3"
              :type="'text'"
              :label="'Surgery Address - Line 3'"
              :placeholder="'Surgery Address - Line 3'"
              :error="formError.find(item => item.field === 'address_line_3')"
              @blur="CheckEmptyField(toPostUser.address_line_3, 'address_line_3')"
            />
            <!-- <AppInput 
              v-model="toPostUser.postcode"
              :type="'select'"
              :label="'Post Code'"
              :items="postCodes"
            /> -->
            <AppPostCode
              v-model="toPostUser.postcode"
              :name="'postcode'"
              :label="'Post code'"
              :error="formError.find(item => item.field === 'postcode')"
              :inStyle="'background-color:#dae1e7;border-color:white'"
              @blur="CheckEmptyField(toPostUser.postcode, 'postcode')"
            />
            Coordinate X {{toPostUser.coordinate_x}} Coordinate Y{{toPostUser.coordinate_y}}
            <AppInput 
              v-model="toPostUser.clinical_commissioning_group_name"
              :type="'text'"
              :label="'Clinical Commissioning Group'"
              :placeholder="'Doe'"
              :error="formError.find(item => item.field === 'clinical_commissioning_group_name')"
              @blur="CheckEmptyField(toPostUser.clinical_commissioning_group_name, 'clinical_commissioning_group_name')"
            />
            <AppFilterSearch
              v-model="toPostUser.practice_type_id"
              :name="'practice_type_id'"
              :label="'Practice Types'"
              :placeholder="'Select...'"
              :error="formError.find(item => item.field === 'practice_type_id')"
              :items="practiceTypes"
              @add="CheckEmptyField(toPostUser.practice_type_id, 'practice_type_id')"
              @remove="CheckEmptyField(toPostUser.practice_type_id, 'practice_type_id')"
            />
            <AppInput 
              v-model="toPostUser.practice_role"
              :type="'select'"
              :label="'Role'"
              :items="[{label: 'Partner', value: 'Partner'}, {label: 'Practice Manager', value: 'Practice Manager'}, {label: 'Practice Staff', value: 'Practice Staff'}]"
              :error="formError.find(item => item.field === 'practice_role')"
              @blur="CheckEmptyField(toPostUser.practice_role, 'practice_role')"
            />
          </template>
          <!-- PRACTICE DETAILS ; IF PRACTICE IS BEING CREATED -->

          <!-- EMAIL ADDRESS AND PASSWORD - FOR USER CREDENTIALS  -->
          <AppInput
            v-model="toPostUser.email"
            :type="'email'"
            :label="'E-Mail Address'"
            :placeholder="'example@example.com'"
            :error="formError.find(item => item.field === 'email')"
            @blur="CheckEmptyField(toPostUser.email, 'email')"
          />
          
          <div class="flex flex-col b rounded-lg">
            <div class="">
              <button
               @click="generateRandomPassword()" class="flex p-2 bg-white text-black rounded-lg">
               <span class="px-2 pt-1"> Generate Random Password</span> 
                <svgicon
                  name="dices" 
                  width="30" 
                  height="30"
                  color="black"
                />
              </button>
            </div>
            <div>
              <AppInput
                v-model="toPostUser.password"
                :type="'password'"
                :label="'Password'"
                :placeholder="'Password'"
                :error="formError.find(item => item.field === 'password')"
                @blur="CheckEmptyField(toPostUser.password, 'password')"
              />  
            </div>
            <div>
              <AppInput
                v-model="toPostUser.password_confirmation"
                :type="'password'"
                :label="'Confirm Password'"
                :placeholder="'Confirm Password'"
                :error="formError.find(item => item.field === 'password_confirmation')"
                @blur="CheckEmptyField(toPostUser.password_confirmation, 'password_confirmation')"
              />
            </div>
          </div>
          <!-- EMAIL ADDRESS AND PASSWORD - FOR USER CREDENTIALS  -->

          <!-- PRACTICE USER ROLES ; IF PRACTICE USER FOR A SPECIFIC PRACTICE IS BEING CREATED -->
           <!-- v-if="surgery && surgery.practice_count > 0 && practice && practice.user_count > 0" -->
          <AppInput
            v-if="surgery && surgery.practice_count > 0 && practice && practice.user_count > 0"
            v-model="toPostUser.practice_user_role_id"
            :type="'select'"
            :label="'Practice Role'"
            :error="
              formError.find(item => item.field === 'practice_user_role_id')
            "
            :items="practice_user_roles"
          />
          <!-- PRACTICE USER ROLES ; IF PRACTICE USER FOR A SPECIFIC PRACTICE IS BEING CREATED -->

          <!-- ADMIN ROLES ; IF ADMIN IS BEING CREATED -->
          <AppFilterSearch
            v-if="adminCreate"
            v-model="toPostUser.roles_id"
            :name="'roles_id'"
            :label="'Admin Role/s'"
            :placeholder="'Select...'"
            :error="formError.find(item => item.field === 'roles_id')"
            :items="adminRoles"
            @add="CheckEmptyField(toPostUser.roles_id, 'roles_id')"
            @remove="CheckEmptyField(toPostUser.roles_id, 'roles_id')"
          />
          <!-- ADMIN ROLES ; IF ADMIN IS BEING CREATED -->

          <AppButton :label="'Create'" @click="checkForm(toPostUser, toPostUser.surgery_id)"/>
         </div>
      </div>

    </div>
    <nuxt-child />
  </div>
</template>
<script>
import debounce from "lodash.debounce";
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppFilterSearch from "@/components/Base/AppFilterSearch";
import AppPostCode from "@/components/Base/AppPostCode"
export default {
  components: {
    AppFilterSearch,
    AppInput,
    AppButton,
    AppPostCode,
  },
  props: ["practice", "surgery", "user", "adminCreate", "userCount"],
  data() {
    return {
      formError: [],
      specificSurgery: [],
      specificPractice: [],
      practiceTypes: [],
      multiple: "true",
      adminRoles: [],
      coordinates: "",
      postCodes: [],
      practice_user_roles: [],
      toPostUser: {
        // USER PERSONAL DETAILS
        title: "",
        first_name: "",
        last_name: "",
        suffix: "",

        //  PRACTICE DETAILS ; IF PRACTICE IS BEING CREATED
        practice_role: `${this.surgery ? "Partner" : ""}`,
        type: `${this.surgery ? "Hub" : ""}`,
        hub_type: `${this.surgery ? "Type 1" : ""}`,
        code: `${this.surgery ? this.surgery.code : ""}`,
        name: `${this.surgery ? this.surgery.name : ""}`,
        phone_number: `${this.surgery ? this.surgery.phone_number : ""}`,
        address_line_1: `${this.surgery ? this.surgery.address_line_1 : ""}`,
        address_line_2: `${this.surgery ? this.surgery.address_line_2 : ""}`,
        address_line_3: `${this.surgery ? this.surgery.address_line_3 : ""}`,
        postcode: `${this.surgery ? this.surgery.postcode : ""}`,
        coordinate_x: "",
        coordinate_y: "",
        clinical_commissioning_group_name: `${this.surgery ? this.surgery.clinical_commissioning_group_name : ""}`,
        practice_type_id: [],
        surgery_id: `${this.surgery ? this.surgery.id : ""}`,

        // USER CREDENTIALS
        email: "",
        password: "",
        password_confirmation: "",

        // FOR ADMIN ROLES ; IF ADMIN IS BEING CREATED
        roles_id: [],

        // IF PRACTICE USER IS BEING CREATED FOR PRACTICE
        practice_id: `${this.practice ? this.practice.id : ""}`,
        practice_user_role_id: ''
      },

      showPasswordFocus: false,
    };
  },

  async created() {
    if(this.surgery){
      await this.$axios
      .$post(`/api/v1/postcode-to-coordinates`,{ postcode: this.surgery.postcode})
      .then(res => {
        this.toPostUser.coordinate_x = res.data.postcode_coordinate.coordinate_x,
        this.toPostUser.coordinate_y = res.data.postcode_coordinate.coordinate_y
      })
      .catch(err => {
        store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: err.response.data.message
        });
      })
    }

    if(this.practice && this.userCount > 0) {
      await this.$axios
      .$get(`/api/v1/admin/practices/${this.practice.id}/practice-roles`)
      .then(res => {
        res.data.roles.forEach(role => {
          this.practice_user_roles.push({ label: role.name, value: role.id})
        })
      })
      .catch(err => {
        store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: err.response.data.message
        });
      })
    }
    
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
          text: err.response.data.message
        });
      });
    await this.$axios.$get(`/api/v1/admin/admin-roles`).then(res => {
      res.data.roles.forEach(item => {
        this.adminRoles.push({value: item.id, label: item.name})
      })
      let default_role = res.data.roles.find((item, index) => index === 0)
    });

   await this.$axios.$get(`/api/v1/postcode-coordinates`).then(res => {
      res.data.postcode_coordinates.forEach(item => {
        this.postCodes.push({value: item.postcode, label: item.postcode})
      })
      // let default_post_code = res.data.roles.find((item, index) => index === 0)
    })
    // console.log('practice details', this.toPostUser)
    // if (this.practice) {
    //   console.log("Practice to be created is a spoke");
    // }

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
          item => item.field === "password"
        );
        let error = this.formError.filter(
          item => item.field === "password"
        );
        // console.log("pass", index, value.length, index >= 0 || value.length >= 6)
        if (index >= 0 || value.length >= 6) {
          this.formError.splice(index, error.length);
        }
      }
      if(this.toPostUser.password_confirmation){
        const error = this.ValidateSamePassword(value, this.toPostUser.password_confirmation);
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
    },
    "toPostUser.postcode"(value) {
      this.$axios.$get(`/api/v1/postcode-coordinates?search=${value}`)
      .then(res => {
        this.toPostUser.coordinate_x  = res.data.postcode_coordinates[0] ? res.data.postcode_coordinates[0].coordinate_x : null
        this.toPostUser.coordinate_y = res.data.postcode_coordinates[0] ? res.data.postcode_coordinates[0].coordinate_y : null
      })
    }
  },

  methods: {
    getPostCodes: debounce(function(input) {
      const params = {
        postcode: input
      };
      this.$axios.$post(`/api/v1/postcode-to-coordinates`, { params })
      .then(res => {
        
      }).catch(err => {

      })
    }, 250),
    getQuery() {
      const query = {
        ...this.$route.query
      };
      const offset = parseInt(query.page) * 10 - 10;
      return offset;
    },
    getPractices() {
      this.$store.dispatch("practices/fetchPractices", {
        limit: 10,
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
        limit: 10
      });
      this.$store.commit("adminusers/ADD_ADMIN_USER", this.toPostUser);
    },
    updatePracticeUsersPageCount() {
      let payload = {
        userCount: this.userCount,
        perPage: 5
      };
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
      let list = ["title", "suffix",];
      !this.adminCreate && list.push("roles_id");
      if(!this.practice){
        list.push("practice_user_role_id","practice_id")
      }
      // this.adminCreate || this.practice && 
      if(this.adminCreate || this.practice){
        list.push(
          "practice_type_id",
          "surgery_id", 
          "practice_role",
          "type",
          "hub_type",
          "code",
          "name",
          "phone_number",
          "address_line_1",
          "address_line_2",
          "address_line_3",
          "postcode",
          "coordinate_x",
          "coordinate_y",
          "clinical_commissioning_group_name",
        )
      }
        
      this.Validate(this.toPostUser, list);
      console.log('form error',this.formError)
      if (!this.formError.length) {
        this.toPostUserInfo(userInfo, surgID);
      }
    },

    togglePassword(){
      if (this.passwordToggle) {
        return 'text'
      }else{
        return 'password'
      }
    },

    generateRandomPassword () {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!&*'.split('')
      const password = Array(6).fill().map(() => chars[Math.floor(Math.random() * chars.length)]).join('')
      this.toPostUser.password = password
      this.toPostUser.password_confirmation = password
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
    
    async getAdminRoles() {
      await this.$axios.$get(`/api/v1/admin/admin-roles`).then(res => {
        this.adminRoles = []
        res.data.roles.forEach(item => {
          this.adminRoles.push({ label: item.name, value: item.id})
        })
      })
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
          if(!toPostUser.coordinate_x || !toPostUser.coordinate_y){
            await this.$axios.$post(`/api/v1/postcode-to-coordinates`,{postcode:toPostUser.postcode})
            .then(res => {
              toPostUser.coordinate_x = res.data.postcode_coordinate.coordinate_x,
              toPostUser.coordinate_y = res.data.postcode_coordinate.coordinate_y
            }).catch(err => {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: err.response.data.message
              });
            })
            await this.$axios
              .post(`/api/v1/admin/practices`, toPostUser)
              .then(res => {
                this.$store.commit("SET_NOTIFICATION", {
                  enabled: true,
                  status: "success",
                  text: "New Practice User Created"
                });
                this.$emit("userCreated");
                this.$router.push('/practices/pending-practices')
              })
              .catch(err => {
                this.$store.commit("SET_NOTIFICATION", {
                  enabled: true,
                  status: "danger",
                  text: err.response.data.message
                });
              });
            await this.getPractices();
            
          }else{
            await this.$axios
              .post(`/api/v1/admin/practices`, toPostUser)
              .then(res => {
                this.$router.push('/practices/pending-practices')
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
                  text: err.response.data.message
                });
              });
            await this.getPractices();
          }
        } else if (
          (this.surgery && this.surgery.practice_count > 0) ||
          (this.practice && this.practice.user_count > 0)
        ) {
          //Add user to the practice
          console.log("this surgery is registered. user is being added", this.surgery);
          console.log('user', toPostUser)
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
                text: err.response.data.message
              });
            });
          await this.getPracticeUsers();
          await this.updatePracticeUsersPageCount();
        } else if (this.adminCreate == true) {
          //Create New Admin
          console.log("new admin is being created");
          this.toPostUser.roles_id = this.toPostUser.roles_id.map(
            item => item.value
          );
          console.log('to post user', toPostUser)
          await this.$axios
            .post(`/api/v1/admin/admin-users`, toPostUser)
            .then(res => {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: "New Admin Account Successfully Created"
              });
              this.getAdminUsers();
              this.$emit("userCreated");
              this.$emit("close");
            })
            .catch(err => {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: err.response.data.message
              });
            });
        }
      } catch (err) {
        store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: err.response.data.message
        });
        console.log("index put locum detail compliance documents error.", err);
      }
    }
  }
};
</script>

<style></style>
