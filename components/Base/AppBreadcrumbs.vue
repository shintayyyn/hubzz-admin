<template>
  <div class="flex items-center py-2">
    <div 
      v-for="(item, index) in crumbs" :key="index" 
      class="flex items-center"
      :class="item.classes"
    >
      <span v-if="index > 0 && index < crumbs.length" class="font-bold text-gray-500 mx-2">
        <svgicon
          :name="'arrow-right'"
          width="9"
          class="fill-current"
        /> 
      </span>
      
      <div class="text-gray-700" :class="index !== crumbs.length-1 ? 'hover:text-blue-500 cursor-pointer' :''" @click="$router.push(item.to)">
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    crumbs () {
      const routeMatched = this.$route.path.split("/")
      
      routeMatched.shift()
      
      let to = ''

      let toArray = []

      routeMatched.forEach((item) => {
        to = `${to}/${item}`
        toArray.push(to)
      })

      let breadcrumbs = routeMatched.reduce((breadcrumbArray, path, index) => {
        let text = this.$route.matched[index].meta.breadCrumb || path

        text = text.replace(/-/g, ' ')

        text = text.replace(/(^\w{1})|(\s{1}\w{1})/g, word => word.toUpperCase())
        
        breadcrumbArray.push({
          path: path,
          to: toArray[index],
          text,
        })

        return breadcrumbArray
      }, [])

      return breadcrumbs.filter(items=> items.text !== '')
    }
  },
}
</script>
