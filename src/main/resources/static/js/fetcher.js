async function getFetcher(uri, data) {
    if(data === '') {
        data = {}
    }
    const response = await fetch (uri, {
        method: 'get',
        data: data
    })

    return await response.json();
}

// post 전송 함수
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