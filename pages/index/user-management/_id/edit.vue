<template>
  <div class="my-2 p-4 border rounded-lg text-sm max-w-lg">
    <AppInput
      v-model="form.email"
      :type="'email'"
      :name="'email'"
      :label="'Email'"
      :error="formError.find(item => item.field === 'email')"
      required
      @blur="CheckEmptyField(form.email, 'email')"
    />
    <AppInput v-model="form.title" :type="'text'" :name="'title'" :label="'Title'" />
    <AppInput
      v-model="form.first_name"
      :type="'text'"
      :name="'first_name'"
      :label="'First Name'"
      :error="formError.find(item => item.field === 'first_name')"
      required
      @blur="CheckEmptyField(form.first_name, 'first_name')"
    />
    <AppInput
      v-model="form.last_name"
      :type="'text'"
      :name="'last_name'"
      :label="'Last Name'"
      :error="formError.find(item => item.field === 'last_name')"
      required
      @blur="CheckEmptyField(form.last_name, 'last_name')"
    />
    <AppInput
      v-if="false"
      v-model="form.suffix" :type="'text'" :name="'suffix'" :label="'Suffix'"
    />

    <AppInput
      v-model="form.roles_id"
      :type="'multi-checkbox'"
      :error="formError.find(item => item.field === 'roles_id')"
      :name="'roles_id'"
      :label="'Admin Role/s'"
      :lists="filteredAdminRoles"
      required
      @checked="form.roles_id.push($event)"
      @unchecked="uncheckRole"
    />

    <AppFilterSearch
      v-if="false"
      v-model="form.roles_id"
      :name="'roles_id'"
      :label="'Admin Role/s'"
      :placeholder="'Select...'"
      :error="formError.find(item => item.field === 'roles_id')"
      :items="filteredAdminRoles"
      required
      @add="CheckEmptyField(form.roles_id, 'roles_id')"
      @remove="CheckEmptyField(form.roles_id, 'roles_id')"
    />

    <AppButton :label="'Save Changes'" @click="updateForm(user.id, form)" />
  </div>
</template>

<script>
import AppInput from "@/components/Base/AppInput"
import AppButton from "@/components/Base/AppButton"
import AppFilterSearch from "@/components/Base/AppFilterSearch"
export default {
  components: {
    AppInput,
    AppButton,
    AppFilterSearch
  },

  props: {
    adminRoles: {
      type: Array,
      default: () => [],
    }
  },

  data () {
    return {
      user: null,
      form: {
        email: "",
        title: "",
        first_name: "",
        last_name: "",
        suffix: "",
        roles_id: []
      },
      filteredAdminRoles: [],
      formError: []
    }
  },

  async mounted () {
    try {
      let response = await this.$axios.$get(
        `/api/v1/admin/admin-users/${this.$route.params.id}`
      )

      this.user = response.data.user

      this.form.email = this.user.email
      this.form.title = this.user.personal_detail.title
      this.form.first_name = this.user.personal_detail.first_name
      this.form.last_name = this.user.personal_detail.last_name
      this.form.suffix = this.user.personal_detail.suffix

      // this.user.admin_detail.roles.forEach(item => {
      //   this.form.roles_id.push({
      //     value: item.id,
      //     label: item.name
      //   })
      // })

      this.user.admin_detail.roles.forEach(item => {
        this.form.roles_id.push(item.id.toString())
      })

      // this.adminRoles.forEach(item => {
      //   const found = this.user.admin_detail.roles.find(
      //     userRole => userRole.id === item.value
      //   )
      //   console.log("items")
      //   if (!found) {
      //     this.filteredAdminRoles.push({
      //       value: item.value,
      //       label: item.label
      //     })
      //   }
      // })

      this.adminRoles.forEach(item => {
        this.filteredAdminRoles.push({
          value: item.value.toString(),
          label: item.label
        })
      })

      console.log("user roles", this.user.admin_detail.roles)
      console.log("filtered", this.filteredAdminRoles)
    } catch (err) {
      this.$store.commit("SET_NOTIFICATION", {
        enabled: true,
        status: "danger",
        text: "Something went wrong!"
      })
    }
  },
  methods: {
    uncheckRole (data) {
      console.log('data', data)

      this.form.roles_id = this.form.roles_id.filter(id => id !== data)
    },

    getAdminUsers () {
      this.$store.dispatch("adminusers/fetchAdminUsers", {
        limit: 10,
      })
    },
    
    updateForm (user_id) {
      this.formError = []
      console.log('form', this.form)
      this.Validate(this.form, ["title", "suffix"])
      if (!this.formError.length) {
        // this.form.roles_id = this.form.roles_id.map(item => item.value)
        this.$axios
          .$put(`/api/v1/admin/admin-users/${user_id}`, this.form)
          .then(res => {
            // this.form.roles_id = []
            // res.data.user.admin_detail.roles.forEach(item => {
            //   this.form.roles_id.push({
            //     value: item.id,
            //     label: item.name
            //   })
            // })
            this.form.roles_id = res.data.user.admin_detail.roles.map(role => role.id.toString())
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: "Admin Account Updated Successfully!"
            })
          })
          .catch(err => {
            console.log("edit admin user error!", err)
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: err.response.data.message
            })
          })
        this.getAdminUsers()
      }
    }
  }
}
</script>
