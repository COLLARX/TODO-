package com.example.todo.todo;

import com.example.todo.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import java.util.List;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase
class TodoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jdbcTemplate.update("DELETE FROM todos");
        jdbcTemplate.update("DELETE FROM users");
    }

    @Test
    void list_returns_only_current_user_todos() throws Exception {
        insertUser(1L, "alice");
        insertUser(2L, "bob");
        insertTodo(101L, 1L, "mine");
        insertTodo(102L, 2L, "not-mine");

        mockMvc.perform(get("/api/todos")
                .with(user(1L)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.code").value(0))
            .andExpect(jsonPath("$.data.length()").value(1))
            .andExpect(jsonPath("$.data[0].title").value("mine"));
    }

    @Test
    void create_attaches_current_user_id() throws Exception {
        insertUser(1L, "alice");

        mockMvc.perform(post("/api/todos")
                .with(user(1L))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "title": "write tests",
                          "description": "follow red green"
                        }
                        """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.code").value(0));

        Integer ownerId = jdbcTemplate.queryForObject(
            "SELECT user_id FROM todos WHERE title = ?",
            Integer.class,
            "write tests"
        );

        org.junit.jupiter.api.Assertions.assertEquals(1, ownerId);
    }

    @Test
    void update_other_users_todo_returns_404() throws Exception {
        insertUser(1L, "alice");
        insertUser(2L, "bob");
        insertTodo(200L, 2L, "not-mine");

        mockMvc.perform(put("/api/todos/200")
                .with(user(1L))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "title": "updated",
                          "description": "still not mine",
                          "status": "DONE"
                        }
                        """))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.code").value(404));
    }

    @Test
    void delete_other_users_todo_returns_404() throws Exception {
        insertUser(1L, "alice");
        insertUser(2L, "bob");
        insertTodo(300L, 2L, "not-mine");

        mockMvc.perform(delete("/api/todos/300")
                .with(user(1L))
                .with(csrf()))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.code").value(404));
    }

    @Test
    void list_with_valid_bearer_token_returns_200() throws Exception {
        insertUser(1L, "alice");
        insertTodo(400L, 1L, "mine");
        String token = jwtService.issue(1L, "alice");

        mockMvc.perform(get("/api/todos")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.code").value(0))
            .andExpect(jsonPath("$.data.length()").value(1));
    }

    @Test
    void list_without_auth_keeps_frame_protection_enabled() throws Exception {
        mockMvc.perform(get("/api/todos"))
            .andExpect(status().isUnauthorized())
            .andExpect(header().exists("X-Frame-Options"));
    }

    @Test
    void h2_console_is_not_publicly_available_by_default() throws Exception {
        mockMvc.perform(get("/h2-console"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void update_returns_400_when_status_enum_is_invalid() throws Exception {
        insertUser(1L, "alice");
        insertTodo(500L, 1L, "mine");

        mockMvc.perform(put("/api/todos/500")
                .with(user(1L))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "title": "updated",
                          "description": "still mine",
                          "status": "INVALID"
                        }
                        """))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value(400));
    }

    private RequestPostProcessor user(Long userId) {
        return authentication(new UsernamePasswordAuthenticationToken(userId, null, List.of()));
    }

    private void insertUser(Long id, String username) {
        jdbcTemplate.update(
            "INSERT INTO users(id, username, password_hash) VALUES (?, ?, ?)",
            id,
            username,
            "$2a$10$M4k4qfW2NC7ZQwQ0jrIS6.8mLXQnYw9jYv6Kp0ZgHgdGXN53BJ38K"
        );
    }

    private void insertTodo(Long id, Long userId, String title) {
        jdbcTemplate.update(
            "INSERT INTO todos(id, user_id, title, description, status) VALUES (?, ?, ?, ?, ?)",
            id,
            userId,
            title,
            title + " description",
            "TODO"
        );
    }
}

