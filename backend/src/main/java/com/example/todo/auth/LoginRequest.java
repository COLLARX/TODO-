package com.example.todo.auth;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
    @NotBlank(message = "username must not be blank")
    String username,
    @NotBlank(message = "password must not be blank")
    String password
) {
}
