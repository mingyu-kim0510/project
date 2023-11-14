package com.example.map_test.controller;

import com.example.map_test.dto.DistrictColorResDto;
import com.example.map_test.dto.PeopleResDto;
import com.example.map_test.dto.StoreReqDto;
import com.example.map_test.dto.StoreResDto;
import com.example.map_test.service.PeopleService;
import com.example.map_test.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MapController {

    private final StoreService storeService;
    private final PeopleService peopleService;

    @PostMapping("/store/list")
    public List<StoreResDto> getStoreList(@RequestBody StoreReqDto dto) {
        return storeService.findStore(dto);
    }

    @GetMapping("/map/{option}")
    public void mapMain(@PathVariable String option, HttpSession session, HttpServletResponse response) throws IOException {
        response.sendRedirect("/map");
        session.setAttribute("option", option);
    }

    @GetMapping("/map")
    public String getSession (HttpSession session) {
        return (String) session.getAttribute("option");
    }

    @PostMapping("/color")
    public List<DistrictColorResDto> getColor() {
        return peopleService.getColor();
    }

    @PostMapping("/pinColor")
    public void getPinColor() {
        peopleService.getColor();
    }
    @PostMapping("/getPredict")
    public void getPredictPin() {

    }
    @GetMapping("/map/init")
    public void initSession (HttpSession session) {
        session.setAttribute("option", "");
    }
}
