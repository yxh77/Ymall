<template>
    <div class="nav-breadcrumb-wrap">
        <div class="container">
            <nav class="nav-breadcrumb">
                <router-link :to='"/"'>Home</router-link>
                <slot name="bread"></slot>
            </nav>
        </div>
    </div>
</template>

<script>
    export default {
        name: "NavBread"
    }
</script>
