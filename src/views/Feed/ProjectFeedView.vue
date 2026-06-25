<template>
  <div class="feed-view">
    <div class="container-gfd feed-layout">

      <!-- Left Sidebar -->
      <aside class="feed-sidebar">
        <div class="glass-card-static sidebar-card">
          <div class="sidebar-profile">
            <div class="sidebar-avatar">
              <img v-if="user?.avatar" :src="user.avatar" alt="" class="sidebar-avatar-img" />
              <span v-else>{{ userInitials }}</span>
            </div>
            <div>
              <p class="sidebar-name">{{ user?.full_name || 'Developer' }}</p>
              <p class="sidebar-role">@{{ user?.username || 'member' }}</p>
            </div>
          </div>
          <div class="divider-gfd" style="margin:1rem 0" />
          <nav class="sidebar-nav">
            <a class="sidebar-link active" href="#">
              <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">home</span>
              Feed
            </a>
            <RouterLink to="/dashboard/projects" class="sidebar-link">
              <span class="material-symbols-outlined">bookmarks</span>
              Saved Projects
            </RouterLink>
            <RouterLink to="/dashboard/analytics" class="sidebar-link">
              <span class="material-symbols-outlined">analytics</span>
              Analytics
            </RouterLink>
          </nav>
        </div>
      </aside>

      <!-- Center Feed -->
      <main class="feed-main">
        <!-- Create Post -->
        <div class="create-post">
          <div class="create-post-top">
            <div class="post-avatar-sm">{{ userInitials }}</div>
            <button class="create-post-input" @click="showCompose = true">
              Share your latest build...
            </button>
          </div>
          <div class="create-post-actions">
            <button class="post-action-type" @click="showCompose = true; composeMode = 'photo'">
              <span class="material-symbols-outlined" style="color:var(--primary)">image</span>
              Photo
            </button>
            <button class="post-action-type" @click="showCompose = true; composeMode = 'video'">
              <span class="material-symbols-outlined" style="color:#22c55e">videocam</span>
              Video
            </button>
            <button class="post-action-type" @click="showCompose = true; composeMode = 'text'">
              <span class="material-symbols-outlined" style="color:#f59e0b">edit_note</span>
              Post
            </button>
          </div>
        </div>

        <!-- Compose Modal -->
        <Transition name="modal">
          <div v-if="showCompose" class="modal-overlay" @click.self="closeCompose">
            <div class="glass-modal compose-modal">
              <div class="compose-header">
                <h3 class="compose-title">Create Post</h3>
                <button class="btn-ghost icon-only" @click="closeCompose">
                  <span class="material-symbols-outlined">close</span>
                </button>
              </div>
              <div class="compose-body">
                <div class="compose-user">
                  <div class="post-avatar-sm">
                    <img v-if="user?.avatar" :src="user.avatar" alt="" class="post-avatar-img" />
                    <span v-else>{{ userInitials }}</span>
                  </div>
                  <p class="compose-name">{{ user?.full_name || 'Developer' }}</p>
                </div>
                <textarea
                  v-model="newPost"
                  class="compose-textarea"
                  placeholder="Share your latest build, insight, or project update..."
                  rows="5"
                  autofocus
                />
              </div>
              <div v-if="selectedImage" class="compose-image-preview">
                <img :src="selectedImage" alt="Selected post image" />
                <button type="button" class="btn-ghost remove-image-btn" @click="clearSelectedImage">
                  <span class="material-symbols-outlined">close</span>
                  Remove image
                </button>
              </div>
              <!-- Video preview -->
              <div v-if="selectedVideo" class="compose-image-preview">
                <video :src="selectedVideo" controls style="width:100%;border-radius:8px;max-height:240px"></video>
                <button type="button" class="btn-ghost remove-image-btn" @click="clearSelectedVideo">
                  <span class="material-symbols-outlined">close</span>
                  Remove video
                </button>
              </div>
              <!-- Quote Preview -->
              <div v-if="quotePost" class="compose-quote-preview">
                <div class="quote-card">
                  <p class="quote-author">{{ quotePost.author }}</p>
                  <p class="quote-text">{{ quotePost.text?.slice(0, 120) }}{{ quotePost.text?.length > 120 ? '...' : '' }}</p>
                </div>
                <button type="button" class="btn-ghost remove-image-btn" @click="quotePost = null">
                  <span class="material-symbols-outlined">close</span>
                  Remove quote
                </button>
              </div>
              <div class="compose-footer">
                <div class="compose-tools">
                  <button type="button" class="btn-ghost image-option" @click="openImagePicker('gallery')">
                    <span class="material-symbols-outlined">photo_library</span>
                    Gallery
                  </button>
                  <button type="button" class="btn-ghost image-option" @click="openImagePicker('camera')">
                    <span class="material-symbols-outlined">photo_camera</span>
                    Camera
                  </button>
                  <button type="button" class="btn-ghost image-option" @click="videoInput.click()">
                    <span class="material-symbols-outlined">videocam</span>
                    Video
                  </button>
                  <input ref="imageInput" type="file" accept="image/*" class="hidden-file-input" @change="handleImageChange" />
                  <input ref="cameraInput" type="file" accept="image/*" capture="environment" class="hidden-file-input" @change="handleImageChange" />
                  <input ref="videoInput" type="file" accept="video/*" class="hidden-file-input" @change="handleVideoChange" />
                </div>
                <button class="btn-primary" :disabled="!newPost.trim() && !selectedImage && !selectedVideo" @click="submitPost">Post</button>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Feed Tabs -->
        <div class="feed-tabs">
          <button class="feed-tab" :class="{ active: feedStore.feedType === 'explore' }" @click="switchFeedType('explore')">
            For You
          </button>
          <button class="feed-tab" :class="{ active: feedStore.feedType === 'following' }" @click="switchFeedType('following')">
            Following
          </button>
        </div>

        <!-- Feed Posts -->
        <div class="feed-posts">
          <article
            v-for="post in posts"
            :key="post.id"
            class="feed-post"
          >
            <!-- Repost label — shown above the header for reposts -->
            <div v-if="post.parent_post_id && post.parent_post" class="repost-label">
              <span class="material-symbols-outlined" style="font-size:14px">repeat</span>
              <span>{{ post.author?.full_name || 'Someone' }} reposted</span>
            </div>

            <!-- For reposts: show ORIGINAL author in header, not the reposter -->
            <div class="post-header" v-if="post.parent_post_id && post.parent_post">
              <div class="post-author-info" @click="goToProfile(post.parent_post.author?.id)">
                <div class="post-avatar">
                  <img v-if="post.parent_post.author?.avatar" :src="post.parent_post.author.avatar" :alt="post.parent_post.author.full_name" class="post-avatar-img" />
                  <span v-else>{{ getInitials(post.parent_post.author?.full_name) }}</span>
                </div>
                <div class="post-author-text">
                  <div class="post-author-line">
                    <span class="post-author-name">{{ post.parent_post.author?.full_name }}</span>
                    <span class="post-author-username">@{{ post.parent_post.author?.username }}</span>
                    <span class="post-time-dot">·</span>
                    <span class="post-time">{{ formatTime(post.parent_post.created_at) }}</span>
                  </div>
                </div>
              </div>
              <div class="post-menu-wrap">
                <button class="btn-ghost icon-only" @click="togglePostMenu(post.id)">
                  <span class="material-symbols-outlined">more_horiz</span>
                </button>
              </div>
            </div>

            <!-- Normal header for non-reposts -->
            <div class="post-header" v-else>
              <div class="post-author-info" @click="goToProfile(post.author?.id)">
                <div class="post-avatar">
                  <img v-if="post.author?.avatar" :src="post.author.avatar" :alt="post.author.full_name" class="post-avatar-img" />
                  <span v-else>{{ getInitials(post.author?.full_name || post.author) }}</span>
                </div>
                <div class="post-author-text">
                  <div class="post-author-line">
                    <span class="post-author-name">{{ post.author?.full_name || post.author }}</span>
                    <span v-if="post.author?.is_verified" class="material-symbols-outlined verified-tick" style="font-variation-settings:'FILL' 1">verified</span>
                    <span class="post-author-username">@{{ post.author?.username || '' }}</span>
                    <span class="post-time-dot">·</span>
                    <span class="post-time">{{ formatTime(post.created_at) }}</span>
                  </div>
                </div>
              </div>
              <div class="post-menu-wrap">
                <button class="btn-ghost icon-only" @click="togglePostMenu(post.id)">
                  <span class="material-symbols-outlined">more_horiz</span>
                </button>
                <Transition name="dropdown">
                  <div v-if="openMenuId === post.id" class="post-dropdown">
                    <!-- Follow/Unfollow -->
                    <button class="dropdown-item" @click="followFromPost(post)">
                      <span class="material-symbols-outlined">person_add</span>
                      Follow @{{ post.author?.username }}
                    </button>
                    <!-- Mute -->
                    <button class="dropdown-item" @click="openMenuId = null">
                      <span class="material-symbols-outlined">volume_off</span>
                      Mute @{{ post.author?.username }}
                    </button>
                    <!-- Block -->
                    <button class="dropdown-item" @click="blockFromPost(post)">
                      <span class="material-symbols-outlined">block</span>
                      Block @{{ post.author?.username }}
                    </button>
                    <!-- View post activity -->
                    <button class="dropdown-item" @click="openMenuId = null">
                      <span class="material-symbols-outlined">bar_chart</span>
                      View post activity
                    </button>
                    <!-- Report -->
                    <button class="dropdown-item" @click="openMenuId = null">
                      <span class="material-symbols-outlined">flag</span>
                      Report post
                    </button>
                    <!-- Delete (only own posts) -->
                    <button v-if="post.author?.id === authStore.user?.id || post.author?.id === authStore.profile?.id" class="dropdown-item dropdown-item--danger" @click="deletePost(post.id)">
                      <span class="material-symbols-outlined">delete</span>
                      Delete post
                    </button>
                  </div>
                </Transition>
              </div>
            </div>

            <!-- Post Content -->
            <div class="post-content">
              <!-- Post content: for reposts show original content, for normal show own content -->
              <div v-if="post.parent_post_id && post.parent_post" class="post-text-wrap">
                <p v-if="post.parent_post.content" class="post-text"
                  :class="{ collapsed: !post.expanded && post.parent_post.content.length > 300 }"
                  v-html="linkifyText(post.parent_post.content)"></p>
                <button v-if="post.parent_post.content?.length > 300 && !post.expanded"
                  class="read-more-btn" @click="post.expanded = true">Read more</button>
                <button v-if="post.parent_post.content?.length > 300 && post.expanded"
                  class="read-more-btn" @click="post.expanded = false">Show less</button>
              </div>
              <!-- Original post media for reposts -->
              <div v-if="post.parent_post_id && post.parent_post?.media_urls?.length" class="post-media">
                <template v-for="(url, idx) in post.parent_post.media_urls.filter(u => u)" :key="idx">
                  <video
                    v-if="post.parent_post.post_type === 'video' || post.parent_post.post_type === 'VIDEO' || /\.(mp4|webm|mov|avi|mkv)/i.test(url)"
                    :src="url" controls class="post-video" preload="metadata" playsinline
                    style="width:100%;border-radius:12px;background:#000;max-height:500px;margin-top:0.5rem"
                  />
                  <img v-else :src="url" alt="Post media" class="post-image" loading="lazy" />
                </template>
              </div>

              <!-- "Read More" collapsible text for normal posts -->
              <div v-else-if="!post.parent_post_id && post.content" class="post-text-wrap">
                <p class="post-text" :class="{ collapsed: !post.expanded && post.content.length > 300 }"
                  v-html="linkifyText(post.content)"></p>
                <button v-if="post.content.length > 300 && !post.expanded" class="read-more-btn"
                  @click="post.expanded = true">Read more</button>
                <button v-if="post.content.length > 300 && post.expanded" class="read-more-btn"
                  @click="post.expanded = false">Show less</button>
              </div>

              <!-- Media (images/videos) for normal posts — shown BELOW text -->
              <div v-if="!post.parent_post_id && post.media_urls && post.media_urls.length && post.media_urls[0]" class="post-media">
                <template v-for="(url, idx) in post.media_urls.filter(u => u)" :key="idx">
                  <!-- Video: render as <video> if post_type is video OR url contains video extension -->
                  <video
                    v-if="post.post_type === 'video' || post.post_type === 'VIDEO' || /\.(mp4|webm|mov|avi|mkv)/i.test(url)"
                    :src="url"
                    controls
                    class="post-video"
                    preload="metadata"
                    playsinline
                    style="width:100%;border-radius:12px;background:#000;max-height:500px;margin-top:0.5rem"
                  />
                  <!-- Image -->
                  <img
                    v-else
                    :src="url"
                    alt="Post media"
                    class="post-image"
                    loading="lazy"
                  />
                </template>
              </div>

              <!-- Code snippet -->
              <div v-if="post.code_snippet" class="post-code-block">
                <div class="code-header">
                  <span class="code-filename">{{ post.code_language || 'code' }}</span>
                </div>
                <pre class="code-content"><code>{{ post.code_snippet }}</code></pre>
              </div>

              <!-- Video attachment -->
              <video v-if="post.video_url" :src="post.video_url" controls class="post-video" preload="metadata" />

              <!-- Document attachment -->
              <a v-if="post.document_url" :href="post.document_url" target="_blank" rel="noopener noreferrer" class="post-document-link">
                <span class="material-symbols-outlined">description</span>
                <span>{{ post.document_name || 'View Document' }}</span>
              </a>

              <!-- Link preview card -->
              <div v-if="post.link_preview" class="post-link-preview">
                <img v-if="post.link_preview.image" :src="post.link_preview.image" class="lp-image" />
                <div class="lp-body">
                  <span v-if="post.link_preview.site_name" class="lp-site">{{ post.link_preview.site_name }}</span>
                  <a :href="post.link_preview.url" target="_blank" rel="noopener noreferrer" class="lp-title">{{ post.link_preview.title }}</a>
                  <span v-if="post.link_preview.description" class="lp-desc">{{ post.link_preview.description }}</span>
                </div>
              </div>

              <!-- Hashtags -->
              <div v-if="post.hashtags && post.hashtags.length" class="post-hashtags">
                <span v-for="tag in post.hashtags" :key="tag" class="hashtag" @click="searchByHashtag(tag)">#{{ tag }}</span>
              </div>
            </div>

            <!-- Post Actions Bar (Twitter/X style) -->
            <div class="post-actions-bar">
              <button class="action-btn" @click="toggleComments(post)">
                <span class="material-symbols-outlined">chat_bubble_outline</span>
                <span v-if="post.comment_count" class="action-count">{{ post.comment_count }}</span>
              </button>
              <button class="action-btn repost-btn" :class="{ active: post.is_reposted }" @click="handleRetweet(post)">
                <span class="material-symbols-outlined">repeat</span>
                <span v-if="post.repost_count" class="action-count">{{ post.repost_count }}</span>
              </button>
              <button class="action-btn like-btn" :class="{ active: post.is_liked }" @click="toggleLike(post)">
                <span class="material-symbols-outlined" :class="{ filled: post.is_liked }">favorite</span>
                <span v-if="post.like_count" class="action-count">{{ post.like_count }}</span>
              </button>
              <button class="action-btn bookmark-btn" :class="{ active: post.is_bookmarked }" @click="toggleBookmark(post)">
                <span class="material-symbols-outlined" :class="{ filled: post.is_bookmarked }">bookmark</span>
              </button>
              <button class="action-btn impressions-btn">
                <span class="material-symbols-outlined">bar_chart</span>
                <span class="action-count">{{ (post.like_count || 0) + (post.comment_count || 0) + (post.repost_count || 0) }}</span>
              </button>
              <button class="action-btn" @click="sharePost(post)">
                <span class="material-symbols-outlined">share</span>
              </button>
            </div>

            <!-- Comments Section -->
            <div v-if="post.showComments" class="post-comments">
              <div v-if="post.commentList?.length" class="comments-list">
                <template v-for="comment in getRootComments(post)" :key="comment.id">
                  <div class="comment-item">
                    <div class="comment-avatar">
                      <img v-if="comment.author_avatar" :src="comment.author_avatar" class="comment-avatar-img" />
                      <span v-else>{{ getInitials(comment.author || comment.content) }}</span>
                    </div>
                    <div class="comment-body">
                      <div class="comment-header-line">
                        <span class="comment-author-name">{{ comment.author || 'User' }}</span>
                        <span v-if="comment.author_username" class="comment-author-handle">@{{ comment.author_username }}</span>
                        <span class="comment-time">{{ comment.time || formatTime(comment.created_at) }}</span>
                      </div>
                      <p class="comment-text">{{ comment.content || comment.text }}</p>
                      <div class="comment-actions">
                        <button class="comment-action" @click="startReply(post, comment)">
                          <span class="material-symbols-outlined" style="font-size:14px;">chat_bubble_outline</span>
                          Reply
                        </button>
                        <button v-if="comment.author_id === authStore.user?.id || comment.author_id === authStore.profile?.id" class="comment-action comment-action--delete" @click="deleteComment(post, comment)">
                          <span class="material-symbols-outlined" style="font-size:14px;">delete</span>
                          Delete
                        </button>
                      </div>

                      <!-- Replies (nested) -->
                      <div v-if="getReplies(post, comment.id).length" class="comment-replies">
                        <div v-for="reply in getReplies(post, comment.id)" :key="reply.id" class="comment-item reply-item">
                          <div class="comment-avatar reply-avatar">
                            <img v-if="reply.author_avatar" :src="reply.author_avatar" class="comment-avatar-img" />
                            <span v-else>{{ getInitials(reply.author || reply.content) }}</span>
                          </div>
                          <div class="comment-body">
                            <div class="comment-header-line">
                              <span class="comment-author-name">{{ reply.author || 'User' }}</span>
                              <span v-if="reply.author_username" class="comment-author-handle">@{{ reply.author_username }}</span>
                              <span class="comment-time">{{ reply.time || formatTime(reply.created_at) }}</span>
                            </div>
                            <p class="comment-text">
                              <span class="reply-mention">@{{ comment.author || 'User' }}</span>
                              {{ reply.content || reply.text }}
                            </p>
                            <div class="comment-actions">
                              <button class="comment-action" @click="startReply(post, comment)">
                                <span class="material-symbols-outlined" style="font-size:14px;">chat_bubble_outline</span>
                                Reply
                              </button>
                              <button v-if="reply.author_id === authStore.user?.id || reply.author_id === authStore.profile?.id" class="comment-action comment-action--delete" @click="deleteComment(post, reply)">
                                <span class="material-symbols-outlined" style="font-size:14px;">delete</span>
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
              <p v-else class="no-comments">No comments yet. Be the first!</p>

              <!-- Reply indicator -->
              <div v-if="replyingTo[post.id]" class="replying-to-bar">
                <span>Replying to <strong>{{ replyingTo[post.id].author || 'User' }}</strong></span>
                <button class="cancel-reply-btn" @click="cancelReply(post.id)">
                  <span class="material-symbols-outlined">close</span>
                </button>
              </div>

              <!-- Comment Input -->
              <div class="comment-input-row">
                <div class="post-avatar-sm">{{ userInitials }}</div>
                <input 
                  v-model="newComments[post.id]" 
                  class="comment-input" 
                  :placeholder="replyingTo[post.id] ? `Reply to @${replyingTo[post.id].author || 'User'}...` : 'Write a comment...'"
                  @keyup.enter="submitComment(post, $event)"
                />
                <button
                  class="comment-send-btn"
                  :disabled="!newComments[post.id]?.trim()"
                  @click="submitComment(post, $event)"
                  title="Send comment"
                >
                  <span class="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </article>

          <!-- Loading skeleton -->
          <div v-if="feedStore.loading" class="feed-loading">
            <div v-for="i in 3" :key="i" class="skeleton-post">
              <div class="skeleton-header">
                <div class="skeleton-avatar skeleton-shimmer"></div>
                <div class="skeleton-text-group">
                  <div class="skeleton-line skeleton-shimmer" style="width:120px;height:12px;"></div>
                  <div class="skeleton-line skeleton-shimmer" style="width:80px;height:10px;margin-top:4px;"></div>
                </div>
              </div>
              <div class="skeleton-body">
                <div class="skeleton-line skeleton-shimmer" style="width:100%;height:12px;"></div>
                <div class="skeleton-line skeleton-shimmer" style="width:85%;height:12px;margin-top:6px;"></div>
                <div class="skeleton-line skeleton-shimmer" style="width:60%;height:12px;margin-top:6px;"></div>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="!feedStore.loading && posts.length === 0" class="feed-empty">
            <span class="material-symbols-outlined" style="font-size:3rem;color:var(--on-surface-variant)">dynamic_feed</span>
            <p>No posts yet. Be the first to share something!</p>
          </div>

          <!-- End of feed -->
          <div v-if="!feedStore.hasMore && posts.length > 0" class="feed-end">
            <p>You're all caught up!</p>
          </div>
        </div>
      </main>

      <!-- Right Sidebar -->
      <aside class="feed-right-sidebar">
        <!-- Trending Posts -->
        <div class="glass-card-static sidebar-card">
          <h3 class="sidebar-section-title">
            <span class="material-symbols-outlined" style="font-size:18px;color:var(--primary)">local_fire_department</span>
            Trending Today
          </h3>
          <div v-if="trendingPosts.length" class="trending-posts-list">
            <div v-for="tp in trendingPosts.slice(0,5)" :key="tp.id" class="trending-post-item"
              @click="openTrendingPost(tp)">
              <div class="tp-author">
                <img v-if="tp.author?.avatar" :src="tp.author.avatar" class="tp-avatar" />
                <span v-else class="tp-avatar-init">{{ (tp.author?.full_name || 'U')[0] }}</span>
                <span class="tp-name">{{ tp.author?.full_name }}</span>
              </div>
              <p class="tp-content">{{ tp.content?.slice(0, 80) }}{{ tp.content?.length > 80 ? '…' : '' }}</p>
              <div class="tp-stats">
                <span><span class="material-symbols-outlined" style="font-size:13px;vertical-align:middle">favorite</span> {{ tp.like_count }}</span>
                <span><span class="material-symbols-outlined" style="font-size:13px;vertical-align:middle">chat_bubble</span> {{ tp.comment_count }}</span>
              </div>
            </div>
          </div>
          <p v-else class="sidebar-empty">No trending posts yet</p>
        </div>

        <!-- Trending Skills -->
        <div class="glass-card-static sidebar-card">
          <h3 class="sidebar-section-title">
            <span class="material-symbols-outlined" style="font-size:18px;color:var(--primary)">trending_up</span>
            Trending Skills
          </h3>
          <div class="trending-skills">
            <span v-for="skill in trendingSkills" :key="skill.skill || skill.name || skill" class="skill-chip">
              {{ skill.skill || skill.name || skill }}
            </span>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useFeedStore }  from '@/store/feed'
import { useUiStore }    from '@/store/ui'
import http from '@/services/http'

const authStore = useAuthStore()
const feedStore = useFeedStore()
const uiStore   = useUiStore()
const { posts } = storeToRefs(feedStore)

// Use profile for display
const user = computed(() => authStore.profile || { full_name: authStore.user?.email || 'User', role: 'member' })

const router = typeof useRouter !== 'undefined' ? useRouter() : null

// Fetch feed on mount
onMounted(() => {
  if (authStore.isAuthenticated) {
    feedStore.fetchFeed(true)
  }
  // Load trending sidebar data
  http.get('/explore/trending').then(data => {
    trendingSkills.value = data.skills || []
  }).catch(() => {})
  http.get('/feed/trending-posts').then(data => {
    trendingPosts.value = data.posts || []
  }).catch(() => {})

  // Infinite scroll
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function handleScroll() {
  const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 500
  if (scrollBottom && feedStore.hasMore && !feedStore.loading) {
    feedStore.loadMore()
  }
}

function goToProfile(userId) {
  if (userId) window.location.href = `/developer/${userId}`
}

function toggleLike(post) {
  if (post.is_liked) {
    feedStore.unlikePost(post.id)
  } else {
    feedStore.likePost(post.id)
  }
}

function toggleBookmark(post) {
  if (!post.is_bookmarked) {
    feedStore.bookmarkPost(post.id)
  }
}

function sharePost(post) {
  const url = window.location.origin + '/feed'
  if (navigator.share) {
    navigator.share({ title: 'GFD Post', text: post.content, url })
  } else {
    navigator.clipboard.writeText(url)
  }
}

function followFromPost(post) {
  if (post.author?.id) {
    http.post(`/users/${post.author.id}/follow`).catch(() => {})
  }
  openMenuId.value = null
}

function blockFromPost(post) {
  if (post.author?.id) {
    http.post(`/users/${post.author.id}/block`).catch(() => {})
  }
  openMenuId.value = null
}

function switchFeedType(type) {
  feedStore.setFeedType(type)
}

function searchByHashtag(tag) {
  feedStore.setFeedType('explore')
  // TODO: pass hashtag filter to feed service
}

function openTrendingPost(post) {
  // Navigate to post detail or open inline
  window.location.href = `/feed/${post.id}`
}

const showCompose = ref(false)
const newPost        = ref('')
const newComments    = ref({})
const replyingTo     = ref({}) // { postId: { id, author } }
const composeMode    = ref('text')
const quotePost      = ref(null)
const imageInput     = ref(null)
const cameraInput    = ref(null)
const videoInput     = ref(null)
const selectedImage  = ref(null)
const selectedImageFile = ref(null)
const selectedVideo  = ref(null)
const selectedVideoFile = ref(null)

const reactionEmojis = [] // Removed — using Twitter-style actions now

const openMenuId = ref(null)

function togglePostMenu(postId) {
  openMenuId.value = openMenuId.value === postId ? null : postId
}

function handleRetweet(post) {
  feedStore.repostPost(post.id)
}

function handleQuote(post) {
  newPost.value = ''
  quotePost.value = post
  showCompose.value = true
  openMenuId.value = null
}

const userInitials = computed(() => {
  const name = user.value?.full_name || user.value?.name || 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

function getInitials(name) {
  if (!name || typeof name !== 'string') return 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = (now - date) / 1000

  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function linkifyText(text) {
  if (!text) return ''
  // Escape HTML first to prevent XSS
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  // Convert URLs to clickable links
  const urlRegex = /(https?:\/\/[^\s<]+)/g
  return escaped.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="post-link-inline">$1</a>')
}

// Seed data is now in the store — no local posts array needed

const trendingSkills = ref([])
const trendingPosts = ref([])
const topDevs = ref([])

function deletePost(postId) {
  feedStore.deletePost(postId)
  openMenuId.value = null
}

function openImagePicker(source) {
  composeMode.value = 'photo'
  if (source === 'camera' && cameraInput.value) {
    cameraInput.value.click()
  } else if (imageInput.value) {
    imageInput.value.click()
  }
}

function handleImageChange(event) {
  const file = event.target.files?.[0]
  if (!file) return
  if (selectedImage.value) {
    URL.revokeObjectURL(selectedImage.value)
  }
  selectedImageFile.value = file
  selectedImage.value = URL.createObjectURL(file)
}

function clearSelectedImage() {
  if (selectedImage.value) URL.revokeObjectURL(selectedImage.value)
  selectedImage.value = null
  selectedImageFile.value = null
  if (imageInput.value) imageInput.value.value = ''
}

function handleVideoChange(event) {
  const file = event.target.files?.[0]
  if (!file) return
  if (selectedVideo.value) URL.revokeObjectURL(selectedVideo.value)
  selectedVideoFile.value = file
  selectedVideo.value = URL.createObjectURL(file)
  // Clear image if video selected
  clearSelectedImage()
}

function clearSelectedVideo() {
  if (selectedVideo.value) URL.revokeObjectURL(selectedVideo.value)
  selectedVideo.value = null
  selectedVideoFile.value = null
}

function closeCompose() {
  showCompose.value = false
  clearSelectedImage()
  clearSelectedVideo()
  composeMode.value = 'text'
  quotePost.value = null
}

async function submitPost() {
  if (!newPost.value.trim() && !selectedImage.value && !selectedVideo.value && !quotePost.value) return

  try {
    let mediaUrls = []
    let postType = 'text'

    // Upload image if selected
    if (selectedImageFile.value) {
      try {
        const formData = new FormData()
        formData.append('file', selectedImageFile.value)
        const uploadResult = await http.post('/uploads/media', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        if (uploadResult.url) {
          mediaUrls.push(uploadResult.url)
          postType = 'image'
        }
      } catch (uploadErr) {
        console.error('Image upload failed:', uploadErr)
      }
    }

    // Upload video if selected
    if (selectedVideoFile.value) {
      try {
        const formData = new FormData()
        formData.append('file', selectedVideoFile.value)
        const uploadResult = await http.post('/uploads/media', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        if (uploadResult.url) {
          mediaUrls.push(uploadResult.url)
          postType = 'video'
        }
      } catch (uploadErr) {
        console.error('Video upload failed:', uploadErr)
      }
    }

    await feedStore.addPost({
      content: newPost.value,
      text: newPost.value,
      media_urls: mediaUrls,
      post_type: postType,
    })
  } catch {
    // Fallback — add locally
    const post = {
      id: 'local-' + Date.now(),
      author: { full_name: user.value?.full_name || 'You', avatar: user.value?.avatar, username: user.value?.username },
      content: newPost.value,
      like_count: 0,
      comment_count: 0,
      repost_count: 0,
      media_urls: selectedImage.value ? [selectedImage.value] : (selectedVideo.value ? [selectedVideo.value] : []),
      created_at: new Date().toISOString(),
    }
    feedStore.posts.unshift(post)
  }

  newPost.value = ''
  clearSelectedImage()
  clearSelectedVideo()
  composeMode.value = 'text'
  quotePost.value = null
  showCompose.value = false
  uiStore.showSuccess('Posted successfully!')
}

async function toggleComments(post) {
  post.showComments = !post.showComments
  if (post.showComments && (!post.commentList || post.commentList.length === 0)) {
    try {
      const data = await http.get(`/feed/${post.id}/comments`)
      if (data.comments) {
        post.commentList = data.comments.map(c => ({
          id: c.id,
          content: c.content,
          author: c.author_name || 'User',
          author_id: c.author_id,
          author_username: c.author_username || '',
          author_avatar: c.author_avatar || null,
          parent_comment_id: c.parent_comment_id || null,
          time: formatTime(c.created_at),
          created_at: c.created_at,
        }))
      }
    } catch {
      try {
        const data = await http.get(`/feed/${post.id}`)
        if (data.comments) {
          post.commentList = data.comments.map(c => ({
            id: c.id, content: c.content, author: c.author_name || 'User',
            author_id: c.author_id, author_username: c.author_username || '',
            author_avatar: c.author_avatar || null,
            parent_comment_id: c.parent_comment_id || null,
            time: formatTime(c.created_at), created_at: c.created_at,
          }))
        }
      } catch { /* ignore */ }
    }
  }
}

function getRootComments(post) {
  if (!post.commentList) return []
  return post.commentList.filter(c => !c.parent_comment_id)
}

function getReplies(post, parentId) {
  if (!post.commentList) return []
  return post.commentList.filter(c => c.parent_comment_id === parentId)
}

function startReply(post, comment) {
  replyingTo.value[post.id] = { id: comment.id, author: comment.author }
}

function cancelReply(postId) {
  delete replyingTo.value[postId]
}

async function deleteComment(post, comment) {
  try {
    await http.request({ method: 'DELETE', url: `/feed/${post.id}/comments/${comment.id}` })
    post.commentList = post.commentList.filter(c => c.id !== comment.id)
    post.comment_count = Math.max((post.comment_count || 1) - 1, 0)
  } catch { /* ignore */ }
}

function submitComment(post, e) {
  const text = newComments.value[post.id]?.trim()
  if (!text) return
  const parentId = replyingTo.value[post.id]?.id || null
  http.post(`/feed/${post.id}/comment`, { content: text, parent_id: parentId }).then(result => {
    if (!post.commentList) post.commentList = []
    post.commentList.push({
      id: result?.id || Date.now().toString(),
      content: text,
      author: authStore.profile?.full_name || 'You',
      author_id: authStore.user?.id || authStore.profile?.id,
      author_username: authStore.profile?.username || '',
      author_avatar: authStore.profile?.avatar || null,
      parent_comment_id: parentId,
      created_at: new Date().toISOString(),
    })
    post.comment_count = (post.comment_count || 0) + 1
  }).catch(() => {})
  newComments.value[post.id] = ''
  cancelReply(post.id)
}
</script>

<style scoped>
.feed-view {
  background: var(--background);
  min-height: 100vh;
  padding-top: 0.5rem;
  padding-bottom: 2rem;
}

/* ── Layout: single col mobile → full-width on desktop (sidebars are fixed) ── */
.feed-layout {
  display: block;
  padding: 0.75rem 0 2rem;
}

@media (min-width: 1024px) {
  .feed-layout {
    padding-top: 1rem;
  }
}

/* ── Sidebars: position:fixed — guaranteed to never scroll ── */
.feed-sidebar,
.feed-right-sidebar { display: none; }

@media (min-width: 1024px) {
  /* Left sidebar: fixed, positioned after the dashboard nav sidebar (256px) */
  .feed-sidebar {
    display: block;
    position: fixed;
    top: 88px;
    left: calc(256px + 1rem);   /* dashboard sidebar width + gap */
    width: 220px;
    max-height: calc(100vh - 96px);
    overflow-y: auto;
    scrollbar-width: none;
    z-index: 10;
  }
  .feed-sidebar::-webkit-scrollbar { display: none; }

  /* Right sidebar: fixed, flush to the right edge */
  .feed-right-sidebar {
    display: block;
    position: fixed;
    top: 88px;
    right: 1rem;
    width: 240px;
    max-height: calc(100vh - 96px);
    overflow-y: auto;
    scrollbar-width: none;
    z-index: 10;
  }
  .feed-right-sidebar::-webkit-scrollbar { display: none; }

  /* Center feed: add matching margins so posts don't go behind fixed sidebars */
  .feed-main {
    margin-left: calc(220px + 1.5rem);   /* left sidebar width + gap */
    margin-right: calc(240px + 1.5rem);  /* right sidebar width + gap */
  }
}

/* Keep grid rows aligned to start */
@media (min-width: 1024px) {
  .feed-layout { align-items: start; }
}

.sidebar-card {
  padding: 1.25rem;
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.sidebar-profile { display: flex; align-items: center; gap: 0.75rem; }

.sidebar-avatar {
  width: 48px; height: 48px;
  border-radius: var(--radius-full);
  background: var(--primary-fixed);
  color: var(--primary);
  font-family: var(--font-headline);
  font-size: 1rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.sidebar-avatar-img {
  width: 100%; height: 100%;
  object-fit: cover;
  border-radius: var(--radius-full);
}

.sidebar-name { font-family: var(--font-headline); font-size: 0.9rem; font-weight: 700; color: var(--on-surface); }
.sidebar-role { font-size: 0.75rem; color: var(--on-surface-variant); text-transform: capitalize; }

.sidebar-nav { display: flex; flex-direction: column; gap: 0.125rem; }

.sidebar-link {
  display: flex; align-items: center; gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-lg);
  font-family: var(--font-headline); font-size: 0.875rem; font-weight: 500;
  color: var(--on-surface-variant); text-decoration: none;
  transition: all 0.15s ease;
}
.sidebar-link:hover, .sidebar-link.active { background: rgba(168,85,247,0.07); color: var(--primary); font-weight: 600; }
.sidebar-link .material-symbols-outlined { font-size: 20px; }

/* ── Feed Main ── */
.feed-main { display: flex; flex-direction: column; gap: 0; min-width: 0; }

@media (max-width: 767px) {
  .post-content { padding-left: 1rem; padding-right: 1rem; }
  .post-actions-bar { padding-left: 1rem; }
}

/* ── Create Post — fixed so it never scrolls ── */
.create-post {
  padding: 1rem;
  background: var(--surface-container-lowest);
  border-bottom: 1px solid var(--outline-variant);
  position: fixed;
  top: 72px;
  left: calc(256px + 220px + 3rem);  /* dash-sidebar + feed-left-sidebar + gaps */
  right: calc(240px + 2rem);          /* feed-right-sidebar + gap */
  z-index: 19;
}

/* On mobile: create-post sits in normal flow, full width */
@media (max-width: 1023px) {
  .create-post {
    position: static;
    top: auto; left: auto; right: auto;
    border-radius: 0;
  }
}

.create-post-top {
  display: flex; align-items: center; gap: 0.75rem;
  margin-bottom: 0.875rem;
}

.post-avatar-sm {
  width: 36px; height: 36px;
  border-radius: var(--radius-full);
  background: var(--primary-fixed); color: var(--primary);
  font-family: var(--font-headline); font-size: 0.75rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.create-post-input {
  flex: 1; min-width: 0;
  padding: 0.5rem 0.875rem;
  background: var(--surface-container);
  border: none; border-radius: var(--radius-full);
  font-family: var(--font-body); font-size: 0.875rem;
  color: var(--on-surface-variant); text-align: left;
  cursor: pointer; transition: background 0.15s ease;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.create-post-input:hover { background: var(--surface-container-high); }

.create-post-actions {
  display: flex; gap: 0;
  padding-top: 0.625rem;
  border-top: 1px solid var(--outline-variant);
}

.post-action-type {
  flex: 1;
  display: flex; align-items: center; justify-content: center; gap: 0.3rem;
  padding: 0.4rem 0.5rem;
  background: none; border: none; border-radius: var(--radius-lg);
  font-family: var(--font-headline); font-size: 0.75rem; font-weight: 500;
  color: var(--on-surface-variant); cursor: pointer;
  transition: background 0.15s ease;
}
.post-action-type:hover { background: var(--surface-container); }
.post-action-type .material-symbols-outlined { font-size: 18px; }

/* ── Feed Posts ── */
.feed-posts { display: flex; flex-direction: column; gap: 0; }

.feed-post {
  padding: 0;
  overflow: visible;
  background: var(--surface-container-lowest);
  border-bottom: 1px solid var(--outline-variant);
  transition: background 0.15s ease;
}

.feed-post:hover {
  background: var(--surface-container-low);
}

/* Post Header */
.post-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 0.75rem 1rem 0;
}

.post-author-info { display: flex; align-items: center; gap: 0.625rem; min-width: 0; }

.post-avatar {
  width: 40px; height: 40px;
  border-radius: var(--radius-full);
  background: var(--surface-container); color: var(--primary);
  font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.post-avatar-img {
  width: 100%; height: 100%;
  object-fit: cover;
  border-radius: var(--radius-full);
}

.post-author-name {
  font-family: var(--font-headline); font-size: 0.875rem; font-weight: 700;
  color: var(--on-surface);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.verified-tick {
  font-size: 16px;
  color: var(--primary);
  flex-shrink: 0;
}

.post-author-line {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.post-author-username {
  font-size: 0.8rem;
  color: var(--on-surface-variant);
  font-weight: 400;
}

.post-time-dot {
  font-size: 0.75rem;
  color: var(--on-surface-variant);
}

.post-time {
  font-size: 0.75rem;
  color: var(--on-surface-variant);
}

.post-meta { font-size: 0.7rem; color: var(--on-surface-variant); margin-top: 1px; }

/* Post Content */
.post-content { padding: 0.25rem 1rem 0.5rem 3.75rem; }

.post-text {
  font-size: 0.9375rem; color: var(--on-surface); line-height: 1.55;
  margin-bottom: 0; word-break: break-word;
}

.post-text :deep(.post-link-inline) {
  color: var(--primary);
  text-decoration: none;
  word-break: break-all;
}

.post-text :deep(.post-link-inline:hover) {
  text-decoration: underline;
}

/* Image */
.post-image-wrap { border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 0.75rem; }

.post-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  border-radius: var(--radius-lg);
  max-height: 320px;
}

.post-image-caption {
  margin-top: 0.5rem;
  color: var(--on-surface-variant);
  font-size: 0.82rem;
}

.post-image-placeholder {
  height: 180px;
  background: var(--surface-container);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  border-radius: var(--radius-lg);
}

.compose-image-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.compose-image-preview img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: var(--radius-lg);
  border: 1px solid var(--outline-variant);
}

.remove-image-btn {
  min-width: auto;
  padding: 0.5rem 0.75rem;
}

.image-option {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.6rem 0.75rem;
  font-size: 0.82rem;
}

.hidden-file-input {
  display: none;
}

/* Code — scrollable on mobile */
.post-code-block {
  background: #111827;
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.code-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.5rem 0.875rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.code-filename {
  font-family: var(--font-mono); font-size: 0.7rem;
  color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.08em;
}

.code-content {
  padding: 0.875rem;
  font-family: var(--font-mono); font-size: 0.75rem;
  line-height: 1.6; color: #e2e8f0;
  overflow-x: auto; /* scroll horizontally on mobile */
  margin: 0; white-space: pre;
  -webkit-overflow-scrolling: touch;
}

/* Links */
.post-links { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem; }

.post-link-btn {
  display: inline-flex; align-items: center; gap: 0.3rem;
  padding: 0.4rem 0.875rem;
  background: var(--primary); color: var(--on-primary);
  border-radius: var(--radius-lg);
  font-family: var(--font-headline); font-size: 0.75rem; font-weight: 600;
  text-decoration: none; transition: opacity 0.15s ease;
}
.post-link-btn:hover { opacity: 0.9; }
.post-link-btn:nth-child(2) {
  background: transparent; border: 1px solid var(--outline-variant); color: var(--on-surface-variant);
}
.post-link-btn:nth-child(2):hover { background: var(--surface-container); }

/* ── Twitter/X Style Actions Bar ── */
.post-actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem 0.75rem 3.5rem;
  border-top: none;
}

.post-actions-bar .action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.6rem;
  background: none;
  border: none;
  border-radius: var(--radius-full);
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: all 0.15s ease;
}

.post-actions-bar .action-btn:hover {
  background: rgba(99,14,212,0.08);
  color: var(--primary);
}

.post-actions-bar .action-btn .material-symbols-outlined {
  font-size: 20px;
}

.post-actions-bar .action-count {
  font-size: 0.75rem;
}

.post-actions-bar .like-btn.active {
  color: #e91e63;
}
.post-actions-bar .like-btn:hover {
  background: rgba(233,30,99,0.08);
  color: #e91e63;
}

.post-actions-bar .repost-btn.active {
  color: #00c853;
}
.post-actions-bar .repost-btn:hover {
  background: rgba(0,200,83,0.08);
  color: #00c853;
}

.post-actions-bar .bookmark-btn.active {
  color: var(--primary);
}

.post-actions-bar .impressions-btn {
  color: var(--on-surface-variant);
}
.post-actions-bar .impressions-btn:hover {
  background: rgba(99,14,212,0.08);
  color: var(--primary);
}

.material-symbols-outlined.filled {
  font-variation-settings: 'FILL' 1;
}

/* ── Feed Tabs — fixed below create-post ── */
.feed-tabs {
  display: flex;
  border-bottom: 1px solid var(--outline-variant);
  background: var(--surface-container-lowest);
  position: fixed;
  top: calc(72px + 110px);
  left: calc(256px + 220px + 3rem);
  right: calc(240px + 2rem);
  z-index: 20;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.feed-tab {
  flex: 1;
  padding: 0.875rem 1rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  font-family: var(--font-headline);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: center;
}

.feed-tab:hover {
  background: var(--surface-container-low);
  color: var(--on-surface);
}

.feed-tab.active {
  color: var(--on-surface);
  font-weight: 700;
  border-bottom-color: var(--primary);
}

/* ── Feed Loading / Empty / End ── */
.feed-loading {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.skeleton-post {
  padding: 1rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-xl);
}

.skeleton-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
.skeleton-avatar { width: 40px; height: 40px; border-radius: 50%; }
.skeleton-text-group { display: flex; flex-direction: column; }
.skeleton-body { display: flex; flex-direction: column; }
.skeleton-line { border-radius: 4px; }

.skeleton-shimmer {
  background: linear-gradient(90deg, var(--surface-container) 25%, var(--surface-container-high) 50%, var(--surface-container) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.feed-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  text-align: center;
  color: var(--on-surface-variant);
  font-size: 0.9rem;
}

.feed-end {
  text-align: center;
  padding: 1.5rem;
  color: var(--on-surface-variant);
  font-size: 0.8rem;
  font-style: italic;
}

/* ── Post Media ── */
.post-media {
  margin-top: 0.75rem;
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--outline-variant);
}

.post-media img {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  display: block;
}

/* ── Hashtags ── */
.post-hashtags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.5rem;
}

.hashtag {
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--primary);
  cursor: pointer;
}
.hashtag:hover { text-decoration: underline; }

/* ── Post Author Clickable ── */
.post-author-info {
  cursor: pointer;
}
.post-author-info:hover .post-author-name {
  text-decoration: underline;
}
.emoji-btn.active .emoji-count { color: var(--primary); }

.post-actions {
  display: flex; gap: 0.875rem;
  flex-shrink: 0; /* always visible */
}

.action-btn {
  display: flex; align-items: center; gap: 0.25rem;
  background: none; border: none;
  font-family: var(--font-headline); font-size: 0.8rem; font-weight: 500;
  color: var(--on-surface-variant); cursor: pointer;
  transition: color 0.15s ease; padding: 0;
  white-space: nowrap;
}
.action-btn:hover { color: var(--primary); }
.action-btn .material-symbols-outlined { font-size: 18px; }

.retweet-btn.retweeted { color: #00ba7c; }
.retweet-btn.retweeted .material-symbols-outlined { color: #00ba7c; }
.retweet-btn:hover { color: #00ba7c; }

.repost-btn:hover { color: var(--primary); }

/* ── Repost Label (Twitter/X style — above the post card) ── */
.repost-label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0;
  margin-bottom: 0.25rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  font-family: var(--font-headline);
}
.repost-label .material-symbols-outlined { color: #22c55e; }

/* ── Reposted Label ── */
.reposted-label {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  margin-bottom: 0.4rem;
}

/* ── Quoted Post Embed ── */
.quoted-post-embed {
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  padding: 0.75rem;
  background: var(--surface-container-low);
  margin-top: 0.5rem;
}

.quoted-author {
  font-family: var(--font-headline);
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 0.25rem;
}

.quoted-text {
  font-size: 0.82rem;
  color: var(--on-surface-variant);
  line-height: 1.5;
}

.quoted-image {
  width: 100%;
  max-height: 150px;
  object-fit: cover;
  border-radius: var(--radius-md, 8px);
  margin-top: 0.5rem;
}

/* ── Compose Quote Preview ── */
.compose-quote-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.quote-card {
  flex: 1;
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  padding: 0.6rem 0.75rem;
  background: var(--surface-container-low);
}

.quote-card .quote-author {
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 0.2rem;
}

.quote-card .quote-text {
  font-size: 0.78rem;
  color: var(--on-surface-variant);
  line-height: 1.4;
}

/* ── Comments ── */
.post-comments {
  padding: 1rem;
  border-top: 1px solid var(--outline-variant);
  background: var(--surface-container-low);
}

.comments-list { display: flex; flex-direction: column; gap: 0.875rem; margin-bottom: 0.875rem; }

.comment-item { display: flex; gap: 0.5rem; }

.comment-avatar {
  width: 28px; height: 28px;
  border-radius: var(--radius-full);
  background: var(--surface-container); color: var(--primary);
  font-family: var(--font-headline); font-size: 0.65rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.comment-avatar-img {
  width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-full);
}

.comment-body { flex: 1; min-width: 0; }

.comment-header-line {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.comment-author-name {
  font-family: var(--font-headline);
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--on-surface);
}

.comment-author-handle {
  font-size: 0.72rem;
  color: var(--on-surface-variant);
}

.comment-time { font-size: 0.68rem; color: var(--on-surface-variant); }

.comment-text {
  font-size: 0.84rem; color: var(--on-surface);
  margin-top: 0.15rem; line-height: 1.5; word-break: break-word;
}

.comment-actions {
  display: flex; gap: 0.75rem; margin-top: 0.3rem;
}

.comment-action {
  display: flex; align-items: center; gap: 0.2rem;
  font-size: 0.72rem; color: var(--on-surface-variant);
  background: none; border: none; cursor: pointer;
  font-family: var(--font-headline); font-weight: 600;
  transition: color 0.15s ease; padding: 0;
}
.comment-action:hover { color: var(--primary); }
.comment-action--delete:hover { color: #ef4444; }

.comment-replies {
  margin-top: 0.625rem;
  padding-left: 0.25rem;
  border-left: 2px solid var(--outline-variant);
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.reply-item { padding-left: 0.5rem; }

.reply-avatar { width: 24px; height: 24px; font-size: 0.55rem; }

.reply-mention {
  color: var(--primary);
  font-weight: 600;
  font-size: 0.82rem;
  margin-right: 0.25rem;
}

.replying-to-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0.75rem;
  background: rgba(168, 85, 247, 0.06);
  border-radius: var(--radius-lg);
  font-size: 0.78rem;
  color: var(--on-surface-variant);
  margin-bottom: 0.5rem;
}

.cancel-reply-btn {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: transparent;
  border: none;
  display: flex; align-items: center; justify-content: center;
  color: var(--on-surface-variant);
  cursor: pointer;
}
.cancel-reply-btn .material-symbols-outlined { font-size: 14px; }

.no-comments {
  font-size: 0.8rem;
  color: var(--on-surface-variant);
  text-align: center;
  padding: 0.5rem 0;
  font-style: italic;
}

.comment-content { flex: 1; min-width: 0; }

.comment-input-row { display: flex; align-items: center; gap: 0.625rem; }

.comment-input {
  flex: 1; min-width: 0;
  padding: 0.45rem 0.75rem;
  background: var(--surface-container-lowest);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-family: var(--font-body); font-size: 0.85rem;
  color: var(--on-surface); outline: none;
}
.comment-input:focus { border-color: var(--primary); }

.comment-send-btn {
  flex-shrink: 0;
  width: 34px; height: 34px;
  display: flex; align-items: center; justify-content: center;
  background: var(--primary); color: var(--on-primary);
  border: none; border-radius: var(--radius-full);
  cursor: pointer; transition: opacity 0.15s ease;
}
.comment-send-btn:hover:not(:disabled) { opacity: 0.85; }
.comment-send-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.comment-send-btn .material-symbols-outlined { font-size: 17px; }

.delete-post-btn { color: var(--on-surface-variant); }
.delete-post-btn:hover { color: #ef4444; background: rgba(239,68,68,0.08); }

/* ── Post Menu Dropdown ── */
.post-menu-wrap { position: relative; }

.post-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 100;
  min-width: 220px;
  padding: 0.5rem;
  background: var(--surface-container-high);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 24px rgba(0,0,0,0.35);
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.75rem;
  background: none;
  border: none;
  border-radius: var(--radius-md, 8px);
  font-family: var(--font-headline);
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--on-surface);
  cursor: pointer;
  transition: background 0.12s ease;
  text-align: left;
  width: 100%;
}
.dropdown-item:hover { background: var(--surface-container); }
.dropdown-item .material-symbols-outlined { font-size: 18px; color: var(--on-surface-variant); }

.dropdown-item--danger { color: #ef4444; }
.dropdown-item--danger:hover { background: rgba(239,68,68,0.08); }
.dropdown-item--danger .material-symbols-outlined { color: #ef4444; }

/* Dropdown transition */
.dropdown-enter-active, .dropdown-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-4px) scale(0.95); }

/* ── Right Sidebar ── */
.sidebar-section-title {
  display: flex; align-items: center; gap: 0.4rem;
  font-family: var(--font-headline); font-size: 0.9rem; font-weight: 700;
  color: var(--on-surface); margin-bottom: 0.875rem;
}

.trending-skills { display: flex; flex-wrap: wrap; gap: 0.4rem; }

.skill-chip {
  padding: 0.25rem 0.625rem;
  background: var(--surface-container); border: 1px solid var(--outline-variant);
  border-radius: var(--radius-full);
  font-family: var(--font-headline); font-size: 0.75rem; font-weight: 500;
  color: var(--on-surface-variant); cursor: pointer; transition: all 0.15s ease;
}
.skill-chip.hot { background: rgba(168,85,247,0.08); border-color: rgba(168,85,247,0.2); color: var(--primary); }

/* ── Read More ── */
.post-text-wrap { position:relative; }
.post-text.collapsed { display:-webkit-box; -webkit-line-clamp:4; -webkit-box-orient:vertical; overflow:hidden; }
.read-more-btn { background:none; border:none; color:var(--primary); font-size:0.82rem; font-weight:600; cursor:pointer; padding:0; margin-top:0.2rem; }
.read-more-btn:hover { text-decoration:underline; }

/* ── Link Preview ── */
.post-link-preview { margin-top:0.75rem; border:1px solid var(--outline-variant); border-radius:var(--radius-xl); overflow:hidden; background:var(--surface-container-low); cursor:pointer; }
.post-link-preview .lp-image { width:100%; height:180px; object-fit:cover; display:block; }
.post-link-preview .lp-body { padding:0.65rem 0.875rem; display:flex; flex-direction:column; gap:0.2rem; }
.post-link-preview .lp-site { font-size:0.68rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--on-surface-variant); }
.post-link-preview .lp-title { font-size:0.9rem; font-weight:700; color:var(--on-surface); text-decoration:none; line-height:1.3; }
.post-link-preview .lp-title:hover { text-decoration:underline; color:var(--primary); }
.post-link-preview .lp-desc { font-size:0.78rem; color:var(--on-surface-variant); line-height:1.45; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }

/* ── Repost quote card ── */
.repost-quote-card { margin-top:0.75rem; border:1px solid var(--outline-variant); border-radius:var(--radius-xl); padding:0.75rem 1rem; background:var(--surface-container-low); }
.repost-author { display:flex; align-items:center; gap:0.5rem; margin-bottom:0.4rem; }
.rp-avatar { width:24px; height:24px; border-radius:50%; object-fit:cover; }
.rp-name { font-size:0.82rem; font-weight:600; color:var(--on-surface); }
.rp-handle { font-size:0.78rem; color:var(--on-surface-variant); }
.rp-text { font-size:0.83rem; color:var(--on-surface-variant); line-height:1.5; }

/* ── Post video ── */
.post-video { width:100%; max-height:360px; border-radius:var(--radius-xl); object-fit:cover; margin-top:0.5rem; background:#000; }

/* ── Post document link ── */
.post-document-link { display:inline-flex; align-items:center; gap:0.4rem; margin-top:0.5rem; padding:0.5rem 0.875rem; background:var(--surface-container); border:1px solid var(--outline-variant); border-radius:var(--radius-full); font-size:0.82rem; font-weight:500; color:var(--primary); text-decoration:none; }
.post-document-link:hover { background:var(--surface-container-low); }

/* ── Trending posts sidebar ── */
.trending-posts-list { display:flex; flex-direction:column; gap:0.75rem; }
.trending-post-item { cursor:pointer; padding:0.5rem 0; border-bottom:1px solid var(--outline-variant); }
.trending-post-item:last-child { border-bottom:none; }
.tp-author { display:flex; align-items:center; gap:0.4rem; margin-bottom:0.3rem; }
.tp-avatar { width:22px; height:22px; border-radius:50%; object-fit:cover; }
.tp-avatar-init { width:22px; height:22px; border-radius:50%; background:var(--primary-fixed); display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-weight:700; color:var(--primary); }
.tp-name { font-size:0.78rem; font-weight:600; color:var(--on-surface); }
.tp-content { font-size:0.78rem; color:var(--on-surface-variant); line-height:1.4; margin-bottom:0.3rem; }
.tp-stats { display:flex; gap:0.75rem; font-size:0.72rem; color:var(--on-surface-variant); }
.sidebar-empty { font-size:0.8rem; color:var(--on-surface-variant); text-align:center; padding:0.5rem; }

.top-devs { display: flex; flex-direction: column; gap: 0.875rem; }

.top-dev-item { display: flex; align-items: center; justify-content: space-between; }
.top-dev-info { display: flex; align-items: center; gap: 0.625rem; }

.top-dev-avatar {
  width: 32px; height: 32px; border-radius: var(--radius-full);
  background: var(--surface-container); color: var(--primary);
  font-family: var(--font-headline); font-size: 0.75rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}

.top-dev-name { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 600; color: var(--on-surface); }
.top-dev-meta { font-size: 0.7rem; color: var(--on-surface-variant); text-transform: uppercase; letter-spacing: 0.04em; }

.follow-btn {
  background: none; border: none;
  font-family: var(--font-headline); font-size: 0.8rem; font-weight: 700;
  color: var(--primary); cursor: pointer;
}
.follow-btn:hover { text-decoration: underline; }

/* ── Compose Modal ── */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex; align-items: flex-end; /* bottom sheet on mobile */
  padding: 0;
}

@media (min-width: 640px) {
  .modal-overlay { align-items: center; padding: 1rem; }
}

.compose-modal {
  width: 100%;
  max-width: 560px;
  padding: 1.25rem;
  border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
}

@media (min-width: 640px) {
  .compose-modal { border-radius: var(--radius-2xl); }
}

.compose-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1rem;
}

.compose-title { font-family: var(--font-headline); font-size: 1rem; font-weight: 700; color: var(--on-surface); }

.compose-body { display: flex; flex-direction: column; gap: 0.875rem; margin-bottom: 0.875rem; }
.compose-user { display: flex; align-items: center; gap: 0.75rem; }
.compose-name { font-family: var(--font-headline); font-size: 0.875rem; font-weight: 600; color: var(--on-surface); }

.compose-textarea {
  width: 100%; padding: 0.75rem;
  background: var(--surface-container-low);
  border: 1px solid var(--outline-variant); border-radius: var(--radius-lg);
  font-family: var(--font-body); font-size: 0.9375rem;
  color: var(--on-surface); resize: none; outline: none; line-height: 1.6;
}
.compose-textarea:focus { border-color: var(--primary); }

.compose-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 0.75rem; border-top: 1px solid var(--outline-variant);
}

.compose-tools { display: flex; gap: 0.25rem; }
.icon-only { padding: 0.4rem; }

/* Modal transition */
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease, transform 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: translateY(20px); }
</style>
