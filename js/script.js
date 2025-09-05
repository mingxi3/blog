// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
  
  // 文章管理系统 - 自动加载文章功能
  class ArticleManager {
    constructor() {
      this.articles = []; // 存储所有文章数据
      this.init();
    }

    // 初始化文章系统
    async init() {
      await this.loadArticles();
      this.renderArticles();
    }

    // 从posts文件夹加载所有文章
    async loadArticles() {
      try {
        // 尝试从posts文件夹加载真实文章
        this.articles = await this.loadRealArticles();
        
        // 如果没有找到真实文章，使用示例文章
        if (this.articles.length === 0) {
          this.articles = [
            {
              title: "欢迎使用你的新博客！",
              date: "2024-12-19",
              tags: ["欢迎", "指南"],
              summary: "这是你的新博客！开始写作吧，分享你的想法和经验。",
              content: `
            <h2>欢迎使用你的新博客！</h2>
            <p>恭喜你搭建了自己的博客系统！这是一个简单但功能完整的博客，你可以：</p>
            
            <h3>✨ 主要功能</h3>
            <ul>
              <li>📱 响应式设计，手机电脑都好看</li>
              <li>🎨 简洁美观的界面</li>
              <li>✍️ 支持Markdown格式</li>
              <li>🏷️ 文章标签系统</li>
              <li>📅 按日期归档</li>
            </ul>

            <h3>🚀 开始使用</h3>
            <p>按照以下步骤添加你的第一篇文章：</p>
            <ol>
              <li>在文件夹中找到 "添加新文章模板.txt"</li>
              <li>复制模板内容到新文件</li>
              <li>填写你的文章内容</li>
              <li>将文件保存到 posts 文件夹</li>
              <li>刷新网页，你的文章就会显示出来！</li>
            </ol>

            <h3>📝 写作格式</h3>
            <p>你可以使用简单的HTML标签来格式化文本：</p>
            <ul>
              <li><b>粗体文本</b></li>
              <li><i>斜体文本</i></li>
              <li><a href="#">链接</a></li>
            </ul>

            <p>开始写作吧！期待看到你的第一篇文章。</p>
          `,
              filename: "welcome.txt"
            }
          ];
        }
      } catch (error) {
        console.error('加载文章失败:', error);
        // 出错时使用示例文章
        this.articles = [
          {
            title: "欢迎使用你的新博客！",
            date: "2024-12-19",
            tags: ["欢迎", "指南"],
            summary: "这是你的新博客！开始写作吧，分享你的想法和经验。",
            content: `
            <h2>欢迎使用你的新博客！</h2>
            <p>恭喜你搭建了自己的博客系统！这是一个简单但功能完整的博客，你可以：</p>
            
            <h3>✨ 主要功能</h3>
            <ul>
              <li>📱 响应式设计，手机电脑都好看</li>
              <li>🎨 简洁美观的界面</li>
              <li>✍️ 支持Markdown格式</li>
              <li>🏷️ 文章标签系统</li>
              <li>📅 按日期归档</li>
            </ul>

            <h3>🚀 开始使用</h3>
            <p>按照以下步骤添加你的第一篇文章：</p>
            <ol>
              <li>在文件夹中找到 "添加新文章模板.txt"</li>
              <li>复制模板内容到新文件</li>
              <li>填写你的文章内容</li>
              <li>将文件保存到 posts 文件夹</li>
              <li>刷新网页，你的文章就会显示出来！</li>
            </ol>

            <h3>📝 写作格式</h3>
            <p>你可以使用简单的HTML标签来格式化文本：</p>
            <ul>
              <li><b>粗体文本</b></li>
              <li><i>斜体文本</i></li>
              <li><a href="#">链接</a></li>
            </ul>

            <p>开始写作吧！期待看到你的第一篇文章。</p>
          `,
            filename: "welcome.txt"
          }
        ];
      }
    }

    // 从服务器加载真实文章
    async loadRealArticles() {
      try {
        const response = await fetch('posts/');
        if (!response.ok) throw new Error('无法访问posts文件夹');
        
        // 这里需要服务器端支持列出目录内容
        // 对于静态网站，可以使用预定义的索引文件
        const indexResponse = await fetch('posts/index.json');
        if (indexResponse.ok) {
          const index = await indexResponse.json();
          const articles = [];
          
          for (const filename of index.files) {
            if (filename.endsWith('.txt')) {
              const articleResponse = await fetch(`posts/${filename}`);
              if (articleResponse.ok) {
                const content = await articleResponse.text();
                articles.push(this.parseArticleFile(content, filename));
              }
            }
          }
          
          return articles;
        }
        
        return [];
      } catch (error) {
        console.warn('无法加载真实文章，使用示例数据:', error);
        return [];
      }
    }

    // 解析文章文件内容 - 支持新的文章格式
    parseArticleFile(content, filename) {
      const lines = content.split('\n');
      const article = {
        title: '',
        date: '',
        tags: [],
        summary: '',
        content: '',
        filename: filename
      };
      
      let contentStarted = false;
      let contentLines = [];
      
      for (const line of lines) {
        // 解析头部信息
        if (line.startsWith('标题:')) {
          article.title = line.substring(3).trim();
        } else if (line.startsWith('日期:')) {
          article.date = line.substring(3).trim();
        } else if (line.startsWith('标签:')) {
          article.tags = line.substring(3).split(',').map(tag => tag.trim());
        } else if (line.startsWith('摘要:')) {
          article.summary = line.substring(3).trim();
        }
        // 检测到分隔符，开始收集内容
        else if (line.trim() === '---') {
          contentStarted = true;
        }
        // 收集正文内容
        else if (contentStarted) {
          contentLines.push(line);
        }
      }
      
      // 移除前后空白行
      article.content = contentLines.join('\n').trim();
      return article;
    }

    // 显示添加文章指南
    showAddArticleGuide() {
      const container = document.querySelector('.posts-grid') || document.querySelector('.archive-posts');
      if (container) {
        container.innerHTML = `
          <div class="add-article-guide">
            <h2>还没有文章</h2>
            <p>按照以下步骤添加你的第一篇文章：</p>
            <ol>
              <li>打开 "添加新文章模板.txt"</li>
              <li>复制模板内容到新文件</li>
              <li>填写你的文章内容</li>
              <li>保存到 posts 文件夹</li>
              <li>刷新此页面</li>
            </ol>
          </div>
        `;
      }
    }

    // 渲染文章列表
    renderArticles() {
      const container = document.querySelector('.posts-grid');
      const archiveContainer = document.querySelector('.archive-posts');
      
      if (container) {
        // 首页文章列表
        container.innerHTML = '';
        this.articles.forEach(article => {
          const articleCard = this.createArticleCard(article);
          container.appendChild(articleCard);
        });
      }

      if (archiveContainer) {
        // 归档页面文章列表
        archiveContainer.innerHTML = '';
        this.articles.forEach(article => {
          const archiveItem = this.createArchiveItem(article);
          archiveContainer.appendChild(archiveItem);
        });
      }
    }

    // 创建文章卡片
    createArticleCard(article) {
      const card = document.createElement('article');
      card.className = 'post-card';
      card.innerHTML = `
        <div class="post-meta">
          <time>${article.date}</time>
          <div class="tags">
            ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        </div>
        <h2><a href="?article=${this.slugify(article.title)}" class="article-link" data-title="${article.title}">${article.title}</a></h2>
        <p class="excerpt">${article.summary}</p>
        <a href="?article=${this.slugify(article.title)}" class="read-more" data-title="${article.title}">阅读更多</a>
      `;
      
      // 添加点击事件监听器
      const links = card.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const title = link.getAttribute('data-title');
          this.showArticleDetail(title);
        });
      });
      
      return card;
    }

    // 创建归档项目
    createArchiveItem(article) {
      const item = document.createElement('div');
      item.className = 'archive-item';
      item.innerHTML = `
        <time>${article.date}</time>
        <h3><a href="#" class="article-link" data-title="${article.title}">${article.title}</a></h3>
        <div class="tags">
          ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      `;
      
      // 添加点击事件监听器
      const link = item.querySelector('.article-link');
      if (link) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const title = link.getAttribute('data-title');
          this.showArticleDetail(title);
        });
      }
      
      return item;
    }

    // 将标题转换为URL友好的格式
    slugify(text) {
      return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    }

    // 显示文章详情
    showArticleDetail(title) {
      const article = this.articles.find(a => a.title === title);
      if (!article) {
        alert('文章未找到！');
        return;
      }

      // 保存当前状态到历史记录
      history.pushState({view: 'detail', title: title}, '', `?article=${this.slugify(title)}`);
      
      // 创建文章详情页面
      const detailPage = this.createDetailPage(article);
      
      // 替换当前页面内容
      const container = document.querySelector('.container') || document.querySelector('main');
      if (container) {
        container.innerHTML = detailPage;
        
        // 滚动到顶部
        window.scrollTo(0, 0);
      }
    }

    // 创建文章详情页面
    createDetailPage(article) {
      return `
        <div class="article-detail">
          <article class="full-article">
            <header>
              <h1>${article.title}</h1>
              <div class="meta">
                <time>${article.date}</time>
                <div class="tags">
                  ${article.tags.map(tag => `<span class="tag">#${tag}</span>`).join(' ')}
                </div>
              </div>
            </header>
            
            <div class="content">
              ${article.content}
            </div>
          </article>
        </div>
      `;
    }

    // 返回文章列表
    returnToList() {
      // 重新渲染文章列表
      this.renderArticles();
      
      // 如果有加载动画，重新初始化
      if (typeof ScrollReveal !== 'undefined') {
        setTimeout(() => {
          ScrollReveal().reveal('.post-card', {
            delay: 100,
            distance: '20px',
            duration: 600,
            easing: 'ease-in-out',
            origin: 'bottom',
            interval: 200
          });
        }, 100);
      }
    }
  }

  // 初始化文章管理器
  window.articleManager = new ArticleManager();

  // 监听浏览器返回事件
  window.addEventListener('popstate', (event) => {
    if (event.state && event.state.view === 'detail') {
      // 如果历史记录中有文章详情，显示它
      articleManager.showArticleDetail(event.state.title);
    } else {
      // 否则返回文章列表
      articleManager.returnToList();
    }
  });

  // 汉堡菜单交互（保持原有功能）
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('nav ul');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // 点击导航链接后关闭菜单
    document.querySelectorAll('nav ul li a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 初始化滚动动画
  if (typeof ScrollReveal !== 'undefined') {
    ScrollReveal().reveal('.post-card', {
      delay: 100,
      distance: '20px',
      duration: 600,
      easing: 'ease-in-out',
      origin: 'bottom',
      interval: 200
    });

    ScrollReveal().reveal('.featured-post', {
      delay: 200,
      distance: '30px',
      duration: 800,
      easing: 'ease-in-out',
      origin: 'top'
    });

    ScrollReveal().reveal('.profile', {
      delay: 200,
      distance: '30px',
      duration: 800,
      easing: 'ease-in-out',
      origin: 'bottom'
    });

    ScrollReveal().reveal('.bio', {
      delay: 400,
      distance: '30px',
      duration: 800,
      easing: 'ease-in-out',
      origin: 'bottom'
    });

    ScrollReveal().reveal('article', {
      delay: 200,
      distance: '30px',
      duration: 800,
      easing: 'ease-in-out',
      origin: 'top'
    });

    ScrollReveal().reveal('.comments', {
      delay: 400,
      distance: '30px',
      duration: 800,
      easing: 'ease-in-out',
      origin: 'bottom'
    });

    ScrollReveal().reveal('.archive-item', {
      delay: 100,
      distance: '20px',
      duration: 600,
      easing: 'ease-in-out',
      origin: 'left',
      interval: 150
    });
  }

  // 文章页图片扫描线效果 (已注释掉)
  /*
  const images = document.querySelectorAll('.content img');
  images.forEach(img => {
    // 创建扫描线效果
    const scanOverlay = document.createElement('div');
    scanOverlay.style.position = 'absolute';
    scanOverlay.style.top = '0';
    scanOverlay.style.left = '0';
    scanOverlay.style.width = '100%';
    scanOverlay.style.height = '100%';
    scanOverlay.style.background = 'repeating-linear-gradient(to bottom, transparent 0px, rgba(0, 0, 0, 0.1) 1px, transparent 2px)';
    scanOverlay.style.pointerEvents = 'none';
    scanOverlay.style.zIndex = '1';

    // 确保图片容器有相对定位
    if (img.parentElement.style.position !== 'relative') {
      img.parentElement.style.position = 'relative';
    }

    img.parentElement.appendChild(scanOverlay);
  });
  */

  // 代码高亮初始化
  if (typeof Prism !== 'undefined') {
    Prism.highlightAll();
  }

  // 文字逐字出现效果
  const typewriterText = document.querySelector('.bio p');
  if (typewriterText) {
    const text = typewriterText.textContent;
    typewriterText.textContent = '';
    let i = 0;

    function typeWriter() {
      if (i < text.length) {
        typewriterText.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      }
    }

    // 等待元素显示后开始动画
    setTimeout(typeWriter, 1000);
  }
});