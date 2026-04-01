package com.example.todo.todo;

import jakarta.validation.constraints.NotBlank;

public record CreateTodoRequest(
    @NotBlank(message = "title must not be blank")
    String title,
    String description
) {
}
