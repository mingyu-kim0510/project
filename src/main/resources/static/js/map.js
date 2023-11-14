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
const likeBtn = document.getElementById('likeBtn');
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
        const result = await postFetcher('/api/store/list', {
                searchVal: "",
                category1: category1,
                category2: "",
                category3: "",
        });
        await getFetcher('/api/map/init','');


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
        let result = await postFetcher('/api/store/list', {
                searchVal: searchVal.value,
                category1: category1,
                category2: category2.value,
                category3: category3.value,
        })

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
    await mapCalcRevised(result, false);
});

// 타임 버튼
timeBtn.addEventListener('click', async ()=>{
    const result = await postFetcher('/api/getPredict')
    await mapCalcRevised(result, true);
})
// 찜 목록만 검색
likeBtn.addEventListener('click', async ()=>{
    const result = await postFetcher('/getLikeAll')
    await mapCalcRevised(result, false);
})

