package com.example.map_test.entity;


import com.example.map_test.dto.StoreResDto;
import com.example.map_test.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="store_table")
public class StoreEntity {

    @Id
    @Column(name = "store_idx", nullable = false)
    private Long storeIdx;

    @Column(name = "store_name", nullable = false)
    private String storeName;

    // 서울시 맛집 홈페이지
    @Column(name = "store_url")
    private String storeUrl;

    @Column(name = "store_addr", nullable = false)
    private String storeAddr;

    @Column(name = "store_new_addr")
    private String storeNewAddr;

    @Column(name = "store_tel")
    private String storeTel;

    @Column(name= "store_lat", nullable = false)
    private Double storeLat;

    @Column(name = "store_lon", nullable = false)
    private Double storeLon;

    @Column(name = "store_category", nullable = false)
    private String storeCategory;

    @Column(name = "store_category2", nullable = false)
    private String storeCategory2;

    @Builder.Default
    @OneToMany(mappedBy = "storeEntity", cascade = CascadeType.REMOVE, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<LikeEntity> likeEntityList = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "dist_idx")
    private DistrictEntity districtEntity;

    public StoreResDto toStoreResDto (int predictTime) {
        if(this.districtEntity == null) {
            return StoreResDto.builder()
                    .storeIdx(storeIdx)
                    .storeName(storeName)
                    .storeNewAddr(storeNewAddr)
                    .storeUrl(storeUrl)
                    .storeLat(storeLat)
                    .storeLon(storeLon)
                    .storeCategory(storeCategory)
                    .storeCategory2(storeCategory2)
                    .storeTel(storeTel)
                    .build();
        } else if (this.districtEntity.getPredictEntityList().isEmpty() || predictTime==0) {
            return StoreResDto.builder()
                    .storeIdx(storeIdx)
                    .storeName(storeName)
                    .storeNewAddr(storeNewAddr)
                    .storeUrl(storeUrl)
                    .storeLat(storeLat)
                    .storeLon(storeLon)
                    .storeCategory(storeCategory)
                    .storeCategory2(storeCategory2)
                    .storeTel(storeTel)
                    .storeDist(districtEntity.getDistIdx())
                    .storeCongestion(districtEntity.getDistDensity())
                    .build();
        } else {

            return StoreResDto.builder()
                    .storeIdx(storeIdx)
                    .storeName(storeName)
                    .storeNewAddr(storeNewAddr)
                    .storeUrl(storeUrl)
                    .storeLat(storeLat)
                    .storeLon(storeLon)
                    .storeCategory(storeCategory)
                    .storeCategory2(storeCategory2)
                    .storeTel(storeTel)
                    .storeDist(districtEntity.getDistIdx())
                    .storeCongestion(districtEntity.getDistDensity())
                    .predictCongestion(districtEntity.getPredictEntityList().get(predictTime-1).getPredictCongestion())
                    .predictTime(districtEntity.getPredictEntityList().get(predictTime-1).getPredictTime())
                    .build();
        }
    }
}
