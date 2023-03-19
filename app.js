const path = require('path');

const express = require('express');

const blogRoutes = require('./routes/blog');

const app = express();

// Activate EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies  수신 요청 본문 구문 분석 / 추출 되는지 확인 /본분 구문분석을 수행할 내장 미들웨어를 설정
app.use(express.static('public')); // Serve static files (e.g. CSS files)  정적파일 제공되는지 확인

app.use(blogRoutes);

app.use(function (error, req, res, next) {
  // Default error handling function
  // Will become active whenever any route / middleware crashes
  console.log(error);
  res.status(500).render('500');
});

app.listen(3000);
