<template>
  <section>
    <div class="px-10">
      <div class="flex flex-no-wrap justify-start">
        <div class="text-4xl mb-4 text-white">Frequently Asked Questions</div>
      </div>
    </div>
    <div class="px-10 mt-5">
      <div class="rounded-lg text-white bg-charade shadow-lg pt-10 px-5 pb-5 mb-10">
        <div class="inline-flex font-bold mt-4 mb-2">
          <div class="flex m-1">
              <span>Locum</span>
          </div>
          <nuxt-link
          :to="{path:`/faqs/addFaq/locum`}"
          class="flex mx-1 -my-1 p-2 text-black rounded-lg bg-sunglow">
            Add 
            <svgicon
            name="add-rectangle"
            width="21"
            height="21"
            color="black black"
            class="mx-1 -my-1 cursor-pointer"/>
          </nuxt-link>
        </div>

        <div v-for="item in locum_faqs" :key="item.id">
          <div class="inline-flex w-full">
            <nuxt-link :to="{path:`/faqs/${item.id}`}" class="flex cursor-pointer"> 
              <svgicon
              name="edit"
              width="21"
              height="21"
              color="white white"
              class="mt-5"/>
            </nuxt-link>
            <div
              class="flex m-1 w-full rounded-lg bg-trout p-4 justify-between cursor-pointer"
              @click="item.toggled = !item.toggled"
            >
              <div>{{item.question}}</div>
              <div class="font-bold text-lg">
                <svgicon name="arrow-right" height="20" width="20" color="white white" v-if="!item.toggled" />
                <svgicon name="arrow-up" height="20" width="20" color="white transparent" v-else/>
              </div>
            </div>
          </div>
          <div
            class="flex justify-start item-answer font-bold text-sm overflow-hidden"
            :class="{'toggled': item.toggled}"
          >
             <quillEditor :options="editorOption" v-model="item.answer" class="w-full mx-4"></quillEditor>
          </div>
        </div>

        <div class="inline-flex font-bold mt-4 mb-2">
          <div class="flex m-1">
              <span>Practice</span>
          </div>
          <nuxt-link
          :to="{path:`/faqs/addFaq/practice`}"
          class="flex mx-1 -my-1 p-2 text-black rounded-lg bg-sunglow">
            Add 
            <svgicon
            name="add-rectangle"
            width="21"
            height="21"
            color="black black"
            class="mx-1 -my-1 cursor-pointer"/>
          </nuxt-link>
        </div>

        <div v-for="item in practice_faqs" :key="item.id">
          <div class="inline-flex w-full">
            <nuxt-link :to="{path:`/faqs/${item.id}`}" class="flex cursor-pointer"> 
              <svgicon
              name="edit"
              width="21"
              height="21"
              color="white white"
              class="mt-5"/>
            </nuxt-link>
            <div
              class="flex m-1 w-full rounded-lg bg-trout p-4 justify-between cursor-pointer"
              @click="item.toggled = !item.toggled"
            >
              <div>{{item.question}}</div>
              <div class="font-bold text-lg">
                <svgicon name="arrow-right" height="20" width="20" color="white white" v-if="!item.toggled" />
                <svgicon name="arrow-up" height="20" width="20" color="white transparent" v-else/>
              </div>
            </div>
          </div>
          <div
            class="flex justify-start item-answer font-bold text-sm overflow-hidden"
            :class="{'toggled': item.toggled}"
          >
            <quillEditor :options="editorOption" v-model="item.answer" class="w-full mx-4"></quillEditor>
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
import { quillEditor } from 'vue-quill-editor'
export default {
  components:{
    quillEditor
  },
  data(){
    return{
       editorOption: {
          theme: 'bubble',
          placeholder: "hahaha",
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'font': [] }],
              [{ 'align': [] }],
              ['link', 'image'],
              ['clean']
            ]
          }
       }
    }
  },
  async asyncData({ app, route, store, error }) {
    const response = await app.$axios.$get(`/api/v1/admin/faqs`)
    let faqs = response && response.data && response.data.faqs ? response.data.faqs : []
    faqs = faqs.map((faq) => {
      return {
        ...faq,
        'toggled': false
      }
    })
    const locum_faqs = faqs.filter(faq => faq.domain === 'Locum')
    const practice_faqs = faqs.filter(faq => faq.domain === 'Practice')
    return {
      locum_faqs,
      practice_faqs
    }
  },
}
</script>
<style scoped>
.item-answer {
  height: 0;
  transition: all 0.3s ease-in-out;
}
.toggled {
  height: 50px;
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
