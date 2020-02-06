<template>
  <div>
    <nuxt-link
			:to="`/locums/${user.id}/locum-jobs/locum-available-jobs`"
			class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg transition-hover"
			:class=" !$route.query.available_job_type ||($route.query.available_job_type && $route.query.available_job_type.toLowerCase() === 'matched') ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
		>Matched</nuxt-link>
		<nuxt-link
			:to="`/locums/${user.id}/locum-jobs/locum-available-jobs?available_job_type=Available
      `"
			class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg transition-hover"
			:class="($route.query.available_job_type && $route.query.available_job_type.toLowerCase() === 'available')? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
		>Public</nuxt-link>
		<nuxt-link
			:to="`/locums/${user.id}/locum-jobs/locum-available-jobs?available_job_type=Bank`"
			class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg transition-hover"
			:class="($route.query.available_job_type && $route.query.available_job_type.toLowerCase() === 'bank') ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
		>Bank</nuxt-link>
    
    <AppTable
      v-if="total > 0"
      :total="total"
      :items="availableJobs"
      :currentPage="currentPage"
      :perPage="params.limit"
      :columns="columns"
      :loading="loading"
      :routerLink="`/locums/${user.id}/locum-jobs/locum-available-jobs`"
      :orderBy="params.order_by"
      @pagechanged="pagechanged"
      @sorted="sorted"
    >
    </AppTable>
    <div v-else>
      <div
        class="mt-10 w-full text-white text-center"
        style="font-family: Nunito"
      >
        This locum has no available jobs.
      </div>
    </div>
    <!-- <LocumAvailableJobs :user='user'/> -->
  </div>
</template>
<script>
import AppTable from '@/components/Base/AppTable'
import LocumAvailableJobs from '@/components/Locums/Jobs/LocumAvailableJobs'
export default {
  components:{
    LocumAvailableJobs,
    AppTable,
  },
  middleware({ query, redirect, error }) {
		if (
			query.status &&
			!["matched", "available", "bank"].includes(query.available_job_type.toLowerCase())
		) {
			return error({
				status: 404,
				message: "This Available Job Type is Invalid"
			});
		}
	},
  data () {
    return {
      loading:false,
      currentPage: 1,
      orderBy: [],
      params: {
        viewing_locum_user_id:'',
        locum_status: '',
				limit: 10,
        offset: 0,
        order_by: [],
			},
      columns: [
				{
					name: "Job Number",
          dataIndex: "job_number",
          sortable: true,
				},
				{
					name: "Practice / Surgery",
          dataIndex: "practice_name",
          sortable: true
				},
				{
					name: "Title",
					dataIndex: "title",
          class: "text-center",
          sortable: true
				},
				{
					name: "From",
					dataIndex: "date_start",
          class: "text-center localDate",
          sortable: true
				},
				{
					name: "To",
					dataIndex: "date_end",
          class: "text-center localDate",
          sortable: true
				},
				{
					name: "Created",
					dataIndex: "date_created",
          class: "text-center localDate",
          sortable: true
				},
			],
    }
  },

  watch: {
		"$route.query.available_job_type"(newStatus, oldStatus) {
			let params = {};
      params = {
        viewing_locum_user_id: this.user.id,
        locum_status: newStatus ? newStatus : 'Matched',
        limit: 10,
        offset: 0,
      };
      setTimeout(async () => {
        this.loading = true;
        await this.getAvailableJobs(params);
        this.loading = false;
      });
		}
	},
  computed:{
    user(){
      return this.$store.state.locums.locumUser
    },
    total() {
			return this.$store.state.jobs.locum_available_jobs_count;
		},
		availableJobs() {
			return this.$store.state.jobs.locum_available_jobs;
		},
  },
  async asyncData({ app, store, route }){
    try{
      let response = await app.$axios.$get(`/api/v1/admin/locum-users/${route.params.id}`)
      const user = response.data.user

      await store.commit('locums/SET_LOCUM_USER', user)
        
    }catch(err){
      store.commit('SET_NOTIFICATION',{ 
        enabled: true, 
        status:'danger', 
        text:'Something went wrong!'
      })
      console.log('get locum user error!', err)
    }
  },
  methods: {
    async getAvailableJobs(params){
      await this.$axios.$get(`/api/v1/admin/jobs/count`, { params }).then(res => {
        console.log('result', res.data.count)
        this.loading = true
        this.$store.commit("jobs/SET_LOCUM_AVAILABLE_JOBS_COUNT", res.data.count)
      }).catch((err)=>{
        this.loading = false
        this.$store.commit('SET_NOTIFICATION',{ 
          enabled: true, 
          status:'danger', 
          text:'Something went wrong!'
        })
      })

      await this.$axios.$get(`/api/v1/admin/jobs`, { params }).then(res => {
        console.log('result', res.data.jobs)
        this.$store.commit("jobs/SET_LOCUM_AVAILABLE_JOBS", res.data.jobs);
				this.loading = false
      }).catch((err)=>{
        this.loading = false
        this.$store.commit('SET_NOTIFICATION',{ 
          enabled: true, 
          status:'danger', 
          text:'Something went wrong!'
        })
      })
    },
    async sorted(order_by) {
      let orderBy = order_by.map(item => {
        let order = item.split(":")[1];
        let sorting = item.split(":")[0];
        switch (sorting) {
          case "date_time_start":
            sorting = "date_start";
            break;
          case "date_time_end":
            sorting = "date_end";
            break;
          case "rate_name":
            sorting = "rate";
            break;
          default:
            sorting;
        }
        return `${sorting}:${order}`;
      });
      this.current_page = 1;
      this.offset = 0;
      this.order_by = orderBy;
      this.loading = true;
      await this.getAvailableJobs();
      this.loading = false;
    },
    async pagechanged(page) {
      this.current_page = page;
      this.offset = this.limit * (page - 1);
      this.loading = true;
      await this.getAvailableJobs();
      this.loading = false;
    },
  }
}
</script>
<style>

</style>