package org.workspace.nas_backend.repository;

import org.workspace.nas_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
     User findByUsername(String username);
     User findByEmail(String email);
}
