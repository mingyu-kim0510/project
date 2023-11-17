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
        const response = await fetch('/api/color',{method: 'post'})
        let colorList = await response.json();
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
                congestion: colors[item.storeDist - 1]
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
        mapRender(result, mapOption, positions);
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
    console.log(positions)
    positions.map(item => {
        console.log(item.congestion)
        if(item.congestion == "여유") {
            var imageSrc = '/img/safe.png';
        }
        else if (item.congestion == "보통") var imageSrc = '/img/good.png';
        else if (item.congestion == "약간 붐빔") var imageSrc = '/img/warn.png';
        else if (item.congestion == "혼잡") var imageSrc = '/img/danger.png';
        else var imageSrc = '/img/default.png';
        // 마커 이미지 크기
        var imageSize = new kakao.maps.Size(24, 35);
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
                tempUrl = '';
            result.map((item) => {
                if (item.storeIdx == marker.Gb) {
                    tempAddr = item.storeNewAddr;
                    tempLat = item.storeLat;
                    tempLng = item.storeLon;
                    tempUrl = item.storeUrl;
                    return;
                }
            });
            let isTempUrl;
            if(tempUrl) isTempUrl = true;
            else isTempUrl = false;

            // 음식점 정보 + 찜 여부 확인하기
            let resp = await fetch('/getLike', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    storeIdx: marker.Gb,
                    storeNewAddr: tempAddr,
                }),
            });
            let result2 = await resp.json();
            var star;

            if (result2.likeResult == 'true' && sessionResult !== '') {
                star = `<img class="align-top align-end" src="/img/star-fill.svg"  alt="star"/>`;
            } else if (sessionResult == '') {
                star = ``;
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
                                    <div class="col-8">
                                        <h6 class="card-title text-start fw-bold">${result2.storeName} - ${marker.Gb}</h6>
                                    </div>
                                    <div class="col-auto">
                                    <a id="starBtn" onclick="dataSend(this)" data-name="${tempAddr}" data-store="${result2.storeName}">
                                        ${star}</a>
                                    </div>
                                    <div class="col-auto text-end align-end">
                                        <a onclick="if(${isTempUrl}) location.href='${tempUrl}'">
                                            <img class="align-top" src="/img/clipboard.svg" style="width: 1.2rem" alt="outerLink">
                                        </a>
                                    </div>
                                </div>
                                <p class="card-text text-start text-truncate" style="font-size:0.8rem">${tempAddr}</p>
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
    const res = await fetch('/like', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            storeName: element.dataset.store,
            storeNewAddr: element.dataset.name,
        }),
    });
    const result = await res.text();
    const starBtn = document.getElementById('starBtn');
    if (result == 1) {
        starBtn.innerHTML = `<img class="align-top align-end" src="/img/star-fill.svg"  alt="star-fill"/>`;
    } else {
        starBtn.innerHTML = `<img class="align-top align-end" src="/img/star.svg"  alt="star"/>`;
    }
}
