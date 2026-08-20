This section acts as the IssoComments component and handles rendering the comment section.
See [...slug].vue for where it is called.

<script setup lang="ts">
interface Props {
    title?: string
    pageId?: string
}
const props = defineProps<Props>()

declare global {
    interface Window {
        Isso?: {
            init: () => void
            fetchComments: () => void
        }
    }
}

useHead({
    script: [
        {
            key: 'isso-embed',
            src: 'https://comments.mikekudrik.boats/js/embed.min.js',
            'data-isso': 'https://comments.mikekudrik.boats/',
            'data-isso-css': 'false',
            'data-isso-sorting': 'newest',
            'data-isso-default-lang': 'en',
            'data-isso-max-comments-top': '10',
            'data-isso-max-comments-nested': '5',
            'data-isso-reveal-on-click': '5',
            'data-isso-avatar': 'true',
            'data-isso-avatar-bg': '#2d3a49',
            'data-isso-vote': 'false',
            'data-isso-author-hashes': 'c9caa0f9f48e',
            async: true,
        },
    ],
})

//check every  150ms to try and refetch
function refetch(tries = 20) {
    if (window.Isso?.fetchComments) {
        window.Isso.fetchComments()
    } else if (tries > 0) {
        setTimeout(() => refetch(tries - 1), 150)
    }
}

watch(
    () => props.pageId,
    async () => {
        await nextTick()
        refetch()
    }
)

onMounted(() => {
    refetch()
})
</script>

<template>
        <section id="isso-thread" :data-title="title" :data-isso-id="pageId"
            class="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <noscript>Javascript needs to be activated to view comments.</noscript>
        </section>
</template>