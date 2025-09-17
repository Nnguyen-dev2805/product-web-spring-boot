package com.dev.product_web.service.impl;

import com.dev.product_web.entity.Category;
import com.dev.product_web.repository.CategoryRepository;
import com.dev.product_web.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}
