window.onload = async () => {
    // 로그인 여부 확인 후 like 버튼 보이기
    const UserSession = await fetch('/mypage', {method:'post'})
    const UserResult = await UserSession.text();

    if (UserResult != '') {
        document.getElementById('likeLabel').style.display = 'inline-block';
        document.getElementById('likeBtn').style.display = 'inline-block';
    }

    // 카테고리 검색
    // 세션을 통해 값이 있는지 확인
    const sessionOption = await getFetcher('/api/map/category')

    if (sessionOption !== "") {
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

    // 구역 검색
    // 세션을 통해 값이 있는지 확인
    const sessionDistrict = await getFetcher('/api/map/district')

    if (sessionDistrict !== "") {
        // 검색기능 수행 전 스피너
        spinner();

        $('#offcanvasExample').offcanvas('show');
        $('.collapse').collapse('hide');

        // request
        const result = await postFetcher('/api/store/district',
            { searchVal: sessionDistrict, isPeopleApi: 1 });
        await getFetcher('/api/map/init');

        // 검색 결과로 맵핀 계산
        await mapCalc(result,null,null, 1);
    }
}