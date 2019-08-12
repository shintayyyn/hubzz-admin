<template>
    <div class="locum-modal shadow-lg">
        <transition name = "slide" mode = "out-in">
            <LocumDetailModal :user="user"/>
        </transition>
        <nuxt-child/>
    </div>
</template>
<script>
import LocumDetailModal from '@/components/Locums/LocumDetailModal'
export default {
    // transition:{
    //     name:'slide',
    //     mode:'out-in'
    // },
    components:{
        LocumDetailModal
    },
    data() {
        return {
            user: null,
        }
    },
    async asyncData({app, route}){
        try{
            let response = await app.$axios.get(`/api/v1/admin/locum-users/${route.params.id}`)
            const user = response.data.data.user
            return{
                user
            }
        }catch(err){
             console.log('get locum error!!!!',err)
        }
    }
}
</script>
<style>
.card {
  min-width: 100px;
  height: 250px;
  box-sizing: content-box;
}
.locum-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.locum-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px orange;
  transition: all 0.3s ease-in-out;
  background-color:#505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .locum-modal {
    width: 80%;
  }
}
</style>
