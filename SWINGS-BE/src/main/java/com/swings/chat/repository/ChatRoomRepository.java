package com.swings.chat.repository;

import com.swings.chat.entity.ChatRoomEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoomEntity, Long> {

    // ✅ 3. 특정 유저가 속한 채팅방 조회 쿼리
    @Query("SELECT c FROM ChatRoomEntity c WHERE c.user1 = :userId OR c.user2 = :userId")
    List<ChatRoomEntity> findByUserId(@Param("userId") String userId);

    List<ChatRoomEntity> findByUser1OrUser2(String user1, String user2);

    // 기존 코드 (채팅방 찾기)
    Optional<ChatRoomEntity> findByUser1AndUser2(String user1, String user2);
}
