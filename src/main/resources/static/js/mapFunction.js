// 지도 관련 계산
async function mapCalc(result, mapPosition, positioner, predictor) {
    // 결과 값 공백 확인하기
    // 결과 있음
    if (result.length !== 0) {
        // 지도 내용 초기화
        mapContainer.innerHTML = '';

        // 핀 위치, 중심좌표 지정
        var positions = [],
            latList = [],
            lngList = [],
            mapOption = '',
            congestion = '',
            distLevel = 0;

        result.forEach((item) => {
            // isPosition 1: 일반지표, 2: 예측지표, null: 지역검색
            if (predictor !== 1) congestion = item.storeCongestion;
            else congestion = item.predictCongestion;
            // mapSearch
            if(positioner != null) {
                positions.push({
                    title: item.storeName,
                    storeIdx: item.storeIdx,
                    latlng: new kakao.maps.LatLng(parseFloat(item.storeLat), parseFloat(item.storeLon)),
                    congestion: congestion,

                });
                distLevel = map.getLevel();
                mapOption = newMapOption(map.getCenter().Ma, map.getCenter().La, distLevel);
            // Predict
            } else {
                positions.push({
                    title: item.storeName,
                    storeIdx: item.storeIdx,
                    latlng: new kakao.maps.LatLng(parseFloat(item.storeLat), parseFloat(item.storeLon)),
                    congestion: congestion
                });
                latList.push(parseFloat(item.storeLat));
                lngList.push(parseFloat(item.storeLon));
                // 중심 좌표값 얻어오기
                var latMid= Math.max(...latList) - (Math.max(...latList) - Math.min(...latList)) / 2;
                var lngMid= Math.max(...lngList) - (Math.max(...lngList) - Math.min(...lngList)) / 2;
                // 지도 확대레벨 계산하기
                const latDist= Math.max(Math.max(...latList) - Math.min(...latList)) * 88740;
                const lngDist= Math.max(Math.max(...lngList) - Math.min(...lngList)) * 88740;
                // 화면비율에 맞춰 최종 거리값 산출
                const distance= Math.max(latDist / 8.6, lngDist / 4);
                // 화면에 맞춰서 지도 확대 되도록 세팅
                distLevel = zoomCalc(distance);
                mapOption = newMapOption(latMid, lngMid, distLevel);
            }
        });

        await mapRender(result, mapOption, positions);
    }
    // 검색결과 없음
    else {
        // 현위치에서 지도 초기화
        mapInit(mapPosition);
        storeList.innerHTML = `<div>검색결과가 없습니다.</div>`;
    }
}

// 지도 초기화
function mapInit(mapPosition) {
    mapContainer.innerHTML = ``;

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



async function mapRender(result, mapOption, positions) {
    // 지도 생성
    map = new kakao.maps.Map(mapContainer, mapOption);
    positions.map(item => {
        if(item.congestion == "여유") var imageSrc = '/img/safe.png';
        else if (item.congestion == "보통") var imageSrc = '/img/good.png';
        else if (item.congestion == "약간 붐빔") var imageSrc = '/img/warn.png';
        else if (item.congestion == "붐빔") var imageSrc = '/img/danger.png';
        else var imageSrc = '/img/default.png';
        // 마커 이미지 생성
        var markerImage = new kakao.maps.MarkerImage(imageSrc, new kakao.maps.Size(20, 31));

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
                tempCategory = '',
                tempLike = false;
            result.map((item) => {
                if (item.storeIdx == marker.Gb) {
                    tempAddr = item.storeNewAddr;
                    tempLat = item.storeLat;
                    tempLng = item.storeLon;
                    tempUrl = item.storeUrl;
                    tempCategory = item.storeCategory;
                    tempLike = item.likeResult;
                    return;
                }
            });
            // 음식점 정보 + 찜 여부 확인하기
            let result2 = await postFetcher('/like/getOne', {
                    storeIdx: marker.Gb,
                    storeNewAddr: tempAddr,
                })
            var star = '';
            if (UserResult === '') {
                star = ``;
            } else {
                star = getLike(result2.likeResult);
            }

            let fetchResult = await postFetcher('/api/getPredictOne', {storeIdx:marker.Gb});
            const predComment = predictComment(fetchResult);
            // 음식점 정보 플로팅 띄우기
            floatingInfo.innerHTML = await floatInfo (result2.storeName, star, tempUrl, tempCategory, tempAddr, marker.Gb, predComment);
            floatingInfo.style.display = 'block';
            const floatElement = $( ".float-info" )
            predGraph.style.bottom = `calc(${floatElement.prop( "scrollHeight" )}px + ${floatElement.css( "bottom" )} + 1rem)`
            graphBackground.style.bottom = `calc(${floatElement.prop( "scrollHeight" )}px + ${floatElement.css( "bottom" )} + 1rem)`

            predGraph.style.right = "1rem"

            predGraph.innerHTML = predictGraph(fetchResult);

            predGraph.style.display = 'block';
            if(predComment !== "<div>예측 자료를 지원하지 않아요</div>") graphBackground.style.display = 'block';
            else  graphBackground.style.display = 'none';

            const starBtn = document.getElementById('starBtn');
            starBtn.innerHTML = star;
            // 음식점 정보 none -> block

            // 지도 좌표 마커로 이동하기

            var moveLatLon = new kakao.maps.LatLng(tempLat, tempLng);
            // 지도 중심을 부드럽게 이동시킵니다
            // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
            map.panTo(moveLatLon);
        };
    }

    // 인포윈도우를 닫는 클로저를 만드는 함수입니다
    function touchStartListener() {
        return function () {
            floatingInfo.style.display = 'none';
            predGraph.style.display = 'none';
            graphBackground.style.display = 'none';
        };
    }

    // 오프캔버스에 검색결과 출력
    storeList.innerHTML = '';
    if(result[0].predictTime !== null && result[0].predictTime !== undefined) {
        const predictTime = result[0].predictTime;
        offcanvasTitle.innerHTML = "검색결과 (" + predictTime.substring(11,13) + "시)";
    }

    storeList.innerHTML = result.reduce((acc, item) => {
        let congestion = null;
        if (item.predictCongestion != null) congestion = item.predictCongestion
        else if (item.storeCongestion != null) congestion = item.storeCongestion;
        else congestion = '미제공'
        return acc += `
                <div class="card mb-3" data-no="${item.storeIdx}">
                    <div class="card-header">
                        <div class="row justify-content-between">
                            <div class="col-8" style=" transform:rotate(0.04deg);">
                                <a
                                 style="display:block; white-space:nowrap; overflow:hidden; text-overflow: ellipsis; font-family: 'NanumSquareBold'; "
                                onclick="
                                    map.setCenter(new kakao.maps.LatLng(${item.storeLat}, ${item.storeLon}));
                                    map.setLevel(3);
                                    $('#offcanvasExample').offcanvas('hide');
                                    const star = getLike(${item.likeResult});
                                    // 음식점 정보 none -> block
                                    floatingInfo.style.display = 'block';
                                    async function floatRender () {
                                        let fetchResult = await postFetcher('/api/getPredictOne', {storeIdx:${item.storeIdx}});
                                        const predComment = predictComment(fetchResult);
                                        floatingInfo.innerHTML = await floatInfo('${item.storeName}', star, '${item.storeUrl}', '${item.storeCategory}', '${item.storeNewAddr}','${item.storeIdx}', predComment);
                                        floatingInfo.style.display = 'block';
                                        const floatElement = $( '.float-info' )
                                        predGraph.style.bottom = 'calc(' + floatElement.prop('scrollHeight') + 'px + ' + floatElement.css('bottom')+ '+' + '1rem)'
                                        graphBackground.style.bottom = 'calc(' + floatElement.prop('scrollHeight') + 'px + ' + floatElement.css('bottom')+ '+' + '1rem)'
                                        predGraph.style.right = '1rem'
                            
                                        predGraph.innerHTML = predictGraph(fetchResult);
                            
                                        predGraph.style.display = 'block';
                                        if(predComment !== '<div>예측 자료를 지원하지 않아요</div>') graphBackground.style.display = 'block';
                                        else  graphBackground.style.display = 'none';
                            
                                        const starBtn = document.getElementById('starBtn');
                                        starBtn.innerHTML = star;
                                    };
                                    floatRender();
                                    
                                ">
                                    ${item.storeName}
                                </a>
                            </div>
                            ${colorPicker(congestion, congestion)}
                        </div>
                    </div>
                    <div class="card-body">
                        <blockquote class="blockquote my-0" style=" transform:rotate(0.04deg);">
                            <a class="my-1 text-decoration-none text-reset"
                               style="font-size:1rem; font-family: 'NanumSquareBold';">${item.storeCategory}</a>
                            <a style="font-size:1rem; font-family: 'NanumSquareBold';">&nbsp;/&nbsp</a>
                            <a style="font-size:1rem; font-family: 'NanumSquare';">${item.storeNewAddr.substring(6, item.length).trim()}</a>
                        </blockquote>
                    </div>
                </div>
            `;
    }, "");
}

function getLike (likeResult) {
    if (likeResult) return `<img class="align-top align-end" src="/img/star-fill.svg"  alt="star"/>`;
    else return `<img class="align-top align-end" src="/img/star.svg"  alt="star"/>`;
}

function colorPicker(element, state) {
    if (state === '붐빔') {
    return `
            <div class="col-auto text-center"
                 style="background-color: #fc5230; color:white; line-height: 1.6rem; border-radius: 4px; width:23vw">
                <a style="font-size: 0.9rem; transform: rotate(0.04deg)">${element}</a>
            </div>`
    } else if (state === '약간 붐빔') {
        return `
            <div class="col-auto text-center"
                 style="background-color: #fd9f28; color:white; line-height: 1.6rem; border-radius: 4px; width:23vw">
                <a style="font-size: 0.9rem; transform: rotate(0.04deg)">${element}</a>
            </div>`
    } else if (state === '보통') {
        return `
            <div class="col-3 text-center"
                 style="background-color: #7db249; color:white; line-height: 1.6rem; border-radius: 4px; width:23vw">
                <a style="font-size: 0.9rem; transform: rotate(0.04deg)">${element}</a>
            </div>`
    } else if (state === '여유') {
        return `
            <div class="col-3 text-center"
                 style="background-color: #1960ef; color:white; line-height: 1.6rem; border-radius: 4px; width:23vw">
                <a style="font-size: 0.9rem; transform: rotate(0.04deg)">${element}</a>
            </div>`
    } else {
        return `
            <div class="col-3 text-center"
                 style="background-color: #595959; color:white; line-height: 1.6rem; border-radius: 4px; width:23vw">
                <a style="font-size: 0.9rem; transform: rotate(0.04deg)">미제공</a>
            </div> 
            `
    }
}

// 플로팅 창 내용 넣기
async function floatInfo (storeName, star, url, category, addr, storeIdx, predComment) {
    let loadStar = `<a id="starBtn" onclick="dataSend(this)" data-name="${addr}" data-store="${storeName}" style="display:none">${star}</a>`
    if(UserResult !== '') loadStar = `<a id="starBtn" onclick="dataSend(this)" data-name="${addr}" data-store="${storeName}">${star}</a>`
    return `
    <div class='shadow-sm card custom_zoomcontrol float-info'
        style="bottom: calc(3.5rem + 11%); width:95%;">
        <div class="card-body w-100" id="renderedCard">
            <div class="row justify-content-between">
                <div class="col-auto"  style="text-overflow: ellipsis; max-width:67%" >
                    <div class="card-title text-start fw-bold" style="display:block; white-space:nowrap; overflow:hidden; text-overflow: ellipsis; font-family: 'NanumSquareExtraBold'; transform: rotate(0.04deg)">${storeName}</div>
                </div>
                <div class="col-auto" style="margin-left: auto; margin-right:0">
                    <div class="row">
                        <div class="col-auto">
                            ${loadStar}
                        </div>
                        <div class="col-auto text-end align-end" style="margin-left: auto; margin-right:0">
                            <a onclick="if(${!!url}) {document.getElementById('framesrc').src='${url}';
                                $('#myModal').modal('show');}">
                                <img class="align-top text-end" src="/img/box-arrow-up-right.svg" style="width: 1.2rem; " alt="outerLink">
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <p class="card-text text-start text-truncate mb-0" style="font-size:0.8rem; font-family: 'NanumSquareBold'; transform: rotate(0.04deg)">
                ${category}
            </p>
            <hr class="my-2">
            <div class="card-text flex-nowrap" style="font-size:1.1rem; text-overflow: ellipsis; font-family: 'NanumSquareBold'; transform: rotate(0.04deg)">${predComment}</div>
        </div>
    </div>
    `
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
        if(marker.Ba != undefined) marker.setMap(null);
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
function newMapOption(lat, lon, level) {
    return {
        center: new kakao.maps.LatLng(lat, lon), // 지도의 중심좌표
        level: level, // 지도의 확대 레벨
    };
}

// 검색 옵션 디자인 변경 함수
const allToggle = document.getElementById('allToggle');
const allToggleLabel = document.getElementById('allToggleLabel');
const apiToggleLabel = document.getElementById('apiToggleLabel');
const safeToggleLabel = document.getElementById('safeToggleLabel');

allToggle.addEventListener('click',() => {
    apiToggleLabel.style.borderTop = '0';
    allToggleLabel.style.border = '1px solid #6c757d';
    allToggleLabel.style.color = 'white';
    safeToggleLabel.style.border = '1px solid #6c757d';
    safeToggleLabel.style.color = '#6c757d';
    apiToggleLabel.style.border = '1px solid #6c757d';
    apiToggleLabel.style.color = '#6c757d';
})
apiToggle.addEventListener('click', ()=>{
    apiToggleLabel.style.borderTop = '0';
    apiToggleLabel.style.border = '1px solid #ffc107';
    apiToggleLabel.style.color = 'white';
    safeToggleLabel.style.border = '1px solid #ffc107';
    safeToggleLabel.style.color = '#ffc107';
    allToggleLabel.style.border = '1px solid #ffc107';
    allToggleLabel.style.color = '#ffc107';
})
safeToggle.addEventListener('click', ()=>{
    apiToggleLabel.style.borderTop = '0';
    safeToggleLabel.style.border = '1px solid #0d6efd';
    safeToggleLabel.style.color = 'white';
    apiToggleLabel.style.border = '1px solid #0d6efd';
    apiToggleLabel.style.color = '#0d6efd';
    allToggleLabel.style.border = '1px solid #0d6efd';
    allToggleLabel.style.color = '#0d6efd';
})

function predictComment (fetchResult) {
    if(fetchResult.congestion1 == null) return `<div>예측 자료를 지원하지 않아요</div>`

    let fetchArr = [fetchResult.congestion, fetchResult.congestion1, fetchResult.congestion2,
    fetchResult.congestion3, fetchResult.congestion4];

    if (fetchArr[0] === '여유' || fetchArr[0] === '보통') {
        var safeCount = 0
        var toWarnCount = fetchArr.indexOf('약간 붐빔');
        var toDangerCount = fetchArr.indexOf('붐빔');
        if (Math.min(toWarnCount, toDangerCount) === -1) {
            safeCount = Math.max(toWarnCount,toDangerCount);
        } else {
            safeCount = Math.min(toWarnCount, toDangerCount);
        }

        if(safeCount === -1) {
            return `<div>당분간은 여유로울 예정이에요</div>`
        } else if (safeCount === 1) {
            return `<div>곧 붐빌 예정이에요</div>`
        } else {
            return `<div>${safeCount}시간 내로 붐빌 예정이에요</div>`
        }
    } else if (fetchArr[0] === '약간 붐빔' || fetchArr[0] === '붐빔') {
        var warnCount = 0;
        var toSafeCount = fetchArr.indexOf('여유');
        var toGoodCount = fetchArr.indexOf('보통')
        if (Math.min(toSafeCount, toGoodCount) === -1) {
            warnCount = Math.max(toSafeCount,toGoodCount);
        } else {
            warnCount = Math.min(toSafeCount, toGoodCount);
        }
        if(warnCount === -1) {
            return `<div>계속 붐빌 예정이에요</div>`
        } else if (warnCount === 1) {
            return `<div>곧 여유로워질 예정이에요</div>`
        } else {
            return `<div>${warnCount}시간 안으로 여유로워질 예정이에요</div>`
        }
    }
}

function predictGraph (fetchResult) {
    let fetchArr = [fetchResult.congestion, fetchResult.congestion1, fetchResult.congestion2,
        fetchResult.congestion3, fetchResult.congestion4];
    let fetchTime = 25;
    let results = ``;

    if(fetchResult.predictTime !== null) fetchTime = parseInt(fetchResult.predictTime.substring(11,13));
    fetchArr.forEach((item,i) => {
        if (fetchResult.predictTime !== null){

            if(item === '여유') {
                results += `
                    <div
                        class="row justify-content-end mt-1"
                        style="margin-left: auto; margin-right: auto; width: 30rem"
                    >
                        <div class="col-auto mx-1 my-auto" style="padding-left: 0.333rem; padding-right: 0.333rem">
                            <div
                                class="my-auto"
                                style="width: 2rem; height: 1rem; box-shadow: 0 .125rem .125rem #9f9f9fd9; background-color: #1960ef; border-radius: 0.66rem"
                            ></div>
                        </div>`
            }
            else if(item === '보통') {
                results += `
                    <div
                        class="row justify-content-end mt-1"
                        style="margin-left: auto; margin-right: auto; width: 30rem"
                    >
                        <div class="col-auto mx-1 my-auto" style="padding-left: 0.333rem; padding-right: 0.333rem">
                            <div
                                class="my-auto"
                                style="width: 3rem; height: 1rem; box-shadow: 0 .125rem .125rem #9f9f9fd9; background-color: #7db249; border-radius: 0.66rem"
                            ></div>
                        </div>`
            }
            else if(item === '약간 붐빔') {
                results += `
                    <div class="row justify-content-end mt-1 mx-auto" style="width: 30rem">
                        <div
                            class="col-auto mx-1 my-auto"
                            style="margin-top: auto; padding-left: 0.333rem; padding-right: 0.333rem"
                        >
                            <div
                                class="my-auto"
                                style="width: 4rem; height: 1rem; box-shadow: 0 .125rem .125rem #9f9f9fd9; background-color: #fd9f28; border-radius: 0.66rem"
                            ></div>
                        </div>`
            }
            else if(item === '붐빔') {
                results += `
                    <div class="row justify-content-end mt-1 mx-auto" style="width: 30rem">
                        <div class="col-auto mx-1 my-auto" style="padding-left: 0.333rem; padding-right: 0.333rem">
                            <div
                                class="my-auto"
                                style="width: 5rem; height: 1rem; box-shadow: 0 .125rem .125rem #9f9f9fd9; background-color: #fc5230; border-radius: 0.66rem"
                            ></div>
                        </div>`
            }


            if(i === 0) {
                results += `
                        <div
                            class="col-auto mx-1 my-auto align-middle p-0"
                            style="width: 2.18rem !important; text-align: center; font-size: 0.9rem; font-family: 'NanumSquareBold';"
                        >
                            현재
                        </div>
                    </div>`
            } else {
                results += `
                        <div
                            class="col-auto mx-1 my-auto align-middle p-0"
                            style="width: 2.18rem !important; text-align: center; font-size: 0.9rem; font-family: 'NanumSquareBold';"
                        >
                            ${fetchTime}시
                        </div>
                    </div>`
                if(fetchTime === 23) fetchTime = 0;
                else if (fetchTime !== 25) fetchTime++;
            }
        }
    })
    return results
}