package com.example.map_test.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DistrictResDto {
    private String districtName;
    private String predictCongestion;
    private int storeCount;
    private String predictTime;
}