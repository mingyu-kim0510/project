package com.example.map_test.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StorePredictDto {
    private Long storeIdx;
    private String storeName;
    private String predictTime;
    private String congestion;
    private String congestion1;
    private String congestion2;
    private String congestion3;
    private String congestion4;
}
