package com.dev.product_web.service.impl;

import com.dev.product_web.dto.product.ProductResponse;
import com.dev.product_web.repository.ProductRepository;
import com.dev.product_web.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    private final ModelMapper modelMapper;

    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(p -> modelMapper.map(p, ProductResponse.class))
                .toList();
    }
}
