package com.example.todo.todo;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TodoMapper {

    List<Todo> listByUserId(Long userId);

    int insert(Todo todo);

    Todo findByIdAndUserId(Long id, Long userId);

    int updateByIdAndUserId(Todo todo);

    int deleteByIdAndUserId(Long id, Long userId);
}
