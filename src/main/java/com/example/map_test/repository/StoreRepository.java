package com.example.map_test.repository;

import com.example.map_test.entity.DistrictEntity;
import com.example.map_test.entity.StoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StoreRepository extends JpaRepository<StoreEntity, Long> {
    List<StoreEntity>
    findByStoreAddrContainingAndStoreCategoryContainingAndStoreCategoryContainingAndStoreCategoryContainingOrStoreNewAddrContainingAndStoreCategoryContainingAndStoreCategoryContainingAndStoreCategoryContainingOrStoreNameContainingAndStoreCategoryContainingAndStoreCategoryContainingAndStoreCategoryContainingOrStoreCategory2ContainingAndStoreCategoryContainingAndStoreCategoryContainingAndStoreCategoryContaining
            (String addr, String c1, String c2, String c3, String newAddr, String c4, String c5, String c6, String storeName, String c7, String c8, String c9, String category, String c10, String c11, String c12);

    // 지역 내 재검색 기능
    List<StoreEntity>
            findByStoreAddrContainingAndStoreCategoryContainingAndStoreCategoryContainingAndStoreCategoryContainingAndStoreLatBetweenAndStoreLonBetweenOrStoreNewAddrContainingAndStoreCategoryContainingAndStoreCategoryContainingAndStoreCategoryContainingAndStoreLatBetweenAndStoreLonBetweenOrStoreNameContainingAndStoreCategoryContainingAndStoreCategoryContainingAndStoreCategoryContainingAndStoreLatBetweenAndStoreLonBetweenOrStoreCategory2ContainingAndStoreCategoryContainingAndStoreCategoryContainingAndStoreCategoryContainingAndStoreLatBetweenAndStoreLonBetween
            (String addr, String c1, String c2, String c3, Double latMin, Double latMax, Double lonMin, Double lonMax, String newAddr, String c4, String c5, String c6, Double latMin1, Double latMax1, Double lonMin1, Double lonMax1, String storeName, String c7, String c8, String c9, Double latMin2, Double latMax2, Double lonMin2, Double lonMax2, String category, String c10, String c11, String c12, Double latMin3, Double latMax3, Double lonMin3, Double lonMax3);

    Optional<StoreEntity> findByStoreNewAddrAndStoreName(String storeAddr, String storeName);

    Optional<StoreEntity> findByStoreIdx(Long idx);

    List<StoreEntity> findByDistrictEntity(DistrictEntity entity);

    List<StoreEntity> findByStoreLatBetweenAndStoreLonBetween (Double latMin, Double latMax, Double lonMin, Double lonMax);


}
