package com.example.map_test.entity;


import com.example.map_test.dto.StoreResDto;
import com.example.map_test.dto.UserDto;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@Entity
@Table(name="store_table")
public class StoreEntity {

    @Id
    @Column(name = "store_idx")
    private Long storeIdx;

    @Column(name = "store_name")
    private String storeName;

    @Column(name = "store_url")
    private String storeUrl;

    @Column(name = "store_addr")
    private String storeAddr;

    @Column(name = "store_new_addr")
    private String storeNewAddr;

    @Column(name = "store_tel")
    private String storeTel;

    @Column(name = "store_web", nullable = true)
    private String storeWeb;

    @Column(name = "store_oper")
    private String storeOper;

    @Column(name = "store_station")
    private String storeStation;

    @Column(name = "store_menu")
    private String storeMenu;

    @Column(name= "store_lat")
    private String storeLat;

    @Column(name = "store_lon")
    private String storeLon;

    @Column(name = "CLSS")
    private String CLSS;


    public StoreResDto toStoreResDto () {
        return StoreResDto.builder()
                .storeIdx(storeIdx)
                .storeName(storeName)
                .storeNewAddr(storeNewAddr)
                .storeUrl(storeUrl)
                .storeLat(storeLat)
                .storeLon(storeLon)
                .build();
    }
}
