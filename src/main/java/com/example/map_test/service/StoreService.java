package com.example.map_test.service;

import com.example.map_test.dto.StoreResDto;
import com.example.map_test.dto.UserDto;

import java.util.List;

public interface StoreService {

    List<StoreResDto> findByStoreNameContaining(String storeName);
}
