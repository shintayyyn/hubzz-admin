<template>
  <transition name="slide" mode="out-in">
    <div class="specific-job-part-modal">
      <div class="mx-2">
        <nuxt-link 
          :to="{path: `/billings/${$route.params.id}/hubzz-invoices/issue-hubzz-invoice`, query: $route.query}">
          <svgicon
            name="arrow-left-solid"
            height="40"
            width="40"
            class="fill-current text-white hover:text-sunglow p-1 cursor-pointer"
          />
        </nuxt-link>
        <JobPartModal 
          :specificJobPart="approvedJobPart" 
          :isNuxtChild="true"
          :isInvoice="true" 
        />
      </div>
    </div>
  </transition>
</template>

<script>
import JobPartModal from "@/components/Base/JobPartModal"
export default {
  components:{
    JobPartModal,
  },
  data () {
    return {
      approvedJobPart: null
    }
  },
  async asyncData ({ app, route }) {
    let response = await app.$axios.$get(`/api/v1/admin/job-parts/${route.params.approvedJobPartId}`)
    const approvedJobPart = response.data.job_part
    return {
      approvedJobPart,
    }
  }
}
</script>

<style>
.specific-job-part-modal {
	position: fixed;
	top: 0;
	right: 0;
	margin-right: 0%;
	width: 100%;
	height: 100%;
	overflow: auto;
	border-left: solid 2px #ffc72c;
	transition: all 0.3s ease-in-out;
	background-color: #505561;
	z-index: 512;
}
@media screen and (min-width: 1200px) {
	.specific-job-part-modal {
		width: 50%;
	}
}
.document {
	width: 100%;
	min-height: 50vh;
}

@media screen and (min-width: 768px) {
	.document {
		min-height: 80vh;
	}
}
</style>