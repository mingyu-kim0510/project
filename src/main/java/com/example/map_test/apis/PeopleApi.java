package com.example.map_test.apis;

import com.example.map_test.dto.PeopleResDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@RequiredArgsConstructor
@Component
public class PeopleApi {

    private final RestTemplate restTemplate;

    public PeopleResDto searchPeople(String distCode) {
        URI uri = UriComponentsBuilder                //주소를 만들떄 : UriComponentBuilder를 사용
                .fromUriString("http://openapi.seoul.go.kr:8088")
                .path("/546278716e736a3136344641447146/json/citydata_ppltn/1/1/" + distCode)
                .encode()
                .build()
                .toUri();
        ResponseEntity<PeopleResDto> result = restTemplate.getForEntity(uri, PeopleResDto.class);
        return result.getBody();
    }
}
