package com.example.map_test.dto;

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
    private Long likeIdx;
    private String storeName;
    private String storeNewAddr;
    public static favResDto toFavDto (LikeEntity entity){
        return favResDto.builder()
                .likeIdx(entity.getStoreEntity().getStoreIdx())
                .storeName(entity.getStoreEntity().getStoreName())
                .storeNewAddr(entity.getStoreEntity().getStoreNewAddr())
                .build();
    }
}
