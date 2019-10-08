<template>
  <section class="flex-1 flex flex-col overflow-hidden py-2">
    <div class="px-6">
      <div class="flex flex-no-wrap justify-start">
        <div class="text-base md:text-4xl font-bold md:font-normal mb-4 text-white">Frequently Asked Questions</div>
      </div>
      <div class="rounded-lg text-white bg-charade shadow-lg pt-8 px-5 pb-5 mb-10">
        <div class="inline-flex flex-wrap font-bold mt-4 mb-2">
          <div class="flex items-center ml-1 mr-2">
              <span>Locum</span>
          </div>
          <div class="flex">
            <nuxt-link
            :to="{path:`/faqs/addFaq/locum`}"
            class="flex mr-2 p-2 text-black rounded-lg bg-sunglow hover:bg-sunglow-dark cursor-pointer focus:outline-none">
              <span class="mr-2">Add</span> 
              <svgicon
                name="add-rectangle"
                width="21"
                height="21"
                color="black black"
                />
            </nuxt-link>
            <button v-if="deleteLocumFaq == false" @click="deleteLocumFaq = true" class="flex p-2 text-white font-bold bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer focus:outline-none">
              <span class="mr-2">Delete</span>
              <svgicon
                name="garbage"
                width="21"
                height="21"
                color="white white"
                />
            </button>
            <button v-if="deleteLocumFaq == true" @click="deleteLocumFaq = false" class="flex p-2 text-white font-bold bg-green-500 hover:bg-green-600 rounded-lg cursor-pointer focus:outline-none">
              <span class="mr-2">Done</span>
              <svgicon
                name="circle-check"
                width="21"
                height="21"
                color="white"
                />
            </button>
          </div>
        </div>

        <div v-for="item in locumFaqs" :key="item.id">
          <div class="inline-flex w-full">
            <nuxt-link v-if="deleteLocumFaq == false" :to="{path:`/faqs/${item.id}`}" class="flex items-center cursor-pointer mr-4"> 
              <svgicon
                name="edit"
                width="21"
                height="21"
                color="white white"
                />
            </nuxt-link>
            <div @click="toDeleteFaq(item.id)" v-if="deleteLocumFaq == true" class="flex items-center cursor-pointer mr-4">
              <svgicon
                name="garbage"
                width="21"
                height="21"
                color="red red"
                />
            </div>
            <div
              class="flex m-1 w-full rounded-lg bg-trout p-4 justify-between cursor-pointer"
              @click="toggleFaqOn(item)"
            >
              <div>{{item.question}}</div>
              <div class="font-bold text-lg">
                <svgicon name="arrow-right" height="20" width="20" color="white white" v-if="!item.toggled" />
                <svgicon name="arrow-up" height="20" width="20" color="white transparent" v-else/>
              </div>
            </div>
          </div>
          <div
            class="flex justify-start w-full h-auto mx-4 item-answer font-bold text-sm overflow-hidden"
            :class="{'toggled': item.toggled}"
          >
             <div v-html="item.answer" class="w-full h-auto mx-4"></div>
          </div>
        </div>
        <!---------------------------------------------------------------------------------->
        <div class="inline-flex font-bold mt-4 mb-2">
          <div class="flex items-center m-1">
              <span>Practice</span>
          </div>
          <nuxt-link
          :to="{path:`/faqs/addFaq/practice`}"
          class="flex items-center mx-2 p-2 text-black rounded-lg bg-sunglow hover:bg-sunglow-dark cursor-pointer focus:outline-none">
            <span class="mr-2">Add</span> 
            <svgicon
              name="add-rectangle"
              width="21"
              height="21"
              color="black black"
              />
          </nuxt-link>
          <button v-if="deletePracticeFaq == false" @click="deletePracticeFaq = true" class="flex items-center text-white font-bold p-2 bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer focus:outline-none">
            <span class="mr-2">Delete</span>
            <svgicon
              name="garbage"
              width="21"
              height="21"
              color="white white"
              />
          </button>
          <button v-if="deletePracticeFaq == true" @click="deletePracticeFaq = false" class="flex items-center p-2 text-white font-bold bg-green-500 hover:bg-green-600 rounded-lg cursor-pointer focus:outline-none">
            <span class="mr-2">Done</span>
            <svgicon
              name="circle-check"
              width="21"
              height="21"
              color="white"
              />
          </button>
        </div>
      
        <div v-for="item in practiceFaqs" :key="item.id">
          <div class="inline-flex w-full">
            <nuxt-link v-if="deletePracticeFaq == false" :to="{path:`/faqs/${item.id}`}" class="flex cursor-pointer mr-4"> 
              <svgicon
                name="edit"
                width="21"
                height="21"
                color="white white"
                class="mt-5"/>
            </nuxt-link>
            <div v-if="deletePracticeFaq == true" class="flex cursor-pointer mr-4">
              <svgicon
                name="garbage"
                width="21"
                height="21"
                color="red red"
                class="mt-5"/>
            </div>
            <div
              class="flex m-1 w-full rounded-lg bg-trout p-4 justify-between cursor-pointer"
              @click="toggleFaqOn(item)"
            >
              <div>{{item.question}}</div>
              <div class="font-bold text-lg">
                <svgicon name="arrow-right" height="20" width="20" color="white white" v-if="!item.toggled" />
                <svgicon name="arrow-up" height="20" width="20" color="white transparent" v-else/>
              </div>
            </div>
          </div>
          <div
            class="flex justify-start w-full h-auto mx-4 item-answer font-bold text-sm overflow-hidden"
            :class="{'toggled': item.toggled}"
          >
            <div v-html="item.answer" class="w-full h-auto mx-8"></div>
          </div>
        </div>
        

        <div class="faq-shield" v-if="$route.name.includes('index-faqs-index-addFaq')"></div>
        <div class="faq-shield" v-if="$route.name.includes('index-faqs-index-id')"></div>
      </div>
       <nuxt-child/>
    </div>
  </section>
</template>
<script>
export default {
  data(){
    return{
      deleteLocumFaq:false,
      deletePracticeFaq:false,
      editorOption: {
        theme: 'bubble',
        placeholder: "Edit Faqs",
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
          ]
        }
      }
    }
  },
  computed:{
    locumFaqs(){
      return this.$store.state.faqs.locumFaqs
    },
    practiceFaqs(){
      return this.$store.state.faqs.practiceFaqs
    },
  },
  async asyncData({ app, route, store, error }) {
    try{
      let response = await app.$axios.$get(`/api/v1/admin/faqs?domain=Locum`)
      let locumFaqs = response.data.faqs

      response = await app.$axios.$get('/api/v1/admin/faqs?domain=Practice')
      let practiceFaqs = response.data.faqs

      await store.commit('faqs/SET_LOCUM_FAQS', locumFaqs)
      await store.commit('faqs/SET_PRACTICE_FAQS',practiceFaqs)

    }catch(err){
      store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
      console.log('faqs error!', err)
    }
  },
  methods:{
    getLocumFaqs(){
      this.$store.dispatch("faqs/fetchLocumFaqs")
    },
    getPracticeFaqs(){
      this.$store.dispatch("faqs/fetchPracticeFaqs")
    },
    async toggleFaqOn(itemFaq){
      if(itemFaq.domain == 'Locum'){
        this.$store.commit('faqs/TOGGLE_LOCUM_FAQ',itemFaq)
      }
      if(itemFaq.domain == 'Practice'){
        this.$store.commit('faqs/TOGGLE_PRACTICE_FAQ',itemFaq)
      }
    },
    async toDeleteFaq(faqId){
        await this.$axios.delete(`/api/v1/admin/faqs/${faqId}`).then(()=>{
          this.getLocumFaqs()
          this.getPracticeFaqs()
          this.$store.commit('SET_NOTIFICATION',{ enabled: true, status:'success', text:'Delete Faq Successful'})
        }).catch(err=>{
          console.log('delete faq error!',err)
          this.$store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
        })
    }
  }
  
}
</script>
<style scoped>
.item-answer {
  height: 0;
  transition: all 0.3s ease-in-out;
}
.toggled {
  height: auto;
}
.faq-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
</style>
