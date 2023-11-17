package com.example.map_test.controller;


import com.example.map_test.dto.StoreResDto;
import com.example.map_test.dto.favReqDto;
import com.example.map_test.dto.favResDto;
import com.example.map_test.service.LikeService;
import com.example.map_test.service.StoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Objects;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/like")
@RestController
public class LikeController {

    private final LikeService likeService;
    private final StoreService storeService;

    @PostMapping("")
    public int like(@RequestBody favReqDto dto, HttpSession session) {
            var user = (String) session.getAttribute("user");
            if(user == null) {
                // 서버 오류
                return 500;
            }
            return likeService.save(dto, user);
    }

    // 해당 음식점 선택 시 찜 여부 리턴
    @PostMapping("/getOne")
    public StoreResDto getLike(@RequestBody favReqDto dto, HttpSession session) {
        var user = (String) session.getAttribute("user");
        boolean likeResult = likeService.select(dto, user);
        var temp = storeService.findOne(dto.getStoreIdx());
        temp.setLikeResult(likeResult);
        return temp;
    }

    // 유저 찜 리스트 가져오기
    @PostMapping("/getAll")
    public List<favResDto> getLikeAll(HttpSession session) {
        System.out.println("get LikeAll Post In...");
        var user = (String) session.getAttribute("user");
        if(user.isEmpty()) {
            return null;
        } else {
            // 내용
            return likeService.selectAll(user);
        }
    }
}
