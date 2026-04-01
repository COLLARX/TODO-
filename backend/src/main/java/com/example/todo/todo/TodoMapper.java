package com.example.todo.todo;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.ResultMap;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface TodoMapper {

    @Select("""
        SELECT id, user_id, title, description, status, created_at, updated_at
        FROM todos
        WHERE user_id = #{userId}
        ORDER BY id
        """)
    @Results(id = "todoResultMap", value = {
        @Result(property = "id", column = "id"),
        @Result(property = "userId", column = "user_id"),
        @Result(property = "title", column = "title"),
        @Result(property = "description", column = "description"),
        @Result(property = "status", column = "status"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "updated_at")
    })
    List<Todo> listByUserId(@Param("userId") Long userId);

    @Insert("""
        INSERT INTO todos (user_id, title, description, status)
        VALUES (#{userId}, #{title}, #{description}, #{status})
        """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Todo todo);

    @Select("""
        SELECT id, user_id, title, description, status, created_at, updated_at
        FROM todos
        WHERE id = #{id} AND user_id = #{userId}
        """)
    @ResultMap("todoResultMap")
    Todo findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);

    @Update("""
        UPDATE todos
        SET title = #{title},
            description = #{description},
            status = #{status},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = #{id} AND user_id = #{userId}
        """)
    int updateByIdAndUserId(Todo todo);

    @Delete("""
        DELETE FROM todos
        WHERE id = #{id} AND user_id = #{userId}
        """)
    int deleteByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);
}
