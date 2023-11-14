package com.example.map_test.dto;

import com.example.map_test.entity.DistrictEntity;
import com.example.map_test.entity.LikeEntity;
import com.example.map_test.entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class favResDto {
    private Long storeIdx;
    private String storeName;
    private String storeNewAddr;
    private String storeUrl;
    private String storeTel;
    private Double storeLat;
    private Double storeLon;
    private String storeCongestion;
    public static favResDto toFavDto (LikeEntity entity){

        if(entity.getStoreEntity().getDistrictEntity() != null) {
            return favResDto.builder()
                    .storeIdx(entity.getStoreEntity().getStoreIdx())
                    .storeName(entity.getStoreEntity().getStoreName())
                    .storeUrl(entity.getStoreEntity().getStoreUrl())
                    .storeNewAddr(entity.getStoreEntity().getStoreNewAddr())
                    .storeLat(entity.getStoreEntity().getStoreLat())
                    .storeLon(entity.getStoreEntity().getStoreLon())
                    .storeTel(entity.getStoreEntity().getStoreTel())
                    .storeCongestion(entity.getStoreEntity().getDistrictEntity().getDistDensity())
                    .build();
        } else {
            return favResDto.builder()
                    .storeIdx(entity.getStoreEntity().getStoreIdx())
                    .storeName(entity.getStoreEntity().getStoreName())
                    .storeUrl(entity.getStoreEntity().getStoreUrl())
                    .storeNewAddr(entity.getStoreEntity().getStoreNewAddr())
                    .storeLat(entity.getStoreEntity().getStoreLat())
                    .storeLon(entity.getStoreEntity().getStoreLon())
                    .storeTel(entity.getStoreEntity().getStoreTel())
                    .build();
        }
    }
}
