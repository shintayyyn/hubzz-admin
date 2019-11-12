import Vue from "vue";
Vue.mixin({
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    CheckEmptyField(inputField, fieldName) {
      let index = this.formError.findIndex(item => item.field === fieldName);
      if (index >= 0) {
        this.formError.splice(index, 1);
      }
      if (!(inputField instanceof Array) && !inputField) {
        this.formError.push({
          field: fieldName,
          message: `${fieldName.replace(/_/g, " ")} is Required`
        });
      }
      if (inputField instanceof Array && !inputField.length) {
        this.formError.push({
          field: fieldName,
          message: `${fieldName.replace(/_/g, " ")} is Required`
        });
      }
      if (typeof inputField === "boolean" && inputField === false) {
        this.formError.push({
          field: fieldName,
          message: `${fieldName.replace(/_/g, " ")} is Required`
        });
      }
    },
    Validate(form, lists) {
      let items = Object.entries(form);
      for (const [key, value] of items) {
        // check if value is array
        if (Array.isArray(value)) {
          if (value.length === 0) {
            if (!lists) {
              this.formError.push({
                field: key,
                message: `${key.replace(/_/g, " ")} is Required`
              });
            }
            if (lists && !lists.includes(key)) {
              this.formError.push({
                field: key,
                message: `${key.replace(/_/g, " ")} is Required`
              });
            }
          }
        } else {
          if (!value || value.toString().trim().length === 0) {
            if (!lists) {
              this.formError.push({
                field: key,
                message: `${key.replace(/_/g, " ")} is Required`
              });
            }
            if (lists && !lists.includes(key)) {
              this.formError.push({
                field: key,
                message: `${key.replace(/_/g, " ")} is required`
              });
            }
          }
        }
      }
    },
    ValidateSamePassword(password, password_confirmation) {
      if (
        password &&
        password_confirmation &&
        password !== password_confirmation
      ) {
        return {
          field: "password_confirmation",
          message: "The Password must be the same"
        };
      }
    },
    ValidateEmail(email) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (email && !re.test(String(email).toLowerCase())) {
        return {
          field: "email",
          message: "This is not a valid email"
        };
      }
    }
  }
});
