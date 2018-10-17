//eslint-disable-next-line
const App = {
    template: html`
    <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-25">
            {{ title }}
        </div>
    
        <md-button @click="refresh" class="md-primary md-raised">Refresh</md-button>
        <md-button @click="add" class="md-primary md-raised">Add</md-button>
        <md-button @click="delete_" class="md-primary md-raised">Delete</md-button>
    
        <md-snackbar :md-active.sync="info" :md-position="position" :md-duration="3000" md-persistent>
            <span>{{info}}</span>
            <md-button class="md-primary" @click="info = null">Retry</md-button>
        </md-snackbar>
    
        <md-list>
            <md-list-item>
                <md-avatar>
                    <img src="https://placeimg.com/40/40/people/5" alt="People">
                </md-avatar>
    
                <span class="md-list-item-text">Abbey Christansen</span>
    
                <md-button class="md-icon-button md-list-action">
                    <md-icon class="md-primary">chat_bubble</md-icon>
                </md-button>
            </md-list-item>
    
            </md-list-item>
        </md-list>
    
    </div>
    `,
    data() {
        return {
            title: 'Expirations list',
            list: null,
            info: null
        };
    },
    methods: {
        refresh() {
            fetch(`${APP_CONTEXT_PATH}/api/list`)
                .then(res => res.json())
                .then(data => this.response = data)
                .then(() => this.info = 'Refreshed');
        },
        add() {
            fetch(`${APP_CONTEXT_PATH}/api/add`, { method: 'POST', body: JSON.stringify({}) })
                .then(res => res.json())
                .then(data => this.response = data);
        },
        delete_() {  // delete is reserved JS keyword
            fetch(`${APP_CONTEXT_PATH}/api/delete`, { method: 'POST', body: JSON.stringify({}) })
                .then(res => res.json())
                .then(data => this.response = data);
        }
    }
};
