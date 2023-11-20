const cardInnerHTML = document.getElementById('cardInnerHTML');
const flexCheckDefault = document.getElementById('flexCheckDefault');

flexCheckDefault.addEventListener('click', async () => {
    const resp = await fetch('/like/getAll', { method: 'post' });
    const result = await resp.json();
    console.log(result);
    tempData = result;
    if (flexCheckDefault.checked) {
        render(result, true);
    } else {
        render(result, false);

    }
})
var tempData = [];
sendData();
async function sendData() {
    cardInnerHTML.style.display = 'none';
    const result = await postFetcher('/like/getAll', { method: 'post' });
    tempData = result;
    render(result);
}
function render(result, isChecked) {
    cardInnerHTML.innerHTML = '';
    result.forEach((item) => {
        if (!isChecked || item.storeCongestion == '여유') {

            let isTempUrl;
            if(item.storeUrl) isTempUrl = true;
            else isTempUrl = false;
            cardInnerHTML.innerHTML += `
                <div class="card mb-4" style="transform: rotate(0.04deg)">
                    <div class="card-header">
                        <span>
                            <div class="row fw-bold">
                                <div class="col-5">
                                    <a style="font-size: 0.9rem; margin-left: 0.4rem" onclick=" if(${isTempUrl}) {document.getElementById('framesrc').src='${item.storeUrl}'; $('#myModal').modal('show');}">${item.storeName}</a>
                                </div>
                                <div class="col-auto" style="margin-left:auto; margin-right:.375rem">
                                    <div class="row">
                                        <div class="col-auto">
                                            ${colorPicker(item.storeCongestion)}
                                        </div>
                                        <div class="col-auto">
                                            <a style="margin-left:auto; margin-right:0" id="like-button" data-name="${item.storeName}" data-store="${item.storeNewAddr}" onclick="undo(this);">
                                                <img src="/img/star-fill.svg" alt="star">
                                            </a>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </span>
                    </div>
                </div>
                `;
            cardInnerHTML.style.display = 'block';
        }
    });
    cardInnerHTML.innerHTML += `<div style="height:3.5rem">&nbsp;</div>`
}
// 버튼 클릭 시 부모 div 삭제하는 함수
function removeCard() {
    var card = this.closest('.card');
    card.remove();
}

// 모든 like-button 요소에 클릭 이벤트 추가
var likeButtons = document.querySelectorAll('#like-button');
likeButtons.forEach(function (button) {
    button.addEventListener('click', removeCard);
});

async function undo(element) {
    const storeName = element.dataset.name;
    const storeNewAddr = element.dataset.store;
    await postFetcher('/like', { storeName: storeName, storeNewAddr: storeNewAddr });
    const itemFind = tempData.find((item) => {
        return item.storeName === storeName;
    });
    const idx = tempData.indexOf(itemFind);
    if (idx > -1) {
        tempData.splice(idx, 1);
    }
    render(tempData);
}

function colorPicker (element) {
    if (element == '붐빔') {
        return `
            <div
                class="col-3 text-center"
                style="background-color: #fc5230; color:white; line-height: 1.6rem; border-radius: 4px; width:23vw"
            >
                <a style="font-size: 0.9rem; transform: rotate(0.04deg)">${element}</a>
            </div>
            `
    } else if (element == '약간 붐빔') {
        return `
            <div
                class="col-3 text-center"
                style="background-color: #fd9f28; color:white; line-height: 1.6rem; border-radius: 4px; width:23vw"
            >
                <a style="font-size: 0.9rem; transform: rotate(0.04deg)">${element}</a>
            </div>
            `
    } else if (element == '보통') {
        return `
            <div
                class="col-3 text-center"
                style="background-color: #7db249; color:white; line-height: 1.6rem; border-radius: 4px; width:23vw"
            >
                <a style="font-size: 0.9rem; transform: rotate(0.04deg)">${element}</a>
            </div>
            `
    } else if (element == '여유') {
        return `
            <div
                class="col-3 text-center"
                style="background-color: #1960ef; color:white; line-height: 1.6rem; border-radius: 4px; width:23vw"
            >
                <a style="font-size: 0.9rem; transform: rotate(0.04deg)">${element}</a>
            </div>
            `
    } else {
        return `
            <div
                class="col-3 text-center"
                style="background-color: #595959; color:white; line-height: 1.6rem; border-radius: 4px; width:23vw"
            >
                <a style="font-size: 0.9rem; transform: rotate(0.04deg)">미제공</a>
            </div>
            `
    }
}