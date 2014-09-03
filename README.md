Xpen 开发中， 目标是可以在本地编辑 js html css，最后上传到 codepen.io 等平台

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


---

目前支持的情况

- html 预处理: html
- js 预处理: js
- css 预处理: scss, stylus, css
- 外部库: jquery
