/*
 * 상수, 변수 시작
 * */
const category1List = document.querySelectorAll('.scroll_control'); // category1의 버튼들
const mapContainer = document.getElementById('map'); // 지도를 표시할 div
const searchVal = document.getElementById('searchVal'); // 검색값
const storeList = document.getElementById('innerList'); // 검색결과 내용 리스트
const floatingInfo = document.getElementById('floatingInfo'); // 음식점 정보 플로팅
const offcanvas = document.getElementById('offcanvasExample'); // 오프캔버스 id
const collapse = document.querySelector('.collapse'); // 콜래스 클래스
const reRenderBtn = document.getElementById('reRenderBtn'); // 지역 내 재검색 버튼
const getHere = document.getElementById('getHere'); // 현위치 버튼
const timeBtn = document.getElementById('timeBtn'); // 혼잡도 예측 버특
var map = new kakao.maps.Map(mapContainer, {
    center: new kakao.maps.LatLng(37.554842, 126.9717319), // 지도의 중심좌표
    level: 5, // 지도의 확대 레벨
});

var category1 = '';
const category2 = document.getElementById('category2');
const category3 = document.getElementById('category3');
var marker = {};
/*
 * 상수, 변수 끝
 * */

window.onload = async () => {
    const sessionCheck = await fetch('/api/map')
    const sessionresult = await sessionCheck.text();
    console.log(sessionresult);
    if (sessionresult != "") {
        category1 = sessionresult;
        // 검색기능 수행 전 스피너
        spinner();

        // 오프캔버스 창 열기
        var bootstrapOffcanvas = new bootstrap.Offcanvas(offcanvas);
        bootstrapOffcanvas.show();

        // request
        const response = await fetch('/api/store/list', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                searchVal: "",
                category1: category1,
                category2: "",
                category3: "",
            }),
        });
        await fetch('/api/map/init');
        // 검색 결과
        let result = await response.json();


        // 검색 결과로 맵핀 계산
        mapCalc(result);
    }
}
// 검색바에서 검색 시
searchVal.addEventListener('keypress', async function search(e) {
    if (e.key === 'Enter') {
        // 검색기능 수행 전 스피너
        spinner();

        // 오프캔버스 창 열기
        var bootstrapOffcanvas = new bootstrap.Offcanvas(offcanvas);
        bootstrapOffcanvas.show();

        // 검색값 공백 확인하기
        if (searchVal.value === '') {
            mapInit('');
            storeList.innerHTML = `<div>검색어를 입력해주세요</div>`;
            return;
        }
        // category1 값 가져오기
        category1List.forEach(item => {
            if (item.checked) category1 = item.dataset.name;
        });

        // request
        const response = await fetch('/api/store/list', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                searchVal: searchVal.value,
                category1: category1,
                category2: category2.value,
                category3: category3.value,
            }),
        });
        // 검색 결과
        let result = await response.json();

        // 검색 결과로 맵핀 계산
        mapCalc(result);
    }
});
// 지역내 재검색
reRenderBtn.addEventListener('click', async () => {
    // 검색기능 수행 전 스피너 띄우기
    spinner();

    const lat = map.getCenter().La;
    const lon = map.getCenter().Ma;
    const intervals = distCalc(map.getLevel()) * 0.00001126887;

    // category1 값 가져오기
    category1List.forEach(item => {
        if (item.checked) category1 = item.dataset.name;
    });
    // request
    let result = await postFetcher('/api/store/list',{
        searchVal: searchVal.value,
        category1: category1,
        category2: category2.value,
        category3: category3.value,
        lat: lat,
        lon: lon,
        intervals: intervals,
    });
    console.log(result)

    let colors;
    if (result.length !== 0) {
        // 지도 내용 초기화
        mapContainer.innerHTML = '';

        // 혼잡도 정보 가져오기
        let colorList = await postFetcher('/api/color', '')
        colors = colorList.map((item, i) => {
            return item.color
        })

        // 핀 위치, 중심좌표 지정
        let positions = [];
        result.forEach(item => {
            positions.push({
                title: item.storeName,
                storeIdx: item.storeIdx,
                latlng: new kakao.maps.LatLng(parseFloat(item.storeLat), parseFloat(item.storeLon)),
                congestion: colors[item.storeDist - 1]
            });
        });
        var mapOption = {
            center: new kakao.maps.LatLng(lon, lat), // 지도의 중심좌표
            level: map.getLevel(), // 지도의 확대 레벨
        };

        await mapRender(result, mapOption, positions);
    }

    timeBtn.addEventListener('click', ()=>{

    })
});


async function postFetcher(uri, body) {
    if(body === ''){
        body = {}
    }
    const response = await fetch(uri,{
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })
    return await response.json();
}