package com.webapp.intelligentworkspace.repository;

import com.webapp.intelligentworkspace.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {
    Optional<User> findUserById(Integer userId);
    Optional<User> findUserByUsername(String username);

    Optional<User> findUserByEmail(String email);

}
