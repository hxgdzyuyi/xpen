XPen 致力于可以在本地编辑 js html css，最后上传到 codepen.io 等平台的工具

### 起源

因为在 codepen.io 上的编辑代码无法使自己习惯的编辑器，于是就做了这个工具。

### 安装

```
  sudo npm install xpen -g
```

### 使用

---

抓取一个线上 codepen 项目到本地。

```bash
  xpen fetch http://codepen.io/pimskie/pen/lvwhs
  xpen f http://codepen.io/pimskie/pen/lvwhs
```

---

在本地创建一个 xpen 项目。

```bash
  xpen init
  xpen i
  xpen init --fast // 默认使用 jade, stylus, js
```

---

新建服务器编辑 js， css， html 文件

```bash
  xpen serve
  xpen s
  xpen s -p 2014
```

---

上传本地的 xpen 项目到 codepen.io

```bash
  xpen upload codepen
  xpen u c
```

![Imgur](http://i.imgur.com/EcRL2Q6.png)

http://codepen.io/anon/pen/hqyuC


### 目前支持的情况

- html 预处理: html, jade
- js 预处理: js
- css 预处理: scss, stylus, css
- 外部库: jquery
