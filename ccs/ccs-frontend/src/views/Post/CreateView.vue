<script setup>
import { usePostsStore } from '@/stores/Posts';
import { storeToRefs } from 'pinia';
import { reactive } from 'vue';
const { createPost } = usePostsStore();
// get data
const { errors } = storeToRefs(usePostsStore());
const formData = reactive({
    name: '',
    desc: '',
});

</script>

<template>
    <main>
        <h1>Create a post</h1>

        <form @submit.prevent="createPost(formData)"
        class="w-1/2 mx-auto space-y-6"
        method="post">
            <div>
                <input type="text" name="name" placeholder="Enter here" id="n" v-model="formData.name">
                <p v-if="errors.name" class="text-red-500">{{ errors.name[0] }}</p>
            </div>
            <div>
                <textarea name="desc" id="d" rows="6" placeholder="Content here" v-model="formData.desc"></textarea>
                <p class="text-red-500" v-if="errors.desc">{{ errors.desc[0] }}</p>
            </div>

            <button class="primary-btn bg-red-100 btn-sm btn">Post</button>
        </form>
    </main>
</template>