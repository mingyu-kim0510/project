package com.example.map_test.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreResDto {
    private Long storeIdx;
    private String storeName;
    private String storeUrl;
    private String storeNewAddr;
    private String storeLat;
    private String storeLon;

}
