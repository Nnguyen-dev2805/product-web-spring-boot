package com.dev.product_web.service;

import com.dev.product_web.dto.category.CategoryResponse;
import com.dev.product_web.entity.Category;
import org.springframework.data.domain.Page;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getAllCategories();

    Category saveCategory(Category category);

    Category getCategoryById(Integer id);

    CategoryResponse updateCategory(Integer id, Category updatedCategory);

    void deleteCategory(Integer id);

    List<CategoryResponse> findByNameContainingIgnoreCase(String name);

}
