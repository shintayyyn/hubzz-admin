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
          <!-- <svgicon name="arrow-left" width="13" height="13" /> -->
        </button>
      </div>

      <div class="flex">
        <div v-for="pageItem in visiblePages" :key="pageItem" class="m-1">
          <button
            type="button"
            class="text-gray-700 hover:text-gray-800 font-bold text-xs md:text-sm py-2 px-1 mx-1 focus:outline-none"
            :disabled="loading || activePage === pageItem"
            :class="{
              'active border-b-2 border-gray-600 cursor-not-allowed': activePage === pageItem
            }"
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
          <!-- <svgicon name="arrow-right" width="13" height="13" /> -->
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
    loading: {
      type: Boolean,
      default: false
    },
    count: {
      type: Number,
      default: 0
    },
    pages: {
      type: Number,
      default: 1
    },
    page: {
      type: Number,
      default: 1
    },
    maxPage: {
      type: Number,
      default: 5
    }
  },

  computed: {
    activePage: {
      get() {
        return this.page
      },
      set(page) {
        this.$emit('page', page)
      }
    },

    isFirstPage() {
      return this.activePage === 1
    },

    isLastPage() {
      return this.activePage === this.pages
    },

    visiblePages() {
      const pageItems = []

      for (let page = 1; page <= this.pages; page++) {
        if (this.showPage(page)) {
          pageItems.push(page)
        }
      }

      return pageItems
    },

    showPage() {
      return page => {
        const left = Math.floor((this.maxPage - 1) / 2)
        const right = Math.ceil((this.maxPage - 1) / 2)

        if (this.activePage < left + 2) {
          return page < this.maxPage + 1
        }

        if (this.activePage > this.pages - right - 1) {
          return page > this.pages - this.maxPage
        }

        return page >= this.activePage - left && page <= this.activePage + right
      }
    }
  },

  methods: {
    navButtonClass(isDisabled) {
      return isDisabled ? 'text-gray-500 cursor-not-allowed' : 'hover:text-gray-800 text-gray-700'
    },

    goFirst() {
      this.activePage = 1
    },

    goPrevious() {
      this.activePage = this.activePage > 1 ? this.activePage - 1 : 1
    },

    goNext() {
      this.activePage = this.activePage < this.pages ? this.activePage + 1 : this.pages
    },

    goLast() {
      this.activePage = this.pages
    }
  }
}
</script>

<style>
.__pagination_button {
  background: linear-gradient(to top, #f2d024, #efde86);
  color: #000;
}

.active {
  border-bottom: 2px solid #999999;
}

.__pagination_button.active:disabled {
  color: #f2d024;
  box-shadow: inset 0px 0px 0px 2px #dbb013;
  cursor: default;
}

.__pagination_button:active {
  transform: translate(2px, 2px);
}

.__pagination_button:active :not(.__pagination_button:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 transparent;
}

.__pagination_button:disabled,
.__pagination_button:disabled svg {
  background: #696c71;
  color: #999999;
  fill: #999999;
  box-shadow: 0 0 0 transparent;
}
</style>
