<script setup>
import { usePostsStore } from '@/stores/Posts';
import { storeToRefs } from 'pinia';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

// get data
const { errors } = storeToRefs(usePostsStore());
const post = ref(null);
const route = useRoute();
const { getPost, updatePost } = usePostsStore();

const formData = reactive({
    name: '',
    desc: '',
});

onMounted(async () => {
    post.value = await getPost(route.params.id);
    
    formData.name = post.value.name;
    formData.desc = post.value.desc;
});
</script>

<template>
    <main>
        <h1>Create a post</h1>

        <form 
        @submit.prevent="updatePost(post, formData)"
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

            <button class="primary-btn bg-red-100 btn-sm btn">Update</button>
        </form>
    </main>
</template>