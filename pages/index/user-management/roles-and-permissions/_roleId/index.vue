<template>
  <div class="role-modal">
    <div class="p-4 md:p-6 text-white">
      <div class="pb-4">
        <svgicon
          name="arrow-left-solid"
          height="32"
          widht="32"
          class="cursor-pointer text-white hover:text-sunglow fill-current"
          @click="goBack()"
        />
      </div>
      <div class="flex flex-row items-start justify-between flex-wrap">
        <div class="flex items-center justify-between w-full leading-tight">
          <div class="text-2xl md:text-4xl font-bold md:font-normal">
            {{ specificRole.name }}
          </div>
          <div class="flex py-1 text-sm md:text-base">
            <div
              v-if="
                editingPermissions == false &&
                  authAdminPermissions.includes('Edit Role')
              "
              @click="editingPermissions = true"
              class="flex items-center mr-1 md:mr-2 py-1 px-2 md:px-4 md:py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 cursor-pointer text-black"
            >
              <div class="mx-2 font-semibold">Edit</div>
              <div>
                <svgicon
                  name="edit"
                  width="21"
                  height="21"
                  color="black black"
                />
              </div>
            </div>
            <div
              v-if="
                editingPermissions == true &&
                  authAdminPermissions.includes('Edit Role')
              "
              @click="editingPermissions = false"
              class="flex items-center mr-1 md:mr-2 py-1 px-2 md:px-4 md:py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 cursor-pointer text-black"
            >
              <div class="mx-2 font-semibold">Cancel</div>
              <div>
                <svgicon
                  name="times-solid"
                  width="21"
                  height="21"
                  color="black black"
                />
              </div>
            </div>
            <div
              v-if="
                editingPermissions == true &&
                  authAdminPermissions.includes('Edit Role')
              "
              @click="save()"
              class="flex items-center ml-1 md:ml-2 py-1 px-2 md:px-4 md:py-2 rounded-lg bg-green-500 hover:bg-green-600 cursor-pointer"
            >
              <div class="mx-2 font-semibold">Save</div>
              <div>
                <svgicon
                  name="circle-check"
                  width="21"
                  height="21"
                  color="white white"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="text-sm italic">{{ specificRole.description }}</div>
      </div>
      <!-- SHOW ROLE PERMISSIONS -->
      <div class="my-2 md:my-4" v-if="editingPermissions == false">
        <div class="flex flex-wrap overflow-hidden">
          <div class="w-full md:w-1/2 xl:w-1/5 overflow-hidden pb-3 md:p-1">
            <div class="text-lg font-semibold">Locum Management</div>
            <div
              v-for="(permission, index) in rolePermissions"
              :key="`permission-${index}`"
              class="px-2"
            >
              {{ permission.category === "Locum" ? permission.name : null }}
            </div>
          </div>
          <div class="w-full md:w-1/2 xl:w-1/5 overflow-hidden pb-3 md:p-1">
            <div class="text-lg font-semibold">Practice Management</div>
            <div
              v-for="(permission, index) in rolePermissions"
              :key="`permission-${index}`"
              class="px-2"
            >
              {{ permission.category === "Practice" ? permission.name : null }}
            </div>
          </div>
          <div class="w-full md:w-1/2 xl:w-1/5 overflow-hidden pb-3 md:p-1">
            <div class="text-lg font-semibold">
              Billing and Reports Management
            </div>
            <div
              v-for="(permission, index) in rolePermissions"
              :key="`permission-${index}`"
              class="px-2"
            >
              {{ permission.category === "Billing" ? permission.name : null }}
            </div>
          </div>
          <div class="w-full md:w-1/2 xl:w-1/5 overflow-hidden pb-3 md:p-1">
            <div class="text-lg font-semibold">Miscellaneous</div>
            <div
              v-for="(permission, index) in rolePermissions"
              :key="`permission-${index}`"
              class="px-2"
            >
              {{ permission.category === "Misc" ? permission.name : null }}
            </div>
          </div>
          <div class="w-full md:w-1/2 xl:w-1/5 overflow-hidden pb-3 md:p-1">
            <div class="text-lg font-semibold">User Management</div>
            <div
              v-for="(permission, index) in rolePermissions"
              :key="`permission-${index}`"
              class="px-2"
            >
              {{
                permission.category === "User Management"
                  ? permission.name
                  : null
              }}
            </div>
          </div>
        </div>
      </div>
      <!-- EDIT ROLE PERMISSIONS -->
      <div
        class="m-4"
        v-if="
          editingPermissions == true &&
            authAdminPermissions.includes('Edit Role')
        "
      >
        <!-- <div class="flex flex-wrap overflow-hidden xl:-mx-1">
          <div class="xl:w-1/5 w-full overflow-hidden xl:my-1 xl:px-1">
            <div class="text-lg font-semibold">Locum Management</div> 
            <div 
              v-for="(role, index) in allPermissions"
              :key="`role-${index}`"
              class="">
              <input type="checkbox"
                v-if="role.category === 'Locum'" 
                :id="role.id" 
                :checked="isChecked(role.permissions)">
              <label for="checkbox">{{ role.category === 'Locum' ? role.name : null}}</label>
            </div>
          </div>
          <div class="xl:w-1/5 w-full overflow-hidden xl:my-1 xl:px-1">
            <div class="text-lg font-semibold">Practice Management</div> 
            <div 
              v-for="(role, index) in allPermissions"
              :key="`role-${index}`"
              class="">
              <input type="checkbox" 
                v-if="role.category === 'Practice'" 
                :id="role.id" 
                :checked="isChecked(role.permissions)">
              <label for="checkbox">{{ role.category === 'Practice' ? role.name : null}}</label>
            </div>
          </div>
          <div class="xl:w-1/5 w-full overflow-hidden xl:my-1 xl:px-1">
            <div class="text-lg font-semibold">Billing and Reports Management</div> 
            <div 
              v-for="(role, index) in allPermissions"
              :key="`role-${index}`"
              class="">
              <input type="checkbox" 
                v-if="role.category === 'Billings'" 
                :id="role.id" 
                :checked="isChecked(role.permissions)">
              <label for="checkbox">{{ role.category === 'Billings' ? role.name : null}}</label>
            </div>
          </div>
          <div class="xl:w-1/5 w-full overflow-hidden xl:my-1 xl:px-1">
            <div class="text-lg font-semibold">Miscellaneous</div> 
            <div 
              v-for="(role, index) in allPermissions"
              :key="`role-${index}`"
              class="">
              <input type="checkbox" 
                v-if="role.category === 'Misc'" 
                :id="role.id" 
                :checked="isChecked(role.permissions)">
              <label for="checkbox">{{ role.category === 'Misc' ? role.name : null}}</label>
            </div>
          </div>
          <div class="xl:w-1/5 w-full overflow-hidden xl:my-1 xl:px-1">
            <div class="text-lg font-semibold">User Management</div> 
            <div 
              v-for="(role, index) in allPermissions"
              :key="`role-${index}`"
              class="">
              <input type="checkbox" 
                v-if="role.category === 'User Management'" 
                :id="role.id" 
                :checked="isChecked(role.permissions)">
              <label for="checkbox">{{ role.category === 'User Management' ? role.name : null}}</label>
            </div>
          </div>
        </div> -->
        <div>
          <p class="flex">Role Name</p>
          <input
            class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none focus:border-yellow"
            type="text"
            placeholder="Super Admin"
            v-model="form.name"
            aria-label="name"
          />
          <p class="flex">Role Description</p>
          <input
            class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none focus:border-yellow"
            type="text"
            placeholder="Super Admin"
            v-model="form.description"
            aria-label="description"
          />
        </div>
        <div class="flex flex-wrap overflow-hidden">
          <div
            class="w-full md:w-1/3 overflow-hidden pb-3"
            v-for="(role, index) in allPermissions"
            :key="index"
          >
            <div class="customized-select">
              <input
                type="checkbox"
                :id="role.permissions"
                :checked="isChecked(role.permissions)"
                @change="checkAll(index, $event.target.checked)"
              />
              <label class="font-bold text-xl pl-1" :for="role.permissions"
                >{{ role.category === "User Management" ? "User" : role.category }} Management</label
              >
            </div>
            <div class="px-1">
              <div
                class="customized-select"
                v-for="permission in role.permissions"
                :key="permission.id"
              >
                <input
                  v-model="permission.done"
                  :id="permission.id"
                  type="checkbox"
                  :checked="permission.done"
                />
                <label class="text-sm pl-1" :for="permission.id">{{
                  permission.name
                }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      specificRole: "",
      rolePermissions: [],
      allPermissions: [],
      editingPermissions: false,
      form: {
        name: "",
        description: "",
        permission_id: []
      }
    };
  },
  created() {
    this.form.name = this.specificRole.name;
    this.form.description = this.specificRole.description;
  },
  computed: {
    authAdminPermissions() {
      return this.$store.getters["auth/permissions"];
    }
  },
  async asyncData({ app, store, route }) {
    try {
      let response = await app.$axios.$get(
        `/api/v1/admin/admin-roles/${route.params.roleId}`
      );
      const specificRole = response.data.role;
      let rolePermissions = response.data.role.permissions;
      let allPermissions = [];
      await app.$axios.$get(`/api/v1/admin/admin-permissions`).then(res => {
        res.data.permissions.forEach(permission => {
          let hasPermission = rolePermissions.find(
            item => item.id === permission.id
          );
          if (hasPermission) {
            allPermissions.push({ ...permission, done: true });
          } else {
            allPermissions.push({ ...permission, done: false });
          }
        });
      });
      let categories = [];
      allPermissions.forEach(permission => {
        if (categories.length === 0) {
          categories.push({
            category: permission.category,
            permissions: []
          });
        } else {
          let hasSameCategory = categories.find(
            item => item.category === permission.category
          );
          if (!hasSameCategory) {
            categories.push({
              category: permission.category,
              permissions: []
            });
          }
        }
      });
      allPermissions.forEach(permission => {
        let foundCategory = categories.find(
          item => item.category === permission.category
        );
        foundCategory.permissions.push(permission);
      });
      allPermissions = categories;
      console.log("allpermissions", allPermissions);
      return {
        specificRole,
        rolePermissions,
        allPermissions
      };
    } catch (err) {
      store.commit("SET_NOTIFICATION", {
        enabled: true,
        status: "danger",
        text: "Something went wrong!"
      });
      console.log("get users error", err);
    }
  },
  methods: {
    isChecked(permissions) {
      return !permissions.map(item => item.done).includes(false);
    },
    checkAll(index, checked) {
      this.allPermissions[index].permissions.forEach(item => {
        item.done = checked;
      });
    },
    goBack() {
      const query = {
        ...this.$route.query
      };
      if (query.job_status) {
        delete query.job_status;
      }
      this.$router.push({
        path: "/user-management/roles-and-permissions",
        query
      });
    },
    save() {
      let ids = [];
      this.allPermissions.forEach(item => {
        item.permissions.forEach(permission => {
          if (permission.done) {
            ids.push(permission.id);
          }
        });
      });
      this.form.permission_id = ids;
      this.$axios
        .$put(
          `/api/v1/admin/admin-roles/${this.$route.params.roleId}`,
          this.form
        )
        .then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: "Role Updated Successfully"
          });
          this.$emit("updateRole", res.data.role);
          this.specificRole.name = res.data.role.name;
          this.specificRole.description = res.data.role.description;
          this.editingPermissions = false;
        });
    }
  }
};
</script>
<style>
.role-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.role-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px yellow;
  transition: all 0.3s ease-in-out;
  background-color: #505561;
  z-index: 512;
}

@media screen and (min-width: 1200px) {
  .role-modal {
    width: 80%;
  }
}
</style>
