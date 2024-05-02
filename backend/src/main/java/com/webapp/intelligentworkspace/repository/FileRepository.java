package com.webapp.intelligentworkspace.repository;

import com.webapp.intelligentworkspace.model.entity.File;
import com.webapp.intelligentworkspace.model.entity.Folder;
import com.webapp.intelligentworkspace.model.entity.Storage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface FileRepository extends JpaRepository<File, Long> {
//    Optional<File> findByUserIdAndParentFolderIsNull(Long id);

    List<File> findByStorageAndIsDeletedIsTrue(Storage storage);


    List<File> findByFolderAndIsDeletedIsFalse(Folder folder);

    List<File> findByFolder_IdAndIsDeletedIsFalse(Long id);
}
