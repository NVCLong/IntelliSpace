package com.webapp.intelligentworkspace.service;

import com.webapp.intelligentworkspace.model.entity.ChatRoom;
import com.webapp.intelligentworkspace.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class RoomService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    public ChatRoom createRoom(String userId) {
        ChatRoom room = new ChatRoom();
        room.setRoomId(UUID.randomUUID().toString());
        room.setUserId(userId);
        return chatRoomRepository.save(room);
    }

    public List<ChatRoom> getRoomsByUserId(String userId) {
        return chatRoomRepository.findByUserId(userId);
    }

    public ChatRoom getRoom(String roomId) {
        return chatRoomRepository.findByRoomId(roomId);
    }
}
