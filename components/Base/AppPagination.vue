<template>
  <div class="pagination flex flex-col my-2" v-if="totalPages > 1">
    <div class="flex flex-col justify-center items-center">
      <div class="flex items-center flex-wrap justify-center md:hidden">
        <div class="pagination-item mx-1 mb-2" v-for="page in pages" :key="page.name">
        <button
            type="button"
            class="page-button md:px-4 p-2 w-10 min-w-0 rounded-lg font-bold text-sm text-gray-800 focus:outline-none"
            @click="onClickPage(page.name)"
            :class="{ active: isPageActive(page.name) }"
          >{{ page.name }}</button>
        </div>
      </div>
      <div class="flex items-center">
        <div class="pagination-item mx-1">
          <button
            type="button"
            class="relative page-button p-4 md:py-2 rounded-lg font-bold text-sm text-black focus:outline-none"
            @click="onClickFirstPage"
            :disabled="loading || isInFirstPage"
          >
            <span class="hidden md:block">First</span>
            <span class="md:hidden absolute mx-1 my-1 left-0 top-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z" />
              </svg>
            </span>
          </button>
        </div>

        <div class="pagination-item mx-1">
          <button
            type="button"
            class="relative page-button p-4 md:py-2 rounded-lg font-bold text-sm text-black focus:outline-none"
            @click="onClickPreviousPage"
            :disabled="loading || isInFirstPage"
          >
            <span class="hidden md:block">Previous</span>
            <span class="md:hidden absolute mx-1 my-1 left-0 top-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" />
              </svg>
            </span>
          </button>
        </div>

        <div class="hidden md:block pagination-item mx-1" v-for="page in pages" :key="page.name">
          <button
            type="button"
            class="page-button p-2 px-4 rounded-lg font-bold text-sm text-gray-800 focus:outline-none"
            @click="onClickPage(page.name)"
            :class="{ active: isPageActive(page.name) }"
          >{{ page.name }}</button>
        </div>

        <div class="pagination-item next mx-1">
          <button
            type="button"
            class="relative page-button p-4 md:py-2 rounded-lg font-bold text-sm text-black focus:outline-none"
            @click="onClickNextPage"
            :disabled="loading || isInLastPage"
          >
            <span class="hidden md:block">Next</span>
            <span class="md:hidden absolute mx-1 my-1 left-0 top-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </span>
          </button>
        </div>

        <div class="pagination-item mx-1">
          <button
            type="button"
            class="relative page-button p-4 md:py-2 rounded-lg font-bold text-sm text-black focus:outline-none"
            @click="onClickLastPage"
            :disabled="loading || isInLastPage"
          >
            <span class="hidden md:block">Last</span>
            <span class="md:hidden absolute mx-1 my-1 left-0 top-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z" />
              </svg>
            </span>
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
    // perPage: {
    //   type: Number,
    //   required: true
    // },
    currentPage: {
      type: Number,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isInFirstPage() {
      return this.currentPage === 1;
    },
    isInLastPage() {
      return this.currentPage === this.totalPages;
    },
    startPage() {
      if (
        this.currentPage === 1 ||
        (this.currentPage === 2 || this.totalPages <= this.maxVisibleButtons)
      ) {
        return 1;
      }

      if (this.currentPage === this.totalPages - 1) {
        return this.totalPages - this.maxVisibleButtons + 1;
      }

      if (
        this.currentPage === this.totalPages &&
        this.totalPages > this.maxVisibleButtons
      ) {
        return this.totalPages - this.maxVisibleButtons + 1;
      }

      return this.currentPage - 2;
    },
    pages() {
      const range = [];
      for (
        let i = this.startPage;
        i <=
        Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages);
        i += 1
      ) {
        range.push({
          name: i,
          isDisabled: i === this.currentPage
        });
      }
      return range;
    }
  },
  methods: {
    onClickFirstPage() {
      this.$emit("pagechanged", 1);
    },
    onClickPreviousPage() {
      this.$emit("pagechanged", this.currentPage - 1);
    },
    onClickPage(page) {
      this.$emit("pagechanged", page);
    },
    onClickNextPage() {
      this.$emit("pagechanged", this.currentPage + 1);
    },
    onClickLastPage() {
      this.$emit("pagechanged", this.totalPages);
    },
    isPageActive(page) {
      return this.currentPage === page;
    }
  }
};
</script>
<style scoped>
.pagination {
  /* list-style-type: none; */
  /* padding: 0; */
}
.pagination-item {
  /* display: inline-block; */
  /* margin-right: 8px; */
}
.active {
  background: linear-gradient(to top, #dbb013, #ecc94b);
  color: #000;
  box-shadow: 0 3px 5px #333;
}

button:active :not(button:disabled){
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 transparent;
}

button:disabled, button:disabled svg {
  background: linear-gradient(to top, #6b717e, #6b7386);
  color: #aaa;
  cursor: not-allowed;
  fill: #aaa;
}
</style>

