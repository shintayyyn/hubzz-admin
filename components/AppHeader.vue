<template>
    <section class="header">
        <!-- HEADER -->
        <div class="flex justify-between items-center text-sm text-white px-6">
            <button class="toggle text-white focus:outline-none" @click="toggleSideBar">
                <img src="~/assets/images/hbg.png">
            </button>
            <nuxt-link to="/" class="py-3 cursor-pointer">
               <img src="~/assets/images/hubzz-icon-transparent.png"> 
            </nuxt-link>
            <nuxt-link to="/account" class="flex flex-row py-2 md:p-2 text-sm cursor-pointer" v-if="$auth.loggedIn">
                <div>
                    <img src = "~/assets/images/default-user-image.png" class="rounded-full" width="48px" height="48px">
                </div>
                <div class="hidden md:block m-2 mt-2 text-white">
                    {{ $auth.user.email }}
                    <div class="font-hairline text-xs">
                        My Account
                    </div>
                </div>
            </nuxt-link>
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
.header{
    display: inline;
}
.toggle{
  margin-left: 0;
}

@media screen and (min-width: 1200px){
  .toggle{
    display: none;
  }
  
} 
</style>
