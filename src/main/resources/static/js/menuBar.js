const menuBar = document.getElementById('menuBar')
var sessionResult;
async function menubar()  {
    const isLoggedIn = await fetch('/mypage', {
        method: 'post'
    })
    sessionResult = await isLoggedIn.text();

    if (sessionResult !== '') {
        menuBar.innerHTML = `
            <nav class="navbar justify-content-around fixed-bottom bg-body-tertiary align-center text-center float-center pb-1">
                <div class="nav-item" style="width:5rem; padding-top:.375rem">
                    <a class='text-decoration-none text-reset' href="/map">
                        <img style="height: 1.5rem" src="/img/map.svg" alt="지도"/>
                        <div style="font-size: 0.7rem">지도</div>
                    </a>
                </div>
                <div class="nav-item" style="width:5rem">
                    <a class='text-decoration-none text-reset' href="/main">
                        <img style="height: 1.5rem" src="/img/house.svg" alt="집"/>
                        <h1 style="font-size: 0.7rem">메인화면</h1> 
                    </a>
                </div>
                <div class="nav-item" style="width:5rem">
                    <a class='text-decoration-none text-reset' href="/mypage">
                        <img style="height: 1.5rem" src="/img/person-bounding-box.svg" alt="계정"/>
                        <div style="font-size: 0.7rem">마이페이지</div>
                    </a>
                </div>
            </nav>
            `
    } else {
        menuBar.innerHTML = `
            <nav class="navbar justify-content-around fixed-bottom bg-body-tertiary align-center text-center float-center pb-1">
                <div class="nav-item" style="width:5rem; padding-top:.375rem">
                    <a class='text-decoration-none text-reset' href="/map">
                        <img style="height: 1.5rem" src="/img/map.svg" alt="지도"/>
                        <div style="font-size: 0.7rem">지도</div>
                    </a>
                </div>
                <div class="nav-item" style="width:5rem">
                    <a class='text-decoration-none text-reset' href="/main">
                        <img style="height: 1.5rem" src="/img/house.svg" alt="집"/>
                        <h1 style="font-size: 0.7rem">메인화면</h1>
                    </a>
                </div>
                <div class="nav-item" style="width:5rem">
                    <a class='text-decoration-none text-reset' href="/login">
                        <img style="height: 1.5rem" src="/img/person-bounding-box.svg" alt="계정"/>
                        <div style="font-size: 0.7rem">로그인</div>
                    </a>
                </div>
            </nav>
            `
    }
}
menubar();