// eslint-disable-next-line
const api = (url, data) => {
    // if sending data as JSON body must be JSON encoded string
    // AND !!! 'Content-Type' header must be valid JSON one
    const opts = data && {
        method: 'POST',
        body: JSON.stringify(data),

        // !!! this is obligatory for JSON encoded data so that the Express 'body-parser' to parse it properly
        headers: {
            'Content-Type': 'application/json'
        }
    };

    return fetch(url, opts)
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => Promise.reject(err));
            }
            return res;
        })
        .then(res => res.json());
};

Vue.use(window.vuelidate.default);
const { required, minLength } = window.validators;

const App = {
    template: html`
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
                <md-button @click="apiDelete(item.id)" class="md-accent md-raised md-list-action">Delete</md-button>
            </md-list-item>
        </md-list>
    
        <md-dialog :md-active.sync="showDialogAdd">
            <md-dialog-title>Add new expiration-check item</md-dialog-title>
    
            <md-dialog-content>
                <!-- <form novalidate class="md-layout" @submit.prevent="validateAdd"> -->
    
                <md-field :class="validateClass('name')">
                    <label>Name</label>
                    <md-input v-model="addItem.name"></md-input>
                    <span class="md-error" v-if="!$v.addItem.name.required">The name is required</span>
                    <span class="md-error" v-else-if="!$v.addItem.name.minlength">Name must have at least {{$v.addItem.name.$params.minLength.min}} letters.</span>
                </md-field>
    
                <md-datepicker v-model="addItem.expiresAtDate" md-immediately :class="validateClass('expiresAtDate')">
                    <label>Expires At</label>
                    <span class="md-error" v-if="!$v.addItem.expiresAtDate.required">The expire-date is required</span>
                </md-datepicker>
    
                <md-dialog-actions>
                    <md-button class="md-primary" @click="showDialogAdd = false">Close</md-button>
                    <md-button type="submit" class="md-primary" @click="validateAdd" :disabled="$v.addItem.$invalid">Add</md-button>
                </md-dialog-actions>
    
                <!-- </form> -->
            </md-dialog-content>
        </md-dialog>
    
        <!-- :md-active.sync needs a boolean prop -->
        <md-snackbar :md-active.sync="showInfo" md-position="center" :md-duration="3000" md-persistent>
            <span>{{info}}</span>
            <md-button class="md-accent" @click="showInfo = false">Dismiss</md-button>
        </md-snackbar>
    </div>
    `,
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
            return dt.toLocaleDateString();
        }
    },
    data() {
        return {
            // describes the current list
            list: [],

            // describes the snackbar info to show , e.g. the result of the api call
            info: null,

            // describes whether to open/show the DialogAdd
            showDialogAdd: false,

            addItem: {
                name: null,
                expiresAt: null,
                expiresAtDate: null,
            }
        };
    },
    computed: {
        // showInfo() {
        //     return !!this.info;
        // },

        // we need a getter AND a setter as 'showInfo' is set when using :md-active.sync="showInfo", to auto close it
        showInfo: {
            // getter
            get: function () {
                return !!this.info;
            },
            // setter
            set: function (newValue) {
                if (!newValue) {
                    this.info = null;
                }
            }
        }
    },
    watch: {
        // watch a nested property
        'addItem.expiresAtDate': function (expiresAtDate) {
            // 'expiresAtDate' is Date object, so create a 'expiresAt' as Number 
            if (expiresAtDate) {
                this.addItem.expiresAt = expiresAtDate.getTime();
            } else {
                this.addItem.expiresAt = null;
            }
        }
    },
    methods: {
        apiRefresh() {
            api(`${APP_CONTEXT_PATH}/api/list`)
                .then(data => this.list = data.Items)
                .then(() => this.info = 'Refreshed');
        },
        apiAdd({ name, expiresAt }) {
            api(`${APP_CONTEXT_PATH}/api/add`, { name, expiresAt })
                .then(data => data.Item)
                .then(Item => this.list = [...this.list, Item])
                .then(() => this.info = 'Added');
        },
        apiDelete(id) {  // delete is reserved JS keyword
            api(`${APP_CONTEXT_PATH}/api/delete`, { id })
                .then(data => data.id)
                .then(ItemId => this.list = this.list.filter(item => item.id !== ItemId))
                .then(() => this.info = 'Deleted');
        },

        validateAdd() {
            // validate first and if any invalid field then return
            this.$v.addItem.$touch();

            if (this.$v.addItem.$invalid) {
                // validation errors are shown already when this.$v.addItem.$touch() is called
                return;
            }

            this.apiAdd(this.addItem);
            this.$v.addItem.$reset();
            this.addItem = {};
            this.showDialogAdd = false;
        }
    },
    validateClass(fieldName) {
        const field = this.$v.addItem[fieldName];

        if (field) {
            return {
                'md-invalid': field.$invalid && field.$dirty
            };
        }
        return null;
    },

    // Vuelidate integration
    validations: {
        'addItem': {
            'name': {
                required,
                minLength: minLength(5)
            },
            'expiresAtDate': {
                required,
            }
        }

    },
};
