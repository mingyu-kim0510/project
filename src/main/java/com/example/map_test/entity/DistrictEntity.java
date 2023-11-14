package com.example.map_test.entity;

import com.example.map_test.dto.DistrictColorResDto;
import com.example.map_test.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="district_table")
public class DistrictEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dist_idx")
    private Long distIdx;

    @Column(name ="dist_code")
    private String distCode;

    @Column(name = "dist_name")
    private String distName;

    @Column(name = "dist_category")
    private String distCategory;

    @Column(name = "dist_density")
    private String distDensity;

    @Column(name = "dist_updated")
    private String distUpdated;

    @Builder.Default
    @OneToMany(mappedBy = "districtEntity", fetch = FetchType.LAZY)
    private List<StoreEntity> storeEntityList = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "districtEntity", fetch = FetchType.LAZY)
    private List<PredictEntity> predictEntityList = new ArrayList<>();

    public DistrictColorResDto toColorDto () {
        return DistrictColorResDto.builder()
                .color(distDensity)
                .build();
    }
}
