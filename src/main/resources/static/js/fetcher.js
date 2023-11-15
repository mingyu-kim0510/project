async function getFetcher(uri) {
    const response = await fetch (uri, {
        method: 'get'
    })
    return await response.text();
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