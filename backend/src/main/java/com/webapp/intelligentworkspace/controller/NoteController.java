package com.webapp.intelligentworkspace.controller;

import com.webapp.intelligentworkspace.model.entity.Note;
import com.webapp.intelligentworkspace.service.NoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/note")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }


    @PostMapping(value="/create/{userId}", consumes = "application/json", produces = "application/json")
    @ResponseBody
    public ResponseEntity<Note> createNote(@PathVariable("userId") Integer userId, @RequestBody Note note){
        System.out.println("Create note");
        return ResponseEntity.ok(noteService.createNote(userId,note));
    }


}
