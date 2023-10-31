package com.example.map_test.entity;


import com.example.map_test.dto.UserDto;
import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="user_table")
public class UserEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userIdx;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "user_pw")
    private String userPw;

    public UserDto toUserDto () {
        return UserDto.builder()
                .userIdx(userIdx)
                .userId(userId)
                .userPw(userPw)
                .build();
    }

}
