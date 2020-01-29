<template>
  <div class="flex-1 flex flex-col py-2 px-2 md:px-6 overflow-y-auto">

    <div class="px-2 text-xl md:text-4xl text-white">Standard Terms</div>

    <div class="practice-shield" v-if="$route.name !== 'index-standard-terms'" @click="$router.push('/standard-terms')"></div>

    <div>
      <section>
        <div>

          <AppLoading :loading="loading" message="Loading" spinner />

          <!-- TABLE -->
          <div class="flex flex-col w-full px-2 py-2 md:mt-4 overflow-x-auto">

            <!-- TABLE HEADER -->
            <div class="row hidden md:flex justify-start leading-none text-sm text-white">

              <div class="flex-1 flex items-center px-2 justify-center">
                <span class="pr-1">ID</span>
              </div>
              <div class="flex-1 flex items-center px-2 justify-center">
                <span class="pr-1">Filename</span>
              </div>
              <div class="flex-1 flex items-center px-2 justify-center">
                <span class="pr-1">Uploaded At</span>
              </div>
              <div class="flex-1 flex items-center px-2 justify-center">
                <span class="pr-1">Action</span>
              </div>

            </div>
            <!-- TABLE HEADER -->

            <!-- TABLE BODY -->
            <div class="row py-2">
              <nuxt-link :to="standardTerms ? `/standard-terms/${standardTerms.file_id}` : '/standard-terms'">
                <div class="flex flex-col md:flex-row items-start md:items-center justify-start shadow-md rounded-lg py-3 bg-waterloo text-white border-l-8 border-sunglow md:border-none transition-hover hover:bg-waterloo-dark">

                  <div class="flex flex-col md:block flex-1 md:truncate px-2 leading-tight py-1 md:py-0 md:text-center md:items-center md:justify-center">
                    <span class="md:hidden pr-1 font-bold">ID</span>
                    <span>{{ standardTerms ? standardTerms.file_id : null }}</span>
                  </div>

                  <div class="flex flex-col md:block flex-1 md:truncate px-2 leading-tight py-1 md:py-0 md:text-center md:items-center md:justify-center">
                    <span class="md:hidden pr-1 font-bold">Filename</span>
                    <span>{{ standardTerms && standardTerms.file ? standardTerms.file.filename : null }}</span>
                  </div>

                  <div class="flex flex-col md:block flex-1 md:truncate px-2 leading-tight py-1 md:py-0 md:text-center md:items-center md:justify-center">
                    <span class="md:hidden pr-1 font-bold">Uploaded At</span>
                    <span>{{ standardTerms && standardTerms.file && standardTerms.file.created_at ? $moment(standardTerms.file.created_at, 'YYYY-MM-DD').format('DD/MM/YYYY | HH:mm A') : null }}</span>
                  </div>

                  <div class="flex flex-col md:block flex-1 md:truncate px-2 leading-tight py-1 md:py-0 md:text-center md:items-center md:justify-center">
                    <span class="md:hidden pr-1 font-bold">Action</span>
                    <span>
                      <button>Upload</button>
                    </span>
                  </div>

                </div>
              </nuxt-link>
            </div>
            <!-- TABLE BODY -->

          </div>
          <!-- TABLE -->

        </div>
      </section>
    </div>

    <nuxt-child />

  </div>
</template>

<script>
  import AppLoading from "@/components/Base/AppLoading";

  export default {
    components: {
      AppLoading
    },

    data() {
      return {
        loading: false,
        standardTerms: null,
        routerLink: '/standard-terms',
      }
    },

    computed: {
      items() {
        return [
          {
            id: this.standardTerms ? this.standardTerms.id : null,
            filename: this.standardTerms ? this.standardTerms.filename : null,
            created_at: this.standardTerms ? this.standardTerms.created_at : null,
          },
        ]
      },

      columns() {
        return [
          {
            name: 'ID',
            dataIndex: 'id',
            class: 'text-center',
            sortable: false
          },
          {
            name: 'Filename',
            dataIndex: 'filename',
            class: 'text-center',
            sortable: false
          },
          {
            name: 'Uploaded At',
            dataIndex: 'created_at',
            class: 'text-center localDate',
            sortable: false,
          },
          {
            name: 'Action',
            dataIndex: 'created_at',
            class: 'text-center localDate',
            sortable: false,
          },
        ]
      },
    },

    methods: {
      dataCell(item, column) {
        var dataIndexArr = column.dataIndex.split(".");
        let str = null;

        if (Array.isArray(item[dataIndexArr[0]])) {
          str = [];
          item[dataIndexArr[0]].forEach(item => {
            str.push(item[dataIndexArr[1]][dataIndexArr[2]]);
          });
        } else {
          str = "";
          let itemArray = null;
          let itemStr = null;
          let dataIndex = null;
          if (dataIndexArr.length === 1) {
            str = item[dataIndexArr[0]];
          }
          if (dataIndexArr.length === 2 && item[dataIndexArr[0]]) {
            str = item[dataIndexArr[0]][dataIndexArr[1]];
          }
          if (
            dataIndexArr.length === 3 &&
            item[dataIndexArr[0]] &&
            item[dataIndexArr[0]][dataIndexArr[1]]
          ) {
            str = item[dataIndexArr[0]][dataIndexArr[1]][dataIndexArr[2]];
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
              ];
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
              ][dataIndexArr[4]];
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
              ][dataIndexArr[4]][dataIndexArr[5]];
          }
        }
        if (str === false) {
          str = "No";
        }
        if (str === true) {
          str = "Yes";
        }
        if (str === null) {
          str = "Unavailable";
        }
        return str;
      }
    },

    mounted() {
      this.loading = true
      this.standardTerms = null
      this.$axios.get('/api/v1/admin/standard-terms').then((response) => {
        this.standardTerms = response.data.data.standard_terms
      }).catch((err) => {
        console.log('err.response || err', err.response || err)
        this.$nuxt.error(err.response || err)
      }).finally(() => {
        this.loading = false
      })
    },
  }
</script>
