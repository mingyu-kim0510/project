package com.example.map_test.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreReqDto {
    @JsonProperty("searchVal")
    private String searchVal;
    private Long storeIdx;
    private String category1;
    private String category2;
    private String category3;
    private Double lat;
    private Double lon;
    private Double intervals;

}
