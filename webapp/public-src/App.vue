<template>
  <v-app>
    <!-- <v-navigation-drawer app></v-navigation-drawer> -->
    <v-toolbar color="indigo white--text" dense fixed app>
      <v-toolbar-title class="mr-5 align-center">
        <span class="title">Expirations list</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- <v-toolbar-items> -->
      <template v-if="auth">
        <v-btn color="success" small @click="apiRefresh">Refresh</v-btn>
        <v-btn color="secondary" small @click="dialogAdd.show = true">Add</v-btn>
        <v-btn color="error" small @click="apiLogout">Logout</v-btn>
      </template>
      <template v-else>
        <v-btn
          color="success"
          small
          @click="dialogAuth.isRegister = true; dialogAuth.show = true;"
        >Register</v-btn>
        <v-btn
          color="secondary"
          small
          @click="dialogAuth.isRegister = false; dialogAuth.show = true;"
        >Login</v-btn>
      </template>
      <!-- </v-toolbar-items> -->
    </v-toolbar>

    <v-content>
      <v-container fluid>
        <v-data-table
          v-if="auth"
          :headers="listHeaders"
          :items="list"
          :pagination="{sortBy: 'expiresAt', 'rowsPerPage': -1}"
          class="elevation-5"
          hide-actions
        >
          <template slot="no-data">No expirations set</template>
          <template slot="items" slot-scope="{ item }">
            <tr>
              <td class="text-xs">
                <v-checkbox :input-value="item.enabled | itemEnabled" disabled hide-details></v-checkbox>
              </td>
              <td class="text-xs">{{ item.name }}</td>
              <td class="text-xs">{{ item.expiresAt | date }}</td>
              <td class="text-xs d-flex align-center">
                <v-spacer></v-spacer>

                <v-layout class="hidden-sm-and-down justify-end">
                  <v-btn small primary @click="dialogAdd.updateItem = item">Update</v-btn>
                  <v-btn small color="error" class="mr-0" @click="apiDelete(item.id)">Delete</v-btn>
                </v-layout>
                <v-layout class="hidden-md-and-up justify-end">
                  <v-menu>
                    <v-btn slot="activator" icon>
                      <v-icon>more_vert</v-icon>
                    </v-btn>
                    <v-list>
                      <v-list-tile @click="dialogAdd.updateItem = item">
                        <v-list-tile-title>Update</v-list-tile-title>
                      </v-list-tile>
                      <v-list-tile @click="apiDelete(item.id)">
                        <v-list-tile-title>Delete</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </v-layout>
              </td>
            </tr>
          </template>
        </v-data-table>
        <div v-else class="error--text">Not Authorized <v-icon>home</v-icon></div>

        <app-dialog-auth
          v-model="dialogAuth.show"
          :isRegister="dialogAuth.isRegister"
          @action="apiAuth"
        ></app-dialog-auth>

        <app-dialog-add
          v-model="dialogAdd.show"
          :show-item="dialogAdd.updateItem"
          @action="apiAddUpdate"
        ></app-dialog-add>

        <app-notifications v-model="info"></app-notifications>
      </v-container>
    </v-content>
    <!-- <v-footer app></v-footer> -->
  </v-app>
</template>

<script>
import jwtDecode from "jwt-decode";

import api from "./services/api";
import { ERROR_UNAUTHORIZED } from "./services/api";
import DialogAuth from "./components/DialogAuth";
import DialogAdd from "./components/DialogAdd";
import Notifications from "./components/Notifications";

export default {
  components: {
    "app-dialog-auth": DialogAuth,
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
      var options = { year: "numeric", month: "long", day: "numeric" };
      return dt.toLocaleDateString("en-US", options);
    },
    itemEnabled(enabled) {
      return enabled !== false;
    }
  },
  data() {
    return {
      // describes the current list
      listHeaders: [
        {
          text: "Enabled",
          value: "enabled",
          align: "left"
        },
        { text: "Name", value: "name" },
        { text: "Expires At", value: "expiresAt" },
        { text: "Actions", value: "_actions", sortable: false, align: "right" }
      ],
      list: [],

      // describes the notification result info to show (e.g. result of the api call)
      info: null,

      authJWT: null,

      dialogAuth: {
        show: false,
        isRgister: false
      },

      dialogAdd: {
        show: false,
        updateItem: null
      }
    };
  },
  computed: {
    auth() {
      return !!this.authJWT;
    }
  },
  watch: {
    authJWT(newValue) {
      // anyway always clear currernt list
      this.list = [];

      // store it in cookie/localStorage (see the notes about it in mounted())
      if (newValue) {
		localStorage.setItem("authJWT", newValue);

		this.apiRefresh();
		
      } else {
        localStorage.removeItem("authJWT");
      }
    },
    "dialogAdd.show"(newValue) {
      if (!newValue) {
        this.dialogAdd.updateItem = null;
      }
    },
    "dialogAdd.updateItem"(newValue) {
      if (newValue) {
        this.dialogAdd.show = true;
      }
    }
  },
  methods: {
    apiRequest() {
      const args = Array.prototype.slice.call(arguments);
      if (args.length === 1) {
        args.push(null);
      }
      args.push(this.authJWT);
      return api.apply(null, args).catch(err => {
        // if API returns 'Unauthorizedd' error then invalidate the token
        if (err === ERROR_UNAUTHORIZED) {
          this.authJWT = null;
        }

        // rethrow the rejected promise
        throw err;
      });
    },
    apiRefresh() {
      this.apiRequest(`${APP_CONTEXT_PATH}/invoke/api/list`)
        .then(data => data.Items)
        .then(Items => (this.list = Items))
        .then(() => (this.info = "Refreshed"))
        .catch(() => (this.info = "Failed to refresh"));
    },
    apiLogout() {
      this.authJWT = null;
    },
    apiAdd({ name, expiresAt, enabled = true }) {
      this.apiRequest(`${APP_CONTEXT_PATH}/invoke/api/add`, {
        name,
        expiresAt,
        enabled
      })
        .then(data => data.Item)
        .then(Item => (this.list = [...this.list, Item]))
        .then(() => (this.info = "Added"))
        .catch(() => (this.info = "Failed to add"));
    },
    apiDelete(id) {
      // delete is reserved JS keyword
      this.apiRequest(`${APP_CONTEXT_PATH}/invoke/api/delete`, { id })
        .then(data => data.id)
        .then(
          ItemId => (this.list = this.list.filter(item => item.id !== ItemId))
        )
        .then(() => (this.info = "Deleted"))
        .catch(() => (this.info = "Failed to delete"));
    },
    apiUpdate({ id, name, expiresAt, enabled }) {
      // delete is reserved JS keyword
      this.apiRequest(`${APP_CONTEXT_PATH}/invoke/api/update`, {
        id,
        name,
        expiresAt,
        enabled
      })
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
    },

    apiAuth(user) {
      // delete is reserved JS keyword
      const action = this.dialogAuth.isRegister ? "register" : "login";
      this.apiRequest(`${APP_CONTEXT_PATH}/auth/${action}`, user)
        .then(({ token }) => (this.authJWT = token))
        .then(
          () =>
            (this.info = this.dialogAuth.isRegister
              ? "Registered"
              : "Logged in")
        )
        .catch(data => {
          // error response must be of the form { error: 'xxxxx' }
          this.info =
            (data && data.error) ||
            (this.dialogAuth.isRegister
              ? "Failed to register"
              : "Failed to login");
        });
    }
  },
  mounted() {
    // restore it from cookie/localStorage
    // It's not adviceable to store it in localStorage/sessionStorage
    // as thus it's vulnerable to XSS (injected or unintentionaly added by outself with 3rd-party library script -npm, bower, CDN)
    // It's better to be stored in HttpOnly Cookie and added a CSRF token in a header (X-XSRF-TOKEN)
    // From AngularJS https://docs.angularjs.org/api/ng/service/$http#cross-site-request-forgery-xsrf-protection
    // Cross Site Request Forgery (XSRF) Protection:
    // XSRF is an attack technique by which the attacker can trick an authenticated user into unknowingly executing actions on your website. AngularJS provides a mechanism to counter XSRF. When performing XHR requests, the $http service reads a token from a cookie (by default, XSRF-TOKEN) and sets it as an HTTP header (by default X-XSRF-TOKEN). Since only JavaScript that runs on your domain could read the cookie, your server can be assured that the XHR came from JavaScript running on your domain.
    // To take advantage of this, your server needs to set a token in a JavaScript readable session cookie called XSRF-TOKEN on the first HTTP GET request. On subsequent XHR requests the server can verify that the cookie matches the X-XSRF-TOKEN HTTP header, and therefore be sure that only JavaScript running on your domain could have sent the request. The token must be unique for each user and must be verifiable by the server (to prevent the JavaScript from making up its own tokens). We recommend that the token is a digest of your site's authentication cookie with a salt for added security.
    // The header will — by default — not be set for cross-domain requests. This prevents unauthorized servers (e.g. malicious or compromised 3rd-party APIs) from gaining access to your users' XSRF tokens and exposing them to Cross Site Request Forgery. If you want to, you can whitelist additional origins to also receive the XSRF token, by adding them to xsrfWhitelistedOrigins. This might be useful, for example, if your application, served from example.com, needs to access your API at api.example.com. See $httpProvider.xsrfWhitelistedOrigins for more details.

    //https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage
    const authJWT = localStorage.getItem("authJWT");

    if (authJWT) {
      // we can validate just the expiration date in the client
      const decoded = jwtDecode(authJWT);
      let expired = false;
      if (decoded.exp) {
        const current_time = Date.now() / 1000;
        if (decoded.exp < current_time) {
          expired = true;
        }
      }

      if (!expired) {
        this.authJWT = authJWT;
      }
    }
  }
};
</script>

<style>
@import "./styles.css";
</style>

