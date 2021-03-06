const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const api = require('../../api/index');
const request = require('sync-request');
const axios = require('axios');

console.log(api);

console.log(getCurrentDatetimeString());

let num_of_user = 0;

const user_infos = {};

/* GET home page. */
router.get('/', async function (req, res, next) {
    const user_id = getUser(req, res);

    var categories;
    var num_of_noti;

    try {
        categories = await getAllItemCategories();
        num_of_noti = await getNumOfNotiPerUser(user_id);
    } catch (error) {
        console.log(error);
        res.render('index');
        return;
    }

    console.log(categories);

    // index.ejs 전달
    res.render('index', {
        num_of_noti,
        categories,
    });
});

router.get('/info', function (req, res, next) {
    const user_id = getUser(req, res);
    res.render('info', {});
});

router.post('/businfo', async function (req, res) {
    let data = req.body;
    console.log(data);
    let { number } = data;
    console.log(number);
    let info = api.searchBusRoute(number);
    console.log(info);
    res.send({ info });
});

router.get('/userinfo', function (req, res, next) {
    const user_id = getUser(req, res);

    // 유저가 등록한 items 보여주는 화면
    var items = user_infos[user_id].items;
    for (const item_idx in items) {
        items[item_idx][num_of_noti] = getNumOfNotiPerItem(items[item_idx], user_id);
    }

    // userinfo.ejs 전달
    res.render('mypage', { items: items });
});

// post
router.post('/search', async function (req, res, next) {

    const user_id = getUser(req, res);

    // 분실 일시(date - datetime), 분실 장소(location - string), 분실 분류(category - string), 분실 이름(name - string) 넘어옴
    const condition = getRequestItem(req);

    // DB 검색
    const items = await getElasticSearch(condition);

    console.log(items);

    // userinfo의 최종 검색 시간 갱신
    if (!(user_infos[user_id])) {

    }
    user_infos[user_id].last_query_date = getCurrentDatetimeString();

    const dict = { "items": items, "condition": condition, "last_query_date": user_infos[user_id].last_query_date };
    console.log(dict);

    // search.ejs, 검색한 목록 프론트에 전달 (new list + old list)
    res.render('search', dict);
});

router.post('/register', function (req, res, next) {
    console.log(req.body);

    const user_id = getUser(req, res);

    // 분실 일시, 분실 장소, 분실 분류, 분실 이름 넘어옴
    const request_item = getRequestItem(req);

    // 유저 정보 저장
    user_infos[user_id].items.push(request_item);
    console.log(user_infos[user_id]);

    // DB 검색
    //const items = getAllSearchedItems(request_item);
    res.redirect('/userinfo');
});

// 아이템 삭제
router.post('/remove', function (req, res, next) {
    console.log(req.body);

    const user_id = getUser(req, res);

    // 분실 일시, 분실 장소, 분실 분류, 분실 이름 넘어옴
    const request_item = getRequestItem(req);

    // user_infos items 확인하며 동일한거 발견하면 삭제
    for (const item of user_infos[user_id].items) {
        if (
            item[date] == date &&
            item[location] == location &&
            item[category] == category &&
            item[name] == name
        ) {
            user_infos[user_id].items.remove(item);
            break;
        }
    }

    res.redirect('/userinfo');
});

module.exports = router;

function createUser(res) {
    res.cookie('user_id', num_of_user, {
        maxAge: 1000000,
    });

    const new_user_info = getNewUserInfo();
    const new_id = Math.random();
    user_infos[new_id] = new_user_info;
    return new_id;
}

function getNewUserInfo() {
    return { items: [], last_query_date: '2017-11-29' };
}

function getRequestItem(req) {
    const date = req.body.date;
    const location = req.body.location;
    const category = req.body.category;
    const name = req.body.name;

    const request_item = { date: date, location: location, category: category, name: name };

    return request_item;
}

function getUser(req, res) {

    let user_id;
    if ((!req.cookies) || (!req.cookies.user_id) || !(user_infos[req.cookies.user_id])) {
        // 쿠키 없는 경우
        // userid 생성
        user_id = createUser(res);
    } else {
        // 쿠키 있는 경우
        user_id = req.cookies.user_id;
        console.log(`user_id = ${user_id}`);
    }

    return user_id;
}

// 특정 아이템에 대한 알림 수 (시간도 고려)
async function getNumOfNotiPerItem(item, user_id) {
    return await getAllSearchedItemsByLastSearchTime(item, user_id).length;
}

// 유저에 대한 알림 수 (시간도 고려)
async function getNumOfNotiPerUser(user_id) {
    num_of_noti_per_user = 0;
    for (const item of user_infos[user_id].items) {
        num_of_noti_per_user += await getNumOfNotiPerItem(item, user_id);
    }

    return num_of_noti_per_user;
}

// DB에 저장된 모든 category 가져오는 함수
async function getAllItemCategories() {
    const seoul_list = await api.getSeoulDBCategories();
    const police_list = await api.getPoliceDBCategories();
    var all_categories = seoul_list.concat(police_list);

    all_categories_list = [];
    for (const category of all_categories) {
        all_categories_list.push(category.category);
    }

    return (all_categories_list = [...new Set(all_categories_list)]);
}

async function getElasticSearch(item) {
    const res = await axios.post(
        "http://3.35.135.122:9200/losts/_search/",
        getESQuery(item, "2017-01-01")
    );
    return res.data.hits.hits.map(x => x._source);
}


function getCurrentDatetimeString() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const hh = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const ss = String(today.getSeconds()).padStart(2, '0');

    const datetime_string = yyyy + '-' + mm + '-' + dd + '-' + hh + ':' + minutes + ':' + ss;

    return datetime_string;
}

function getESQuery(item, last_query_date) {
    const body = {
        query: {
            bool: {
                must: [
                    {
                        range: {
                            date: {
                                gte: item.date,
                            },
                        },
                    },
                    {
                        range: {
                            insert_time: {
                                gte: last_query_date,
                            },
                        },
                    },
                    {
                        multi_match: {
                            query: item.name,
                            fields: ['name^3', 'category'],
                            analyzer: 'synonym',
                        },
                    },
                    {
                        match: {
                            category: item.category,
                        },
                    },
                    {
                        match: {
                            place: {
                                query: item.location,
                                fuzziness: 2,
                            },
                        },
                    },
                ],
            },
        },
        sort: [
            {
                _score: {
                    order: 'desc',
                },
                date: {
                    order: 'desc',
                },
            },
        ],
    };

    return body;
}


// (async () => {
//     let result = await getElasticSearch({
//         date: "2021-04-30",
//         location: "서울시",
//         category: "가방",
//         name: "가방"
//     });
//     console.log(result);

// })();