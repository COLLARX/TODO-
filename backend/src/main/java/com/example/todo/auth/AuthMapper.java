package com.example.todo.auth;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AuthMapper {

    User findByUsername(String username);

    int insertUser(User user);
}
