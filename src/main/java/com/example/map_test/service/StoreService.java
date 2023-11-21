package com.example.map_test.service;

import com.example.map_test.dto.*;

import java.util.List;

public interface StoreService {
    List<StoreResDto> findStore(StoreReqDto dto);
    StoreResDto findOne(Long storeIdx);


    StorePredictDto findStorePredictOne (StoreReqDto dto);
    List<StoreResDto> findStoresByDistrict(StoreReqDto dto);
}
