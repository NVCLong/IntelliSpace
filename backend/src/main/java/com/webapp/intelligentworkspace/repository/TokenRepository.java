package com.webapp.intelligentworkspace.repository;

import com.webapp.intelligentworkspace.model.entity.Token;
import com.webapp.intelligentworkspace.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token,Long> {

    Optional<Token> findByToken(String token);
    Optional<Token> findByUser(User user);
}
