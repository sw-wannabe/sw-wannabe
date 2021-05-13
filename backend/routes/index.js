const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");

let num_of_user = 0;

const user_info = {};

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.sendFile(__dirname + "");
	
	let user_id;
	if (req.cookies == undefined) { // 쿠키 없는 경우
		// userid 생성
		user_id = createUser();
	} else { // 쿠키 있는 경우
		user_id = req.cookies.user_id
		console.log(user_id);
	}
	
	// index.ejs 전달
    res.render('index', { title: 'index' });
});

router.get('/info', function (req, res, next) {
    res.render('index', { title: 'Info' });
	
	let user_id;
	if (req.cookies == undefined) { // 쿠키 없는 경우
		// userid 생성
		user_id = createUser();
	} else { // 쿠키 있는 경우
		user_id = req.cookies.user_id
		console.log(user_id);
	}
	
	// info.html 전달
    res.render('info', { title: 'User Info' });
});

router.get('/userinfo', function (req, res, next) {
    res.render('index', { title: 'User Info' });
	
	let user_id;
	if (req.cookies == undefined) { // 쿠키 없는 경우
		// userid 생성
		user_id = createUser();
	} else { // 쿠키 있는 경우
		user_id = req.cookies.user_id
		console.log(user_id);
	}
	
	const current_user_info = user_info[user_id];
	console.log(current_user_info)
	
    // res.render('userinfo', { title: 'User Info' });
});


// post
router.post('/search', function (req, res, next) {
	console.log(req.body);
    res.render('index', { title: 'Search' });
	
	let user_id;
	if (req.cookies == undefined) { // 쿠키 없는 경우
		// userid 생성
		user_id = createUser();
	} else { // 쿠키 있는 경우
		user_id = req.cookies.user_id
		console.log(user_id);
	}
	// 분실 일시(date - datetime), 분실 장소(location - string), 분실 분류(category - string), 분실 이름(name - string) 넘어옴
	const date = req.body.date;
	const location = req.body.location;
	const category = req.body.category;
	const name = req.body.name;
	
	// DB 검색
	
	// 유저 정보 저장
	
	// searchList.html, 검색한 목록 프론트에 전달 (new list + old list)
});

router.post('/checknew', function (req, res, next) {
	console.log(req.body);
    //res.render('index', { title: 'Check New' });
	
	let user_id;
	if (req.cookies == undefined) { // 쿠키 없는 경우
		// userid 생성
		user_id = createUser();
	} else { // 쿠키 있는 경우
		user_id = req.cookies.user_id
		console.log(user_id);
	}
	
	// 분실 일시, 분실 장소, 분실 분류, 분실 이름 넘어옴
	const date = req.body.date;
	const location = req.body.location;
	const category = req.body.category;
	const name = req.body.name;
	
	// DB 검색 - 새로운 리스트 가져오기 -> 이전 최신 물품은 서버에 저장해두기
	
	// 유저 정보 저장
	
	// searchList.html, 검색한 목록 프론트에 전달 (new list + old list)
});

router.post('/register', function (req, res, next) {
	console.log(req.body);
    //res.render('index', { title: 'Check New' });
	
	let user_id;
	if (req.cookies == undefined) { // 쿠키 없는 경우
		// userid 생성
		user_id = createUser();
	} else { // 쿠키 있는 경우
		user_id = req.cookies.user_id
		console.log(user_id);
	}
	
	// 분실 일시, 분실 장소, 분실 분류, 분실 이름 넘어옴
	const date = req.body.date;
	const location = req.body.location;
	const category = req.body.category;
	const name = req.body.name;
	
	const new_item = {date: date, location: location, category: category, name:name}
	
	// 유저 정보 저장
	user_info[user_id].items.push(new_item)
	console.log(user_info[user_id])
	
	// 전달할 거 있는지??
});

module.exports = router;

function createUser(res) {
	res.cookie("user_id", num_of_user, {});
	user_info[num_of_user] = {items: []};
	
	return num_of_user++;
}