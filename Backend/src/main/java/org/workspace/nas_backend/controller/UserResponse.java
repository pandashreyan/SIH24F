//package org.workspace.nas_backend.dto;
package org.workspace.nas_backend.controller;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {
    private String username;
    private String email;
}
