package com.example.map_test.controller;

import com.example.map_test.dto.UserDto;
import com.example.map_test.service.PeopleService;
import com.example.map_test.service.StoreService;
import com.example.map_test.service.StoreServiceImpl;
import com.example.map_test.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Slf4j
@Controller
@RequestMapping("")
@RequiredArgsConstructor
public class HomeController {

    @GetMapping("/map")
    public void mapMain() {
    }

    @GetMapping("/map/{search}")
    public void mapMain(@PathVariable String search) {
    }



    @GetMapping("/")
    public String mapTest() {
        return "/main";
    }
    @GetMapping("/login")
    public void loginPage() {
    }

    @GetMapping("/signup")
    public void signup(){
    }

    @GetMapping("/mypage")
    public String mypage(HttpSession session, Model model){
        if(sessionCheck(session)) {
            return "redirect:/login";
        } else {
            model.addAttribute("username", session.getAttribute("user"));
            return "/mypage";
        }
    }

    @GetMapping("/main")
    public void main(){
    }

    @GetMapping("/likelist")
    public String likelist(HttpSession session){
        if(sessionCheck(session)) {
            return "redirect:/login";
        } else {
            return "/likelist";
        }
    }

    public boolean sessionCheck(HttpSession session) {
        return session.getAttribute("user") == null;
    }
}
