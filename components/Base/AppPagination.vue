<template>
  <div class="w-full pagination flex flex-col">
    <div class="w-full flex flex-wrap justify-between py-2 text-sm">
      <div class="text-gray-500">
        <div>{{ pageInfo(perPage, currentPage, total) }}</div>
      </div>
      <div class="pl-2">
        <div>
          List
          <select v-model="selectedLimit" class="bg-white border-b-2 focus:border-yellow-400 focus:outline-none px-2">
            <option v-if="total > 5" :value="5">
              5
            </option>
            <option v-if="total > 10" :value="10">
              10
            </option>
            <option v-if="total > 15" :value="15">
              15
            </option>
            <option v-if="total > 20" :value="20">
              20
            </option>
            <option v-if="total > 30" :value="30">
              30
            </option>
            <option v-if="total > 50" :value="50">
              50
            </option>
            <option :value="total" selected>
              All
            </option>
          </select>
          items
        </div>
      </div>
    </div>
    <div v-if="totalPages > 1" class="flex flex-col justify-center items-center py-2">
      <div class="flex items-center">
        <div class="pagination-item m-1">
          <button
            type="button"
            class="font-bold text-xs md:text-sm py-2 px-1 mx-1 focus:outline-none"
            :class="currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'hover:text-gray-800 text-gray-700'"
            :disabled="loading || isInFirstPage"
            @click="onClickFirstPage"
          >
            <svgicon name="first-track" width="12" height="12" class="fill-current" />
          </button>
        </div>

        <div class="pagination-item m-1">
          <button
            type="button"
            :disabled="loading || isInFirstPage"
            class="font-bold text-xs md:text-sm py-2 px-1 mx-1 focus:outline-none"
            :class="isInFirstPage ? 'text-gray-900 cursor-not-allowed' : 'hover:text-gray-800 text-gray-700'"
            @click="onClickPreviousPage"
          >
            <svgicon name="caret-down" width="12" height="12" class="fill-current" style="transform: rotate(90deg)" />
          </button>
        </div>

        <div v-for="page in pages" :key="page.name" class="pagination-item m-1">
          <button
            type="button"
            class="text-gray-700 font-bold text-xs md:text-sm py-2 px-1 mx-1 focus:outline-none"
            :disabled="loading || page.isDisabled"
            :class="{ active: isPageActive(page.name) }"
            @click="onClickPage(page.name)"
          >
            {{ page.name }}
          </button>
        </div>

        <div class="pagination-item next m-1">
          <button
            type="button"
            :disabled="loading || isInLastPage"
            class="font-bold text-xs md:text-sm py-2 px-1 mx-1 focus:outline-none"
            :class="isInLastPage ? 'text-gray-500 cursor-not-allowed' : 'hover:text-gray-800 text-gray-700'"
            @click="onClickNextPage"
          >
            <svgicon name="caret-down" width="12" height="12" class="fill-current" style="transform: rotate(-90deg)" />
          </button>
        </div>

        <div class="pagination-item m-1">
          <button
            type="button"
            class="font-bold text-xs md:text-sm py-2 px-1 mx-1 focus:outline-none"
            :class="currentPage === pages ? 'text-gray-500 cursor-not-allowed' : 'hover:text-gray-800 text-gray-700'"
            :disabled="loading || isInLastPage"
            @click="onClickLastPage"
          >
            <svgicon name="last-track" width="12" height="12" class="fill-current" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    maxVisibleButtons: {
      type: Number,
      required: false,
      default: 5
    },
    totalPages: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    perPage: {
      type: Number,
      required: false,
      default: 15
    }
  },
  data() {
    return {
      selectedLimit: null
    }
  },
  computed: {
    isInFirstPage() {
      return this.currentPage === 1
    },
    isInLastPage() {
      return this.currentPage === this.totalPages
    },
    startPage() {
      if (this.currentPage === 1 || this.currentPage === 2 || this.totalPages <= this.maxVisibleButtons) {
        return 1
      }

      if (this.currentPage === this.totalPages - 1) {
        return this.totalPages - this.maxVisibleButtons + 1
      }

      if (this.currentPage === this.totalPages && this.totalPages > this.maxVisibleButtons) {
        return this.totalPages - this.maxVisibleButtons + 1
      }

      return this.currentPage - 2
    },

    pages() {
      const range = []
      for (let i = this.startPage; i <= Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages); i += 1) {
        range.push({
          name: i,
          isDisabled: i === this.currentPage
        })
      }
      return range
    }
  },
  watch: {
    selectedLimit(newValue, oldValue) {
      if ((newValue, oldValue)) {
        this.$emit('limitchanged', newValue)
      }
    }
  },
  mounted() {
    this.selectedLimit = this.perPage
    if (this.total < this.selectedLimit) {
      this.selectedLimit = this.total
    }
  },
  methods: {
    pageInfo(perPage, currentPage, total) {
      return ` Showing ${perPage * currentPage + 1 - perPage} to
      ${Math.ceil(total / perPage) === currentPage ? total : currentPage * perPage} of ${total} items`
    },
    onClickFirstPage() {
      this.$emit('pagechanged', 1)
    },
    onClickPreviousPage() {
      this.$emit('pagechanged', this.currentPage - 1)
    },
    onClickPage(page) {
      this.$emit('pagechanged', page)
    },
    onClickNextPage() {
      this.$emit('pagechanged', this.currentPage + 1)
    },
    onClickLastPage() {
      this.$emit('pagechanged', this.totalPages)
    },
    isPageActive(page) {
      return this.currentPage === page
    }
  }
}
</script>
<style scoped>
.page-button {
  background: linear-gradient(to top, #f2d024, #efde86);
}
.active {
  border-bottom: 2px solid #999999;
}

button:active :not(button:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 transparent;
}
button:disabled,
button:disabled svg {
  /* background: #e2e2e2; */
  color: #999999;
  cursor: not-allowed;
  fill: #999999;
  box-shadow: 0 0 0 transparent;
}
</style>
