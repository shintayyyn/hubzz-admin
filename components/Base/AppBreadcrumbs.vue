<template>
  <div class="flex items-center py-2">
    <div 
      v-for="(item, index) in crumbs" :key="index" 
      class="flex"
      :class="item.classes"
    >
      <span v-if="index > 0 && index < crumbs.length" class="font-bold text-gray-500 mx-2">
        <svgicon
          :name="'arrow-right'"
          width="9"
          class="fill-current mt-2"
        /> 
      </span>
      <div class="text-gray-700" @click="$router.push(item.to)">
        {{ item.text }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    links: {
			type: Array,
      default: () => [],
		},
  },
  
  computed: {
    crumbs () {
      const routeMatched = this.$route.path.split("/")
      routeMatched.shift()
      console.log('routeMatched', routeMatched)
      let breadcrumbs = routeMatched.reduce((breadcrumbArray, path, index) => {
        let text = this.$route.matched[index].meta.breadCrumb || path
        text = text.replace(/-/g, ' ')
        text = text.replace(/(^\w{1})|(\s{1}\w{1})/g, word => word.toUpperCase())
        let to = ''

        routeMatched.forEach((item) => {
          to = `${to}/${item}`
        })

        console.log('to', to)
        breadcrumbArray.push({
          path: path,
          to: breadcrumbArray[index - 1]
            ? "/" + breadcrumbArray[index - 1].path + "/" + path
            : "/" + path,
          text,
        })
        console.log('breadcrumbArray', breadcrumbArray[index - 1])
        return breadcrumbArray
      }, [])
      console.log('routematched', routeMatched)
      return breadcrumbs
    }
  },

  methods: {
    onClickHandler (url, index) {
      if (index !== this.links.length-1) {
        this.$router.push(url)
      }
    }
  }
}
</script>