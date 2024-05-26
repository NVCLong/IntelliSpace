package com.webapp.intelligentworkspace.repository;

import com.webapp.intelligentworkspace.model.entity.ChatRoom;
import com.webapp.intelligentworkspace.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    ChatRoom findByRoomId(String roomId);
    Optional<ChatRoom> findByUser(User user);

}
