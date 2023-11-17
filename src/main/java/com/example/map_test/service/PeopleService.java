package com.example.map_test.service;

import com.example.map_test.dto.DistrictColorResDto;
import com.example.map_test.dto.PeopleResDto;

import java.util.List;

public interface PeopleService {

    // server -> server
    public void updatePeopleCongestion();

    List<DistrictColorResDto> getColor();
}
