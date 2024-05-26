package com.webapp.intelligentworkspace.controller;

import com.webapp.intelligentworkspace.model.entity.ChatRoom;
import com.webapp.intelligentworkspace.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @GetMapping("/create")
    public ResponseEntity<ChatRoom> createRoom(@RequestParam("userId") Integer userId) {
        ChatRoom newRoom = roomService.createRoom(userId);
        return ResponseEntity.ok(newRoom);
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<ChatRoom> getRoom(@PathVariable String roomId) {
        ChatRoom room = roomService.getRoom(roomId);
        return room != null ? ResponseEntity.ok(room) : ResponseEntity.notFound().build();
    }
}
