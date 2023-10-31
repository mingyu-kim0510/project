package com.example.map_test.entity;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import javax.persistence.*;

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

}
