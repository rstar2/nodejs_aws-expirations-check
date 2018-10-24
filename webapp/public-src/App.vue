<template>
	<div class="md-layout">
        <md-toolbar class="md-layout-item md-size-100 md-dense">
            <div class="md-toolbar-section-start">
                <h3 class="md-title">Expirations list</h3>
            </div>
            <div class="md-toolbar-section-end">
                <md-button @click="apiRefresh" class="md-primary md-raised">Refresh</md-button>
                <md-button @click="showDialogAdd = true" class="md-primary md-raised">Add</md-button>
            </div>
        </md-toolbar>
    
        <md-list class="md-layout-item md-size-100">
            <md-list-item v-for="item in list" :key="item.id">
                <span class="md-list-item-text">{{item.expiresAt | date}}</span>
                <span class="md-list-item-text">{{item.name}}</span>
                <md-button @click="updateItem = item" class="md-default md-raised md-list-action">Update</md-button>
                <md-button @click="apiDelete(item.id)" class="md-accent md-raised md-list-action">Delete</md-button>
            </md-list-item>
        </md-list>
    
        <app-dialog-add v-model="showDialogAdd" :show-item="updateItem" @action="apiAddUpdate">
        </app-dialog-add>
    
        <app-notifications v-model="info"></app-notifications>
    </div>
</template>

<script>
import api from "./services/api";
import DialogAdd from "./components/DialogAdd";
import Notifications from "./components/Notifications";

export default {
  components: {
    "app-dialog-add": DialogAdd,
    "app-notifications": Notifications
  },
  filters: {
    /**
     * @param {Number|String} expiresAt
     */
    date(expiresAt) {
      // make it to Number
      expiresAt = +expiresAt;
      if (!expiresAt) return "";
      // make it to Date
      const dt = new Date(expiresAt);
      return dt.toLocaleDateString();
    }
  },
  data() {
    return {
      // describes the current list
      list: [
        {
          id: "asdasd",
          expiresAt: 1539637200000,
          name: "test"
        }
      ],

      // describes the notification result info to show (e.g. result of the api call)
      info: null,

      // describes whether to open/show the DialogAdd/Update
      showDialogAdd: false,
      updateItem: null
    };
  },
  watch: {
    showDialogAdd(newValue) {
      if (!newValue) {
        this.updateItem = null;
      }
    },
    updateItem(newValue) {
      if (newValue) {
        this.showDialogAdd = true;
      }
    }
  },
  methods: {
    apiRefresh() {
      api(`${APP_CONTEXT_PATH}/invoke/api/list`)
        .then(data => (this.list = data.Items))
        .then(() => (this.info = "Refreshed"))
        .catch(() => (this.info = "Failed to refresh"));
    },
    apiAdd({ name, expiresAt }) {
      api(`${APP_CONTEXT_PATH}/invoke/api/add`, { name, expiresAt })
        .then(data => data.Item)
        .then(Item => (this.list = [...this.list, Item]))
        .then(() => (this.info = "Added"))
        .catch(() => (this.info = "Failed to add"));
    },
    apiDelete(id) {
      // delete is reserved JS keyword
      api(`${APP_CONTEXT_PATH}/invoke/api/delete`, { id })
        .then(data => data.id)
        .then(
          ItemId => (this.list = this.list.filter(item => item.id !== ItemId))
        )
        .then(() => (this.info = "Deleted"))
        .catch(() => (this.info = "Failed to delete"));
    },
    apiUpdate({ id, name, expiresAt }) {
      // delete is reserved JS keyword
      api(`${APP_CONTEXT_PATH}/invoke/api/update`, { id, name, expiresAt })
        .then(data => data.Item)
        .then(Item =>
          this.list.some(item => {
            if (item.id === Item.id) {
              Object.assign(item, { ...Item });
              return true;
            }
          })
        )
        .then(() => (this.info = "Updated"))
        .catch(() => (this.info = "Failed to update"));
    },
    apiAddUpdate(item) {
      if (item.id) {
        this.apiUpdate(item);
      } else {
        this.apiAdd(item);
      }
    }
  },
  mounted() {}
};
</script>

<style>
@import "./styles.css";
</style>

