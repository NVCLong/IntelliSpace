package com.webapp.intelligentworkspace.repository;

import com.webapp.intelligentworkspace.model.entity.Storage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StorageRepository extends JpaRepository<Storage, Long> {

    Optional<Storage> findById(Long id);
}
