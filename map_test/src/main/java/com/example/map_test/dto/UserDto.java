package com.example.map_test.dto;


import com.example.map_test.entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long userIdx;
    private String userId;
    private String userPw;

    public static UserDto toUserDto (UserEntity entity){
        return UserDto.builder()
                .userIdx(entity.getUserIdx())
                .userId(entity.getUserId())
                .userPw(entity.getUserPw())
                .build();
    }
}
