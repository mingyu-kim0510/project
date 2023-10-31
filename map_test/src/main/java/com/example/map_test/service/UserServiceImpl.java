package com.example.map_test.service;

import com.example.map_test.dto.UserDto;
import com.example.map_test.entity.UserEntity;
import com.example.map_test.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    @Override
    public List<UserEntity> findAll() {
            return userRepository.findAll();
    }

//    @Override
//    public UserDto findByUserId(String userId) {
//        System.out.println("UserServiceImpl userID: " + userId);
//        return userRepository.findByUserId(userId).toUserDto();
//    }


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

    @Override public void register(UserDto dto){
        var tmp = dtoToEntity(dto);
        userRepository.save(tmp);
    }
}
