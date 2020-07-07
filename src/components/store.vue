<template>

</template>

<script>
    import Vue from 'vue'

    export const state = Vue.observable({
        nickName: '',
        cartCount: 0,
    });

    export const mutations = {
        nickName(nickName) {
            state.nickName = nickName;
        },
        cartCount(cartCount) {
            state.cartCount = cartCount;
        }
    };

    export default {
        name: "store"
    }

</script>

<style scoped>

</style>