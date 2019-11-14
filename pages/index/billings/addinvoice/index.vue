<template>
  <div class="billing-modal p-4 md:p-8 shadow-lg">
    <AddInvoice />
  </div>
</template>

<script>
import AddInvoice from "@/components/Billings/AddInvoice";
export default {
  components: {
    AddInvoice
  },
  async asyncData({ app, route }) {
    try {
    } catch (err) {
      console.log("index qualifications index create asyncData err", err);
    }
  },

  data() {
    return {
      name: ""
    };
  }
};
</script>
<style>
.invoice {
  width: 100%;
}
@media (min-width: 480px) {
  .right-side-header-content {
    width: calc(100% - 0px);
  }
}
.page-overlap {
  min-width: 100%;
}
@media screen and (min-width: 768px) {
  .page-overlap {
    min-width: calc(100% - 70px);
  }
  .invoice {
    width: 800px;
  }
}

@media screen and (min-width: 1200px) {
  .page-overlap {
    min-width: calc(100% - 200px);
  }
}

.billing-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px yellow;
  transition: all 0.3s ease-in-out;
  background-color: #505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .billing-modal {
    width: 80%;
  }
}
.billing-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
</style>
