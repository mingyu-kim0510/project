package com.example.map_test.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class favReqDto {

    private String storeName;
    private String storeNewAddr;
    private Long storeIdx;
}