package com.example.map_test.service;

import com.example.map_test.dto.PeopleResDto;
import com.example.map_test.dto.StoreReqDto;
import com.example.map_test.dto.StoreResDto;
import com.example.map_test.dto.UserDto;

import java.util.List;

public interface StoreService {

    List<StoreResDto> findStore(StoreReqDto dto);

    StoreResDto findOne(Long storeIdx);

}
