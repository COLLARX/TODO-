package com.example.todo.todo;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TodoServiceImpl implements TodoService {

    private final TodoMapper todoMapper;

    public TodoServiceImpl(TodoMapper todoMapper) {
        this.todoMapper = todoMapper;
    }

    @Override
    public List<TodoDto> list(Long userId) {
        return todoMapper.listByUserId(userId).stream()
            .map(this::toDto)
            .toList();
    }

    @Override
    public TodoDto create(Long userId, CreateTodoRequest request) {
        Todo todo = new Todo();
        todo.setUserId(userId);
        todo.setTitle(request.title().trim());
        todo.setDescription(request.description());
        todo.setStatus(TodoStatus.TODO);
        todoMapper.insert(todo);
        return toDto(todoMapper.findByIdAndUserId(todo.getId(), userId));
    }

    @Override
    public TodoDto update(Long userId, Long id, UpdateTodoRequest request) {
        Todo todo = new Todo();
        todo.setId(id);
        todo.setUserId(userId);
        todo.setTitle(request.title().trim());
        todo.setDescription(request.description());
        todo.setStatus(request.status());
        if (todoMapper.updateByIdAndUserId(todo) == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "todo not found");
        }
        return toDto(todoMapper.findByIdAndUserId(id, userId));
    }

    @Override
    public void delete(Long userId, Long id) {
        if (todoMapper.deleteByIdAndUserId(id, userId) == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "todo not found");
        }
    }

    private TodoDto toDto(Todo todo) {
        return new TodoDto(todo.getId(), todo.getTitle(), todo.getDescription(), todo.getStatus());
    }
}
