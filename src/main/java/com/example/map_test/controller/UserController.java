package com.example.map_test.controller;


import com.example.map_test.dto.StoreResDto;
import com.example.map_test.dto.UserDto;
import com.example.map_test.service.StoreService;
import com.example.map_test.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("")
@RestController
public class UserController {

    private final UserService userService;

    // 로그인
    @PostMapping("/login")
    public String login(@RequestBody UserDto dto, HttpSession session) {
        var result = userService.login(dto);
        if (result == null) {
            System.out.println("로그인 실패");
            return null;
        } else {
            session.setAttribute("user", dto.getUserId());
            return (String) session.getAttribute("user");
        }
    }

    // 마이페이지
    @PostMapping("/mypage")
    public String userId(HttpSession session) {
        return (String) session.getAttribute("user");
    }

    // 회원가입
    @PostMapping("/signup")
    public String register(@RequestBody UserDto dto) {
        System.out.println(dto);
        var temp = userService.register(dto);
        System.out.println(temp);
        return temp;
    }

    @PostMapping("/modify")
    public void modify(@RequestBody UserDto dto, HttpSession session, Model model) {
        String originalName = (String) session.getAttribute("user");
        userService.modify(originalName, dto);
        session.setAttribute("user", dto.getUserId());
        model.addAttribute("test", session.getAttribute("user"));
    }

    // 검색 후 리스트 출력
    @GetMapping("/logout")
    public void logout(HttpServletResponse response, HttpSession session) throws IOException {
        session.invalidate();
        response.sendRedirect("/mypage");
    }

    @PostMapping("/id-check")
    public boolean idcheck(@RequestBody UserDto dto) {
        System.out.println("userId =" + dto.getUserId());
        boolean checkResult = userService.idcheck(dto);
        return checkResult;
    }


}
