package com.example.map_test.repository;

import com.example.map_test.entity.DistrictEntity;
import com.example.map_test.entity.PredictEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PredictRepository extends JpaRepository<PredictEntity, Long> {
    Optional<PredictEntity> findByDistrictEntity (DistrictEntity entity);
}
