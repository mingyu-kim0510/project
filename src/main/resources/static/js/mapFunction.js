// 지도 초기화
function mapInit(mapPosition) {
    mapContainer.innerHTML = ``;
    // marker.setMap(null)
    // default (서울역) 좌표
    let mapLat = 37.554842;
    let mapLng = 126.9717319;
    if (mapPosition) {
        mapLat = mapPosition.Ma;
        mapLng = mapPosition.La;
    }
    var mapOption = {
        center: new kakao.maps.LatLng(mapLat, mapLng), // 지도의 중심좌표
        level: 5, // 지도의 확대 레벨
    };

    map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

}

// 스피너 표기
function spinner() {
    storeList.innerHTML = `
        <div class="spinner-border" role="status">
            <span class="visually-hidden" id="loadResult">Loading...</span>
        </div>
    `;
}

// 지도 관련 계산
async function mapCalc(result, mapPosition) {
    // 결과 값 공백 확인하기
    // 결과 있음
    if (result.length !== 0) {
        // 지도 내용 초기화
        mapContainer.innerHTML = '';

        // 혼잡도 정보 가져오기
        let colorList = await postFetcher('/api/color','')
        colors = colorList.map((item, i) => {return item.color})

        // 핀 위치, 중심좌표 지정
        let positions = [],
            latList = [],
            lngList = [];
        result.forEach((item) => {
            positions.push({
                title: item.storeName,
                storeIdx: item.storeIdx,
                latlng: new kakao.maps.LatLng(parseFloat(item.storeLat), parseFloat(item.storeLon)),
                congestion: item.storeCongestion
            });
            latList.push(parseFloat(item.storeLat));
            lngList.push(parseFloat(item.storeLon));
        });

        // 중심 좌표값 얻어오기
        const latMid = Math.max(...latList) - (Math.max(...latList) - Math.min(...latList)) / 2;
        const lngMid = Math.max(...lngList) - (Math.max(...lngList) - Math.min(...lngList)) / 2;
        // 지도 확대레벨 계산하기
        let latDist = Math.max(Math.max(...latList) - Math.min(...latList));
        let lngDist = Math.max(Math.max(...lngList) - Math.min(...lngList));
        // 위도 경도 -> 거리 환산
        latDist *= 88740;
        lngDist *= 88740;
        // 화면비율에 맞춰 최종 거리값 산출
        const distance = Math.max(latDist / 8.6, lngDist / 4);
        // 확대 레벨 값
        let distLevel = 0;

        // 화면에 맞춰서 지도 확대 되도록 세팅
        distLevel = zoomCalc(distance);

        // 옵션 최종입력
        var mapOption = {
            center: new kakao.maps.LatLng(latMid, lngMid), // 지도의 중심좌표
            level: distLevel, // 지도의 확대 레벨
        };
        // 완성된 값으로 지도 그리기
        await mapRender(result, mapOption, positions);
    }
    // 검색결과 없음
    else {
        // 현위치에서 지도 초기화
        mapInit(mapPosition);
        storeList.innerHTML = `<div>검색결과가 없습니다.</div>`;
    }
}

async function mapRender(result, mapOption, positions) {
    // 지도 생성
    map = new kakao.maps.Map(mapContainer, mapOption);
    positions.map(item => {
        if(item.congestion == "여유") var imageSrc = '/img/safe.png';
        else if (item.congestion == "보통") var imageSrc = '/img/good.png';
        else if (item.congestion == "약간 붐빔") var imageSrc = '/img/warn.png';
        else if (item.congestion == "붐빔") var imageSrc = '/img/danger.png';
        else var imageSrc = '/img/default.png';
        // 마커 이미지 크기
        var imageSize = new kakao.maps.Size(18, 26);
        // 마커 이미지 생성
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

        marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: item.latlng, // 마커를 표시할 위치
            title: item.storeIdx, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image: markerImage, // 마커 이미지
        });

        // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
        // 이벤트 리스너로는 클로저를 만들어 등록합니다
        // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
        kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker));
        mapContainer.addEventListener('touchend', touchStartListener());
    });

    // getColor();

    // 인포윈도우를 표시하는 클로저를 만드는 함수입니다
    function makeOverListener(map, marker) {
        return async function () {
            //// 음식점 정보 띄우기
            // 정보 가져오기
            let tempAddr = '',
                tempLat = '',
                tempLng = '',
                tempUrl = '',
                tempTel = '';
            result.map((item) => {
                if (item.storeIdx == marker.Gb) {
                    tempAddr = item.storeNewAddr;
                    tempLat = item.storeLat;
                    tempLng = item.storeLon;
                    tempUrl = item.storeUrl;
                    tempTel = item.storeTel;
                    return;
                }
            });
            if(tempTel == null) tempTel = ''
            // 음식점 정보 + 찜 여부 확인하기
            let result2 = await postFetcher('/getLike', {
                    storeIdx: marker.Gb,
                    storeNewAddr: tempAddr,
                })
            let star = '';
            if (sessionResult === '') {
                star = ``;
            } else if (result2.likeResult) {
                star = `<img class="align-top align-end" src="/img/star-fill.svg"  alt="star"/>`;
            } else {
                star = `<img class="align-top align-end" src="/img/star.svg"  alt="star"/>`;
            }

            // 음식점 정보 플로팅 띄우기
            //
            floatingInfo.innerHTML = `
                        <div class='shadow-sm card custom_zoomcontrol'
                        style="bottom: calc(3.5rem + 11%); width:95%">
                            <div class="card-body w-100">
                                <div class="row">
                                    <div class="col-9">
                                        <h6 class="card-title text-start fw-bold">${result2.storeName}</h6>
                                    </div>
                                    <div class="col-auto" style="margin-left: auto; margin-right:0">
                                    <a id="starBtn" onclick="dataSend(this)" data-name="${tempAddr}" data-store="${result2.storeName}">
                                        ${star}</a>
                                    </div>
                                    <div class="col-auto text-end align-end" style="margin-left: auto; margin-right:0">
                                        <a onclick="if(${!!tempUrl}) {document.getElementById('framesrc').src='${tempUrl}'; document.querySelector('#myModal').style.display = 'block'}">
                                            <img class="align-top text-end" src="/img/box-arrow-up-right.svg" style="width: 1.2rem; " alt="outerLink">
                                        </a>
                                    </div>
                                </div>
                                <p class="card-text text-start text-truncate" style="font-size:0.8rem; margin-bottom: 0.375rem">${tempAddr.substring(5)}</p>
                                <p class="card-text text-start text-truncate" style="font-size:0.8rem">${tempTel}</p>
                            </div>
                        </div>
                    `;

            const starBtn = document.getElementById('starBtn');
            starBtn.innerHTML = star;
            // 음식점 정보 none -> block
            floatingInfo.style.display = 'block';

            // 지도 좌표 마커로 이동하기

            var moveLatLon = new kakao.maps.LatLng(tempLat, tempLng);
            // 지도 중심을 부드럽게 이동시킵니다
            // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
            map.panTo(moveLatLon);
            navigator.clipboard.writeText(marker.Gb+', ');
        };
    }

    // 인포윈도우를 닫는 클로저를 만드는 함수입니다
    function touchStartListener() {
        return function () {
            floatingInfo.style.display = 'none';
        };
    }

    // 오프캔버스에 검색결과 출력
    storeList.innerHTML = '';
    storeList.innerHTML = result.reduce((acc, item) => {
        return acc += `
                <div class="card mb-3" data-no="${item.storeIdx}">
                    <div class="card-header">
                        ${item.storeName}
                    </div>
                    <div class="card-body">
                        <blockquote class="blockquote mb-0">
                            <p style="font-size:1rem">${item.storeNewAddr}</p>
                        </blockquote>
                    </div>
                </div>
                `;
    }, "");
}

// 확대레벨로 현재화면의 거리값 계산
function distCalc(zoomLevel) {
    switch (zoomLevel) {
        case 10:
            return 8000;
        case 9:
            return 4000;
        case 8:
            return 2000;
        case 7:
            return 1000;
        case 6:
            return 500;
        case 5:
            return 250;
        case 4:
            return 100;
        case 3:
            return 50;
        case 2:
            return 30;
        case 1:
            return 20;
        default:
            return 16000;
    }
}

// 검색 결과로 보여질 지도의 확대 값 계산하기
function zoomCalc(distance) {
    if (distance > 4000) {
        return 10;
    } else if (distance > 2000) {
        return 9;
    } else if (distance > 1000) {
        return 8;
    } else if (distance > 500) {
        return 7;
    } else if (distance > 250) {
        return 6;
    } else if (distance > 100) {
        return 5;
    } else if (distance > 50) {
        return 4;
    } else if (distance > 30) {
        return 3;
    } else if (distance > 20) {
        return 2;
    } else {
        return 1;
    }
}

// 찜 기능 (백으로 전송)
async function dataSend(element) {
    const result = await postFetcher('/like', {
        storeName: element.dataset.store,
        storeNewAddr: element.dataset.name,
    })
    const starBtn = document.getElementById('starBtn');
    if (result == 1) {
        starBtn.innerHTML = `<img class="align-top align-end" src="/img/star-fill.svg"  alt="star-fill"/>`;
    } else {
        starBtn.innerHTML = `<img class="align-top align-end" src="/img/star.svg"  alt="star"/>`;
    }
}

// 모피어스에서 현위치 지정하기
function getCurrentLocation () {
    getLocation().then(result => {
        marker.setMap(null);
        // GeoLocation을 이용해서 접속 위치를 얻어옵니다
        let lat = result.coords.latitude, // 위도
            lon = result.coords.longitude// 경도

        var locPosition = new kakao.maps.LatLng(lat, lon) // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다

        // 마커와 인포윈도우를 표시합니다
        marker = new kakao.maps.Marker({
            map: map,
            position: locPosition
        });
        // 지도 중심좌표를 접속위치로 변경합니다
        map.setCenter(locPosition);

    })
}
function getLocation () {
    return new Promise((resolve) => {
        M.plugin('location').current({
            timeout:10000,
            maximumAge: 1,
            callback(result) {
                resolve(result);
            },
        });
    });
}
getHere.addEventListener('click', () => {
        if (navigator.geolocation) {
            getCurrentLocation()
        }
    }
)