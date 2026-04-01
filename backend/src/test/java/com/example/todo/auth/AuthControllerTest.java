package com.example.todo.auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@AutoConfigureTestDatabase
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @BeforeEach
    void setUp() {
        jdbcTemplate.update("DELETE FROM todos");
        jdbcTemplate.update("DELETE FROM users");
    }

    @Test
    void register_returns_200_when_valid_payload() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "username": "alice",
                          "password": "secret123"
                        }
                        """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.code").value(0))
            .andExpect(jsonPath("$.message").value("ok"))
            .andExpect(jsonPath("$.data").doesNotExist());
    }

    @Test
    void register_returns_400_when_username_blank() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "username": " ",
                          "password": "secret123"
                        }
                        """))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value(400));
    }

    @Test
    void login_returns_jwt_when_credentials_valid() throws Exception {
        jdbcTemplate.update(
            "INSERT INTO users(username, password_hash) VALUES (?, ?)",
            "alice",
            passwordEncoder.encode("secret123")
        );

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "username": "alice",
                          "password": "secret123"
                        }
                        """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.code").value(0))
            .andExpect(jsonPath("$.message").value("ok"))
            .andExpect(jsonPath("$.data.token").isString());
    }

    @Test
    void login_returns_401_when_password_invalid() throws Exception {
        jdbcTemplate.update(
            "INSERT INTO users(username, password_hash) VALUES (?, ?)",
            "alice",
            passwordEncoder.encode("secret123")
        );

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "username": "alice",
                          "password": "wrong-password"
                        }
                        """))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.code").value(401));
    }

    @Test
    void register_returns_409_when_username_exists() throws Exception {
        jdbcTemplate.update(
            "INSERT INTO users(username, password_hash) VALUES (?, ?)",
            "alice",
            passwordEncoder.encode("secret123")
        );

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "username": "alice",
                          "password": "secret123"
                        }
                        """))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.code").value(409));
    }
}

