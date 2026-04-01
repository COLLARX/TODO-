package com.example.todo.todo;

public record TodoDto(Long id, String title, String description, TodoStatus status) {
}
