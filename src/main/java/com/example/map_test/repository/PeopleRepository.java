package com.example.map_test.repository;

import com.example.map_test.entity.DistrictEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PeopleRepository extends JpaRepository<DistrictEntity, Long> {
    Optional<DistrictEntity> findByDistCode (String distName);
    List<DistrictEntity> findAll();
    List<DistrictEntity> findByPredictEntityListNotNull ();
}
