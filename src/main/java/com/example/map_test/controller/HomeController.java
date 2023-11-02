package com.example.map_test.controller;

import com.example.map_test.dto.UserDto;
import com.example.map_test.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@Controller
@RequestMapping("")
@RequiredArgsConstructor
public class HomeController {

    private final UserService userService;

    @GetMapping("/main")
    public void mapMain() {
    }

    @GetMapping("/login")
    public void loginPage() {
    }

    @GetMapping("/signup")
    public void signup(){
    }

    @GetMapping("/mypage")
    public void mypage(){
    }

}
