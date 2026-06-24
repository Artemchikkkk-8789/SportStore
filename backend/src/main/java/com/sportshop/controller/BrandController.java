package com.sportshop.controller;

import com.sportshop.dto.BrandDto;
import com.sportshop.service.BrandService;
import lombok.RequiredArgsConstructor;
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
@RequestMapping("/brands")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    @GetMapping
    public List<BrandDto> getAll() {
        return brandService.findAll();
    }

    @PostMapping
    public BrandDto create(@RequestBody BrandDto dto) {
        return brandService.create(dto);
    }

    @PutMapping("/{id}")
    public BrandDto update(@PathVariable Long id, @RequestBody BrandDto dto) {
        return brandService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        brandService.delete(id);
    }
}
