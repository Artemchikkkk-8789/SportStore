package com.sportshop.controller;

import com.sportshop.dto.CategoryDto;
import com.sportshop.entity.Category;
import com.sportshop.mapper.CategoryMapper;
import com.sportshop.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final CategoryMapper mapper;

    @GetMapping
    public List<CategoryDto> getAll() {
        return categoryService.findAll().stream()
                .map(mapper::toDTO)   // ← ПРАВИЛЬНО
                .toList();
    }

    @GetMapping("/{id}")
    public CategoryDto getById(@PathVariable Long id) {
        return mapper.toDTO(categoryService.findById(id)); // ← ПРАВИЛЬНО
    }

    @PostMapping
    public CategoryDto create(@RequestBody CategoryDto dto) {
        Category category = mapper.toEntity(dto);
        return mapper.toDTO(categoryService.save(category)); // ← ПРАВИЛЬНО
    }

    @PutMapping("/{id}")
    public CategoryDto update(@PathVariable Long id, @RequestBody CategoryDto dto) {
        Category category = mapper.toEntity(dto);
        category.setId(id);
        return mapper.toDTO(categoryService.save(category));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        categoryService.delete(id);
    }
}
