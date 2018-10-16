//eslint-disable-next-line
const App = {
    template: html`
    <div>
        <h1>
            {{ title }}
        </h1>
        <pre>
            {{ response }}
        </pre>
        <button @click="test"></button
    </div>
    `,
    // components: {
    //     //eslint-disable-next-line
    //     List
    // },
    data() {
        return {
            title: 'Expirations list',
            response: undefined,
        };
    },
    methods: {
        test() {
            fetch(`${APP_CONTEXT_PATH}/api/test`)
            .then(res => res.json())
            .then(data => this.response = data);
        }
    }
};
