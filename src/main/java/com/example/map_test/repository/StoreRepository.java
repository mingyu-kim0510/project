package com.example.map_test.repository;

import com.example.map_test.entity.DistrictEntity;
import com.example.map_test.entity.StoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StoreRepository extends JpaRepository<StoreEntity, Long> {
    Optional<StoreEntity> findByStoreNewAddrAndStoreName(String storeAddr, String storeName);
    Optional<StoreEntity> findByStoreIdx(Long idx);
    List<StoreEntity> findByStoreLatBetweenAndStoreLonBetween (Double latMin, Double latMax, Double lonMin, Double lonMax);
    List<StoreEntity> findByDistrictEntityNotNull();
}
