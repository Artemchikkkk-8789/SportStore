package com.sportshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ProductImagesDto {
    private String mainImage;
    private List<String> galleryImages;
}
