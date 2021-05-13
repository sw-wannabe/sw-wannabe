const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser")

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
    // res.sendFile(__dirname + "");
	
	// main.html 전달
});

router.get('/info', function (req, res, next) {
    res.render('index', { title: 'Info' });
	
	// info.html 전달
});

router.post('/search', function (req, res, next) {
	console.log(req.body);
    res.render('index', { title: 'Search' });
	
	// 분실 일시, 분실 장소, 분실 분류, 분실 이름 넘어옴
	
	// DB 검색
	
	// 유저 정보 저장
	
	// searchList.html, 검색한 목록 프론트에 전달 (new list + old list)
});

router.post('/check-new', function (req, res, next) {
	console.log(req.body);
    res.render('index', { title: 'Check New' });
	
	// 분실 일시, 분실 장소, 분실 분류, 분실 이름 넘어옴
	
	// DB 검색 - 새로운 리스트 가져오기 -> 이전 최신 물품은 서버에 저장해두기
	
	// 유저 정보 저장
	
	// searchList.html, 검색한 목록 프론트에 전달 (new list + old list)
});

router.post('', function(req, res, next) {
	
})

module.exports = router;