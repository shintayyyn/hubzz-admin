<template>
  <div class="flex flex-col justify-center items-center py-2 w-full">
    <div class="flex items-center">
      <div v-if="pages > 2" class="m-1">
        <button
          type="button"
          class="font-bold text-xs md:text-sm py-2 px-1 mx-1 focus:outline-none"
          :class="navButtonClass(isFirstPage)"
          :disabled="loading || isFirstPage"
          @click="goFirst"
        >
          <svgicon name="first-track" width="12" height="12" class="fill-current" />
        </button>
      </div>

      <div class="m-1">
        <button
          type="button"
          class="font-bold text-xs md:text-sm py-2 px-1 mx-1 focus:outline-none"
          :class="navButtonClass(isFirstPage)"
          :disabled="loading || isFirstPage"
          @click="goPrevious"
        >
          <svgicon name="caret-down" width="12" height="12" class="fill-current" style="transform: rotate(90deg)" />
        </button>
      </div>

      <div class="flex">
        <div v-for="pageItem in visiblePages" :key="pageItem" class="m-1">
          <button
            type="button"
            class="text-gray-700 hover:text-gray-800 font-bold text-xs md:text-sm py-2 px-1 mx-1 focus:outline-none"
            :disabled="loading || activePage === pageItem"
            :class="{ 'active border-b-2 border-gray-600 cursor-not-allowed': activePage === pageItem }"
            @click="activePage = pageItem"
          >
            {{ pageItem }}
          </button>
        </div>
      </div>

      <div class="m-1">
        <button
          type="button"
          class="font-bold text-xs md:text-sm py-2 px-1 mx-1 focus:outline-none"
          :class="navButtonClass(isLastPage)"
          :disabled="loading || isLastPage"
          @click="goNext"
        >
          <svgicon name="caret-down" width="12" height="12" class="fill-current" style="transform: rotate(-90deg)" />
        </button>
      </div>

      <div v-if="pages > 2" class="m-1">
        <button
          type="button"
          class="font-bold text-xs md:text-sm py-2 px-1 mx-1 focus:outline-none"
          :class="navButtonClass(isLastPage)"
          :disabled="loading || isLastPage"
          @click="goLast"
        >
          <svgicon name="last-track" width="12" height="12" class="fill-current" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: { type: Boolean, default: false },
    count: { type: Number, default: 0 },
    pages: { type: Number, default: 1 },
    page: { type: Number, default: 1 },
    maxPage: { type: Number, default: 5 }
  },

  computed: {
    activePage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('page', val)
      }
    },

    isFirstPage() {
      return this.activePage === 1
    },

    isLastPage() {
      return this.activePage === this.pages
    },

    visiblePages() {
      const result = []
      const { pages, activePage, maxPage } = this

      const left = Math.floor((maxPage - 1) / 2)
      const right = Math.ceil((maxPage - 1) / 2)

      for (let p = 1; p <= pages; p++) {
        const inStartRange = activePage < left + 2 && p < maxPage + 1
        const inEndRange = activePage > pages - right - 1 && p > pages - maxPage
        const inMiddleRange = p >= activePage - left && p <= activePage + right

        if (inStartRange || inEndRange || inMiddleRange) {
          result.push(p)
        }
      }

      return result
    }
  },

  methods: {
    navButtonClass(disabled) {
      return disabled ? 'text-gray-500 cursor-not-allowed' : 'hover:text-gray-800 text-gray-700'
    },

    goFirst() {
      this.activePage = 1
    },

    goPrevious() {
      this.activePage = Math.max(1, this.activePage - 1)
    },

    goNext() {
      this.activePage = Math.min(this.pages, this.activePage + 1)
    },

    goLast() {
      this.activePage = this.pages
    }
  }
}
</script>
