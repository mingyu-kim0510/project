package com.example.map_test.controller;

import com.example.map_test.dto.UserDto;
import com.example.map_test.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Slf4j
@Controller
@RequestMapping("")
@RequiredArgsConstructor
public class HomeController {

    private final UserService userService;

    @GetMapping("/home")
    public void get(Model model) {
        model.addAttribute("test", userService.findAll());
    }

    @GetMapping("/login")
    public void loginPage() {
    }
    @GetMapping("/signup")
    public void signup(){
    }


    @PostMapping("/signup")
    public String register(UserDto dto){
        System.out.println(dto);
        userService.register(dto);
        return "redirect:/login";
    }
}
