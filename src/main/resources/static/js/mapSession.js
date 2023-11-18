window.onload = async () => {
    // 로그인 여부 확인 후 like 버튼 보이기
    const UserSession = await fetch('/mypage', {method:'post'})
    const UserResult = await UserSession.text();

    if (UserResult != '') {
        document.getElementById('likeLabel').style.display = 'inline-block';
        document.getElementById('likeBtn').style.display = 'inline-block';
    }
    const sessionOption = await getFetcher('/api/map')

    if (sessionOption != "") {
        category1 = sessionOption;
        // 검색기능 수행 전 스피너
        spinner();

        $('#offcanvasExample').offcanvas('show');
        $('.collapse').collapse('hide');

        // request
        const result = await postFetcher('/api/store/list',
            { searchVal: "", category1: category1, category2: "", category3: "", isPeopleApi: 1 });
        await getFetcher('/api/map/init');

        // 검색 결과로 맵핀 계산
        await mapCalc(result,null,null);
    }
}