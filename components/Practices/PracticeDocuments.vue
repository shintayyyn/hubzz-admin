<template>
  <!-- TABLE RESPONSIVE-->
  <div class="flex flex-col mx-2 text-white">
    <p class="text-sm italic">(Note: Only file types .pdf, .jpeg, .msword, .tiff are acccepted)</p>
    <!-- HEADER -->
    <div class="w-full hidden md:flex text-sm lg:text-base font-bold pb-3 md:px-2">
      <div class="w-1/4">Title</div>
      <div class="w-1/4 text-center">File Size</div>
      <div class="w-1/4 text-center">Last Upload Date</div>
      <div v-if="authAdminPermissions.includes('Upload Practice Documents')" class="w-1/4 text-center">Upload New File</div>
    </div>
    <!-- END HEADER -->
    <!-- BODY -->
    <div
      v-for="(document,index) in specificPracticeDocumentTypes"
      :key="`surgery-${index}`"
      class="relative w-full flex flex-col md:flex-row md:items-center rounded-lg bg-waterloo my-2 shadow-lg p-4 md:p-0 border-l-8 border-sunglow md:border-0"
    >
      <AppLoading :loading="uploading.includes(document.practiceDocType.id)" :message="'Uploading'" :spinner="false" class="rounded-lg"/>
      <div class="w-full md:w-1/4 py-2 md:px-2 flex flex-col items-start md:flex-row md:items-center">
        <div v-if="document.practiceSpecificDoc" class="p-2 mb-4 md:m-2 bg-green-500 rounded-lg flex items-center">
          <svgicon
            name="circle-check"
            width="23"
            height="23"
            color="white"
            />
          <span class="md:hidden pl-2">Approved</span>
        </div>
        <strong class="block md:hidden text-sm uppercase">Title</strong>
        <span
          class="whitespace-no-wrap"
        >{{ document.practiceDocType ? document.practiceDocType.name:null }}</span>
      </div>
      <div class="w-full md:w-1/4 py-2 md:px-2 flex flex-col md:flex-row md:items-center md:justify-center">
        <strong class="block md:hidden text-sm uppercase">File Size</strong>
        <span
          class="break-all"
        >{{ document.practiceSpecificDoc && document.practiceSpecificDoc.file ? (document.practiceSpecificDoc.file.size / 1048576).toFixed(2) + " Mb":null }}</span>
      </div>
      <div class="w-full md:w-1/4 py-2 md:px-2 flex flex-col md:flex-row md:items-center md:justify-center">
        <strong class="block md:hidden text-sm uppercase">Last Upload Date</strong>
        <span
          class="break-all"
        >{{ document.practiceSpecificDoc && document.practiceSpecificDoc.created_at ? $moment(document.practiceSpecificDoc.updated_at ? document.practiceSpecificDoc.updated_at : document.practiceSpecificDoc.created_at).format('MMM D, YYYY | hh:mm A'):null }}</span>
      </div>
      <div class="w-full md:w-1/4 py-2  flex flex-col md:flex-row md:items-center md:justify-center">
        <strong class="block md:hidden text-sm uppercase">Upload New File</strong>
        <div
          class="w-full flex md:flex-col lg:flex-row items-center lg:justify-center"
        >
          <div v-if="authAdminPermissions.includes('Upload Practice Documents')" class="flex items-center md:justify-center px-1 py-1" :class="document.practiceSpecificDoc ? '' : 'w-full'">
            <div class="flex justify-center text-white text-sm">
              <label>
                <!-- File -->
                <input
                  type="file"
                  id="file"
                  :ref="`file-${document.practiceDocType.id}`"
                  v-on:change="handleFileUpload(`file-${document.practiceDocType.id}`, document.practiceDocType.id, practice.id, document.practiceDocType.id, document.practiceSpecificDoc)"
                />
                <span class="cursor-pointer flex items-center text-center rounded-full text-white px-4 py-2 text-xs" :class="document.practiceSpecificDoc ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-green-500 '">
                  <svgicon name="cloud-upload" width="16" height="16" color="transparent white" />
                  <span class="pl-2">{{ document.practiceSpecificDoc ? 'Update' : 'Upload' }}</span>
                </span>
              </label>
            </div>
          </div>

          <div v-if="document.practiceSpecificDoc" class=" flex items-center justify-center text-white text-xs px-1 py-1 xl:py-0">
            <nuxt-link
              :to="{path:`/practices/${practice.id}/practice-documents/${document.practiceSpecificDoc ? document.practiceSpecificDoc.id: null}`,query}"
              class="bg-blue-500 hover:bg-blue-600 flex items-center text-center rounded-full text-white no-underline px-6 py-2"
            >
              <svgicon name="folder" width="16" height="16" color="white white"></svgicon>
              <span class="pl-2">View</span>
            </nuxt-link>
            
          </div>
        </div>
      </div>
    </div>
    <!-- END BODY -->
  </div>
  <!-- END TABLE -->
</template>

<script>
import AppLoading from '@/components/Base/AppLoading'
export default {
  components: {
    AppLoading
  },
  props: ["practice"],
  data() {
    return {
      file: "",
      // specificPracticeDocumentTypes:[],
      files: [],
      practiceDocTypes: [],
      practiceDocs: [],
      query: null,
      uploading: []
    };
  },
  created() {
    (this.query = {
      ...this.$route.query
    }),
      this.getData();
  },
  computed: {
    specificPracticeDocumentTypes() {
      return this.$store.state.practices.specificPracticeDocumentTypes;
    },
    authAdminPermissions() {
      return this.$store.getters["permissions"]
    },
  },

  methods: {
    async getData() {
      try {
        const pracDocTypes = await this.$axios
          .$get(`/api/v1/admin/practice-document-types`)
          .then(res => {
            this.practiceDocTypes = res.data.practice_document_types;
          })
          .catch(err => {
            store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: "Something went wrong!"
            });
          });
        this.practiceDocs = await this.$axios.$get(
          `/api/v1/admin/practice-documents`,
          {
            params: {
              practice_id: this.practice.id
            }
          }
        );
        const specificPracticeDocumentTypes = this.practiceDocTypes.map(
          practiceDocType => {
            const practiceSpecificDoc = this.practiceDocs.data.practice_documents.find(
              practiceDoc => {
                return (
                  practiceDoc.practice_document_type.id === practiceDocType.id
                );
              }
            );
            return {
              practiceDocType,
              practiceSpecificDoc
            };
          }
        );
        await this.$store.commit(
          "practices/SET_PRACTICE_DOCUMENTS",
          specificPracticeDocumentTypes
        );
      } catch (err) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: "Something went wrong!"
        });
      }
    },
    async handleFileUpload(refName, documentId, practiceID, practiceDocumentID, practiceSpecificDocument){
       console.log(
        "Infos uploaded: \n",
        "refname: ",
        refName,
        "docID: ",
        documentId,
        "prac id: ",
        practiceID,
        "prac docid: ",
        practiceDocumentID,
        "prac document: ",
        practiceSpecificDocument
      );

      const el = this.$refs[refName][0];
      if (el.files && el.files.length === 0) {
        return;
      }
      const file = el.files[0];
      let types = ["pdf", "jpeg", "msword", "tiff"];
      console.log("legit file", file.name, file)
      const fileReader = new FileReader();

      if (!types.includes(file.type.split("/")[1])) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: "Invalid file format"
        });
        return;
      }
      // if (!types.includes(practiceSpecificDocument.file.subtype)){
      //   this.$store.commit("SET_NOTIFICATION", {
      //     enabled: true,
      //     status: "danger",
      //     text: "!!",
      //     doNotClose: true,
      //   });
      //   return
      // }
      this.uploading.push(documentId)

      fileReader.readAsDataURL(file);
      

      const index = this.files.findIndex(({ id }) => id === documentId);

      if (index > -1) {
        this.files.splice(index, 1, {
          id: documentId,
          file
        });
      } else {
        this.files.push({
          id: documentId,
          file
        });
      }

      try {
        let formData = new FormData();
        let file = this.files.find(({ id }) => id === practiceDocumentID);
        if (file) {
          file = file.file;
          // console.log("practice id: "+practiceID+"practice doc id: "+practiceDocumentID)
          // console.log(file)

          if (practiceSpecificDocument) {
            // console.log('File exists: PUT Request (Updates Existing)')
            // console.log(practiceSpecificDocument)

            formData.append("practice_document_id", practiceID);
            formData.append("file", file);

            const response = await this.$axios
              .put(
                `/api/v1/admin/practice-documents/${practiceSpecificDocument.id}`,
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data"
                  },
                  onUploadProgress: function (progressEvent) {
                    console.log('ew')
                  }
                }
              )
              .then(async () => {
                // console.log("practice doc",this.practiceDocTypes)
                this.practiceDocs = await this.$axios.$get(
                  `/api/v1/admin/practice-documents`,
                  {
                    params: {
                      practice_id: this.practice.id
                    }
                  }
                );
                // console.log('prac docs',this.practiceDocs.data.practice_documents)

                let specificPracticeDocumentTypes = this.practiceDocTypes.map(
                  practiceDocType => {
                    const practiceSpecificDoc = this.practiceDocs.data.practice_documents.find(
                      practiceDoc => {
                        return (
                          practiceDoc.practice_document_type.id ===
                          practiceDocType.id
                        );
                      }
                    );
                    return {
                      practiceDocType,
                      practiceSpecificDoc
                    };
                  }
                )
                await this.$store.commit(
                  "practices/SET_PRACTICE_DOCUMENTS",
                  specificPracticeDocumentTypes
                );
                // console.log('practice docs',specificPracticeDocumentTypes)
                this.uploading = []
                this.$store.commit("SET_NOTIFICATION", {
                  enabled: true,
                  status: "success",
                  text: "Upload Success"
                });
              })
              .catch(err => {
                this.$store.commit("SET_NOTIFICATION", {
                  enabled: true,
                  status: "danger",
                  text: "Something went wrong!"
                });
                console.log(err);
              });
          } else {
            // console.log('File does not exist: POST Request (Posts new file)')
            formData.append("file", file);
            formData.append("practice_id", practiceID);
            formData.append("practice_document_type_id", practiceDocumentID);

            const response = await this.$axios
              .post("/api/v1/admin/practice-documents", formData, {
                headers: {
                  "Content-Type": "multipart/form-data"
                }
              })
              .then(async () => {
                // console.log("practice doc",this.practiceDocTypes)
                this.practiceDocs = await this.$axios.$get(
                  `/api/v1/admin/practice-documents`,
                  {
                    params: {
                      practice_id: this.practice.id
                    }
                  }
                );
                // console.log('prac docs',practiceDocs.data.practice_documents)

                let specificPracticeDocumentTypes = this.practiceDocTypes.map(
                  practiceDocType => {
                    const practiceSpecificDoc = this.practiceDocs.data.practice_documents.find(
                      practiceDoc => {
                        return (
                          practiceDoc.practice_document_type.id ===
                          practiceDocType.id
                        );
                      }
                    );
                    return {
                      practiceDocType,
                      practiceSpecificDoc
                    };
                  }
                );
                await this.$store.commit(
                  "practices/SET_PRACTICE_DOCUMENTS",
                  specificPracticeDocumentTypes
                );
                this.uploading = []
                this.$store.commit("SET_NOTIFICATION", {
                  enabled: true,
                  status: "success",
                  text: "Upload Success!"
                });
              })
              .catch(err => {
                this.$store.commit("SET_NOTIFICATION", {
                  enabled: true,
                  status: "danger",
                  text: "Something went wrong!"
                });
                console.log(err);
              });
          }
        } else {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "alert",
            text: "Please choose a file to upload first."
          });
        }
      } catch (err) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: "Something went wrong!"
        });
        console.log("index practices index _id index asyncData err", err);
      }
    }
  }
};
</script>

<style>
button:focus {
  outline: none;
}
#file {
  color: transparent;
  -webkit-appearance: none;
  appearance: none;
  display: none;
}
.practice-document-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.practice-document-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #FFC72C;
  transition: all 0.3s ease-in-out;
  background-color: #505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .practice-document-modal {
    width: 70%;
  }
}
</style>