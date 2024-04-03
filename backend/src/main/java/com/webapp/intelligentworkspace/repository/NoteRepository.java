package com.webapp.intelligentworkspace.repository;

import com.webapp.intelligentworkspace.model.entity.Note;
import com.webapp.intelligentworkspace.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findAllByUser(User user);

    Optional<Note> findById(Long id);

}
