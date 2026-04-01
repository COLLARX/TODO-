package com.example.todo.auth;

public interface AuthService {

    void register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
}
