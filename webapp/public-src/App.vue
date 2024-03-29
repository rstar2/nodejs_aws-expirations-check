<template>
  <v-app>
    <!-- <v-navigation-drawer app></v-navigation-drawer> -->

    <v-app-bar color="indigo white--text" dense fixed app>
      <v-toolbar-title>Expirations list</v-toolbar-title>

      <v-spacer></v-spacer>

      <template v-if="auth">
        <v-btn class="mx-3" color="success" small @click="apiRefresh"
          >Refresh</v-btn
        >
        <v-btn
          class="mx-3"
          color="secondary"
          small
          @click="dialogAdd.show = true"
          >Add</v-btn
        >
        <v-btn color="error" small @click="apiLogout">Logout</v-btn>
      </template>
      <template v-else>
        <v-btn
          class="mx-3"
          color="success"
          small
          @click="
            dialogAuth.isRegister = true;
            dialogAuth.show = true;
          "
          >Register</v-btn
        >
        <v-btn
          color="secondary"
          small
          @click="
            dialogAuth.isRegister = false;
            dialogAuth.show = true;
          "
          >Login</v-btn
        >
      </template>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <v-data-table
          v-if="auth"
          :headers="listHeaders"
          :items="list"
          :items-per-page="100"
          sort-by="expiresAt"
          :sort-desc="false"
          class="elevation-5"
          hide-default-footer
          :class="{ xs: $vuetify.breakpoint.xsOnly }"
        >
          <template slot="no-data"
            >No expirations set</template
          >
          <template slot="item" slot-scope="{ item }">
            <tr>
              <td
                class="text-xs"
                :class="$vuetify.breakpoint.xsOnly ? 'd-flex align-center' : ''"
              >
                <v-checkbox
                  :input-value="item.enabled | itemEnabled"
                  disabled
                  hide-details
                  class="ma-0 pa-0"
                ></v-checkbox>
              </td>
              <td
                class="text-xs"
                :class="$vuetify.breakpoint.xsOnly ? 'd-flex align-center' : ''"
              >
                {{ item.name }}
              </td>
              <td
                class="text-xs"
                :class="$vuetify.breakpoint.xsOnly ? 'd-flex align-center' : ''"
              >
                {{ item.expiresAt | date }}
              </td>
              <td class="text-xs d-flex align-center justify-end">
                <v-layout class="hidden-sm-and-down justify-end">
                  <v-btn small primary @click="dialogAdd.updateItem = item"
                    >Update</v-btn
                  >
                  <v-btn
                    small
                    color="error"
                    class="ml-3"
                    @click="tryDelete(item.id)"
                    >Delete</v-btn
                  >
                </v-layout>
                <v-layout class="hidden-md-and-up justify-end">
                  <v-menu>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" icon>
                        <v-icon>more_vert</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="dialogAdd.updateItem = item">
                        <v-list-item-title>Update</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="tryDelete(item.id)">
                        <v-list-item-title>Delete</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-layout>
              </td>
            </tr>
          </template>
        </v-data-table>
        <div v-else class="error--text">
          Not Authorized
          <v-icon>home</v-icon>
        </div>

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
import jwtDecode from 'jwt-decode';

import api from './services/api';
import { ERROR_UNAUTHORIZED } from './services/api';
import DialogAuth from './components/DialogAuth';
import DialogAdd from './components/DialogAdd';
import Notifications from './components/Notifications';

import {
    hasSubscription,
    createSubscription,
    setHandleSubscription
} from './configurePushNotifications';

export default {
    components: {
        'app-dialog-auth': DialogAuth,
        'app-dialog-add': DialogAdd,
        'app-notifications': Notifications
    },
    filters: {
    /**
     * @param {Number|String} expiresAt
     */
        date(expiresAt) {
            // make it to Number
            expiresAt = +expiresAt;
            if (!expiresAt) return '';
            // make it to Date
            const dt = new Date(expiresAt);
            let options = { year: 'numeric', month: 'long', day: 'numeric' };
            return dt.toLocaleDateString('en-US', options);
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
                    text: 'Enabled',
                    value: 'enabled',
                    align: 'left'
                },
                { text: 'Name', value: 'name' },
                { text: 'Expires At', value: 'expiresAt' },
                { text: 'Actions', value: '_actions', sortable: false, align: 'right' }
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
                console.log('Valid authJWT');
                localStorage.setItem('authJWT', newValue);

                this.apiRefresh();

                // check for push notification subcription and if not any then try to create new
                console.log('Check for push notification subcription and if not any then try to create new');
                hasSubscription().then(has => !has && createSubscription());
            } else {
                localStorage.removeItem('authJWT');
            }
        },
        'dialogAdd.show'(newValue) {
            if (!newValue) {
                this.dialogAdd.updateItem = null;
            }
        },
        'dialogAdd.updateItem'(newValue) {
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
                .then(() => (this.info = 'Refreshed'))
                .catch(() => (this.info = 'Failed to refresh'));
        },
        apiLogout() {
            this.authJWT = null;
        },
        apiAdd(item) {
            this.apiRequest(`${APP_CONTEXT_PATH}/invoke/api/add`, item)
                .then(data => data.Item)
                .then(Item => (this.list = [...this.list, Item]))
                .then(() => (this.info = 'Added'))
                .catch(() => (this.info = 'Failed to add'));
        },
        apiDelete(id) {
            // delete is reserved JS keyword
            this.apiRequest(`${APP_CONTEXT_PATH}/invoke/api/delete`, { id })
                .then(data => data.id)
                .then(
                    ItemId => (this.list = this.list.filter(item => item.id !== ItemId))
                )
                .then(() => (this.info = 'Deleted'))
                .catch(() => (this.info = 'Failed to delete'));
        },
        apiUpdate(item) {
            // delete is reserved JS keyword
            this.apiRequest(`${APP_CONTEXT_PATH}/invoke/api/update`, item)
                .then(data => data.Item)
                .then(Item =>
                    this.list.some(item => {
                        if (item.id === Item.id) {
                            Object.assign(item, { ...Item });
                            return true;
                        }
                    })
                )
                .then(() => (this.info = 'Updated'))
                .catch(() => (this.info = 'Failed to update'));
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
            const action = this.dialogAuth.isRegister ? 'register' : 'login';
            this.apiRequest(`${APP_CONTEXT_PATH}/auth/${action}`, user)
                .then(({ token }) => (this.authJWT = token))
                .then(
                    () =>
                        (this.info = this.dialogAuth.isRegister
                            ? 'Registered'
                            : 'Logged in')
                )
                .catch(data => {
                    // error response must be of the form { error: 'xxxxx' }
                    this.info =
            (data && data.error) ||
            (this.dialogAuth.isRegister
                ? 'Failed to register'
                : 'Failed to login');
                });
        },

        async tryDelete(id) {
            if (await this.$confirm('Delete?', { title: 'Confirmation Warning' })) {
                this.apiDelete(id);
            }
        },

        /**
     * @param {PushSubscription?} subsription
     * @param {PushSubscription?} oldSubscription
     */
        async updateSubsctiption(subsription, oldSubscription) {
            // register the new
            if (subsription) {
                console.log('Update push notification subcription, authJWT is valid: ', !!this.authJWT);
                this.apiRequest(
                    `${APP_CONTEXT_PATH}/invoke/webpush/register`,
                    subsription
                )
                    .then(
                        ({ success }) =>
                            success && (this.info = 'Subscribed to push notifications')
                    )
                    .catch(
                        () => (this.info = 'Failed to subscrib to push notifications')
                    );
            }

            // unregister old - no matter the result
            if (oldSubscription) {
                this.apiRequest(
                    `${APP_CONTEXT_PATH}/invoke/webpush/unregister`,
                    oldSubscription
                );
            }
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
        const authJWT = localStorage.getItem('authJWT');

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

        setHandleSubscription(this.updateSubsctiption);
    }
};
</script>

<style>
@import "./styles.css";

/* Fix the ExtraSmall devices (e.g. phones) look of the Vuetify table */
.xs thead tr {
  display: table-row;
}
.xs tbody tr {
  display: flex;
  justify-content: space-between;
}

/* This will make the text in a table cell not overflowing the row's height,
   technically this means that no more than 2 lines of text will be in one row
    */
tbody tr {
  overflow: hidden;
}
</style>

