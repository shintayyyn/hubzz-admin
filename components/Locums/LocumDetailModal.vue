<template>
  <div class="p-8 max-w-xl">
    <nuxt-link to="/locums" class="cursor-pointer">
      <svgicon name="arrow-left-solid" height="32" width="32" class="text-white fill-current"/>
    </nuxt-link>

    <LocumTabs/>
    <div class="mt-5">
      <transition name="fade" mode="out-in">
        <Component :is="activeComponent" :user="user" />
      </transition>
    </div>
    
    <div>
      <nuxt-child/>
    </div>

  </div>
</template>
<script>
import LocumTabs from '@/components/Locums/LocumTabs'
import LocumProfile from '@/components/Locums/LocumProfile'
import LocumJobs from '@/components/Locums/LocumJobs'
import LocumCompliance from '@/components/Locums/LocumCompliance'
export default {
  props:['user'],
  components:{
      LocumTabs,
      locum_profile : LocumProfile,
      locum_jobs : LocumJobs,
      locum_compliance : LocumCompliance
  },
  created() {
    const query = {
      ...this.$route.query,
      locum_tab: this.$route.query.locum_tab || 'locum_profile'
    }
    this.$router.push({ query })
  },
  computed: {
    activeComponent() {
      return this.$route.query.locum_tab
    }
  },
}
</script>
