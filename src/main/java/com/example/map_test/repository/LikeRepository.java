package com.example.map_test.repository;

import com.example.map_test.entity.LikeEntity;
import com.example.map_test.entity.StoreEntity;
import com.example.map_test.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<LikeEntity, Long> {
    Optional<LikeEntity> findByStoreEntityAndUserEntity(StoreEntity storeEntity, UserEntity entity);

    List<LikeEntity> findByUserEntity(UserEntity entity);
    void deleteByStoreEntityAndUserEntity(StoreEntity storeEntity, UserEntity entity);

}
