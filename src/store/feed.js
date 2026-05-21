// ── Feed Store — shared post state between compose sheet and feed view ──
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFeedStore = defineStore('feed', () => {
  const posts = ref([
    {
      id: 1,
      author: 'Sarah Koenig',
      time: '2 hours ago',
      category: 'Distributed Systems',
      text: 'Just finished a major refactor of our edge-computing layer. Reduced latency by 40% using a custom Rust-based caching strategy. Check out the architecture diagram below! 🚀',
      type: 'image',
      imageCaption: 'Edge computing architecture diagram — latency reduced by 40%',
      links: [
        { label: 'Live Demo', icon: 'link' },
        { label: 'GitHub Repo', icon: 'terminal' },
      ],
      reactions: {
        '👍': ['user1', 'user2', 'user3'],
        '🔥': ['user4'],
        '🚀': ['user5', 'user6'],
      },
      commentList: [
        { id: 1, author: 'Marcus Chen', time: '1h ago', text: "Incredible work! The latency improvement is massive. How'd you handle the cache invalidation?" },
        { id: 2, author: 'Lina Low',    time: '30m ago', text: 'This is exactly what we needed. Are you open-sourcing the caching layer?' },
      ],
      showComments: false,
    },
    {
      id: 2,
      author: 'Alex Miller',
      time: '5 hours ago',
      category: 'UI/UX Engineer',
      text: "Working on a new glassmorphic component library for React. Here's a quick look at the card primitive logic. It's all about that backdrop-filter!",
      type: 'code',
      filename: 'glass-card.tsx',
      code: `const GlassCard = ({ children }) => {
  return (
    <div className="backdrop-blur-xl bg-white/30 border border-white/20">
      {children}
    </div>
  );
};`,
      reactions: {
        '👍': ['user7', 'user8'],
        '❤️': ['user9'],
      },
      commentList: [],
      showComments: false,
    },
    {
      id: 3,
      author: 'Marcus Chen',
      time: '1 day ago',
      category: 'Full-Stack Lead',
      text: 'Just shipped v3 of our internal design system. 200+ components, full dark mode support, and a11y compliant. The team velocity has doubled since we standardized. Highly recommend investing in your design system early! 💎',
      type: 'text',
      reactions: {
        '🎉': ['user10', 'user11', 'user12'],
        '👍': ['user13'],
      },
      commentList: [],
      showComments: false,
    },
  ])

  // Prepend a new post to the top of the feed
  function addPost(post) {
    posts.value.unshift(post)
  }

  // Remove a post by id
  function deletePost(postId) {
    posts.value = posts.value.filter(p => p.id !== postId)
  }

  return { posts, addPost, deletePost }
})
