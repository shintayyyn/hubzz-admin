<template>
  <div>
    <AppTable
      v-if="total > 0"
      :total="total"
      :items="practice_roles"
      :currentPage="currentPage"
      :perPage="params.limit"
      :columns="columns"
     
      @pagechanged="pagechanged"
    >
    <!-- :routerLink="`/practices/${$route.params.id}/practice-users/user-roles`" -->

      <!-- <template v-slot:status_slot="slotProps">
        <div
          class="px-4 py-1 rounded-full text-center w-32 mx-auto"
          :class="slotProps.item.status === 'Active' ? 'bg-green-500 text-white lg:px-8 sm:px-2' : 'bg-yellow-500 text-black lg:px-6 sm:px-2'"
        >{{ slotProps.item.status }}</div>
      </template> -->
    </AppTable>
  </div>
</template>
<script>
import AppTable from '@/components/Base/AppTable'
export default {
  components:{
    AppTable
  },
  data(){
    return{
      currentPage: 1,
      perPage: 10,
      params: {
        limit: 10,
        offset: 0,
      },
      total:'',
      practice_roles: [],

      columns: [
        {
          name: 'Role',
          dataIndex: "name",
          class: "text-center",
          sortable: false
        },
        {
          name:'Description',
          dataIndex:"description",
          class: "text-center",
          sortable: false
        },
        {
          name:"Created At",
          dataIndex: "created_at",
          class: "text-center localDate",
          sortable: false
        }
      ]
    }
  },
  beforeDestroy() {
		let query = Object.assign({}, this.$route.query);
		delete query.practice_roles_page;
		this.$router.push({ query });
	},
	watch: {
		$route(to, from) {
			this.currentPage = parseInt(to.query.practice_roles_page);
			this.getPracticeRoles();
		}
	},
  async asyncData({ app, route, store }){
    try{
      let response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}/practice-roles/count`)
      console.log(response)
      const total = response.data.count
      let params = {
        limit: 10,
        offset: 0,
      }
      response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}/practice-roles`,{ params })
      const practice_roles = response.data.roles

      return{
        total,
        practice_roles
      }
    }catch(err){
      store.commit("SET_NOTIFICATION", {
				enabled: true,
				status: "danger",
				text: err.response.data.message
			});
			console.log('get roles error!',err);
    }
  },
  methods: {
    pagechanged(e) {
			const query = {
				...this.$route.query,
				practice_users_page: e || 1
			};
			this.$router.push({ query });
			this.getPracticeRoles();
    },
    async getPracticeRoles(){
      let limit = 5;
      let offset = 0;
      offset = this.perPage * (parseInt(this.$route.query.practice_roles_page) - 1);
      let params = {
        limit,
        offset,
      }
      await this.$axios
        .$get(`/api/v1/admin/practice/${this.$route.params.id}/practice-roles`,{ params })
        .then(res => {
          this.practice_roles = res.data.roles
        })
    },
  } 
}
</script>

<style>

</style>