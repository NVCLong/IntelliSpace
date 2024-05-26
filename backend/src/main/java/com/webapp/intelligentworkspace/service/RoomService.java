package com.webapp.intelligentworkspace.service;

import com.webapp.intelligentworkspace.model.entity.ChatRoom;
import com.webapp.intelligentworkspace.model.entity.User;
import com.webapp.intelligentworkspace.repository.ChatRoomRepository;
import com.webapp.intelligentworkspace.repository.UserRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class RoomService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;
    @Autowired
    private UserRepository userRepository;

    public ChatRoom createRoom(Integer userId) {
        User user= userRepository.findUserById(userId).orElse(null);
        if(user==null){
            return  null;
        }

        ChatRoom room = chatRoomRepository.findByUser(user).orElse(null);
        if(room==null) {
            room= new ChatRoom();
            room.setRoomId(UUID.randomUUID().toString());
            room.setUser(user);
            return chatRoomRepository.save(room);
        }else {
            room.setRoomId(UUID.randomUUID().toString());
            return chatRoomRepository.save(room);
        }
    }

//    public List<ChatRoom> getRoomsByUserId(String userId) {
//        return chatRoomRepository.findByUserId(userId);
//    }

    public ChatRoom getRoom(String roomId) {
        return chatRoomRepository.findByRoomId(roomId);
    }
}
