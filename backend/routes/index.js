const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const api = require('../../api/index');

console.log(api);

let num_of_user = 0;

const user_infos = {};

/* GET home page. */
router.get('/', async function (req, res, next) {
    // res.sendFile(__dirname + "");
	
	const user_id = getOrCreateUserIdFromCookie(req, res);
	
	try {
		const categories = await getAllItemCategories();
		console.log(categories);
		console.log(await getNumOfNotiPerUser(user_id));
	} catch (error) {
		console.log(error);
	}
	
	// index.ejs 전달
    res.render('index', { title: 'index' });
});

router.get('/info', function (req, res, next) {
    res.render('index', { title: 'Info' });
	
	const user_id = getOrCreateUserIdFromCookie(req, res);
	
	// info.html 전달
    res.render('info', { title: 'User Info' });
});

router.get('/user_infos', function (req, res, next) {
	
	const user_id = getOrCreateUserIdFromCookie(req, res);
	
	const current_user_info = user_infos[user_id];
	console.log(current_user_info);
	
    // 유저가 등록한 items를 배열에 담아 JSON으로 리턴 {items: []}
});


// post
router.post('/search', function (req, res, next) {
	console.log(req.body);
	
	const user_id = getOrCreateUserIdFromCookie(req, res);
	
	// 분실 일시(date - datetime), 분실 장소(location - string), 분실 분류(category - string), 분실 이름(name - string) 넘어옴
	const request_item = getRequestItem(req);
	
	// DB 검색
	
	// 유저 정보 저장
	
	// searchList.html, 검색한 목록 프론트에 전달 (new list + old list)
});

router.post('/checknew', function (req, res, next) {
	console.log(req.body);
	
	const user_id = getOrCreateUserIdFromCookie(req, res);
	
	// 분실 일시, 분실 장소, 분실 분류, 분실 이름 넘어옴
	const request_item = getRequestItem(req);
	
	// DB 검색 - 새로운 리스트 가져오기 -> 이전 최신 물품은 서버에 저장해두기
	
	// 유저 정보 저장
	
	// searchList.html, 검색한 목록 프론트에 전달 (new list + old list)
});

router.post('/register', function (req, res, next) {
	console.log(req.body);
	
	const user_id = getOrCreateUserIdFromCookie(req, res);
	
	// 분실 일시, 분실 장소, 분실 분류, 분실 이름 넘어옴
	const request_item = getRequestItem(req);
	
	// 유저 정보 저장
	user_infos[user_id].items.push(request_item);
	console.log(user_infos[user_id]);
	
	// 전달할 거 있는지??
});

// 아이템 삭제
router.post('/remove', function (req, res, next) {
	console.log(req.body);
	
	const user_id = getOrCreateUserIdFromCookie(req, res);
	
	// 분실 일시, 분실 장소, 분실 분류, 분실 이름 넘어옴
	const request_item = getRequestItem(req);
	
	
	// user_infos items 확인하며 동일한거 발견하면 삭제
	for (item of user_infos[user_id].items) {
		if (item[date] == date && item[location] == location && item[category] == category && item[name] == name) {
			user_infos[user_id].items.remove(item);
			break;
		}
	}
	
});

module.exports = router;

function createUser(res) {
	res.cookie("user_id", num_of_user, {
		maxAge: 1000000
	});
	
	const new_user_info = getNewUserInfo();
	user_infos[num_of_user] = new_user_info;
	
	return num_of_user++;
}

function getNewUserInfo() {
	return {items: [], last_query_date: '2017-11-29'};
}

function getRequestItem(req) {
	const date = req.body.date;
	const location = req.body.location;
	const category = req.body.category;
	const name = req.body.name;
	
	const request_item = {date: date, location: location, category: category, name:name}
	
	return request_item;
}

function getOrCreateUserIdFromCookie(req, res) {
	let user_id;
	if (req.cookies == undefined || req.cookies.user_id == undefined) { // 쿠키 없는 경우
		// userid 생성
		user_id = createUser(res);
	} else { // 쿠키 있는 경우
		user_id = req.cookies.user_id;
		console.log(`user_id = ${user_id}`);
	}
	
	return user_id;
}

// 특정 아이템에 대한 알림 수 (시간도 고려)
async function getNumOfNotiPerItem(item) {
	const policeItems = await api.searchPoliceDB({ 
		insertDateFrom: user_infos[user_id].last_query_date, 
		location: item.location, 
		name: item.name, 
		category: item.category });
	
	const seoulItems = await api.searchSeoulDB({ 
		insertDateFrom: user_infos[user_id].last_query_date, 
		location: item.location, 
		name: item.name, 
		category: item.category });
	
	const items = policeItems.concat(seoulItems);
	
	return items.length
}

// 유저에 대한 알림 수 (시간도 고려)
async function getNumOfNotiPerUser(user_id) {
	num_of_noti_per_user = 0;
	for (item of user_infos[user_id].items) {
		num_of_noti_per_user += await getNumOfNotiPerItem(item);
	}
	
	return num_of_noti_per_user;
}

// 모든 category
async function getAllItemCategories() {
	const seoul_list = await api.getSeoulDBCategories();
	const police_list = await api.getPoliceDBCategories();
	var all_categories = seoul_list.concat(police_list);
	
	all_categories_list = [];
	for (category of all_categories) {
		all_categories_list.push(category.category);
	}
	
	return all_categories_list = [...new Set(all_categories_list)];
}

// user_infos에 마지막 분실물 리스트 확인 시간 저장해둬야 함. 분실물 리스트 확인 시간 갱신 해야 함 ->