<template>
    <section class="header">
        <!-- HEADER -->
        <div class="flex justify-between text-sm text-white py-2 px-6">
            <button class="toggle text-white" @click="toggleSideBar">
                <img src="~/assets/images/hbg.png">
            </button>

            <img src="~/assets/images/hubzz-icon-transparent.png">

            <div class="p-2 text-sm" v-if="$auth.loggedIn">
                <span>{{ $auth.user.email }}</span>
            </div>
        </div>
        <!-- HEADER -->
    </section>
</template>
<script>
export default {
    methods: {
        toggleSideBar() {
            this.$store.commit("TOGGLE_SIDEBAR", true);
        document.body.style.overflow = "hidden";    
        },
    }
}
</script>

<style>

.toggle{
  margin-left: 0;
}

@media screen and (min-width: 1200px){
  .toggle{
    display: none;
  }
  
} 
</style>

