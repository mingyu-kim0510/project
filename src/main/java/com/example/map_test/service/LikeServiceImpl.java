package com.example.map_test.service;

import com.example.map_test.dto.favReqDto;
import com.example.map_test.dto.favResDto;
import com.example.map_test.entity.LikeEntity;
import com.example.map_test.entity.StoreEntity;
import com.example.map_test.entity.UserEntity;
import com.example.map_test.repository.LikeRepository;
import com.example.map_test.repository.StoreRepository;
import com.example.map_test.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class LikeServiceImpl implements LikeService {
    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    @Transactional
    @Override
    public Integer save (favReqDto dto, String user) {
        var entity = userRepository.findByUserId(user);
        var temp = storeRepository.findByStoreNewAddrAndStoreName(dto.getStoreNewAddr(), dto.getStoreName());
        if(entity.isPresent() && temp.isPresent()) {
            var likeEntity = likeRepository.findByStoreEntityAndUserEntity(temp.get(), entity.get());
            if(likeEntity.isPresent()) {
                likeRepository.deleteByStoreEntityAndUserEntity(temp.get(), entity.get());
                return 0;
            } else {
                likeRepository.save(LikeEntity.toSaveLike(temp.get(), entity.get()));
                return 1;
            }
        }
        return null;
    }

    @Transactional
    @Override
    public boolean select (favReqDto dto, String user) {
        var entity = userRepository.findByUserId(user);
        var temp = storeRepository.findByStoreIdx(dto.getStoreIdx());
        if(entity.isPresent() && temp.isPresent()) {
            Optional<LikeEntity> likeEntity = likeRepository.findByStoreEntityAndUserEntity(temp.get(), entity.get());
            return likeEntity.isPresent();
        }
        return false;
    }

    @Transactional
    @Override
    public List<favResDto> selectAll (String user) {
        var entity = userRepository.findByUserId(user);
        if(entity.isPresent()) {
            var likeEntityList = likeRepository.findByUserEntity(entity.get());
            List<favResDto> likeList = new ArrayList<>();
            likeEntityList.forEach(item -> likeList.add(favResDto.toFavDto(item)));
            return likeList;
        }
        return null;
    }
}
