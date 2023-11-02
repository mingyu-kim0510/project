package com.example.map_test.entity;

import com.example.map_test.dto.favReqDto;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.User;

import javax.persistence.*;
import java.util.Set;

@Data
@Slf4j
@Entity
@Table(name="like_table")
public class LikeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="like_idx")
    private Long likeIdx;

    @Column(name = "like_num", nullable = false)
    private Long likeNum;

    @ManyToOne
    @JoinColumn(name = "user_idx")
    private UserEntity userEntity;

    public static LikeEntity toSaveLike(favReqDto dto , UserEntity entity) {
        LikeEntity likeEntity = new LikeEntity();
        likeEntity.setLikeNum(dto.getStoreNum());
        likeEntity.setUserEntity(entity);
        return likeEntity;
    }
}
