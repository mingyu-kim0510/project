package com.example.map_test.service;

import com.example.map_test.dto.StoreResDto;
import com.example.map_test.repository.StoreRepository;
import com.example.map_test.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class StoreServiceImpl implements StoreService {

    private final StoreRepository storeRepository;

    @Override
    public List<StoreResDto> findByStoreNameContaining(String storeName) {
        var temp = storeRepository.findByStoreNameContaining(storeName);
        List<StoreResDto> temp2 = new ArrayList<>();
        temp.forEach(item -> {
            temp2.add(item.toStoreResDto());
        });
        return temp2;

    };

}
