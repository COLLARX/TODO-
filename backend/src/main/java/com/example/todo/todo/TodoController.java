package com.example.todo.todo;

import com.example.todo.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping
    public ApiResponse<List<TodoDto>> list(Authentication authentication) {
        return ApiResponse.ok(todoService.list(currentUserId(authentication)));
    }

    @PostMapping
    public ApiResponse<TodoDto> create(Authentication authentication, @Valid @RequestBody CreateTodoRequest request) {
        return ApiResponse.ok(todoService.create(currentUserId(authentication), request));
    }

    @PutMapping("/{id}")
    public ApiResponse<TodoDto> update(Authentication authentication, @PathVariable Long id, @Valid @RequestBody UpdateTodoRequest request) {
        return ApiResponse.ok(todoService.update(currentUserId(authentication), id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(Authentication authentication, @PathVariable Long id) {
        todoService.delete(currentUserId(authentication), id);
        return ApiResponse.ok(null);
    }

    private Long currentUserId(Authentication authentication) {
        return (Long) authentication.getPrincipal();
    }
}
