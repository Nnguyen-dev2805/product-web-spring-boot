package com.dev.product_web.service;

import com.dev.product_web.dto.product.ProductResponse;

import java.util.List;

public interface ProductService {
    List<ProductResponse> getAllProducts();
}
