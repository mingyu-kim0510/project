package com.example.map_test.controller;


import com.example.map_test.dto.UserDto;
import com.example.map_test.entity.UserEntity;
import com.example.map_test.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpSession;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("")
@RestController
public class UserController {

    private final UserService userService;

//    @PostMapping("/api/user/login")
//    public @ResponseBody UserDto getUser(@RequestBody UserDto data) {
//        System.out.println(data);
//        return userService.findByUserId(data.getUserId());
//    }


    @PostMapping("/login")
    public void login(UserDto dto){

        var result = userService.login(dto);
        if (result == null) {
            System.out.println("로그인 실패");
        }
    }



}
