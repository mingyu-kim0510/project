package com.example.map_test.repository;

import com.example.map_test.entity.StoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StoreRepository extends JpaRepository<StoreEntity, Long> {
    List<StoreEntity> findByStoreNameContaining(String storeName);
}
