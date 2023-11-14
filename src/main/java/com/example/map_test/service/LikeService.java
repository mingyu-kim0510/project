package com.example.map_test.service;


import com.example.map_test.dto.favReqDto;
import com.example.map_test.dto.favResDto;
import com.example.map_test.entity.LikeEntity;

import java.util.List;

public interface LikeService {
    Integer save(favReqDto dto, String user);

    boolean select(favReqDto dto, String user);

    List<favResDto> selectAll(String user);

}
