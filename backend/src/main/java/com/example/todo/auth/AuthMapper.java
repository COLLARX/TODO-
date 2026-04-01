package com.example.todo.auth;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface AuthMapper {

    @Select("""
        SELECT id, username, password_hash, created_at, updated_at
        FROM users
        WHERE username = #{username}
        """)
    @Results(id = "userResultMap", value = {
        @Result(property = "id", column = "id"),
        @Result(property = "username", column = "username"),
        @Result(property = "passwordHash", column = "password_hash"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "updated_at")
    })
    User findByUsername(@Param("username") String username);

    @Insert("""
        INSERT INTO users (username, password_hash)
        VALUES (#{username}, #{passwordHash})
        """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertUser(User user);
}
