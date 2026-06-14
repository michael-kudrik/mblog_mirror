<script setup>

const {data: posts } = await useAsyncData('posts', () =>
    queryCollection('content').order('date', 'DESC').all()
)

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

</script>



<template>

<main class="max-w-2xl mx-auto px-6 py-12">
    <ul class="space-y-8">
      <li v-for="post in posts" :key="post.path">
        <NuxtLink :to="post.path">
          <p class="text-lg font-semibold">{{ post.title }}</p>
          <p class="text-sm opacity-60">{{ formatDate(post.date) }}</p>
        </NuxtLink>
      </li>
    </ul>
  </main>
</template>