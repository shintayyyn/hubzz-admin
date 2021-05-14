<template>
  <div class="page-overlap flex-1 flex flex-col self-end ">
    <transition name="drop" mode="in-out">
      <AppConfirm
        v-if="confirm"
        :message="'Are you sure you want to deactivate this practice?'"
        @cancel="confirm=false"
        @confirm="toDeactivate()"
      />
    </transition>
    <!-- TABS -->
    <div class="flex flex-col rounded">
      <div class="w-full overflow-hidden">
        <div class="flex flex-row overflow-x-auto border-b border-gray-500 mb-2 justify-between">
          <div class="flex">
            <button
              class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
              :class="tab1 === true ? 'border-b-4 border-gray-500' : 'text-gray-600'"
              @click="tab1=true,tab2=false"
            >
              <strong>General</strong>
            </button>
            <button
              v-if="practiceUser && practiceUser.status !== 'Deactivated' && authAdminPermissions.includes('Edit Practice User')"
              class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
              :class="tab2 === true ? 'border-b-4 border-gray-500' : 'text-gray-600'"
              @click="tab2=true,tab1=false"
            >
              <strong>Change Password</strong>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- TABS END HERE -->

    <div class="flex sm:p-2 max-w-lg">
      <!-- TAB 1 -->
      <div
        v-if="tab1"
        class="flex flex-col relative p-4 border rounded-lg text-sm w-full"
      >
        <div
          v-if="practiceUser && practiceUser.status !== 'Deactivated' && authAdminPermissions.includes('Edit Practice User') && tab1"
          class="absolute right-0 px-4"
        >
          <button
            class="rounded-lg py-1 px-4 text-sm bg-sunglow hover:bg-sunglow-dark text-black"
            @click="editProfile = !editProfile"
          >
            {{ editProfile ? 'Cancel Editing' : 'Edit Profile' }}
          </button>
        </div>
        <div v-if="editProfile" class="w-full overflow-hidden  text-sm p-2">
          <AppInput
            v-model="toPutPracticeUser.username"
            :type="'text'"
            :name="'username'"
            :label="'Username'"
            :error="formError.find(item => item.field === 'username')"
            required
            @blur="CheckEmptyField(toPutPracticeUser.username, 'username')"
          />

          <AppInput
            v-model="toPutPracticeUser.email"
            :type="'email'"
            :name="'email'"
            :label="'E-Mail Address'"
            :error="formError.find(item => item.field === 'email')"
            required
            @blur="CheckEmptyField(toPutPracticeUser.email, 'email')"
          />

          <AppInput
            v-model="toPutPracticeUser.title"
            :type="'text'"
            :name="'title'"
            :label="'Title'"
            :placeholder="'Mr. / Mrs. / Dr. / etc.....'"
          />

          <AppInput
            v-model="toPutPracticeUser.first_name"
            :type="'text'"
            :name="'first_name'"
            :label="'First Name'"
            :error="formError.find(item => item.field === 'first_name')"
            required
            @blur="CheckEmptyField(toPutPracticeUser.first_name, 'first_name')"
          />

          <AppInput
            v-model="toPutPracticeUser.last_name"
            :type="'text'"
            :name="'last_name'"
            :label="'Last Name'"
            :error="formError.find(item => item.field === 'last_name')"
            required
            @blur="CheckEmptyField(toPutPracticeUser.last_name, 'last_name')"
          />

          <AppInput
            v-if="false"
            v-model="toPutPracticeUser.suffix"
            :type="'text'"
            :name="'suffix'"
            :label="'Suffix'"
            :placeholder="'Ph.D'"
          />

          <AppInput
            v-model="toPutPracticeUser.practice_role"
            :type="'select'"
            :name="'practice_role'"
            :label="'Role'"
            :items="[{ label: 'Partner', value: 'Partner'}, { label: 'Practice Manager', value: 'Practice Manager'}, { label: 'Practice Staff', value: 'Practice Staff'}]"
            :error="formError.find(item => item.field === 'practice_role')"
            required
            @blur="CheckEmptyField(toPutPracticeUser.practice_role, 'practice_role')"
          />

          <AppInput
            v-model="toPutPracticeUser.practice_user_role_id"
            :type="'select'"
            :label="'Practice User Role'"
            :items="practice_user_roles"
            :error="
              formError.find(item => item.field === 'practice_user_role_id')
            "
            required
            @blur="CheckEmptyField(toPutPracticeUser.practice_user_role_id, 'practice_user_role_id')"
          />

          <p class="flex py-1 font-bold">
            Sign-Up verified by e-mail
          </p>

          <p
            class="p-2"
            :class="practiceUser.email && '-light rounded'"
          >
            {{ practiceUser.email_verified_at ? $moment(practiceUser.email_verified_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY | HH:mm'): 'Not yet verified' }}
          </p>

          <AppInput
            v-model="toPutPracticeUser.status"
            :type="'select'"
            :label="'Status'"
            :error="formError.find(item => item.field === 'status')"
            :items="[{ label: 'Active', value: 'Active'}, {label: 'Disabled', value: 'Disabled'}]"
            :disabled="!practiceUser.email_verified_at"
            required
            @blur="CheckEmptyField(toPutPracticeUser.status, 'status')"
          />

          <button
            class="bg-sunglow hover:bg-yellow-500 rounded-lg mt-3 py-1 px-4 text-black text-sm"
            @click.prevent="checkForm(practiceUser.id,toPutPracticeUser)"
          >
            Save Changes
          </button>
        </div>

        <div
          v-if="!authAdminPermissions.includes('Edit Practice User') || authAdminPermissions.includes('Edit Practice User') && !editProfile"
          class="w-full overflow-hidden text-sm p-2"
        >
          <div class="flex py-2 font-bold">
            Username
          </div>
          <div class="flex px-2 ">
            {{ practiceUser.username ? practiceUser.username : 'N/A' }}
          </div>

          <div class="flex py-2 font-bold">
            E-Mail Address
          </div>
          <div class="flex px-2 ">
            {{ practiceUser.email }}
          </div>

          <div class="flex py-2 font-bold">
            Title
          </div>
          <div
            class="flex px-2 "
          >
            {{ practiceUser.title ? practiceUser.title : 'N/A' }}
          </div>

          <div class="flex py-2 font-bold">
            First Name
          </div>
          <div
            class="flex px-2 "
          >
            {{ practiceUser.first_name ? practiceUser.first_name : 'N/A' }}
          </div>

          <div class="flex py-2 font-bold">
            Last Name
          </div>
          <div
            class="flex px-2 "
          >
            {{ practiceUser.last_name ? practiceUser.last_name : 'N/A' }}
          </div>

          <template v-if="false">
            <div class="flex py-2 font-bold">
              Suffix
            </div>

            <div class="flex px-2 ">
              {{ practiceUser.suffix ? practiceUser.suffix : 'N/A' }}
            </div>
          </template>

          <div class="flex py-2 font-bold">
            Role
          </div>

          <div
            class="flex px-2 "
          >
            {{ practiceUser.practice_detail && practiceUser.practice_detail.practice_role ? practiceUser.practice_detail.practice_role : 'N/A' }}
          </div>

          <div class="flex py-2 font-bold">
            Practice User Role
          </div>
          
          <div
            class="flex px-2 "
          >
            {{ practiceUser.practice_detail && practiceUser.practice_detail.role ? practiceUser.practice_detail.role.name : 'N/A' }}
          </div>

          <div class="flex py-2 font-bold">
            Status
          </div>

          <div class="flex px-2 ">
            {{ practiceUser.status ? practiceUser.status : 'N/A' }}
          </div>

          <br>

          <div>
            <div class="flex py-2 font-bold">
              Memorable word category
            </div>
            
            <div class="flex px-2 ">
              {{ practiceUser.memorable_word_category_name ? practiceUser.memorable_word_category_name : 'N/A' }}
            </div>
  
            <div class="flex py-2 font-bold">
              Memorable word
            </div>
            
            <div class="flex px-2 ">
              {{ practiceUser.memorable_word ? practiceUser.memorable_word : 'N/A' }}
            </div>
  
            <div class="flex py-2 font-bold">
              Memorable date
            </div>
            
            <div class="flex px-2 ">
              {{ practiceUser.memorable_date ? $moment(practiceUser.memorable_date, 'YYYY-MM-DD').format('DD/MM/YYYY') : 'N/A' }}
            </div>
  
            <div class="flex py-2 font-bold">
              Memorable 6 digit number
            </div>
            
            <div class="flex px-2 ">
              {{ practiceUser.memorable_number ? practiceUser.memorable_number : 'N/A' }}
            </div>
          </div>

          <br>

          <div 
            v-if="practiceUser 
              && practiceUser.status !== 'Deactivated' 
              && authAdminPermissions.includes('Delete Practice User')" 
            class="flex my-2"
          >
            <AppButton
              :label="'Deactivate this Practice User'"
              :background="'red'"
              :class="''"
              @click="confirm = true"
            />
          </div>
        </div>
      </div>

      <!-- TAB 2 -->
      <div v-if="tab2" class="flex text-sm  border p-4 rounded-lg w-full">
        <div class="overflow-hidden  text-sm p-2 w-full">
          <AppInput
            v-model="toChangePassword.password"
            :type="'password'"
            :name="'password'"
            :label="'New Password'"
            :error="formError.find(item => item.field === 'password')"
            required
            @blur="CheckEmptyField(toChangePassword.password, 'password')"
          />
          <AppInput
            v-model="toChangePassword.password_confirmation"
            :type="'password'"
            :name="'password_confirmation'"
            :label="'Confirm New Password'"
            :error="formError.find(item => item.field === 'password_confirmation')"
            required
            @blur="CheckEmptyField(toChangePassword.password_confirmation, 'password_confirmation')"
          />
          <!-- <button
            class="inline-flex font-semibold no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow float-left"
            @click.prevent="checkPasswordInfo(practiceUser.id,toChangePassword)"
          >Save Changes</button>-->
          <AppButton :label="'Save Changes'" @click="checkPasswordInfo(practiceUser.id,toChangePassword)" />
        </div>
      </div>
    </div>

    <div v-if="confirm" class="shield" @click="confirm = false" />
  </div>
</template>

<script>
  import AppButton from "@/components/Base/AppButton"
  import AppInput from "@/components/Base/AppInput"
  import AppConfirm from "@/components/Base/AppConfirm"

  export default {
    components: {
      AppButton,
      AppInput,
      AppConfirm
    },

    props: {
      practiceUser: {
        type: Object,
        default: () => null,
      }
    },

    data () {
      return {
        practice: null,
        formError: [],
        errors: [],
        errorPass: [],
        userTabs: 0,
        editProfile: false,
        tab1: true,
        tab2: false,

        toPutPracticeUser: {
          username: '',
          email: '',
          title: '',
          first_name: '',
          last_name: '',
          suffix: '',
          practice_role: '',
          practice_user_role_id: '',
          status: '',
        },

        toChangePassword: {
          password: "",
          password_confirmation: ""
        },

        practice_user_roles: [],

        confirm: false,
      }
    },

    computed: {
      authAdminPermissions () {
        return this.$store.getters["permissions"]
      }
    },

    watch: {
      'toPutPracticeUser.username' () {
        const index = this.formError.findIndex(formError => formError.field === 'username')

        if (this.toPutPracticeUser.username) {
          if (index > -1) {
            this.formError.splice(index, 1)
          }
        } else {
          if (index === -1) {
            this.formError.push({
              field: 'username',
              message: 'Username is required.',
              validation: 'required',
            })
          }
        }
      },

      "toPutPracticeUser.email" (value) {
        const error = this.ValidateEmail(value)
        if (error) {
          this.formError.push(error)
        } else {
          let index = this.formError.findIndex(item => item.field === "email")
          let errors = this.formError.filter(item => item.field === "email")
          if (index >= 0) {
            this.formError.splice(index, errors.length)
          }
        }
      },

      "toChangePassword.password" (value) {
        if (value && value.length < 6) {
          this.formError.push({
            field: "password",
            message: "Password Must Be Atleast 6 Characters"
          })
        } else {
          let index = this.formError.findIndex(
            item => item.message === "Password Must Be Atleast 6 Characters"
          )
          let error = this.formError.filter(
            item => item.message === "Password Must Be Atleast 6 Characters"
          )
          if (index >= 0) {
            this.formError.splice(index, error.length)
          }
        }
      },

      "toChangePassword.password_confirmation" (value) {
        const error = this.ValidateSamePassword(
          this.toChangePassword.password,
          value
        )
        if (error) {
          this.formError.push(error)
        } else {
          let index = this.formError.findIndex(
            item => item.field === "password_confirmation"
          )
          let errors = this.formError.filter(
            item => item.field === "password_confirmation"
          )
          if (index >= 0) {
            this.formError.splice(index, errors.length)
          }
        }
      },

      editProfile () {
        if (this.editProfile) {
          this.toPutPracticeUser.username = this.practiceUser.username
          this.toPutPracticeUser.email = this.practiceUser.email
          this.toPutPracticeUser.title = this.practiceUser.title
          this.toPutPracticeUser.first_name = this.practiceUser.first_name
          this.toPutPracticeUser.last_name = this.practiceUser.last_name
          this.toPutPracticeUser.suffix = this.practiceUser.suffix
          this.toPutPracticeUser.practice_role = this.practiceUser.practice_detail.practice_role
          this.toPutPracticeUser.practice_user_roles = this.practiceUser.practice_detail.role.id
          this.toPutPracticeUser.status = this.practiceUser.status
        }
      },

    },

    created () {
      this.practice = this.practiceUser.practice_detail.practice

      console.log("specificUserPractice", this.practice)

      this.toPutPracticeUser = {
        username: this.practiceUser.username,
        email: this.practiceUser.email,
        title: this.practiceUser.title,
        first_name: this.practiceUser.first_name,
        last_name: this.practiceUser.last_name,
        suffix: this.practiceUser.suffix,
        practice_role: this.practiceUser.practice_detail.practice_role,
        practice_user_role_id: this.practiceUser.practice_detail.role
          ? this.practiceUser.practice_detail.role.id
          : '',
        status: this.practiceUser.status,
      }

      // this.practice_user_roles = {label: this.practiceUser.practice_detail.role.name, value:this.practiceUser.practice_detail.role.id}

      this.$axios
        .$get(`/api/v1/admin/practices/${this.practice.id}/practice-roles`)
        .then(res => {
          res.data.roles.forEach(role => {
            this.practice_user_roles.push({ label: role.name, value: role.id })
          })
        })
        .catch(err => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: err.response.data.message
          })
        })

      console.log("practice_user_roles", this.practice_user_roles)
    },

    methods: {

      errorMessage (field, message) {
        if (this.formError.find(error => error.field === field.toString())) {
          let error = this.formError.find(
            error => error.field === field.toString()
          )
          return message ? message : error.message
        }
        return
      },

      checkForm: function (practiceUserId, userInfo) {
        this.formError = []
        this.Validate(this.toPutPracticeUser, ["title", "suffix"])
        if (!this.formError.length) {
          this.updatePracticeUser(practiceUserId, userInfo)
        }
      },

      checkPasswordInfo: function (uID, changePass) {
        this.Validate(this.toChangePassword)
        if (!this.formError.length) {
          this.toChangeUserPassword(uID, changePass)
        }
      },

      async updatePracticeUser (practiceUserId, toPutPracticeUser) {
        try {
          await this.$axios.put(`/api/v1/admin/practice-users/${practiceUserId}`, toPutPracticeUser)

          const response = await this.$axios.get(`/api/v1/admin/practice-users/${practiceUserId}`)

          const practiceUser = response.data.data.user

          this.$emit('setPracticeUser', practiceUser)

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: "Saved Changes"
          })

          this.editProfile = false
          // vm.$forceUpdate()
        } catch (err) {
          console.log('err', err.response || err)

          let message = null

          if (err.response) {
            if (err.response.status === 400 && err.response.data.error_messages) {
              this.formError = err.response.data.error_messages
            } else {
              message = err.response.data.message
            }
          } else if (err.request) {
            message = 'Something went wrong!'
          } else {
            message = err.message
          }

          if (message) {
            this.$store.commit('SET_NOTIFICATION', {
              enabled: true,
              status: 'danger',
              text: message,
            })
          }
        }
      },

      async toChangeUserPassword (userID, toChangePassword) {
        try {
          console.log(toChangePassword.password)
          console.log(toChangePassword.password_confirmation)
          await this.$axios.put(`/api/v1/admin/users/${userID}/change-password`, {
            password: toChangePassword.password,
            password_confirmation: toChangePassword.password_confirmation
          })
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: "Saved Changes"
          })
        } catch (err) {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: err.response.data.message
          })
          console.log("index put locum detail compliance documents error", err)
        }
      },

      async toDeactivate () {
        await this.$axios
          .put(
            `/api/v1/admin/practice-users/${this.$route.params.pracUserId}/deactivate`
          )
          .then((response) => {
            const practiceUser = response.data.data.user

            this.$emit('setPracticeUser', practiceUser)

            this.confirm = false

            this.$router.push({
              path:`/practices/${this.practice.id}/practice-users`,
              query: this.$route.query,
            })

            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: "Successfully Deactivated User"
            })
          })
          .catch(err => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: err.response.data.message
            })
          })
      },

    },

  }
</script>
