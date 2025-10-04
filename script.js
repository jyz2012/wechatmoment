class WechatMomentGenerator {
    constructor() {
        this.template = document.getElementById('wechat-moment-template');
        this.uploadedImages = []; // 存储所有上传的图片
        this.comments = []; // 存储所有评论
        this.likes = []; // 存储所有点赞
        this.initEventListeners();
        this.setDefaultAvatar();
        this.updateInteractionsVisibility(); // 初始化时隐藏互动区域
        this.checkAndLoadSavedData(); // 检查并询问是否加载保存的数据
    }
    
    // 设置默认头像
    setDefaultAvatar() {
        const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iNSIgZmlsbD0iI0Q4RDhEOCIvPgo8cGF0aCBkPSJNMjAgMTVDMjMuMzEzNyAxNSAyNiAxNy42ODYzIDI2IDIxQzI2IDI0LjMxMzcgMjMuMzEzNyAyNyAyMCAyN0MxNi42ODYzIDI3IDE0IDI0LjMxMzcgMTQgMjFDMTQgMTcuNjg2MyAxNi42ODYzIDE1IDIwIDE1WiIgZmlsbD0iIzlBOUE5QSIvPgo8cGF0aCBkPSJNMTAgMzBDMTAgMjcuNzkwOSAxMS4';
        document.getElementById('user-avatar').src = defaultAvatar;
        document.getElementById('author-avatar').src = defaultAvatar;
    }
    
    // 更新昵称
    updateNickname(nickname) {
        document.getElementById('user-nickname').textContent = nickname;
        document.getElementById('author-name').textContent = nickname;
        this.saveData(); // 保存数据
    }
    
    // 更新个性签名
    updateSignature(signature) {
        document.getElementById('user-signature').textContent = signature || '个性签名';
        this.saveData(); // 保存数据
    }
    
    // 更新头像
    updateAvatar(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const avatarElements = document.querySelectorAll('#user-avatar, #author-avatar');
            avatarElements.forEach(el => {
                el.src = e.target.result;
            });
        };
        reader.readAsDataURL(file);
    }
    
    // 更新背景 - 修改为使用CSS背景
    updateBackground(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            // 使用CSS背景而非img src
            document.getElementById('cover-bg').style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
    }
    
    // 更新文字内容
    updateText(content) {
        document.getElementById('moment-text').textContent = content;
        this.saveData(); // 保存数据
    }
    
    // 更新时间显示
    updateTime() {
        const timeValue = document.getElementById('time-value').value;
        const timeUnit = document.getElementById('time-unit').value;
        const timeElement = document.getElementById('moment-time');
        
        if (!timeValue || timeValue === '') {
            timeElement.textContent = '1分钟前';
        } else {
            timeElement.textContent = timeValue + timeUnit;
        }
        this.saveData(); // 保存数据
    }
    
    // 更新位置显示
    updateLocation(location) {
        const locationElement = document.getElementById('moment-location');
        locationElement.textContent = location || '';
        this.saveData(); // 保存数据
    }
    
    // 保存数据到localStorage
    saveData() {
        const data = {
            nickname: document.getElementById('nickname-input').value,
            signature: document.getElementById('signature-input').value,
            content: document.getElementById('content-input').value,
            timeValue: document.getElementById('time-value').value,
            timeUnit: document.getElementById('time-unit').value,
            location: document.getElementById('location-input').value,
            likes: this.likes,
            comments: this.comments
        };
        localStorage.setItem('wechatMomentData', JSON.stringify(data));
    }
    
    // 检查并询问是否加载保存的数据
    checkAndLoadSavedData() {
        const savedData = localStorage.getItem('wechatMomentData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                // 检查是否有实际的用户数据（不只是默认值）
                const hasUserData = data.nickname || data.signature || data.content || 
                                  data.location || (data.likes && data.likes.length > 0) || 
                                  (data.comments && data.comments.length > 0);
                
                if (hasUserData) {
                    const shouldRestore = confirm('检测到之前保存的设置，是否还原？');
                    
                    if (shouldRestore) {
                        this.loadSavedData(data);
                    } else {
                        // 用户选择不还原，清空历史记录
                        localStorage.removeItem('wechatMomentData');
                    }
                }
            } catch (error) {
                console.error('检查保存数据失败:', error);
                // 数据损坏，直接清除
                localStorage.removeItem('wechatMomentData');
            }
        }
    }
    
    // 从localStorage加载数据
    loadSavedData(data = null) {
        if (!data) {
            const savedData = localStorage.getItem('wechatMomentData');
            if (!savedData) return;
            try {
                data = JSON.parse(savedData);
            } catch (error) {
                console.error('加载保存数据失败:', error);
                return;
            }
        }
        
        // 恢复表单数据
        if (data.nickname) {
            document.getElementById('nickname-input').value = data.nickname;
            this.updateNickname(data.nickname);
        }
        if (data.signature) {
            document.getElementById('signature-input').value = data.signature;
            this.updateSignature(data.signature);
        }
        if (data.content) {
            document.getElementById('content-input').value = data.content;
            this.updateText(data.content);
        }
        if (data.timeValue) {
            document.getElementById('time-value').value = data.timeValue;
        }
        if (data.timeUnit) {
            document.getElementById('time-unit').value = data.timeUnit;
        }
        if (data.location) {
            document.getElementById('location-input').value = data.location;
            this.updateLocation(data.location);
        }
        
        // 恢复点赞和评论
        if (data.likes) {
            this.likes = data.likes;
            this.updateLikesPreview();
            this.updateMomentLikes();
        }
        if (data.comments) {
            this.comments = data.comments;
            this.updateCommentsPreview();
            this.updateMomentComments();
        }
        
        // 更新时间显示
        this.updateTime();
    }
    
    // 清空所有数据
    clearAllData() {
        if (confirm('确定要清空所有设置吗？此操作不可撤销。')) {
            // 清空localStorage
            localStorage.removeItem('wechatMomentData');
            
            // 刷新页面
            window.location.reload();
        }
    }
    
    // 添加图片到上传列表
    addImages(files) {
        const maxImages = 9;
        const remainingSlots = maxImages - this.uploadedImages.length;
        
        if (remainingSlots <= 0) {
            alert(`最多只能上传${maxImages}张图片`);
            return;
        }
        
        const filesToAdd = Array.from(files).slice(0, remainingSlots);
        
        filesToAdd.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = {
                    id: Date.now() + Math.random(), // 生成唯一ID
                    dataUrl: e.target.result,
                    file: file
                };
                this.uploadedImages.push(imageData);
                this.updateImagePreview();
                this.updatePreviewImages();
            };
            reader.readAsDataURL(file);
        });
        
        // 清空文件输入框，允许重复选择
        document.getElementById('image-upload').value = '';
    }
    
    // 移除指定图片
    removeImage(imageId) {
        this.uploadedImages = this.uploadedImages.filter(img => img.id !== imageId);
        this.updateImagePreview();
        this.updatePreviewImages();
    }
    
    // 清空所有图片
    clearAllImages() {
        this.uploadedImages = [];
        this.updateImagePreview();
        this.updatePreviewImages();
    }
    
    // 添加评论
    addComment(nickname, content) {
        if (!nickname.trim() || !content.trim()) {
            alert('请填写评论者昵称和评论内容');
            return;
        }
        
        const comment = {
            id: Date.now() + Math.random(),
            nickname: nickname.trim(),
            content: content.trim()
        };
        
        this.comments.push(comment);
        this.updateCommentsPreview();
        this.updateMomentComments();
        this.saveData(); // 保存数据
        
        // 清空输入框
        document.getElementById('comment-nickname').value = '';
        document.getElementById('comment-content').value = '';
    }
    
    // 移除评论
    removeComment(commentId) {
        this.comments = this.comments.filter(comment => comment.id !== commentId);
        this.updateCommentsPreview();
        this.updateMomentComments();
        this.saveData(); // 保存数据
    }
    
    // 清空所有评论
    clearAllComments() {
        this.comments = [];
        this.updateCommentsPreview();
        this.updateMomentComments();
        this.saveData(); // 保存数据
    }
    
    // 添加点赞
    addLike(nickname) {
        if (!nickname.trim()) {
            alert('请填写点赞者昵称');
            return;
        }
        
        // 检查是否已经点赞过
        if (this.likes.some(like => like.nickname === nickname.trim())) {
            alert('该用户已经点赞过了');
            return;
        }
        
        const like = {
            id: Date.now() + Math.random(),
            nickname: nickname.trim()
        };
        
        this.likes.push(like);
        this.updateLikesPreview();
        this.updateMomentLikes();
        this.saveData(); // 保存数据
        
        // 清空输入框
        document.getElementById('like-nickname').value = '';
    }
    
    // 移除点赞
    removeLike(likeId) {
        this.likes = this.likes.filter(like => like.id !== likeId);
        this.updateLikesPreview();
        this.updateMomentLikes();
        this.saveData(); // 保存数据
    }
    
    // 清空所有点赞
    clearAllLikes() {
        this.likes = [];
        this.updateLikesPreview();
        this.updateMomentLikes();
        this.saveData(); // 保存数据
    }
    
    // 更新点赞预览区域
    updateLikesPreview() {
        const previewContainer = document.getElementById('likes-preview');
        previewContainer.innerHTML = '';
        
        this.likes.forEach(like => {
            const likeItem = document.createElement('div');
            likeItem.className = 'preview-like-item';
            
            const nickname = document.createElement('span');
            nickname.className = 'preview-like-nickname';
            nickname.textContent = like.nickname;
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'preview-like-remove';
            removeBtn.innerHTML = '×';
            removeBtn.onclick = () => this.removeLike(like.id);
            
            likeItem.appendChild(nickname);
            likeItem.appendChild(removeBtn);
            previewContainer.appendChild(likeItem);
        });
    }
    
    // 更新朋友圈点赞显示
    updateMomentLikes() {
        const container = document.getElementById('moment-likes');
        container.innerHTML = '';
        
        if (this.likes.length === 0) {
            this.updateInteractionsVisibility();
            return;
        }
        
        // 添加点赞图标
        const icon = document.createElement('img');
        icon.className = 'likes-icon';
        icon.src = 'assets/like_light.jpg';
        icon.alt = '点赞';
        container.appendChild(icon);
        
        // 添加点赞者昵称
        this.likes.forEach((like, index) => {
            const nickname = document.createElement('span');
            nickname.className = 'like-nickname';
            nickname.textContent = like.nickname;
            container.appendChild(nickname);
            
            // 添加分隔符（除了最后一个）
            if (index < this.likes.length - 1) {
                const separator = document.createElement('span');
                separator.className = 'like-separator';
                separator.textContent = ', ';
                container.appendChild(separator);
            }
        });
        
        this.updateInteractionsVisibility();
    }
    
    // 更新评论预览区域
    updateCommentsPreview() {
        const previewContainer = document.getElementById('comments-preview');
        previewContainer.innerHTML = '';
        
        this.comments.forEach(comment => {
            const commentItem = document.createElement('div');
            commentItem.className = 'preview-comment-item';
            
            const nickname = document.createElement('span');
            nickname.className = 'preview-comment-nickname';
            nickname.textContent = comment.nickname + ':';
            
            const content = document.createElement('span');
            content.className = 'preview-comment-content';
            content.textContent = comment.content;
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'preview-comment-remove';
            removeBtn.innerHTML = '×';
            removeBtn.onclick = () => this.removeComment(comment.id);
            
            commentItem.appendChild(nickname);
            commentItem.appendChild(content);
            commentItem.appendChild(removeBtn);
            previewContainer.appendChild(commentItem);
        });
    }
    
    // 更新朋友圈评论显示
    updateMomentComments() {
        const container = document.getElementById('moment-comments');
        container.innerHTML = '';
        
        if (this.comments.length === 0) {
            this.updateInteractionsVisibility();
            return;
        }
        
        this.comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'moment-comment';
            
            const nickname = document.createElement('span');
            nickname.className = 'comment-nickname';
            nickname.textContent = comment.nickname;
            
            const content = document.createElement('span');
            content.className = 'comment-content';
            content.textContent = ': ' + comment.content;
            
            commentDiv.appendChild(nickname);
            commentDiv.appendChild(content);
            container.appendChild(commentDiv);
        });
        
        this.updateInteractionsVisibility();
    }
    
    // 更新互动区域的显示状态
    updateInteractionsVisibility() {
        const interactionsContainer = document.getElementById('moment-interactions');
        const likesContainer = document.getElementById('moment-likes');
        const commentsContainer = document.getElementById('moment-comments');
        const divider = document.getElementById('interaction-divider');
        
        const hasLikes = this.likes.length > 0;
        const hasComments = this.comments.length > 0;
        
        // 如果既没有点赞也没有评论，隐藏整个互动区域
        if (!hasLikes && !hasComments) {
            interactionsContainer.style.display = 'none';
            return;
        }
        
        // 显示互动区域
        interactionsContainer.style.display = 'block';
        
        // 控制分隔线的显示：只有当既有点赞又有评论时才显示
        if (hasLikes && hasComments) {
            divider.style.display = 'block';
        } else {
            divider.style.display = 'none';
        }
        
        // 调整点赞区域的下边距
        if (hasLikes && !hasComments) {
            likesContainer.style.padding = '8px 12px';
        } else {
            likesContainer.style.padding = '8px 12px 0 12px';
        }
    }
    
    // 更新图片预览区域
    updateImagePreview() {
        const previewContainer = document.getElementById('image-preview');
        previewContainer.innerHTML = '';
        
        this.uploadedImages.forEach(image => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            
            const img = document.createElement('img');
            img.src = image.dataUrl;
            img.alt = '预览图片';
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '×';
            removeBtn.onclick = () => this.removeImage(image.id);
            
            previewItem.appendChild(img);
            previewItem.appendChild(removeBtn);
            previewContainer.appendChild(previewItem);
        });
    }
    
    // 更新预览区域的图片显示
    updatePreviewImages() {
        const container = document.getElementById('image-container');
        container.innerHTML = '';
        
        if (this.uploadedImages.length === 0) return;
        
        const imageCount = this.uploadedImages.length;
        
        // 根据图片数量设置不同的布局
        if (imageCount === 1) {
            // 单张图片 - 按原比例显示
            const img = document.createElement('img');
            img.src = this.uploadedImages[0].dataUrl;
            img.className = 'image-single';
            container.appendChild(img);
        } else {
            // 多张图片 - 使用背景图方式确保截图时正确显示
            container.className = 'images-grid';
            
            // 设置不同的网格布局
            if (imageCount === 2) {
                container.classList.add('grid-2');
            } else if (imageCount === 3) {
                container.classList.add('grid-3');
            } else if (imageCount === 4) {
                container.classList.add('grid-4');
            } else {
                // 5-9张图片
                container.classList.add('grid-5-9');
            }
            
            // 创建图片元素 - 使用div背景图方式
            this.uploadedImages.forEach(image => {
                const div = document.createElement('div');
                div.className = 'grid-image';
                div.style.backgroundImage = `url(${image.dataUrl})`;
                container.appendChild(div);
            });
        }
    }
    
    // 生成截图
    generateScreenshot() {
        // 显示加载提示
        const originalText = document.getElementById('generate-btn').textContent;
        document.getElementById('generate-btn').textContent = '生成中...';
        document.getElementById('generate-btn').disabled = true;
        
        // 使用html2canvas生成截图
        html2canvas(this.template, {
            scale: 2, // 提高清晰度
            useCORS: true, // 允许跨域图片
            backgroundColor: null, // 透明背景
            allowTaint: true, // 允许污染图片
            logging: false, // 关闭日志
            imageTimeout: 15000, // 图片加载超时时间
            onclone: function(clonedDoc) {
                // 确保克隆的文档中的背景图也能正确显示
                const clonedCover = clonedDoc.getElementById('cover-bg');
                if (clonedCover) {
                    const originalCover = document.getElementById('cover-bg');
                    clonedCover.style.backgroundImage = originalCover.style.backgroundImage;
                }
                
                // 确保克隆的文档中的多张图片也能正确显示
                const clonedImages = clonedDoc.querySelectorAll('.grid-image');
                const originalImages = document.querySelectorAll('.grid-image');
                
                clonedImages.forEach((clonedImg, index) => {
                    if (originalImages[index]) {
                        clonedImg.style.backgroundImage = originalImages[index].style.backgroundImage;
                    }
                });
            }
        }).then(canvas => {
            // 将canvas转换为图片数据URL
            const imageData = canvas.toDataURL('image/png');
            
            // 创建下载链接
            const link = document.createElement('a');
            link.download = '朋友圈截图.png';
            link.href = imageData;
            
            // 触发下载
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // 恢复按钮状态
            document.getElementById('generate-btn').textContent = originalText;
            document.getElementById('generate-btn').disabled = false;
        }).catch(error => {
            console.error('截图生成失败:', error);
            alert('截图生成失败，请重试');
            
            // 恢复按钮状态
            document.getElementById('generate-btn').textContent = originalText;
            document.getElementById('generate-btn').disabled = false;
        });
    }
    
    // 初始化事件监听
    initEventListeners() {
        // 绑定昵称输入
        document.getElementById('nickname-input').addEventListener('input', (e) => {
            this.updateNickname(e.target.value || '微信用户');
        });
        
        // 绑定个性签名输入
        document.getElementById('signature-input').addEventListener('input', (e) => {
            this.updateSignature(e.target.value);
        });
        
        // 绑定头像上传
        document.getElementById('avatar-upload').addEventListener('change', (e) => {
            this.updateAvatar(e.target.files[0]);
        });
        
        // 绑定背景上传
        document.getElementById('bg-upload').addEventListener('change', (e) => {
            this.updateBackground(e.target.files[0]);
        });
        
        // 绑定内容输入
        document.getElementById('content-input').addEventListener('input', (e) => {
            this.updateText(e.target.value || '这里输入朋友圈内容...');
        });
        
        // 绑定时间设置
        document.getElementById('time-value').addEventListener('input', () => {
            this.updateTime();
        });
        
        document.getElementById('time-unit').addEventListener('change', () => {
            this.updateTime();
        });
        
        // 绑定位置输入
        document.getElementById('location-input').addEventListener('input', (e) => {
            this.updateLocation(e.target.value);
        });
        
        // 绑定图片上传
        document.getElementById('image-upload').addEventListener('change', (e) => {
            this.addImages(e.target.files);
        });
        
        // 绑定清空图片按钮
        document.getElementById('clear-images-btn').addEventListener('click', () => {
            this.clearAllImages();
        });
        
        // 绑定添加点赞按钮
        document.getElementById('add-like-btn').addEventListener('click', () => {
            const nickname = document.getElementById('like-nickname').value;
            this.addLike(nickname);
        });
        
        // 绑定点赞输入框回车事件
        document.getElementById('like-nickname').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const nickname = document.getElementById('like-nickname').value;
                this.addLike(nickname);
            }
        });
        
        // 绑定清空点赞按钮
        document.getElementById('clear-likes-btn').addEventListener('click', () => {
            this.clearAllLikes();
        });
        
        // 绑定添加评论按钮
        document.getElementById('add-comment-btn').addEventListener('click', () => {
            const nickname = document.getElementById('comment-nickname').value;
            const content = document.getElementById('comment-content').value;
            this.addComment(nickname, content);
        });
        
        // 绑定评论输入框回车事件
        document.getElementById('comment-content').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const nickname = document.getElementById('comment-nickname').value;
                const content = document.getElementById('comment-content').value;
                this.addComment(nickname, content);
            }
        });
        
        // 绑定清空评论按钮
        document.getElementById('clear-comments-btn').addEventListener('click', () => {
            this.clearAllComments();
        });
        
        // 绑定生成按钮
        document.getElementById('generate-btn').addEventListener('click', () => {
            this.generateScreenshot();
        });
        
        // 绑定清空所有按钮
        document.getElementById('clear-all-btn').addEventListener('click', () => {
            this.clearAllData();
        });
    }
}

// 初始化生成器
document.addEventListener('DOMContentLoaded', function() {
    const generator = new WechatMomentGenerator();
});