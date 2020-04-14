<template>
  <section class="header">
    <!-- HEADER -->
    <div class="flex justify-between items-center text-sm text-white px-4 md:px-6">
      <button class="toggle text-white focus:outline-none" @click="toggleSideBar">
        <img src="~/assets/images/hbg.png">
      </button>
      <nuxt-link to="/" class="py-3 cursor-pointer">
        <img src="~/assets/images/hubzz-icon-transparent.png"> 
      </nuxt-link>
      <div class="flex justify-right">
        <div class="m-4 cursor-pointer">
          <div @click="notificationToggle = !notificationToggle">
            <svgicon name="notification" width="30" height="30" color="white" class="ml-2" />
          </div>
          <div v-if="notificationToggle === true">
            <ul class="dropdown-menu">
              <li class="head text-light bg-dark">
                <div class="row">
                  <div class="col-lg-12 col-sm-12 col-12">
                    <span>Notifications (3)</span>
                    <a href="" class="float-right text-light">Mark all as read</a>
                  </div>
                </div>
              </li>
              <li class="notification-box">
                <div class="row">
                  <div class="col-lg-3 col-sm-3 col-3 text-center">
                    <img src="/demo/man-profile.jpg" class="w-50 rounded-circle">
                  </div>    
                  <div class="col-lg-8 col-sm-8 col-8">
                    <strong class="text-info">David John</strong>
                    <div>
                      Lorem ipsum dolor sit amet, consectetur
                    </div>
                    <small class="text-warning">27.11.2015, 15:00</small>
                  </div>    
                </div>
              </li>
              <li class="notification-box bg-gray">
                <div class="row">
                  <div class="col-lg-3 col-sm-3 col-3 text-center">
                    <img src="/demo/man-profile.jpg" class="w-50 rounded-circle">
                  </div>    
                  <div class="col-lg-8 col-sm-8 col-8">
                    <strong class="text-info">David John</strong>
                    <div>
                      Lorem ipsum dolor sit amet, consectetur
                    </div>
                    <small class="text-warning">27.11.2015, 15:00</small>
                  </div>    
                </div>
              </li>
              <li class="notification-box">
                <div class="row">
                  <div class="col-lg-3 col-sm-3 col-3 text-center">
                    <img src="/demo/man-profile.jpg" class="w-50 rounded-circle">
                  </div>    
                  <div class="col-lg-8 col-sm-8 col-8">
                    <strong class="text-info">David John</strong>
                    <div>
                      Lorem ipsum dolor sit amet, consectetur
                    </div>
                    <small class="text-warning">27.11.2015, 15:00</small>
                  </div>    
                </div>
              </li>
              <li class="footer bg-dark text-center">
                <a href="" class="text-light">View All</a>
              </li>
            </ul>
          </div>
        </div>
        
        <nuxt-link to="/account" class="flex flex-row py-2 text-sm cursor-pointer" v-if="$auth.loggedIn">
          <div>
            <img src = "~/assets/images/default-user-image.png" class="rounded-full" width="48px" height="48px">
          </div>
          <div class="hidden md:block ml-2 mt-2 text-white">
            {{ $auth.user.email }}
            <div class="font-hairline text-xs">
              My Account
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>
    <!-- HEADER -->
  </section>
</template>
<script>
export default {
  data (){
    return{
      notificationToggle: false
    }
  },
  methods: {
    toggleSideBar () {
      this.$store.commit("TOGGLE_SIDEBAR", true)
      document.body.style.overflow = "hidden"
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
.dropdown-menu{
  top: 60px;
  right: 0px;
  left: unset;
  width: 460px;
  box-shadow: 0px 5px 7px -1px #c1c1c1;
  padding-bottom: 0px;
  padding: 0px;
}
.dropdown-menu:before{
  content: "";
  position: absolute;
  top: -20px;
  right: 12px;
  border:10px solid #343A40;
  border-color: transparent transparent #343A40 transparent;
}
.notification-box{
  padding: 10px 0px; 
}
@media screen and (min-width: 1200px){
  .dropdown-menu{
    top: 50px;
    left: -16px;  
    width: 290px;
  } 
  .toggle{
    display: none;
  }
  
} 
</style>
