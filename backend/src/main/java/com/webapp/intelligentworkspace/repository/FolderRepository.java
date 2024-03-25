package com.webapp.intelligentworkspace.repository;

import com.webapp.intelligentworkspace.model.entity.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FolderRepository extends JpaRepository<Folder,Long> {
    Optional<Folder> findById(Long id);

    Optional<Folder> findByName(String name);

    List<Folder> findAllByParentFolderId(Long id);

    @Query(value="""
select f from Folder f 
join Storage s on s.id=f.storage.id
where f.storage.id = :storage_id and f.parentFolder is null
""")
    List<Folder> findAllRootFolderById(Long storage_id);

    Folder findByParentFolder(Folder parentFolder);
}
