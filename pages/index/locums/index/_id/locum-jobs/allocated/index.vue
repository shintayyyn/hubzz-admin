<template>
	<div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
		<div style="width: calc(100%);" class="flex-1 flex flex-col self-end bg-trout shadow-lg">

            <!-- HEADER -->
            <div class="flex justify-between text-sm text-white py-2 px-6">
                <nuxt-link :to="{path:`/locums/${locumUser.id}`,query: $route.query }" class="text-white p-1">
                <svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
                </nuxt-link>
            </div>

            <div class="mx-6">

                <div class="flex flex-wrap">
                    <div class="my-1 px-1">
                        <div class="my-2 rounded-lg">
                            <nuxt-link
                            class="hover:bg-grey rounded-lg p-3 text-white text-sm"
                            :to="{path:`/locums/${locumUser.id}`,query: $route.query}">
                            <strong>Profile</strong>
                            </nuxt-link>
                        </div>
                    </div>
                    <div class="my-1 px-1">
                        <div class="my-2 rounded-lg">
                            <nuxt-link
                            class="bg-grey-dark hover:bg-grey rounded-lg p-3 text-white text-sm"
                            :to="{path:`/locums/${locumUser.id}/locum-jobs`,query: $route.query}">
                            <strong>Jobs</strong>
                            </nuxt-link>
                        </div>
                    </div>
                </div>

                <!-- DEFAULT TABS -->
                <div class="flex flex-col rounded-lg mt-2 " >
                    <div class="flex flex-wrap -mx-1">
                        <div class="my-1 px-1">
                            <div class="my-2 rounded-lg">
                                <nuxt-link
                                class="bg-grey-dark hover:bg-grey rounded-lg p-3 text-white text-sm"
                                :to="{path:`/locums/${locumUser.id}/locum-jobs/allocated`,query: $route.query}">
                                <strong>Allocated</strong>
                                </nuxt-link>
                            </div>
                        </div>
                        <div class="my-1 px-1">
                            <div class="my-2 rounded-lg">
                                <nuxt-link
                                class="hover:bg-grey rounded-lg p-3 text-white text-sm"
                                :to="{path:`/locums/${locumUser.id}/locum-jobs/available`,query: $route.query}">
                                <strong>Available</strong>
                                </nuxt-link>
                            </div>
                        </div>
                        <div class="my-1 px-1">
                            <div class="my-2 rounded-lg">
                                <nuxt-link
                                class="hover:bg-grey rounded-lg p-3 text-white text-sm"
                                :to="{path:`/locums/${locumUser.id}/locum-jobs/applied`,query: $route.query}">
                                <strong>Applied</strong>
                                </nuxt-link>
                            </div>
                        </div>
                        <div class="my-1 px-1">
                            <div class="my-2 rounded-lg">
                                <nuxt-link
                                class="hover:bg-grey rounded-lg p-3 text-white text-sm"
                                :to="{path:`/locums/${locumUser.id}/locum-jobs/unsuccessful`,query: $route.query}">
                                <strong>Unsuccessful</strong>
                                </nuxt-link>
                            </div>
                        </div>

                        <div class="my-1 px-1">
                            <div class="my-2 rounded-lg">
                                <nuxt-link
                                class="hover:bg-grey rounded-lg p-3 text-white text-sm"
                                :to="{path:`/locums/${locumUser.id}/locum-jobs/declined`,query: $route.query}">
                                <strong>Declined</strong>
                                </nuxt-link>
                            </div>
                        </div>

                        <div class="my-1 px-1">
                            <div class="my-2 rounded-lg">
                                <nuxt-link
                                class="hover:bg-grey rounded-lg p-3 text-white text-sm"
                                :to="{path:`/locums/${locumUser.id}/locum-jobs/completed`,query: $route.query}">
                                <strong>Completed</strong>
                                </nuxt-link>
                            </div>
                        </div>
                    </div>

                </div>
                <!--DEFAULT TABS END HERE-->

                <!-- TABLE -->
                <div style="w-full">
                    <div class="flex flex-col">
                        <!-- HEADER -->
                        <div class="flex my-2">
                            <div style="width: 20%;">
                                <div class="flex text-white text-sm p-4">
                                <strong>Job number</strong>
                                </div>
                            </div>
                            <div style="width: 15%;">
                                <div class="flex text-white text-sm p-4">
                                <strong>Practice / Surgery</strong>
                                </div>
                            </div>
                            <div style="width: 15%;">
                                <div class="flex text-white text-sm p-4">
                                <strong>Title</strong>
                                </div>
                            </div>
                            <div style="width: 16%;">
                                <div class="flex text-white text-sm p-4">
                                <strong>From</strong>
                                </div>
                            </div>
                            <div style="width: 16%;">
                                <div class="flex text-white text-sm p-4">
                                <strong>To</strong>
                                </div>
                            </div>
                            <div style="width: 16%;">
                                <div class="flex text-white text-sm p-4">
                                <strong>Created</strong>
                                </div>
                            </div>
                        </div>
                        <!-- HEADER -->

                        <!-- BODY -->
                        <nuxt-link
                        v-for="(locumUserCurrentJob, index) in locumUserCurrentJobs"
                        :key="`locumUserCurrentJob-${index}`"
                        :to="`/locums/${locumUser.id}/locum-jobs/view-job/${locumUserCurrentJob.id}`"
                        class="flex no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light mt-2"
                        >
                            <div style="width: 20%;">
                                <div class="flex text-white text-sm p-4">
                                    <span>{{ locumUserCurrentJob.job_number }}</span>
                                </div>
                            </div>
                            <div style="width: 15%;">
                                <div class="flex text-white text-sm p-4">
                                    <span>{{ locumUserCurrentJob.platform_job.practice.surgery.name }}</span>
                                </div>
                            </div>
                            <div style="width: 15%;">
                                <div class="flex text-white text-sm p-4">
                                    <span>{{ locumUserCurrentJob.platform_job.appointed_to_locum.user.locum_detail.profession.name }}</span>
                                </div>
                            </div>
                            <div style="width: 16%;">
                                <div class="flex text-white text-sm p-4">
                                    <span>{{ locumUserCurrentJob.platform_job.date_start }}</span>
                                </div>
                            </div>
                            <div style="width: 16%;">
                                <div class="flex text-white text-sm p-4">
                                    <span>{{ locumUserCurrentJob.platform_job.date_end }}</span>
                                </div>
                            </div>
                            <div style="width: 16%;">
                                <div class="flex text-white text-sm p-4">
                                    <span>{{ locumUserCurrentJob.platform_job.date_created }}</span>
                                </div>
                            </div>
                        </nuxt-link>
                        <!-- BODY -->
                    </div>
                </div>
                <!--TABLE ENDS HERE-->
            </div>
            
            <nuxt-child/>
		</div>
	</div>
</template>

<script>
export default{
	transition: "subpage",

    data() {
        return{
            locumUser:null,
            locumUserCurrentJobs:[]
        }
    },

  async asyncData({ app, route }) {
    let response = await app.$axios.get(`/api/v1/admin/locum-users/${route.params.id}`)
    const locumUser = response.data.data.user
    
    response = await app.$axios.get(`/api/v1/admin/jobs`)
    const allJobs = response.data.data.jobs

    const locumUserCurrentJobs = allJobs.filter((locumsAppointed)=>{
    return locumsAppointed.appointed_to_locum_detail_id === locumUser.locum_detail.id
    })

    return{
        locumUser,
        locumUserCurrentJobs
    }

  },
}
</script>

<style>

</style>