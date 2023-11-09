package com.example.map_test.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PeopleResDto {

    @JsonProperty("SeoulRtd.citydata_ppltn")
    private List<People> people;

    @Data
    @NoArgsConstructor
    public static class People {
        @JsonProperty("AREA_NM")
        private String distName;
        @JsonProperty("AREA_CD")
        private String distCode;
        @JsonProperty("AREA_CONGEST_LVL")
        private String distDensity;
        @JsonProperty("PPLTN_TIME")
        private String distUpdated;
        @JsonProperty("FCST_YN")
        private String distReplace;
    }
}
