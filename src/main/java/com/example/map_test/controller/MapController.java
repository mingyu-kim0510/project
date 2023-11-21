package com.example.map_test.controller;

import com.example.map_test.dto.*;
import com.example.map_test.service.PeopleService;
import com.example.map_test.service.StoreService;
import lombok.RequiredArgsConstructor;
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
    @PostMapping("/store/district")
    public List<StoreResDto> getStoresByDistrict (@RequestBody StoreReqDto dto) {
        return storeService.findStoresByDistrict(dto);
    }

    @GetMapping("/map/{option}")
    public void mapMain(@PathVariable String option, HttpSession session, HttpServletResponse response) throws IOException {
        response.sendRedirect("/map");
        session.setAttribute("option", option);
    }
    @GetMapping("/district/{target}/{timeCount}")
    public void getStoresByDistrict(@PathVariable String target,@PathVariable int timeCount, HttpSession session, HttpServletResponse response) throws IOException {
        response.sendRedirect("/map");
        session.setAttribute("district", target);
        session.setAttribute("timeCount", timeCount);
    }
    @GetMapping("/map/category")
    public String getSession (HttpSession session) {
        return (String) session.getAttribute("option");
    }
    @GetMapping("/map/district")
    public DistrictResDto getDistrictSession(HttpSession session) {
        DistrictResDto dto = new DistrictResDto();
        dto.setDistrictName((String) session.getAttribute("district"));
        if (session.getAttribute("timeCount") != null) {
            dto.setStoreCount((Integer) session.getAttribute("timeCount"));
        }

        return dto;
    }

    @PostMapping("/color")
    public List<DistrictColorResDto> getColor() {
        return peopleService.getColor();
    }

    @PostMapping("/pinColor")
    public void getPinColor() {
        peopleService.getColor();
    }
    @PostMapping("/getPredictOne")
    public StorePredictDto getPredictOne(@RequestBody StoreReqDto dto) {
        return storeService.findStorePredictOne(dto);
    }
    @GetMapping("/map/init")
    public void initSession (HttpSession session) {
        session.setAttribute("option", "");
        session.setAttribute("district", "");
        session.setAttribute("timeCount", 0);
    }

    @PostMapping("/getPredictAll")
    public List<DistrictResDto> getPredictAll() {
        return peopleService.findStorePredictByDistrict();
    }



}
