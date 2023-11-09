package com.example.map_test.service;

import com.example.map_test.dto.UserDto;
import com.example.map_test.entity.UserEntity;
import com.example.map_test.repository.UserRepository;
import com.example.map_test.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;


    @Override
    public UserDto login(UserDto dto) {
        Optional<UserEntity> temp = userRepository.findByUserId(dto.getUserId());
        if(temp.isPresent()){
            UserEntity entity = temp.get();
            if(entity.getUserPw().equals(dto.getUserPw())) {
                return UserDto.toUserDto(entity);
            }
            return null;
        } else {
            return null;
        }
    }

    @Override
    public String register(UserDto dto){
        if (userRepository.findByUserId(dto.getUserId()).isPresent()) {
            return null;
        }
        return userRepository.save(dtoToEntity(dto)).getUserId();
    }

    @Override
    public void modify(String originalName, UserDto dto) {
        var temp = userRepository.findByUserId(dto.getUserId());
        if (temp.isPresent()) {
            temp.get().setUserId(dto.getUserId());
        }
    }
}
