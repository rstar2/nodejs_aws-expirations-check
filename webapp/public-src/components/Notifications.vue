<template>
  <v-snackbar v-model="active" :timeout="3000">
    <span>{{info}}</span>
    <v-btn class="red--text" text @click="active = false">Dismiss</v-btn>
  </v-snackbar>
</template>

<script>
export default {
    props: {
        info: {
            type: String,
            default: null
        }
    },
    model: {
        prop: 'info',
        event: 'change'
    },
    computed: {
        active: {
            // getter
            get: function() {
                return !!this.info;
            },
            // setter
            set: function(newValue) {
                if (!newValue) {
                    this.$emit('change', null);
                }
            }
        }
    }
};
</script>
