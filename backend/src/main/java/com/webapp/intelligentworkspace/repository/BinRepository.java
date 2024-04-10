package com.webapp.intelligentworkspace.repository;

import com.webapp.intelligentworkspace.model.entity.Bin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Optional;


@Repository
public interface BinRepository extends JpaRepository<Bin,Long> {

    Optional<Bin> findById(Long id);

}
