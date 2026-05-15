package org.workspace.nas_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.workspace.nas_backend.model.Response;

public interface ResponseRepository extends JpaRepository<Response, Long> {
}
