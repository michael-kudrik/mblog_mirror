<script setup lang="ts">
const route = useRoute()
const tag = computed(() => route.params.tag as string)

const { data: posts } = await useAsyncData(`posts-${tag.value}`, () => {
  return queryCollection('content')
    .where('tags', 'LIKE', `%"${tag.value}"%`)
    .order('date', 'DESC')
    .all()
})

function formatDate(date: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <main class="max-w-3xl mx-auto px-6 py-12">
    <div class="mb-12">
      <h1 class="text-4xl font-bold">Posts tagged with #{{ tag }}</h1>
    </div>

    <ul v-if="posts && posts.length" class="space-y-8">
      <li v-for="post in posts" :key="post.path">
        <NuxtLink :to="post.path" class="group">
          <p class="text-2xl font-semibold group-hover:drop-shadow-[0_2px_4px_rgba(238,226,206,0.6)] transition-colors">
            {{ post.title }}
          </p>
          <p class="text-sm opacity-60 mt-1">{{ formatDate(post.date) }}</p>
        </NuxtLink>
      </li>
    </ul>
    <p v-else class="text-lg opacity-60">No posts found with this tag.</p>
    <NuxtLink to="/" class="text-primary hover:underline flex items-center gap-2 mt-8">
      ← Back to home
    </NuxtLink>

  </main>
</template>
