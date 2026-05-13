// YouTube Clone Enhanced JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize app
    initializeApp();

    function initializeApp() {
        setupEventListeners();
        loadInitialVideos();
        setupTheme();
        setupSearch();
        setupModals();
        setupNotifications();
    }

    // Theme Management
    function setupTheme() {
        const themeToggle = document.querySelector('.theme-toggle');
        const currentTheme = localStorage.getItem('theme') || 'light';

        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.querySelector('i').className = 'fas fa-sun';
        }

        themeToggle.addEventListener('click', toggleTheme);
    }

    function toggleTheme() {
        const themeToggle = document.querySelector('.theme-toggle');
        const icon = themeToggle.querySelector('i');
        const currentTheme = document.documentElement.getAttribute('data-theme');

        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            icon.className = 'fas fa-moon';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            icon.className = 'fas fa-sun';
        }
    }

    // Event Listeners Setup
    function setupEventListeners() {
        // Menu toggle
        const menuBtn = document.querySelector('.menu-btn');
        const sidebar = document.querySelector('.sidebar');
        menuBtn.addEventListener('click', () => toggleSidebar(sidebar));

        // Sidebar navigation
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        sidebarItems.forEach(item => {
            item.addEventListener('click', () => handleSidebarClick(item));
        });

        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => handleFilterClick(btn));
        });

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        loadMoreBtn.addEventListener('click', loadMoreVideos);
    }

    function toggleSidebar(sidebar) {
        sidebar.classList.toggle('sidebar-hidden');
    }

    function handleSidebarClick(item) {
        // Remove active class from all items
        document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
        // Add active class to clicked item
        item.classList.add('active');

        const section = item.getAttribute('data-section');
        const category = item.getAttribute('data-category');

        if (section) {
            loadSection(section);
        } else if (category) {
            filterVideosByCategory(category);
        }
    }

    function handleFilterClick(btn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        filterVideosByCategory(filter);
    }

    // Search Functionality
    function setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const voiceSearchBtn = document.querySelector('.voice-search-btn');

        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });

        voiceSearchBtn.addEventListener('click', startVoiceSearch);
    }

    function performSearch() {
        const query = document.getElementById('searchInput').value.trim();
        if (query) {
            showToast(`Searching for: "${query}"`);
            // In a real app, this would make an API call
            filterVideosBySearch(query);
        }
    }

    function startVoiceSearch() {
        showToast('Voice search feature coming soon!');
        // In a real app, this would use Web Speech API
    }

    function filterVideosBySearch(query) {
        const videos = document.querySelectorAll('.video-card');
        videos.forEach(video => {
            const title = video.querySelector('.video-title').textContent.toLowerCase();
            const channel = video.querySelector('.channel-name').textContent.toLowerCase();

            if (title.includes(query.toLowerCase()) || channel.includes(query.toLowerCase())) {
                video.style.display = 'block';
            } else {
                video.style.display = 'none';
            }
        });
    }

    function filterVideosByCategory(category) {
        const videos = document.querySelectorAll('.video-card');
        videos.forEach(video => {
            const videoCategory = video.getAttribute('data-category') || 'all';
            if (category === 'all' || videoCategory === category) {
                video.style.display = 'block';
            } else {
                video.style.display = 'none';
            }
        });
    }

    // Video Management
    function loadInitialVideos() {
        const videoGrid = document.getElementById('videoGrid');
        const videos = generateVideoData();

        videos.forEach(video => {
            const videoCard = createVideoCard(video);
            videoGrid.appendChild(videoCard);
        });

        setupVideoCardListeners();
    }

    function loadMoreVideos() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        const originalText = loadMoreBtn.innerHTML;
        loadMoreBtn.innerHTML = '<div class="loading"></div> Loading...';

        setTimeout(() => {
            const videoGrid = document.getElementById('videoGrid');
            const newVideos = generateVideoData(6);

            newVideos.forEach(video => {
                const videoCard = createVideoCard(video);
                videoGrid.appendChild(videoCard);
            });

            setupVideoCardListeners();
            loadMoreBtn.innerHTML = originalText;
            showToast('Loaded 6 more videos!');
        }, 1500);
    }

    function generateVideoData(count = 12) {
        const categories = ['music', 'gaming', 'cooking', 'technology', 'sports', 'all'];
        const channels = [
            { name: 'Nature Channel', avatar: 'https://via.placeholder.com/36x36?text=NC' },
            { name: 'Chef Mario', avatar: 'https://via.placeholder.com/36x36?text=CM' },
            { name: 'Tech Reviews', avatar: 'https://via.placeholder.com/36x36?text=TR' },
            { name: 'Fit Life', avatar: 'https://via.placeholder.com/36x36?text=FL' },
            { name: 'Wanderlust', avatar: 'https://via.placeholder.com/36x36?text=WL' },
            { name: 'Music Studio', avatar: 'https://via.placeholder.com/36x36?text=MS' },
            { name: 'Game Masters', avatar: 'https://via.placeholder.com/36x36?text=GM' },
            { name: 'Cooking Pro', avatar: 'https://via.placeholder.com/36x36?text=CP' }
        ];

        const titles = [
            'Amazing Nature Documentary - Full HD',
            'Cooking Tutorial: Perfect Pasta Recipe',
            'Tech Review: Latest Smartphone Features',
            'Fitness Workout for Beginners',
            'Travel Vlog: Exploring Hidden Gems',
            'Music Video: Latest Hit Song',
            'Gaming Stream Highlights',
            'Cooking Masterclass: Advanced Techniques',
            'Tech News: AI Breakthroughs',
            'Sports Highlights Compilation',
            'Music Production Tutorial',
            'Travel Guide: Best Destinations'
        ];

        const videos = [];
        for (let i = 0; i < count; i++) {
            const channel = channels[Math.floor(Math.random() * channels.length)];
            const category = categories[Math.floor(Math.random() * categories.length)];
            const title = titles[Math.floor(Math.random() * titles.length)];

            videos.push({
                id: `video-${Date.now()}-${i}`,
                title: title,
                channel: channel.name,
                avatar: channel.avatar,
                thumbnail: `https://via.placeholder.com/320x180?text=${encodeURIComponent(title.substring(0, 20))}`,
                duration: `${Math.floor(Math.random() * 20) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
                views: `${(Math.random() * 10).toFixed(1)}M`,
                timeAgo: `${Math.floor(Math.random() * 30) + 1} ${['days', 'weeks', 'hours'][Math.floor(Math.random() * 3)]} ago`,
                category: category,
                description: `This is a detailed description for ${title}. Learn more about this amazing content!`,
                likes: Math.floor(Math.random() * 100000) + 1000,
                dislikes: Math.floor(Math.random() * 1000) + 10
            });
        }

        return videos;
    }

    function createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.setAttribute('data-category', video.category);
        card.setAttribute('data-video-id', video.id);

        card.innerHTML = `
            <div class="thumbnail">
                <img src="${video.thumbnail}" alt="Video thumbnail">
                <div class="duration">${video.duration}</div>
            </div>
            <div class="video-info">
                <div class="channel-avatar">
                    <img src="${video.avatar}" alt="Channel avatar">
                </div>
                <div class="video-details">
                    <h3 class="video-title">${video.title}</h3>
                    <p class="channel-name">${video.channel}</p>
                    <p class="video-stats">${video.views} views • ${video.timeAgo}</p>
                </div>
            </div>
        `;

        return card;
    }

    function setupVideoCardListeners() {
        const videoCards = document.querySelectorAll('.video-card');
        videoCards.forEach(card => {
            card.addEventListener('click', () => openVideoModal(card));
        });
    }

    // Modal Management
    function setupModals() {
        // Video modal
        const closeVideoModal = document.getElementById('closeVideoModal');
        closeVideoModal.addEventListener('click', () => closeModal('videoModal'));

        // Upload modal
        const uploadBtn = document.getElementById('uploadBtn');
        const closeUploadModal = document.getElementById('closeUploadModal');
        const uploadArea = document.querySelector('.upload-area');
        const videoFileInput = document.getElementById('videoFileInput');
        const uploadSubmitBtn = document.getElementById('uploadSubmitBtn');

        uploadBtn.addEventListener('click', () => openModal('uploadModal'));
        closeUploadModal.addEventListener('click', () => closeModal('uploadModal'));

        uploadArea.addEventListener('click', () => videoFileInput.click());
        videoFileInput.addEventListener('change', handleFileUpload);
        uploadSubmitBtn.addEventListener('click', submitUpload);

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                closeAllModals();
            }
        });
    }

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    function closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
        document.body.style.overflow = 'auto';
    }

    function openVideoModal(card) {
        const videoId = card.getAttribute('data-video-id');
        const videoData = getVideoDataById(videoId);

        if (!videoData) return;

        // Populate video modal
        document.getElementById('videoTitle').textContent = videoData.title;
        document.getElementById('videoViews').textContent = `${videoData.views} views`;
        document.getElementById('videoDate').textContent = videoData.timeAgo;
        document.getElementById('modalChannelName').textContent = videoData.channel;
        document.getElementById('modalChannelAvatar').src = videoData.avatar;
        document.getElementById('modalSubscriberCount').textContent = `${Math.floor(Math.random() * 100) + 10}K subscribers`;
        document.getElementById('videoDescription').textContent = videoData.description;
        document.getElementById('likeCount').textContent = videoData.likes.toLocaleString();
        document.getElementById('dislikeCount').textContent = videoData.dislikes.toLocaleString();
        document.getElementById('commentCount').textContent = `(${Math.floor(Math.random() * 1000) + 100})`;

        // Load comments
        loadComments(videoId);

        // Set up video player (placeholder)
        const videoPlayer = document.getElementById('videoPlayer');
        videoPlayer.poster = videoData.thumbnail;

        openModal('videoModal');
    }

    function getVideoDataById(videoId) {
        // In a real app, this would fetch from an API
        // For now, we'll create mock data
        const mockData = {
            title: 'Amazing Nature Documentary - Full HD',
            channel: 'Nature Channel',
            avatar: 'https://via.placeholder.com/36x36?text=NC',
            views: '1.2M',
            timeAgo: '2 days ago',
            description: 'Experience the beauty of nature in this stunning 4K documentary. From majestic mountains to serene oceans, witness the wonders of our planet.',
            likes: 12500,
            dislikes: 234
        };
        return mockData;
    }

    function loadComments(videoId) {
        const commentsList = document.getElementById('commentsList');
        commentsList.innerHTML = '';

        const comments = generateComments(5);
        comments.forEach(comment => {
            const commentElement = createCommentElement(comment);
            commentsList.appendChild(commentElement);
        });
    }

    function generateComments(count) {
        const authors = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];
        const texts = [
            'Amazing video! Really enjoyed the cinematography.',
            'This is exactly what I needed to see today. Thank you!',
            'Great content as always. Keep it up!',
            'The quality is outstanding. Well done!',
            'Can\'t wait for the next video in this series!'
        ];

        const comments = [];
        for (let i = 0; i < count; i++) {
            comments.push({
                author: authors[Math.floor(Math.random() * authors.length)],
                text: texts[Math.floor(Math.random() * texts.length)],
                timeAgo: `${Math.floor(Math.random() * 24) + 1} hours ago`,
                likes: Math.floor(Math.random() * 100) + 1
            });
        }
        return comments;
    }

    function createCommentElement(comment) {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.innerHTML = `
            <img src="https://via.placeholder.com/32x32?text=${comment.author.charAt(0)}" alt="User">
            <div class="comment-content">
                <div class="comment-author">${comment.author}</div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-actions">
                    <button><i class="fas fa-thumbs-up"></i> ${comment.likes}</button>
                    <button><i class="fas fa-thumbs-down"></i></button>
                    <button>Reply</button>
                    <span>${comment.timeAgo}</span>
                </div>
            </div>
        `;
        return commentDiv;
    }

    // Video Actions
    document.addEventListener('click', (e) => {
        if (e.target.closest('#likeBtn')) {
            toggleLike();
        } else if (e.target.closest('#dislikeBtn')) {
            toggleDislike();
        } else if (e.target.closest('#shareBtn')) {
            shareVideo();
        } else if (e.target.closest('#saveBtn')) {
            saveVideo();
        } else if (e.target.closest('#subscribeBtn')) {
            toggleSubscribe();
        } else if (e.target.closest('#postCommentBtn')) {
            postComment();
        }
    });

    function toggleLike() {
        const likeBtn = document.getElementById('likeBtn');
        const likeCount = document.getElementById('likeCount');

        likeBtn.classList.toggle('liked');
        const currentLikes = parseInt(likeCount.textContent.replace(/,/g, ''));
        const newLikes = likeBtn.classList.contains('liked') ? currentLikes + 1 : currentLikes - 1;
        likeCount.textContent = newLikes.toLocaleString();
    }

    function toggleDislike() {
        const dislikeBtn = document.getElementById('dislikeBtn');
        const dislikeCount = document.getElementById('dislikeCount');

        const currentDislikes = parseInt(dislikeCount.textContent.replace(/,/g, ''));
        dislikeCount.textContent = (currentDislikes + 1).toLocaleString();
    }

    function shareVideo() {
        const videoTitle = document.getElementById('videoTitle').textContent;
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('Video link copied to clipboard!');
        });
    }

    function saveVideo() {
        showToast('Video saved to Watch Later!');
    }

    function toggleSubscribe() {
        const subscribeBtn = document.getElementById('subscribeBtn');
        subscribeBtn.classList.toggle('subscribed');

        if (subscribeBtn.classList.contains('subscribed')) {
            subscribeBtn.textContent = 'Subscribed';
            showToast('Subscribed to channel!');
        } else {
            subscribeBtn.textContent = 'Subscribe';
            showToast('Unsubscribed from channel');
        }
    }

    function postComment() {
        const commentInput = document.getElementById('commentInput');
        const commentText = commentInput.value.trim();

        if (commentText) {
            const newComment = {
                author: 'You',
                text: commentText,
                timeAgo: 'now',
                likes: 0
            };

            const commentElement = createCommentElement(newComment);
            const commentsList = document.getElementById('commentsList');
            commentsList.insertBefore(commentElement, commentsList.firstChild);

            commentInput.value = '';
            showToast('Comment posted!');
        }
    }

    // Upload Functionality
    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (file) {
            showToast(`Selected file: ${file.name}`);
        }
    }

    function submitUpload() {
        const title = document.getElementById('uploadTitle').value;
        const description = document.getElementById('uploadDescription').value;
        const category = document.getElementById('uploadCategory').value;

        if (title && description && category) {
            showToast('Video uploaded successfully!');
            closeModal('uploadModal');
            // Reset form
            document.getElementById('uploadTitle').value = '';
            document.getElementById('uploadDescription').value = '';
            document.getElementById('uploadCategory').value = '';
        } else {
            showToast('Please fill in all fields');
        }
    }

    // Notifications
    function setupNotifications() {
        const notificationsBtn = document.getElementById('notificationsBtn');
        const closeNotifications = document.getElementById('closeNotifications');
        const notificationPanel = document.getElementById('notificationPanel');

        notificationsBtn.addEventListener('click', () => {
            notificationPanel.classList.toggle('show');
        });

        closeNotifications.addEventListener('click', () => {
            notificationPanel.classList.remove('show');
        });

        // Close notifications when clicking outside
        document.addEventListener('click', (e) => {
            if (!notificationPanel.contains(e.target) && !notificationsBtn.contains(e.target)) {
                notificationPanel.classList.remove('show');
            }
        });
    }

    // Section Loading
    function loadSection(section) {
        const videoGrid = document.getElementById('videoGrid');
        videoGrid.innerHTML = '<div style="text-align: center; padding: 40px; width: 100%;">Loading...</div>';

        setTimeout(() => {
            videoGrid.innerHTML = '';
            let videos;

            switch(section) {
                case 'trending':
                    videos = generateVideoData(12).sort((a, b) => parseFloat(b.views) - parseFloat(a.views));
                    break;
                case 'subscriptions':
                    videos = generateVideoData(8);
                    break;
                case 'library':
                    videos = generateVideoData(6);
                    break;
                case 'history':
                    videos = generateVideoData(10);
                    break;
                case 'watch-later':
                    videos = generateVideoData(4);
                    break;
                case 'liked':
                    videos = generateVideoData(8);
                    break;
                default:
                    videos = generateVideoData(12);
            }

            videos.forEach(video => {
                const videoCard = createVideoCard(video);
                videoGrid.appendChild(videoCard);
            });

            setupVideoCardListeners();
            showToast(`Loaded ${section} section`);
        }, 1000);
    }

    // Toast Notifications
    function showToast(message) {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;

        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: 'var(--card-bg)',
            color: 'var(--text-color)',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: '9999',
            fontSize: '14px',
            border: '1px solid var(--border-color)',
            animation: 'slideInFromRight 0.3s ease'
        });

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutToRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Add toast animations to CSS
    const toastStyles = document.createElement('style');
    toastStyles.textContent = `
        @keyframes slideInFromRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutToRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(toastStyles);

    // Responsive behavior
    function handleResize() {
        const sidebar = document.querySelector('.sidebar');
        if (window.innerWidth <= 768) {
            sidebar.classList.add('sidebar-hidden');
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize();
});