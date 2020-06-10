<template>
  <section>
    <div>
      <AppLoading :loading="loading" spinner />
      <div
        class="relative flex flex-col overflow-x-auto w-full px-2 mt-4"
        :style="totalPages > 1 && `min-height: ${minHeight}`"
      >
        <div class="row hidden md:flex text-white justify-start font-bold leading-none text-sm">
          <div
            v-for="(column, index) in columns"
            :key="`${column}-${index}`"
            class="flex-1 flex items-center p-2"
            :class="[
              column.class &&
                column.class.includes('text-center') &&
                'justify-center',
              column.sortable && 'cursor-pointer'
            ]"
            @click="column.sortable && sort(column.sortIndex || column.dataIndex)"
          >
            <span class="pr-1">{{ column.name }}</span>
            <svgicon
              v-if="column.sortable"
              :name="sortIcon(column.dataIndex)"
              height="12"
              width="12"
              color="#fff"
            />
          </div>
        </div>
        <div v-for="item in items" :key="item.id" class="row py-2">
          <nuxt-link
            :to="{ path: `${routerLink}/${routerId ? item[routerId] : item.id}`, query: { ...$route.query } }"
            :event="!routerLink || (routerId && item[routerId] === null) ? '' : 'click'"
          >
            <div
              class="flex flex-col md:flex-row items-start md:items-center justify-start shadow-md rounded-lg py-3 bg-waterloo text-white border-l-8 border-sunglow md:border-none"
              :class="routerLink ? 'transition-hover hover:bg-waterloo-dark' : 'cursor-default'"
            >
              <div
                v-for="(column, index) in columns"
                :key="index"
                class="flex-1 px-2"
                :class="column.class"
              >
                <template v-if="Array.isArray(dataCell(item, column))">
                  <div
                    v-for="(itemName, basis) in dataCell(item, column)"
                    :key="`${itemName}-${basis}`"
                  >
                    {{ itemName }}
                  </div>
                </template>

                <template v-else>
                  <template v-if="column.slotName">
                    <div v-if="column.slotName == 'checker'" @click="$emit(column.eventName, item)">
                      <slot :name="column.slotName" :item="item" />
                    </div>
                    <slot v-else :name="column.slotName" :item="item" @click="$emit(column.eventName, item)" />
                  </template>
                  <template v-else-if="column.dataIndex === 'actions'">
                    <slot name="actions" :item="item" @click="$emit('click', item)" />
                  </template>
                  <template v-else-if="column.dataIndex === 'actions-button'">
                    <slot name="actions-button" :item="item" />
                  </template>
                  <template
                    v-else-if="
                      column.class &&
                        column.class.includes('localDate') &&
                        dataCell(item, column) !== '(none)'
                    "
                  >
                    {{ dataCell(item, column) | localDate }}
                  </template>
                  <template
                    v-else-if="
                      column.class &&
                        column.class.includes('currency') &&
                        dataCell(item, column) !== '(none)'
                    "
                  >
                    {{ dataCell(item, column) | currency }}
                  </template>
                  <template
                    v-else-if="
                      column.class &&
                        column.class.includes('fileSize') &&
                        dataCell(item, column) !== '(none)'
                    "
                  >
                    {{ dataCell(item, column) | fileSize }}
                  </template>
                  <template v-else>
                    {{ dataCell(item, column) }}
                  </template>
                </template>
              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
    <div v-if="total > 0" class="bottom-0 w-full">
      <AppPagination
        :total="total"
        :total-pages="totalPages"
        :current-page="currentPage"
        :loading="loading"
        :perPage="perPage"
        @pagechanged="pagechanged"
        @limitchanged="limitchanged"
      />
    </div>
  </section>
</template>

<script>
  import AppPagination from "@/components/Base/AppPagination"
  import AppLoading from "@/components/Base/AppLoading"
  export default {
    components: {
      AppLoading,
      AppPagination
    },
    props: {
      nestedItem: {
        type: Object,
        default: null,
        required: false,
      },
      total: {
        type: Number,
        required: true
      },
      items: {
        type: Array,
        required: true
      },
      loading: {
        type: Boolean,
        default: false
      },
      currentPage: {
        type: Number,
        default: 1
      },
      perPage: {
        type: Number,
        default: 10
      },
      columns: {
        type: Array,
        required: true
      },
      orderBy: {
        type: Array,
        required: false,
        default: () => []
      },
      routerLink: {
        type: String,
        default: null
      },
      routerId: {
        type: String,
        default: null
      },
      customWidth: {
        type: Number,
        default: null
      },
      minHeight: {
        type: String,
        default: null
      }
    },
    data () {
      return {
        params: []
        // totalPages: 0
      }
    },
    computed: {
      totalPages () {
        return Math.ceil(this.total / this.perPage)
      }
    },
    mounted () {
      this.params = this.orderBy
      // this.totalPages = Math.ceil(this.total / this.perPage);
    },
    methods: {
      sort (dataIndex) {
        if (!this.params.some(item => item.includes(`${dataIndex}`))) {
          this.params = []
          this.params.push(`${dataIndex}:desc`)
        } else {
          let index = this.params.findIndex(item => item === `${dataIndex}:desc`)
          if (index >= 0) {
            this.params.splice(index, 1, `${dataIndex}:asc`)
          } else {
            this.params.splice(
              this.params.findIndex(item => item === `${dataIndex}:asc`),
              1
            )
          }
        }
        this.$emit("sorted", this.params)
      },
      pagechanged (pageNumber) {
        const nestedItem = this.nestedItem ? this.nestedItem : null
        if (this.nestedItem) {
          this.$emit("pagechanged", pageNumber, nestedItem)
        } else {
          this.$emit("pagechanged", pageNumber)
        }
      },
      checkClicked (item) {
        this.$emit("toggleCheck", item)
      },
      limitchanged (limit) {
        this.$emit ("limitchanged", limit)
      },

      sortIcon (dataIndex) {
        return this.params.some(orderBy => orderBy === dataIndex || orderBy === `${dataIndex}:asc`)
          ? 'sort-ascend'
          : this.params.some(orderBy => orderBy === `${dataIndex}:desc`)
            ? 'sort-descend'
            : 'sort'
      },

      dataCell (item, column) {
        var dataIndexArr = column.dataIndex.split(".")
        let str = null
        if (Array.isArray(item[dataIndexArr[0]])) {
          str = []
          item[dataIndexArr[0]].forEach(item => {
            if (item[dataIndexArr[2]]) {
              str.push(item[dataIndexArr[1]][dataIndexArr[2]])
            } else {
              str.push(item[dataIndexArr[1]])
            }
          })
        } else {
          str = ""
          // let itemArray = null
          // let itemStr = null
          // let dataIndex = null
          if (dataIndexArr.length === 1) {
            str = item[dataIndexArr[0]]
          }
          if (dataIndexArr.length === 2 && item[dataIndexArr[0]]) {
            str = item[dataIndexArr[0]][dataIndexArr[1]]
          }
          if (
            dataIndexArr.length === 3 &&
            item[dataIndexArr[0]] &&
            item[dataIndexArr[0]][dataIndexArr[1]]
          ) {
            str = item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]]
          }
          if (
            dataIndexArr.length === 4 &&
            item[dataIndexArr[0]] &&
            item[dataIndexArr[0]][dataIndexArr[1]] &&
            item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]]
          ) {
            str =
              item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][
                dataIndexArr[3]
              ]
          }
          if (
            dataIndexArr.length === 5 &&
            item[dataIndexArr[0]] &&
            item[dataIndexArr[0]][dataIndexArr[1]] &&
            item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][
              dataIndexArr[3]
            ]
          ) {
            str =
              item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][
                dataIndexArr[3]
              ][dataIndexArr[4]]
          }
          if (
            dataIndexArr.length === 6 &&
            item[dataIndexArr[0]] &&
            item[dataIndexArr[0]][dataIndexArr[1]] &&
            item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][
              dataIndexArr[3]
            ] &&
            item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][
              dataIndexArr[3]
            ][dataIndexArr[4]]
          ) {
            str =
              item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]][
                dataIndexArr[3]
              ][dataIndexArr[4]][dataIndexArr[5]]
          }
        }
        if (str === false) {
          str = "No"
        }
        if (str === true) {
          str = "Yes"
        }
        if (str === null || str === "") {
          str = "(none)"
        }
        return str
      }
    }
  }
</script>

<style scoped>
  @media (min-width: 768px) {
    .row {
      min-width: 1200px;
    }
  }
</style>
