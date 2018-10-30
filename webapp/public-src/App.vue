<template>
	<div class="md-layout">
        <md-toolbar class="md-layout-item md-size-100 md-dense">
            <div class="md-toolbar-section-start">
                <h3 class="md-title">Expirations list</h3>
            </div>
            <div class="md-toolbar-section-end">
                <template v-if="auth" >
					<md-button @click="apiRefresh" class="md-primary md-raised">Refresh</md-button>
                	<md-button @click="dialogAdd.show = true" class="md-primary md-raised">Add</md-button>
				</template>
				<template v-else>
                	<md-button @click="dialogAuth.isRegister = true; dialogAuth.show = true;" class="md-primary md-raised">Register</md-button>
                	<md-button @click="dialogAuth.isRegister = false; dialogAuth.show = true;" class="md-primary md-raised">Login</md-button>
				</template>
            </div>
        </md-toolbar>
    
        <!-- <md-list class="md-layout-item md-size-100">
            <md-list-item v-for="item in list" :key="item.id">
                <span class="md-list-item-text">{{item.expiresAt | date}}</span>
                <span class="md-list-item-text">{{item.name}}</span>
                <md-button @click="updateItem = item" class="md-default md-raised md-list-action">Update</md-button>
                <md-button @click="apiDelete(item.id)" class="md-accent md-raised md-list-action">Delete</md-button>
            </md-list-item>
        </md-list> -->
		<md-table v-model="list" md-sort="name" md-sort-order="asc" md-fixed-header
					class="md-layout-item md-size-100">
      		<!-- <md-table-toolbar>
        		<h1 class="md-title">Items</h1>
      		</md-table-toolbar> -->

      		<md-table-row slot="md-table-row" slot-scope="{ item }">
      			<md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
      		  	<md-table-cell md-label="Expires At" md-sort-by="expiresAt">{{item.expiresAt | date}}</md-table-cell>
      		  	<md-table-cell md-label="Actions" class="asd">
					<md-button @click="dialogAdd.updateItem = item" class="md-default md-raised md-list-action">Update</md-button>
            		<md-button @click="apiDelete(item.id)" class="md-accent md-raised md-list-action">Delete</md-button>
				</md-table-cell>	
      		</md-table-row>
    	</md-table>
    
		<app-dialog-auth v-model="dialogAuth.show" :isRegister="dialogAuth.isRegister" @action="apiAuth">
        </app-dialog-auth>

        <app-dialog-add v-model="dialogAdd.show" :show-item="dialogAdd.updateItem" @action="apiAddUpdate">
        </app-dialog-add>
    
        <app-notifications v-model="info"></app-notifications>
    </div>
</template>

<script>
import api from "./services/api";
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
    }
  },
  data() {
    return {
      // describes the current list
      list: [
        {
          id: "dummy",
          expiresAt: 1539637200000,
          name: "Dummy"
        }
      ],

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
      // store it in cookie/localStorage (see the notes about it in mounted())
      if (newValue) localStorage.setItem("authJWT", newValue);
      else localStorage.removeItem("authJWT");
    },
    "dialogAdd.show" (newValue) {
      if (!newValue) {
        this.dialogAdd.updateItem = null;
      }
    },
    "dialogAdd.updateItem" (newValue) {
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
      return api.apply(null, args);
    },
    apiRefresh() {
      this.apiRequest(`${APP_CONTEXT_PATH}/invoke/api/list`)
        .then(data => (this.list = data.Items))
        .then(() => (this.info = "Refreshed"))
        .catch(() => (this.info = "Failed to refresh"));
    },
    apiAdd({ name, expiresAt }) {
      this.apiRequest(`${APP_CONTEXT_PATH}/invoke/api/add`, { name, expiresAt })
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
    apiUpdate({ id, name, expiresAt }) {
      // delete is reserved JS keyword
      this.apiRequest(`${APP_CONTEXT_PATH}/invoke/api/update`, {
        id,
        name,
        expiresAt
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
    this.authJWT = localStorage.getItem("authJWT");

    // TODO: when api request responds with Unauthorized then clear/invalidate the stored token
    //this.authJWT = null;
  }
};
</script>

<style>
@import "./styles.css";
</style>

