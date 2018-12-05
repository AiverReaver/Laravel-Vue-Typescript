<template>
    <h1>This is an example component</h1>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component"
@Component
export default class ExampleComponent extends Vue {
    mounted() : void {
        console.log("hello");
    }
}
</script>