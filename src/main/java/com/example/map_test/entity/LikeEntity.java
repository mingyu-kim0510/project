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

    @ManyToOne
    @JoinColumn(name = "user_idx")
    private UserEntity userEntity;

    @ManyToOne
    @JoinColumn(name = "store_idx")
    private StoreEntity storeEntity;

    public static LikeEntity toSaveLike(StoreEntity storeEntity , UserEntity entity) {
        LikeEntity temp = new LikeEntity();
        temp.setStoreEntity(storeEntity);
        temp.setUserEntity(entity);
        return temp;
    }
}
