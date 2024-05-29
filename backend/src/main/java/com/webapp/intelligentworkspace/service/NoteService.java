package com.webapp.intelligentworkspace.service;

import com.webapp.intelligentworkspace.model.entity.Note;
import com.webapp.intelligentworkspace.model.entity.User;
import com.webapp.intelligentworkspace.repository.NoteRepository;
import com.webapp.intelligentworkspace.repository.UserRepository;
import org.aspectj.weaver.ast.Not;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class NoteService {
    @Autowired
    private final NoteRepository noteRepository;

    private final UserRepository userRepository;

    private final OpenAIService openAIService;

    public NoteService(NoteRepository noteRepository, UserRepository userRepository,OpenAIService openAIService) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
        this.openAIService= openAIService;
    }

    public List<Note>  getALlNotesByUserId(Integer userId){
        User user= userRepository.findUserById(userId).orElse(null);
        if(user== null){
            return  null;
        }else {
            List<Note> results= noteRepository.findAllByUser(user);
            if(results.isEmpty()){
                System.out.println("User o not have any note");
                return results;
            }else{
                System.out.println("User has notes");
                return results;
            }
        }
    }

    public Note getNoteById(Long noteId){
        Note note= noteRepository.findById(noteId).orElse(null);
        if(note== null){
            System.out.println("Do not find this note");
            return null;
        }else {
            System.out.println("Find this note");
            return note;
        }
    }

    public Note createNote(Integer userId, Note request){
        User user= userRepository.findUserById(userId).orElse(null);
        if( user== null){
            // case do not find user
            return null;
        }else{
            Note note= Note.builder()
//                    .title(request.getTitle())
                    .status(false)
                    .content(request.getContent())
                    .user(user)
                    .build();

            noteRepository.save(note);
            return note;
        }
    }

    public Note updateStatus(Long noteId){
        Note note= noteRepository.findById(noteId).orElse(null);
        if(note== null){
            return null;
        }else {
            note.setStatus(!note.isStatus());
            noteRepository.save(note);
            return note;
        }
    }

    public Note updateNote(Long noteId, Note updatedNote){
        Note note= noteRepository.findById(noteId).orElse(null);
        if( note== null){
            // case do not find note
            return null;
        }else{
            System.out.println(updatedNote.getTitle());
            System.out.println(updatedNote.getContent()=="");
            if(!Objects.equals(updatedNote.getContent(), "")) {
                System.out.println("Have content");
                note.setContent(updatedNote.getContent());
            }
            if(!Objects.equals(updatedNote.getTitle(),"")){
                System.out.println("Have tittle ");
                note.setTitle(updatedNote.getTitle());
            }
            return noteRepository.save(note);
        }
    }

    public void deleteNote(Long noteId){
        noteRepository.deleteById(noteId);
    }

    public Note sumarizeNote(Long noteId){
        Note note= noteRepository.findById(noteId).orElse(null);
        if( note == null){
            return null;
        }
        //
        String content=openAIService.summarizeNote(note.getContent());
        System.out.println(content);
        note.setContent(content);
        noteRepository.save(note);
        return  note;
    }


}
