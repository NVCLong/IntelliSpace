package com.webapp.intelligentworkspace.controller;

import com.webapp.intelligentworkspace.model.entity.Note;
import com.webapp.intelligentworkspace.service.NoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping(value = "/{userId}", consumes = "application/json", produces = "application/json")
    @ResponseBody
    public ResponseEntity<List<Note>> getALlNote(@PathVariable("userId") Integer userId){
        System.out.println("Getting All notes");
        return ResponseEntity.ok(noteService.getALlNotesByUserId(userId));
    }

    @GetMapping("/getNote/{noteId}")
    @ResponseBody
    public ResponseEntity<Note> getNote(@PathVariable("noteId") Long noteId){
        System.out.println("Get specific note");
        return ResponseEntity.ok(noteService.getNoteById(noteId));
    }

    @PatchMapping(value="/update/{noteId}",consumes = "application/json", produces = "application/json" )
    @ResponseBody
    public ResponseEntity<Note> updateNote(@PathVariable("noteId") Long noteId, @RequestBody Note updatedNote){
        System.out.println("Update Note");
        return ResponseEntity.ok(noteService.updateNote(noteId,updatedNote));
    }


    @DeleteMapping(value="/delete/{noteId}")
    @ResponseBody
    public ResponseEntity<String> deleteNote(@PathVariable("noteId") Long noteId){
        noteService.deleteNote(noteId);
        return ResponseEntity.ok("Delete successfully");
    }

    @GetMapping(value="/sumarize/{noteId}")
    @ResponseBody
    public ResponseEntity<Note> sumarizeNote(@PathVariable("noteId") Long noteId){
        System.out.println("sumarize note");
        return ResponseEntity.ok(noteService.sumarizeNote(noteId));
    }


}
