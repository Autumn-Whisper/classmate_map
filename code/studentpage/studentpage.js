// 动态加载外部脚本库的函数
function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.onload = () => resolve(script);
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
      document.head.appendChild(script);
    });
  }
  
  // 加载marked和MathJax库
  Promise.all([
    loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js'),
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.0/es5/tex-mml-chtml.js')
  ])
    .then(() => {
      // 获取用于展示Markdown内容的容器
      const content = document.getElementById('studentpage-content');
  
      // 获取URL参数中的同学名字
      const urlParams = new URLSearchParams(window.location.search);
      const studentName = urlParams.get('student');
  
      // 根据同学名字加载对应的Markdown文件（例如：张三.md）
      fetch(`content/studentpage/${studentName}.md`)
        .then(response => response.text())
        .then(text => {
          // 使用marked库将Markdown转换为HTML
          const html = marked(text);
          // 将转换后的HTML插入容器
          content.innerHTML = html;
          // 使用MathJax渲染数学公式
          MathJax.typesetPromise([content]).catch((err) => console.error(err));
        })
        .catch(error => {
          console.error('加载Markdown文件时发生错误：', error);
        });
    })
    .catch(error => {
      console.error('加载库时发生错误：', error);
    });
  