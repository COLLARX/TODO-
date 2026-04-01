package com.example.todo.todo;

import java.util.List;

public interface TodoService {

    List<TodoDto> list(Long userId);

    TodoDto create(Long userId, CreateTodoRequest request);

    TodoDto update(Long userId, Long id, UpdateTodoRequest request);

    void delete(Long userId, Long id);
}
