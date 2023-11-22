/*
 * 상수, 변수 시작
 * */
const category1List = document.querySelectorAll('.scroll_control'); // category1의 버튼들
const mapContainer = document.getElementById('map'); // 지도를 표시할 div
const searchVal = document.getElementById('searchVal'); // 검색값
const offcanvasTitle = document.getElementById('offcanvasTitle'); // 검색결과 타이틀
const storeList = document.getElementById('innerList'); // 검색결과 내용 리스트
const floatingInfo = document.getElementById('floatingInfo'); // 음식점 정보 플로팅
const reRenderBtn = document.getElementById('reRenderBtn'); // 지역 내 재검색 버튼
const reRenderBtn2 = document.getElementById('reRenderBtn2'); // 지역 내 재검색 버튼
const getHere = document.getElementById('getHere'); // 현위치 버튼
const likeBtn = document.getElementById('likeBtn'); // 찜 버튼
const category2 = document.getElementById('category2'); // 카테고리 2
const category3 = document.getElementById('category3'); // 카테고리 3
const apiToggle = document.getElementById('apiToggle'); // 혼잡도 토글
const safeToggle = document.getElementById('safeToggle'); // 여유 토글
const predGraph = document.getElementById('predGraph'); // 혼잡도 그래프
const graphBackground = document.getElementById('graphBackground'); // 혼잡도 그래프
var category1 = '';
var marker = {};
var map = new kakao.maps.Map(mapContainer, {
    center: new kakao.maps.LatLng(37.554842, 126.9717319), // 지도의 중심좌표
    level: 5, // 지도의 확대 레벨
});
/*
 * 상수, 변수 끝
 * */

// 검색바에서 검색 시
searchVal.addEventListener('keypress', async function search(e) {
    if (e.key === 'Enter') {
        // 검색기능 수행 전 스피너
        spinner();

        // 오프캔버스 창 열기
        $('#offcanvasExample').offcanvas('show');
        // 콜랩스 창 닫기
        $('.collapse').collapse('hide');

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
            isPeopleApi: bool2int(apiToggle.checked, safeToggle.checked)
        });

        // 검색 결과로 맵핀 계산
        await mapCalc(result,null,null, null);

        offcanvasTitle.innerHTML = `"${searchVal.value}"` + " 검색결과";
        searchVal.value = '';
    }
});
// 지역내 재검색
reRenderBtn.addEventListener('click', async () => {
    // 검색기능 수행 전 스피너 띄우기
    spinner();
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
        lat: map.getCenter().La,
        lon: map.getCenter().Ma,
        intervals: intervals,
        isPeopleApi: bool2int(apiToggle.checked, safeToggle.checked)
    });
    await mapCalc(result, false, 0, null);
    if(searchVal.innerHTML !== "") offcanvasTitle.innerHTML = `"${searchVal.value}"` + " 검색결과";
    else offcanvasTitle.innerHTML = "검색결과";
    searchVal.value = '';
});

// 지역내 재검색 (콜랩스 내 버튼)
reRenderBtn2.addEventListener('click', async () => {
    // 검색기능 수행 전 스피너 띄우기
    spinner();

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
        lat: map.getCenter().La,
        lon: map.getCenter().Ma,
        intervals: intervals,
        isPeopleApi: bool2int(apiToggle.checked, safeToggle.checked)
    });
    await mapCalc(result, false, 0, null);
    $('#collapseExample').collapse('hide');
    if(searchVal.innerHTML !== "") offcanvasTitle.innerHTML = `"${searchVal.value}"` + " 검색결과";
    else offcanvasTitle.innerHTML = "검색결과";
    searchVal.value = '';
});


// 찜 목록만 검색
likeBtn.addEventListener('click', async ()=>{
    var data = await postFetcher('/like/getAll')
    if (apiToggle.checked) {
        const result = data.filter(item => item.storeCongestion != null)
        await mapCalc(result, null, null, null);
        if(searchVal.innerHTML !== "") offcanvasTitle.innerHTML = `"${searchVal.value}"` + " 검색결과";
        else offcanvasTitle.innerHTML = "검색결과";
        searchVal.value = '';
    } else if (safeToggle.checked) {
        const result = data.filter(item => item.storeCongestion === "여유")
        await mapCalc(result, null, null, null);
        if(searchVal.innerHTML !== "") offcanvasTitle.innerHTML = `"${searchVal.value}"` + " 검색결과";
        else offcanvasTitle.innerHTML = "검색결과";
        searchVal.value = '';
    } else {
        await mapCalc(data, null, null, null);
        if(searchVal.innerHTML !== "") offcanvasTitle.innerHTML = `"${searchVal.value}"` + " 검색결과";
        else offcanvasTitle.innerHTML = "검색결과";
        searchVal.value = '';
    }
})

function bool2int (boolValue, boolValue2) {
    if (boolValue) return 1;
    else if (boolValue2) return 2;
    else return 0;
}