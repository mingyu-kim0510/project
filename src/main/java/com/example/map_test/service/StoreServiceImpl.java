package com.example.map_test.service;

import com.example.map_test.apis.PeopleApi;
import com.example.map_test.dto.DistrictResDto;
import com.example.map_test.dto.PeopleResDto;
import com.example.map_test.dto.StoreReqDto;
import com.example.map_test.dto.StoreResDto;
import com.example.map_test.entity.DistrictEntity;
import com.example.map_test.entity.StoreEntity;
import com.example.map_test.repository.PeopleRepository;
import com.example.map_test.repository.StoreRepository;
import com.example.map_test.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@Service
public class StoreServiceImpl implements StoreService {
    private final StoreRepository storeRepository;
    private final PeopleRepository peopleRepository;
    // 옵션 검색기능
    @Override
    public List<StoreResDto> findStore(StoreReqDto dto) {
        // 현재 위치에서 검색
        if (dto.getLon() != null) {
            final Double MAP_DIST_LAT = dto.getIntervals() * 3;
            final Double MAP_DIST_LNG = dto.getIntervals() * 6;

            var storesInLocation = storeRepository.findByStoreLatBetweenAndStoreLonBetween(
                    dto.getLon() - MAP_DIST_LNG,dto.getLon() + MAP_DIST_LNG,
                    dto.getLat() - MAP_DIST_LAT,dto.getLat() + MAP_DIST_LAT)
                    .stream()
                    .filter(i -> i.getStoreName().contains(dto.getSearchVal())
                            || i.getStoreAddr().contains(dto.getSearchVal())
                            || i.getStoreCategory2().contains(dto.getSearchVal()))
                    .filter(i -> i.getStoreCategory().contains(dto.getCategory1())
                            && i.getStoreCategory().contains(dto.getCategory2())
                            && i.getStoreCategory().contains(dto.getCategory3()));
            if (dto.getIsPeopleApi() == 2) {
                storesInLocation = storesInLocation.filter(i -> i.getDistrictEntity() != null && i.getDistrictEntity().getDistDensity().equals("여유"));
            } else if (dto.getIsPeopleApi() == 1) {
                storesInLocation = storesInLocation.filter(i -> i.getDistrictEntity() != null);
            }
            List<StoreResDto> storeResDtoList = new ArrayList<>();
            storesInLocation.forEach(item -> {
                storeResDtoList.add(item.toStoreResDto(0));
            });
            return storeResDtoList;
        }
        // 검색어를 통해서 검색
        var storesByCategory = storeRepository.findAll().stream()
                .filter(i -> i.getStoreName().contains(dto.getSearchVal())
                        || i.getStoreAddr().contains(dto.getSearchVal())
                        || i.getStoreCategory2().contains(dto.getSearchVal()))
                .filter(i -> i.getStoreCategory().contains(dto.getCategory1())
                        && i.getStoreCategory().contains(dto.getCategory2())
                        && i.getStoreCategory().contains(dto.getCategory3()));
        if (dto.getIsPeopleApi() == 2) {
            storesByCategory = storesByCategory.filter(i -> i.getDistrictEntity() != null && i.getDistrictEntity().getDistDensity().equals("여유"));
        } else if (dto.getIsPeopleApi() == 1) {
            storesByCategory = storesByCategory.filter(i -> i.getDistrictEntity() != null);
        }
        List<StoreResDto> temp2 = new ArrayList<>();
        storesByCategory.forEach(item -> temp2.add(item.toStoreResDto(0)));
        return temp2;
    }
    @Override
    public StoreResDto findOne (Long storeIdx) {
        return storeRepository.findByStoreIdx(storeIdx)
                .map(entity -> entity.toStoreResDto(0)).orElse(null);
    }

    // 예측 자료 찾기
    @Override
    public List<StoreResDto> findStorePredict(StoreReqDto dto, int predictTime) {
        // 인구데이터 구역 내 예측자료 제공 여부
        var temp = storeRepository.findByDistrictEntityNotNull().stream()
                    .filter(i -> !i.getDistrictEntity().getPredictEntityList().isEmpty());
        List<StoreResDto> dtoList = new ArrayList<>();
        temp.forEach(item -> dtoList.add(item.toStoreResDto(1)));
        return dtoList;
    }



}
