package com.sportshop.service;

import com.sportshop.dto.BrandDto;
import com.sportshop.entity.Brand;
import com.sportshop.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandService {

    private final BrandRepository brandRepository;

    public List<BrandDto> findAll() {
        return brandRepository.findAll().stream()
                .sorted(Comparator.comparing(Brand::getName, String.CASE_INSENSITIVE_ORDER))
                .map(this::toDto)
                .toList();
    }

    public BrandDto create(BrandDto dto) {
        validateName(dto.getName());
        Brand brand = brandRepository.findByNameIgnoreCase(dto.getName().trim()).orElseGet(Brand::new);
        brand.setName(dto.getName().trim());
        return toDto(brandRepository.save(brand));
    }

    public BrandDto update(Long id, BrandDto dto) {
        validateName(dto.getName());
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found: " + id));
        brand.setName(dto.getName().trim());
        return toDto(brandRepository.save(brand));
    }

    public void delete(Long id) {
        brandRepository.deleteById(id);
    }

    public Brand getOrCreate(String name) {
        validateName(name);
        return brandRepository.findByNameIgnoreCase(name.trim()).orElseGet(() -> {
            Brand brand = new Brand();
            brand.setName(name.trim());
            return brandRepository.save(brand);
        });
    }

    private void validateName(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Brand name is required");
        }
    }

    private BrandDto toDto(Brand brand) {
        BrandDto dto = new BrandDto();
        dto.setId(brand.getId());
        dto.setName(brand.getName());
        return dto;
    }
}
