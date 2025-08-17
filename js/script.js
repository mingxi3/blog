// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
  // 已移除扫描线动画
  
  // 创建扫描线动画 (已注释掉)
  // const scanline = document.createElement('div');
  // scanline.classList.add('scanline');
  // document.body.appendChild(scanline);

  // 汉堡菜单交互
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