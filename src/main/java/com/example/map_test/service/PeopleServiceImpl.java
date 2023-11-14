package com.example.map_test.service;

import com.example.map_test.apis.PeopleApi;
import com.example.map_test.dto.DistrictColorResDto;
import com.example.map_test.entity.DistrictEntity;
import com.example.map_test.entity.PredictEntity;
import com.example.map_test.repository.PeopleRepository;
import com.example.map_test.repository.PredictRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class PeopleServiceImpl implements PeopleService{

    private final PeopleApi peopleApi;
    private final PeopleRepository peopleRepository;
    private final PredictRepository predictRepository;

    // 10분마다 함수 실행해서 업데이트
    // 소요 약 2초
    @Scheduled(fixedRate = 600000, initialDelay = 3000)
    @Override
    public void updatePeopleCongestion() {

        // 장소 id 리스트
        List<String> testList = new ArrayList<>();
        for(int i = 1; i < 10; i++) {
            testList.add("POI00" + i);
        }
        for(int i = 10; i < 100; i++) {
            testList.add("POI0" + i);
        }
        for(int i = 100; i < 114; i++) {
            testList.add("POI" + i);
        }
        predictRepository.deleteAllInBatch();
        // API 병렬 Request -> dto -> entity로 Update
        testList.parallelStream().forEach(item -> {
            // dto
            var dto = peopleApi.searchPeople(item);

            // 지역 코드로 selectOne
            var entity = peopleRepository.findByDistCode(dto.getPeople().get(0).getDistCode()).get();
            List<PredictEntity> predictEntityList = new ArrayList<>();
            PredictEntity predictEntity = new PredictEntity();

            for(var i = 0; i < 4; i++) {
                predictEntityList.add(new PredictEntity());
            }
            // dto -> entity
            entity.setDistDensity(dto.getPeople().get(0).getDistDensity());
            entity.setDistUpdated(dto.getPeople().get(0).getDistUpdated());
            if(dto.getPeople().get(0).getPeoplePredicts() != null) {
                for(var i =0; i < predictEntityList.size(); i++) {
                    predictEntityList.get(i).setDistrictEntity(entity);
                    predictEntityList.get(i).setPredictCongestion(dto.getPeople().get(0).getPeoplePredicts().get(i).getPredictCongestion());
                    predictEntityList.get(i).setPredictTime(dto.getPeople().get(0).getPeoplePredicts().get(i).getPredictTime());
                    predictRepository.save(predictEntityList.get(i));
                }
            }
            // update 쿼리 실행
            peopleRepository.save(entity);

        });
        System.out.println("forEach end...");

    }

    @Override
    public List<DistrictColorResDto> getColor() {
        List<DistrictEntity> temp = peopleRepository.findAll();
        List<DistrictColorResDto> colorList = new ArrayList<>();
        temp.forEach(item -> {
            colorList.add(item.toColorDto());
        });
        return colorList;
    }
}
