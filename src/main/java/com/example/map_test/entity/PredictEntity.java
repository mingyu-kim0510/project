package com.example.map_test.entity;

import com.example.map_test.dto.DistrictResDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="district_predict")
public class PredictEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "predict_idx")
    private Long predictIdx;

    @Column(name ="pred_time")
    private String predictTime;

    @Column(name = "pred_congestion")
    private String predictCongestion;

    @ManyToOne
    @JoinColumn(name = "dist_idx")
    private DistrictEntity districtEntity;

    public DistrictResDto todistrictResDto (String predictName, int storeCount) {
        return DistrictResDto.builder()
                .districtName(predictName)
                .predictCongestion(predictCongestion)
                .predictTime(predictTime)
                .storeCount(storeCount)
                .build();
    }
}
