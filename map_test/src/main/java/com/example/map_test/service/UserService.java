package com.example.map_test.service;

import com.example.map_test.dto.UserDto;
import com.example.map_test.entity.UserEntity;
import com.example.map_test.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import java.util.List;
import java.util.Optional;

public interface UserService {

    UserDto login(UserDto dto);

   void register(UserDto dto);

    default UserEntity dtoToEntity(UserDto dto){
        UserEntity entity = UserEntity.builder()
                .userIdx(dto.getUserIdx())
                .userId(dto.getUserId())
                .userPw(dto.getUserPw())
                .build();
        return entity;
    }


//    UserDto findByUserId(String userId);
    List<UserEntity> findAll();

}
