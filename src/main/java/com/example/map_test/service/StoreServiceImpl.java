package com.example.map_test.service;

import com.example.map_test.apis.PeopleApi;
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

@RequiredArgsConstructor
@Service
public class StoreServiceImpl implements StoreService {

    private final StoreRepository storeRepository;
    private final PeopleApi peopleApi;
    private final PeopleRepository peopleRepository;

    // 옵션 검색기능
    @Override
    public List<StoreResDto> findStore(StoreReqDto dto) {
        if (dto.getLon() != null) {
            final Double MAP_DIST_LAT = dto.getIntervals() * 3;
            final Double MAP_DIST_LNG = dto.getIntervals() * 6;
            System.out.println(MAP_DIST_LAT);
            var temp = findStoreListinLocation
                    (dto.getSearchVal(),
                            dto.getCategory1(),
                            dto.getCategory2(),
                            dto.getCategory3(),
                            dto.getLon() - MAP_DIST_LNG,
                            dto.getLon() + MAP_DIST_LNG,
                            dto.getLat() - MAP_DIST_LAT,
                            dto.getLat() + MAP_DIST_LAT);
            List<StoreResDto> temp2 = new ArrayList<>();
            temp.forEach(item -> {
                temp2.add(item.toStoreResDto());
            });
            return temp2;
        }
            var temp = findStoreList(dto.getSearchVal(), dto.getCategory1(), dto.getCategory2(), dto.getCategory3());
            List<StoreResDto> temp2 = new ArrayList<>();
            temp.forEach(item -> {
                temp2.add(item.toStoreResDto());
            });
            return temp2;
    }

    @Override
    public StoreResDto findOne (Long storeIdx) {
        return storeRepository.findByStoreIdx(storeIdx).map(StoreEntity::toStoreResDto).orElse(null);
    }



    public List<StoreEntity> findStoreList (String searchVal, String c1, String c2, String c3) {
        return storeRepository.findByStoreAddrContainingAndStoreCategoryContainingAndStoreCategoryContainingAndStoreCategoryContainingOrStoreNewAddrContainingAndStoreCategoryContainingAndStoreCategoryContainingAndStoreCategoryContainingOrStoreNameContainingAndStoreCategoryContainingAndStoreCategoryContainingAndStoreCategoryContainingOrStoreCategory2ContainingAndStoreCategoryContainingAndStoreCategoryContainingAndStoreCategoryContaining
                (searchVal, c1, c2, c3, searchVal, c1, c2, c3, searchVal, c1, c2, c3, searchVal, c1, c2, c3);
    }

    public List<StoreEntity> findStoreListinLocation (String searchVal, String c1, String c2, String c3, Double latMin, Double latMax, Double lonMin, Double lonMax) {
        return storeRepository.findByStoreAddrContainingAndStoreCategoryContainingAndStoreCategoryContainingAndStoreCategoryContainingAndStoreLatBetweenAndStoreLonBetweenOrStoreNewAddrContainingAndStoreCategoryContainingAndStoreCategoryContainingAndStoreCategoryContainingAndStoreLatBetweenAndStoreLonBetweenOrStoreNameContainingAndStoreCategoryContainingAndStoreCategoryContainingAndStoreCategoryContainingAndStoreLatBetweenAndStoreLonBetweenOrStoreCategory2ContainingAndStoreCategoryContainingAndStoreCategoryContainingAndStoreCategoryContainingAndStoreLatBetweenAndStoreLonBetween
                (searchVal, c1, c2, c3, latMin, latMax, lonMin, lonMax, searchVal, c1, c2, c3, latMin, latMax, lonMin, lonMax, searchVal, c1, c2, c3, latMin, latMax, lonMin, lonMax, searchVal, c1, c2, c3, latMin, latMax, lonMin, lonMax);
    }
}
