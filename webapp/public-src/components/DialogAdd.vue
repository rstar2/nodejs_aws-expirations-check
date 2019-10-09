<template>
  <v-dialog v-model="active" max-width="450">
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>

      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <!-- This time will use the built in v-form validation -->
            <v-form ref="form" lazy-validation>
              <v-flex xs12>
                <v-text-field
                  label="Name*"
                  v-model="item.name"
                  :rules="[
			  () => !!item.name || 'The name is required',
			  () => !!item.name && item.name.length >= 5 || 'Name must have at least 5 letters']"
                ></v-text-field>
              </v-flex>

              <v-menu
                v-model="datePicker.active"
                :close-on-content-click="false"
                offset-y
                transition="scale-transition"
                offset-yfull-widthmin-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="item.expiresAtStr"
                    label="Expires At"
                    hint="MM/DD/YYYY format"
                    prepend-icon="event"
                    @blur="void 0"
                    :rules="[() => !!item.expiresAtStr || 'Expiry date is required']"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="item.expiresAtStr"
                  @input="datePicker.active = false"
                  :min="datePickerMin"
                  :max="datePickerMax"
                  :picker-date.sync="datePicker.pickerDate"
                  no-title
                  scrollable
                ></v-date-picker>
              </v-menu>

              <v-slider
                v-model="item.daysBefore"
                :min="1"
                :max="14"
                thumb-label="always"
                :thumb-size="16"
              />

              <v-switch v-model="item.enabled" label="Enabled" />
            </v-form>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <!-- Move the buttons to the right -->
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="_doClose">Close</v-btn>
        <v-btn color="green darken-1" text @click="_doAction" :disabled="disabled">{{ action }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
/**
 * @param {Date} date
 * @return {String}
 */
const isoFormat = date => date.toISOString().substr(0, 10);

export default {
  props: {
    show: { type: Boolean, default: false },
    showItem: { type: Object, default: null }
  },
  model: {
    prop: "show",
    event: "close"
  },
  data() {
    return {
      item: this._emptyItem(),

      datePicker: {
        active: false,
        pickerDate: null
      }
    };
  },
  computed: {
    title() {
      return this.showItem
        ? "Update expiration-check item"
        : "Add new expiration-check item";
    },
    action() {
      return this.showItem ? "Update" : "Add";
    },
    active: {
      // getter
      get: function() {
        return !!this.show;
      },
      // setter
      set: function(newValue) {
        if (!newValue) {
          this.$emit("close", false);
        }
      }
    },
    disabled() {
      return false;
      // return this.$v.item.$invalid;
    },
    datePickerMin() {
      return isoFormat(new Date());
    },
    datePickerMax() {
      const minDate = new Date(this.datePickerMin);
      minDate.setFullYear(minDate.getFullYear() + 3);
      return isoFormat(minDate);
    }
  },
  watch: {
    show(isShown) {
      // on each show of the dialog - reset the DatePicker initial year-month date
      if (isShown) {
        this.datePicker.pickerDate = this.datePickerMin.split("-").slice(0, 2).join("-");
      } else {
		this.$refs.form.resetValidation();
		this.item = this._emptyItem();
	  }
    },
    showItem(newItem) {
      this.item = newItem
        ? Object.assign(this.item, newItem)
        : this._emptyItem();
    },

    // watch a nested property
    "item.expiresAt": function(expiresAt, old) {
      if (expiresAt === old) return;

      // 'expiresAt' is Number object, so create a 'expiresAtStr' as String
      this.item.expiresAtStr = expiresAt
        ? isoFormat(new Date(expiresAt))
        : null;
    },
    "item.expiresAtStr": function(expiresAtStr, old) {
      if (expiresAtStr === old) return;

      // 'expiresAtDate' is Date object, so create a 'expiresAt' as Number
      this.item.expiresAt = expiresAtStr
        ? new Date(expiresAtStr).getTime()
        : null;
    }
  },
  methods: {
    _emptyItem() {
      return {
        name: null,
        expiresAt: null,
        enabled: true,

        // TODO: move into the data()
        // The Date-picker works with String model
        expiresAtStr: "",

        daysBefore: 7
      };
    },
    _doClose() {
      this.active = false;
    },
    _doAction() {
      // this time will use the built in v-form validation
      if (this.$refs.form.validate()) {
        this._doClose();

        this.$emit("action", this.item);
      }
    }
  }
};
</script>
