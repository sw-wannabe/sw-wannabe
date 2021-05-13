const api = require('./index');

console.log(api);

setTimeout(async () => {

    let list;

    //모든 데이터 가져옴
    list = await api.searchPoliceDB({});
    console.log(list);

    // 분실물 습득 시간으로 필터링, 주어진 시간 포함하여 그 이후 데이터만 가져옴. 날짜 yyyy-MM-dd 또는 yyyy-MM-dd-hh-mm-ss
    list = await api.searchPoliceDB({ dateFrom: '2017-11-29' });
    console.log(list);

    // 분실물 습득 시간으로 필터링, 주어진 시간 포함하여 그 이전 데이터만 가져옴.
    list = await api.searchPoliceDB({ dateTo: '2017-11-29-14:15:16' });
    console.log(list);

    // 데이터 크롤링 된 시간으로 필터링, 형식은 마찬가지.
    list = await api.searchPoliceDB({ insertDateFrom: '2017-11-29' });
    console.log(list);

    // 모든 카테고리 가져옴 (중복 제거)
    list = await api.getPoliceDBCategories();
    console.log(list);

    // 모든 카테고리 가져옴 (중복 제거)
    list = await api.getSeoulDBCategories();
    console.log(list);

    // json들의 배열을 elasticsearch에 집어넣음.
    let data = await api.searchPoliceDB({});
    let result = await Promise.all(data.map(async data => {
        const { id, ...remain } = data;
        try {
            return api.sendToElasticSearch(remain);
        } catch (e) {
            return e.response;
        }
    }));
    console.log(result);

}, 100);