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
                v-model="datePicker"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-yfull-widthmin-width="290px"
              >
                <v-text-field
                  slot="activator"
                  v-model="item.expiresAtStr"
                  label="Expires At"
                  prepend-icon="event"
                  readonly
                  :rules="[
			  () => !!item.expiresAtStr || 'The expiery date is required']"
                ></v-text-field>
                <v-date-picker v-model="item.expiresAtStr" @input="datePicker = false"></v-date-picker>
              </v-menu>

			  <v-slider v-model="item.daysBefore" thumb-label="always" :min="1" :max="14"/>

              <v-switch v-model="item.enabled" label="Enabled" />
            </v-form>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <!-- Move the buttons to the right -->
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="doClose">Close</v-btn>
        <v-btn color="green darken-1" flat @click="doAction" :disabled="disabled">{{ action }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    show: { type: Boolean, default: false },
    showItem: { type: Object, default: null }
  },
  model: {
    prop: "show",
    event: "close"
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
          this.$emit("close");
        }
      }
    },
    disabled() {
      return false;
      // return this.$v.item.$invalid;
    }
  },
  data() {
    return {
      item: this.emptyItem(),
      datePicker: false
    };
  },
  watch: {
    showItem(newValue) {
      this.item = newValue
        ? Object.assign(this.item, newValue)
        : this.emptyItem();
    },

    // watch a nested property
    "item.expiresAt": function(expiresAt, old) {
      if (expiresAt === old) return;

      // 'expiresAt' is Number object, so create a 'expiresAtDate' as Date
      this.item.expiresAtStr = expiresAt ? new Date(expiresAt).toISOString().substr(0, 10) : null;
    },
    "item.expiresAtStr": function(expiresAtStr, old) {
      if (expiresAtStr === old) return;

      // 'expiresAtDate' is Date object, so create a 'expiresAt' as Number
      this.item.expiresAt = expiresAtStr ? new Date(expiresAtStr).getTime() : null;
    }
  },
  methods: {
    emptyItem() {
      return {
        name: null,
		expiresAt: null,
		enabled: true,

		// The Date-picker works with String model
		expiresAtStr: null,
		
        daysBefore: 7,
      };
    },
    doClose() {
      this.$refs.form.resetValidation();

      this.item = this.emptyItem();

      this.active = false;
    },
    doAction() {
      // this time will use the built in v-form validation
      if (this.$refs.form.validate()) {
        this.$refs.form.resetValidation();

        const item = this.item;

        this.item = this.emptyItem();
        this.active = false;

        this.$emit("action", item);
      }
    }
  }
};
</script>
