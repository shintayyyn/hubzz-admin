<template>
  <div class="w-full pagination flex flex-wrap justfify-between items-center">
    <div class="flex-1 flex flex-wrap justify-between pt-2 md:py-2 text-sm">
      <div class="text-gray-500 w-full md:w-auto text-center md:text-left">
        <div v-if="total > 0" class="whitespace-no-wrap">
          {{ pageInfo(perPage, currentPage, total) }}
        </div>
      </div>
      <div class="hidden pl-2 text-white">
        <div>
          List
          <select
            v-model="selectedLimit"
            class="bg-transparent border-b-2 focus:border-yellow-400 focus:outline-none px-2 mx-2"
          >
            <option v-if="total > 5" class="text-black" :value="5">
              5
            </option>
            <option v-if="total > 10" class="text-black" :value="10">
              10
            </option>
            <option v-if="total > 15" class="text-black" :value="15">
              15
            </option>
            <option v-if="total > 20" class="text-black" :value="20">
              20
            </option>
            <option v-if="total > 30" class="text-black" :value="30">
              30
            </option>
            <option v-if="total > 50" class="text-black" :value="50">
              50
            </option>
            <option class="text-black" :value="total">
              All
            </option>
          </select>
          items
        </div>
      </div>
    </div>
    <div
      v-if="total > 0"
      class="flex flex-col justify-center items-center py-2 w-full"
    >
      <div :class="pages.length > 2 ? 'flex md:hidden' : 'hidden'">
        <div v-for="page in pages" :key="page.name" class="md:hidden pagination-item m-1">
          <button
            type="button"
            class="page-button rounded-lg py-2 px-3 md:px-4 font-bold text-xs md:text-sm focus:outline-none"
            :disabled="loading || (page.isDisabled && isPageActive(page.name))"
            :class="{ active: isPageActive(page.name) }"
            @click="onClickPage(page.name)"
          >
            {{ page.name }}
          </button>
        </div>
      </div>

      <div class="flex items-center">
        <div v-if="pages.length > 2" class="pagination-item m-1">
          <button
            type="button"
            class="relative page-button rounded-lg h-full p-3 flex justify-center items-center font-bold text-sm focus:outline-none"
            :class="{ 'text-gray-500 cursor-not-allowed': isInFirstPage }"
            :disabled="loading || isInFirstPage"
            @click="onClickFirstPage"
          >
            <!-- <span class="hidden md:block">First</span> -->
            <svgicon name="left-chevron" width="13" height="13" />
            <!-- <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
							<path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z" />
						</svg>-->
          </button>
        </div>

        <div class="pagination-item m-1">
          <button
            type="button"
            class="relative page-button rounded-lg h-full py-3 px-3 flex justify-center items-center font-bold text-sm focus:outline-none"
            :class="{ 'text-gray-500 cursor-not-allowed': isInFirstPage }"
            :disabled="loading || isInFirstPage"
            @click="onClickPreviousPage"
          >
            <!-- <span class="hidden md:block">Previous</span> -->
            <svgicon name="arrow-left" width="13" height="13" />
          </button>
        </div>

        <div :class="pages.length > 2 ? 'hidden md:flex' : 'flex'">
          <div v-for="page in pages" :key="page.name" class="pagination-item m-1">
            <button
              type="button"
              class="rounded-lg page-button py-2 px-3 md:px-4 font-bold text-xs md:text-sm focus:outline-none"
              :disabled="loading || (page.isDisabled && isPageActive(page.name))"
              :class="{ active: isPageActive(page.name) }"
              @click="onClickPage(page.name)"
            >
              {{ page.name }}
            </button>
          </div>
        </div>

        <div class="pagination-item next m-1">
          <button
            type="button"
            class="relative page-button rounded-lg h-full p-3 font-bold text-sm focus:outline-none"
            :class="{ 'text-gray-500 cursor-not-allowed': isInLastPage }"
            :disabled="loading || isInLastPage"
            @click="onClickNextPage"
          >
            <!-- <span class="hidden md:block">Next</span> -->
            <svgicon name="arrow-right" width="13" height="13" />
            <!-- <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
							<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
						</svg>-->
          </button>
        </div>

        <div v-if="pages.length > 2" class="pagination-item m-1">
          <button
            type="button"
            class="relative page-button rounded-lg h-full p-3 font-bold text-sm focus:outline-none"
            :class="{ 'text-gray-500 cursor-not-allowed': isInLastPage }"
            :disabled="loading || isInLastPage"
            @click="onClickLastPage"
          >
            <!-- <span class="hidden md:block">Last</span> -->
            <svgicon name="right-chevron" width="13" height="13" />
            <!-- <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
							<path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z" />
						</svg>-->
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
			type: Number
			// required: true
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
			default: 10,
		}
	},
	data () {
		return {
			selectedLimit: null
		}
	},
	computed: {
		isInFirstPage () {
			return this.currentPage === 1
		},
		isInLastPage () {
			return this.currentPage === this.totalPages
		},
		startPage () {
			if (
				this.currentPage === 1 ||
				this.currentPage === 2 ||
				this.totalPages <= this.maxVisibleButtons
			) {
				return 1
			}

			if (this.currentPage === this.totalPages - 1) {
				return this.totalPages - this.maxVisibleButtons + 1
			}

			if (
				this.currentPage === this.totalPages &&
				this.totalPages > this.maxVisibleButtons
			) {
				return this.totalPages - this.maxVisibleButtons + 1
			}

			return this.currentPage - 2
		},
		pages () {
			const range = []
			for (
				let i = this.startPage;
				i <=
				Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages);
				i += 1
			) {
				range.push({
					name: i,
					isDisabled: i === this.currentPage
				})
			}
			return range
		}
	},
	watch: {
		selectedLimit (newValue, oldValue) {
			if ((newValue, oldValue)) {
				this.$emit("limitchanged", newValue)
			}
		}
	},
	mounted () {
		this.selectedLimit = this.perPage
	},
	methods: {
		pageInfo (perPage, currentPage, total) {
			return ` Showing ${perPage * currentPage + 1 - perPage} to
      		${
						Math.ceil(total / perPage) === currentPage
							? total
							: currentPage * perPage
					} of ${total} items`
		},
		onClickFirstPage () {
			this.$emit("pagechanged", 1)
		},
		onClickPreviousPage () {
			this.$emit("pagechanged", this.currentPage - 1)
		},
		onClickPage (page) {
			this.$emit("pagechanged", page)
		},
		onClickNextPage () {
			this.$emit("pagechanged", this.currentPage + 1)
		},
		onClickLastPage () {
			this.$emit("pagechanged", this.totalPages)
		},
		isPageActive (page) {
			return this.currentPage === page
		}
	}
}
</script>
<style scoped>
.page-button {
	background: linear-gradient(to top, #f2d024, #efde86);
	color: #000;
}
.active {
	background: linear-gradient(to top, #dbb013, #ecc94b);
	color: #000;
	box-shadow: 0 3px 5px #333;
}
button.active:disabled {
	color: #f2d024;
	box-shadow: inset 0px 0px 0px 2px #dbb013;
	cursor: default;
}

button:active {
	transform: translate(2px, 2px);
}

button:active :not(button:disabled) {
	transform: translate(2px, 2px);
	box-shadow: 0 0 0 transparent;
}

button:disabled,
button:disabled svg {
	background: #696c71;
	color: #999999;
	cursor: not-allowed;
	fill: #999999;
	box-shadow: 0 0 0 transparent;
}
</style>
