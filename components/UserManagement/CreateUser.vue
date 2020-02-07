<template>
  <div class="flex flex-col p-4 md:p-8" >
    <!-- class="absolute top-0 bottom-0 right-0 left-0 flex flex-col p-4 md:p-8" -->
    <div v-if="registeeType !== 'customSurgery'" class="flex justify-between text-sm text-white">
      <div @click="$emit('close')" class="cursor-pointer">
        <svgicon
          name="arrow-left-solid"
          height="32"
          width="32"
          class="text-white hover:text-sunglow fill-current"
        />
      </div>
    </div>
    <div class="py-4">
      <div class="text-white">
        <div class="text-lg font-bold">{{registeeType == 'customSurgery' ? 'Create Custom Practice' : 'Create User'}}</div>
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
            required
          />
          <AppInput 
            v-model="toPostUser.last_name"
            :type="'text'"
            :label="'Last Name'"
            :placeholder="'Doe'"
            :error="formError.find(item => item.field === 'last_name')"
            @blur="CheckEmptyField(toPostUser.last_name, 'last_name')"
            required
          />
          <AppInput 
            v-model="toPostUser.suffix"
            :type="'text'"
            :label="'Suffix'"
            :placeholder="'Ph.D'"
          />
          <!-- USER PERSONAL DETAILS ENDS HERE -->

          <!-- PRACTICE DETAILS ; IF PRACTICE IS BEING CREATED -->
           <template v-if=" registeeType == 'customSurgery' || registeeType == 'newPractice'">
            <AppInput 
              v-model="toPostUser.type"
              :type="'select'"
              :label="'Type'"
              :items="[{label: 'Hub', value: 'Hub'}, {label: 'Stand Alone', value: 'Stand Alone'}, {label: 'Spoke', value: 'Spoke'}]"
              required
            />
            <template v-if="toPostUser.type == 'Hub'">
              <AppInput 
                v-model="toPostUser.hub_type"
                :type="'select'"
                :label="'Hub Type'"
                :items="[{label: 'Type 1', value: 'Type 1'}, {label: 'Type 2', value: 'Type 2'}]"
                required
              />
            </template>
            <AppInput 
              v-model="toPostUser.code"
              :type="'text'"
              :label="'Surgery Code'"
              :placeholder="'Surgery Code'"
              :error="formError.find(item => item.field === 'code')"
              @blur="CheckEmptyField(toPostUser.code, 'code')"
              required
            />
            <AppInput 
              v-model="toPostUser.name"
              :type="'text'"
              :label="'Surgery Name'"
              :placeholder="'Surgery Name'"
              :error="formError.find(item => item.field === 'name')"
              @blur="CheckEmptyField(toPostUser.name, 'name')"
              required
            />
            <AppInput 
              v-model="toPostUser.phone_number"
              :type="'text'"
              :label="'Phone Number'"
              :placeholder="'Phone Number'"
              :error="formError.find(item => item.field === 'phone_number')"
              @blur="CheckEmptyField(toPostUser.phone_number, 'phone_number')"
              required
            />
            <AppInput 
              v-model="toPostUser.address_line_1"
              :type="'text'"
              :label="'Surgery Address - Line 1'"
              :placeholder="'Surgery Address - Line 1'"
              :error="formError.find(item => item.field === 'address_line_1')"
              @blur="CheckEmptyField(toPostUser.address_line_1, 'address_line_1')"
              required
            />
            <AppInput 
              v-model="toPostUser.address_line_2"
              :type="'text'"
              :label="'Surgery Address - Line 2'"
              :placeholder="'Surgery Address - Line 2'"
              :error="formError.find(item => item.field === 'address_line_2')"
              @blur="CheckEmptyField(toPostUser.address_line_2, 'address_line_2')"
              required
            />
            <AppInput 
              v-model="toPostUser.address_line_3"
              :type="'text'"
              :label="'Surgery Address - Line 3'"
              :placeholder="'Surgery Address - Line 3'"
              :error="formError.find(item => item.field === 'address_line_3')"
              @blur="CheckEmptyField(toPostUser.address_line_3, 'address_line_3')"
              required
            />
            <AppInput 
              v-model="toPostUser.address_line_4"
              :type="'text'"
              :label="'Surgery Address - Line 4'"
              :placeholder="'Surgery Address - Line 4'"
            />
            <AppInput 
              v-model="toPostUser.address_line_5"
              :type="'text'"
              :label="'Surgery Address - Line 5'"
              :placeholder="'Surgery Address - Line 5'"
            />
            
            <!-- <AppInput 
              v-model="toPostUser.postcode"
              :type="'select'"
              :label="'Post Code'"
              :items="postCodes"
            /> -->
            <AppPostCode
              :urlIndex="'/api/v1/postcode-coordinates'"
              v-model="toPostUser.postcode"
              :name="'postcode'"
              :label="'Post code'"
              :error="formError.find(item => item.field === 'postcode')"
              
              @blur="CheckEmptyField(toPostUser.postcode, 'postcode')"
              required
            />
            Coordinate X {{toPostUser.coordinate_x}} Coordinate Y{{toPostUser.coordinate_y}}
            <AppInput 
              v-model="toPostUser.clinical_commissioning_group_name"
              :type="'text'"
              :label="'Clinical Commissioning Group'"
              :placeholder="'Clinical Comissioning Group'"
              :error="formError.find(item => item.field === 'clinical_commissioning_group_name')"
              @blur="CheckEmptyField(toPostUser.clinical_commissioning_group_name, 'clinical_commissioning_group_name')"
            />
            <AppInput
                v-model="toPostUser.practice_type_id"
                :type="'multi-checkbox'"
                :error="formError.find(item => item.field === 'practice_type_id')"
                @checked="toPostUser.practice_type_id.push($event)"
                @unchecked="uncheckPractice($event)"
                :name="'practice_type_id'"
                :label="'Practice Types'"
                :lists="practiceTypes"
                required
              />
          </template>
          <!-- PRACTICE DETAILS ; IF PRACTICE IS BEING CREATED ENDS HERE -->

          <!-- PRACTICE USER ROLES ; IF PRACTICE USER FOR A SPECIFIC PRACTICE IS BEING CREATED -->
          <!-- v-if="surgery && surgery.practice_count > 0 && practice && practice.user_count > 0" -->
          
            <AppInput 
            v-if="registeeType !== 'admin'"
            v-model="toPostUser.practice_role"
            :type="'select'"
            :label="'Role'"
            :placeholder="'Select...'"
            :items="[{label: 'Partner', value: 'Partner'}, {label: 'Practice Manager', value: 'Practice Manager'}, {label: 'Practice Staff', value: 'Practice Staff'}]"
            :error="formError.find(item => item.field === 'practice_role')"
            @blur="CheckEmptyField(toPostUser.practice_role, 'practice_role')"
            required
          />

          <AppInput
            v-if="practice && practice.user_count > 0"
            v-model="toPostUser.practice_user_role_id"
            :type="'select'"
            :label="'Practice User Role'"
            :placeholder="'Select...'"
            :error="
              formError.find(item => item.field === 'practice_user_role_id')
            "
            :items="practice_user_roles"
          />
          <!-- PRACTICE USER ROLES ; IF PRACTICE USER FOR A SPECIFIC PRACTICE IS BEING CREATED -->

          <!-- EMAIL ADDRESS AND PASSWORD - FOR USER CREDENTIALS  -->
          <AppInput
            v-model="toPostUser.email"
            :type="'email'"
            :label="'E-Mail Address'"
            :placeholder="'example@example.com'"
            :error="formError.find(item => item.field === 'email')"
            @blur="CheckEmptyField(toPostUser.email, 'email')"
            required
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
                @blur="validatePassword(toPostUser.password, 'password')"
                required
              />  
            </div>
            <div>
              <AppInput
                v-model="toPostUser.password_confirmation"
                :type="'password'"
                :label="'Confirm Password'"
                :placeholder="'Confirm Password'"
                :error="formError.find(item => item.field === 'password_confirmation')"
                @blur="validatePassword(toPostUser.password_confirmation, 'password_confirmation')"
                required
              />
            </div>
          </div>
          <!-- EMAIL ADDRESS AND PASSWORD - FOR USER CREDENTIALS  -->

          <!-- ADMIN ROLES ; IF ADMIN IS BEING CREATED -->
          <AppInput
            v-if="registeeType === 'admin'"
            v-model="toPostUser.roles_id"
            :type="'multi-checkbox'"
            :error="formError.find(item => item.field === 'roles_id')"
            @checked="addRole($event)"
            @unchecked="uncheckRole($event)"
            :name="'roles_id'"
            :label="'Admin Role/s'"
            :lists="adminRoles"
            required
          />
          <!-- <AppFilterSearch
            v-if="registeeType === 'admin'"
            v-model="toPostUser.roles_id"
            :name="'roles_id'"
            :label="'Admin Role/s'"
            :placeholder="'Select...'"
            :error="formError.find(item => item.field === 'roles_id')"
            :items="adminRoles"
            @add="CheckEmptyField(toPostUser.roles_id, 'roles_id')"
            @remove="CheckEmptyField(toPostUser.roles_id, 'roles_id')"
          /> -->
          <!-- ADMIN ROLES ; IF ADMIN IS BEING CREATED ENDS HERE -->

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
  props: ["practice", "surgery", "user", "registeeType", "userCount", "customSurgery"],
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

        // USER CREDENTIALS
        email: "",
        password: "",
        password_confirmation: "",

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
        address_line_4: `${this.surgery ? this.surgery.address_line_4 : ""}`,
        address_line_5: `${this.surgery ? this.surgery.address_line_5 : ""}`,
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
        practice_user_role_id: '',
      },

      showPasswordFocus: false,
    };
  },

  async created() {
    console.log('registee type', this.registeeType)
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
        this.$store.commit("SET_NOTIFICATION", {
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
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: err.response.data.message
        });
      });
    await this.$axios.$get(`/api/v1/admin/admin-roles`).then(res => {
      res.data.roles.forEach(item => {
        this.adminRoles.push({label: item.name, value: item.id})
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
          this.formError.splice(index, error.length);
      }
      if(this.toPostUser.password_confirmation){
        const error = this.ValidateSamePassword(value, this.toPostUser.password_confirmation);
        if (error) {
          this.formError.push(error);
        } else {
          let confirm_index = this.formError.findIndex(
            item => item.field === "password_confirmation"
          );
          let password_index = this.formError.findIndex(
            item => item.field === "password"
          );
          let errors = this.formError.filter(
            item => ["password", "password_confirmation"].includes(item.field) 
          );
          if (confirm_index >= 0) {
            this.formError.splice(confirm_index, errors.length);
            this.formError.splice(password_index, errors.length);
          }
        }
      }
    },
    "toPostUser.password_confirmation"(value) {
      const error = this.ValidateSamePassword(this.toPostUser.password, value);
      if (error) {
        this.formError.push(error);
      } else {
        let confirm_index = this.formError.findIndex(
            item => item.field === "password_confirmation"
          );
          let password_index = this.formError.findIndex(
            item => item.field === "password"
          );
          let errors = this.formError.filter(
            item => ["password", "password_confirmation"].includes(item.field) 
          );
          if (confirm_index >= 0) {
            this.formError.splice(confirm_index, errors.length);
            this.formError.splice(password_index, errors.length);
          }
      }
    },
    "toPostUser.postcode"(value) {
      this.$axios.$get(`/api/v1/postcode-coordinates?search=${value}`)
      .then(res => {
        this.toPostUser.coordinate_x  = res.data.postcode_coordinates[0] ? res.data.postcode_coordinates[0].coordinate_x : null
        this.toPostUser.coordinate_y = res.data.postcode_coordinates[0] ? res.data.postcode_coordinates[0].coordinate_y : null
      })
    },
  },

  methods: {
    addRole(e){
      this.adminRoles.find(item => {
        if (item.value === parseInt(e)) {
          this.toPostUser.roles_id.push(item)
        }
      })
    },
    validatePassword(field, fieldName) {
      this.CheckEmptyField(field, fieldName)
      this.ValidateSamePassword(this.toPostUser.password, this.toPostUser.password_confirmation)
    },
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
        status: 'Inactive',
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
      let notRequired = ["title", "suffix",];

      this.registeeType !== 'admin' && notRequired.push("roles_id", "address_line_4", "address_line_5",);

      if(this.registeeType !== 'practiceUser'){
        notRequired.push("practice_user_role_id", "practice_id")
      }

      if (this.surgery && this.surgery.practice_count >= 1) {
        notRequired.push("hub_type")
      }
      
      if(this.registeeType === 'customSurgery') {
        notRequired.push("surgery_id", "hub_type")
      }

      if(this.registeeType === 'admin' || this.registeeType === 'practiceUser'){
        notRequired.push(
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
          "address_line_4",
          "address_line_5",
          "postcode",
          "coordinate_x",
          "coordinate_y",
          "clinical_commissioning_group_name",
        )
      }

      console.log(this.toPostUser)
      this.Validate(this.toPostUser, notRequired);
      console.log('errors',this.formError)
      console.log(this.toPostUser)
      if (!this.formError.length) {
        this.toPostUserInfo(userInfo, surgID);
      }
    },

    uncheckPractice(value) {
      this.toPostUser.practice_type_id = this.toPostUser.practice_type_id.filter(
        id => id != value
      );
    },

    uncheckRole(value) {
      this.toPostUser.roles_id = this.toPostUser.roles_id.filter(
        id => id != value
      );
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
        if (this.registeeType === 'newPractice' || this.registeeType === 'customSurgery') {
          //Create new practice
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
              console.log("Practice err", err)
              this.formError = err.response.data.error_messages
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
                  text: "New Practice Created"
                });
                this.$emit("userCreated");
              })
              .catch(err => {
              console.log("catch practice", {err})
              this.formError = err.response.data.error_messages
              });
            await this.getPractices();
          }
        } else if (this.registeeType === 'practiceUser') {
          console.log('CREATING PRACTICE USER')
          //Add user to the practice
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
              console.log("practice user err", {err})
              // this.formError = err.response.data.error_messages
            });
          await this.getPracticeUsers();
          await this.updatePracticeUsersPageCount();
        } else if (this.registeeType === 'admin') {
          console.log('CREATING NEW ADMIN')
          //Create New Admin
          console.log("new admin is being created");
          this.toPostUser.roles_id = this.toPostUser.roles_id.map(
            item => item.value
          );
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
              this.formError = err.response.data.error_messages
              console.log("admin err", {err})
              // this.formError = err.response.data.error_messages
            });
        }
      } catch (err) {
        console.log("try catch", err)
        console.log("index put locum detail compliance documents error.", err);
      }
    }
  }
};
</script>

<style></style>
