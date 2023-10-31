package com.example.map_test.controller;


import com.example.map_test.dto.StoreReqDto;
import com.example.map_test.dto.StoreResDto;
import com.example.map_test.dto.UserDto;
import com.example.map_test.service.StoreService;
import com.example.map_test.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("")
@RestController
public class UserController {

    private final UserService userService;
    private final StoreService storeService;

    @PostMapping("/login")
    public void login(UserDto dto){

        var result = userService.login(dto);
        if (result == null) {
            System.out.println("로그인 실패");
        }
    }

    @PostMapping("/api/store/list")
    public @ResponseBody List<StoreResDto> getStoreList(@RequestBody StoreReqDto storeReqDto) {
        var temp = storeReqDto.getSearchVal();
        var temp2 = storeService.findByStoreNameContaining(temp);
        System.out.println(temp2);
        return temp2;
    }
}
