package com.example.map_test.service;

import com.example.map_test.apis.PeopleApi;
import com.example.map_test.dto.*;
import com.example.map_test.entity.DistrictEntity;
import com.example.map_test.entity.StoreEntity;
import com.example.map_test.repository.PeopleRepository;
import com.example.map_test.repository.StoreRepository;
import com.example.map_test.service.StoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@Service
@Slf4j
public class StoreServiceImpl implements StoreService {
    private final StoreRepository storeRepository;
    private final PeopleRepository peopleRepository;
    // 옵션 검색기능
    @Override
    public List<StoreResDto> findStore(StoreReqDto dto) {
        // 현위치에서 검색
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
            storesInLocation.forEach(item -> storeResDtoList.add(item.toStoreResDto(0)));
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


    @Override
    public StorePredictDto findStorePredictOne(StoreReqDto dto) {
        var temp = storeRepository.findByStoreIdx(dto.getStoreIdx());
        if(temp.isPresent() && temp.get().getDistrictEntity() != null) {
            if (!temp.get().getDistrictEntity().getPredictEntityList().isEmpty()) {
                var temp2 =
                        temp.get().getDistrictEntity().getPredictEntityList();
                StorePredictDto predictDto = new StorePredictDto();
                predictDto.setStoreName(temp.get().getStoreName());
                predictDto.setStoreIdx(temp.get().getStoreIdx());
                predictDto.setCongestion(temp.get().getDistrictEntity().getDistDensity());
                predictDto.setPredictTime(temp2.get(0).getPredictTime());
                predictDto.setCongestion1(temp2.get(0).getPredictCongestion());
                predictDto.setCongestion2(temp2.get(1).getPredictCongestion());
                predictDto.setCongestion3(temp2.get(2).getPredictCongestion());
                predictDto.setCongestion4(temp2.get(3).getPredictCongestion());
                return predictDto;
            }

            StorePredictDto predictDto = new StorePredictDto();
            predictDto.setStoreName(temp.get().getStoreName());
            predictDto.setStoreIdx(temp.get().getStoreIdx());
            predictDto.setCongestion(temp.get().getDistrictEntity().getDistDensity());
            return predictDto;
        }

        return new StorePredictDto();
    }

    @Override
    public List<StoreResDto> findStoresByDistrict(StoreReqDto dto) {
        DistrictEntity entity = new DistrictEntity();
        List<StoreResDto> list = new ArrayList<>();

        log.info("searchVal : {}", dto.getSearchVal());
        entity.setDistName(dto.getSearchVal());
        var dist = peopleRepository.findByDistName(dto.getSearchVal());
        if(dist.isPresent()) {
            var temp = storeRepository.findByDistrictEntity(dist.get());
            temp.forEach(item -> list.add(item.toStoreResDto(dto.getIsPeopleApi())));
            return list;
        }
        return null;

    }



}
