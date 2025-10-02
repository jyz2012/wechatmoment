class WechatMomentGenerator {
    constructor() {
        this.template = document.getElementById('wechat-moment-template');
        this.uploadedImages = []; // 存储所有上传的图片
        this.initEventListeners();
        this.setDefaultAvatar();
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
    }
    
    // 更新个性签名
    updateSignature(signature) {
        document.getElementById('user-signature').textContent = signature || '个性签名';
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
        
        // 绑定图片上传
        document.getElementById('image-upload').addEventListener('change', (e) => {
            this.addImages(e.target.files);
        });
        
        // 绑定清空图片按钮
        document.getElementById('clear-images-btn').addEventListener('click', () => {
            this.clearAllImages();
        });
        
        // 绑定生成按钮
        document.getElementById('generate-btn').addEventListener('click', () => {
            this.generateScreenshot();
        });
    }
}

// 初始化生成器
document.addEventListener('DOMContentLoaded', function() {
    const generator = new WechatMomentGenerator();
});