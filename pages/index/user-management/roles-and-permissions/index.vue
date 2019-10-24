<template>
    <div class="flex-1 flex flex-col py-2 px-4 overflow-auto">
      <div class="flex flex-row-reverse px-2 justify-between flex-wrap">
        <div>
             <button
          class="inline-flex no-underline m-1 py-2 px-4 md:my-2 bg-red-500 text-sm font-semibold text-white rounded-lg shadow md:float-right"
          >Delete Role</button>
          <button
          class="inline-flex no-underline m-1 py-2 px-4 md:my-2 bg-green-500 text-sm font-semibold text-white rounded-lg shadow md:float-right"
          >Add New Role</button>
        </div>
      </div>
      <div class="px-2 table border-separate overflow-x-auto" style="border-spacing: 0 10px;">
        <!-- HEADER -->
        <div class="hidden md:table-row font-bold text-white text-sm py-4">
          <div class="table-cell p-2 align-middle">Role Name</div> 
          <div class="table-cell p-2 align-middle">Date Created</div>
          <div class="table-cell p-2 align-middle">Description</div>
        </div>
        <!-- END HEADER -->
        <!-- BODY -->
        <div
          v-for="(roles, index) in roles_and_permissions"
          :key="`roles-${index}`"
          class="flex flex-col sm:flex-row sm:flex-wrap justify-between px-2 py-2 border-l-8 border-yellow-500 md:border-l-0 md:table-row my-2 text-white no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light" 
        >
          <div class="flex flex-col text-white sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
            <strong class="block md:hidden text-sm uppercase">Role Name</strong>
            <span class="break-word">{{ roles.role_name }}</span>
          </div>
          <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
            <strong class="block md:hidden text-sm uppercase">Date Created</strong>
            <span class="break-all">{{ roles.date_created }}</span>
          </div>
          <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
            <strong class="block md:hidden text-sm uppercase">Description</strong>
            <span class="break-all">{{ roles.description }}</span>
          </div>
        </div>
      </div>
      
    </div>
</template>
<script>
export default {
  data(){
    return{
      roles_and_permissions:[
        {
          id:1,
          role_name: 'Super Admin',
          date_created: '2019-10-18',
          description: 'God Above All'
        },
        {
          id:2,
          role_name: 'Admin',
          date_created: '2019-10-18',
          description: 'God`s right hand'
        },
        {
          id:3,
          role_name: 'Associate Admin',
          date_created: '2019-10-18',
          description: 'Lowest form of all admins'
        },
        {
          id:4,
          role_name: 'Practice-Only Admin',
          date_created: '2019-10-18',
          description: 'Only has control towards practices '
        },
        {
          id:5,
          role_name: 'Locum Only Admin',
          date_created: '2019-10-18',
          description: 'Only controls Locums'
        },
      ],
    }
  },
  async asyncData({ app, route, store}){
    try{

    }catch(err){
      console.log('get error!', err)
    }
  }
}
</script>
<style>

</style>