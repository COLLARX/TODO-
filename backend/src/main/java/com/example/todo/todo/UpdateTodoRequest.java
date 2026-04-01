package com.example.todo.todo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateTodoRequest(
    @NotBlank(message = "title must not be blank")
    String title,
    String description,
    @NotNull(message = "status must not be null")
    TodoStatus status
) {
}
