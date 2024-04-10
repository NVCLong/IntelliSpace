package com.webapp.intelligentworkspace.repository;

import com.webapp.intelligentworkspace.model.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

public interface FileRepository extends JpaRepository<File, Long> {
    Optional<File> findByUserIdAndParentFolderIsNull(Long id);
}
