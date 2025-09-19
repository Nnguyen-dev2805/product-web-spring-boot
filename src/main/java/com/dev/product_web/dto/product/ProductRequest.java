package com.dev.product_web.dto.product;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {
    private String name;
    private Double price;
    private Integer quantity;
    private Integer categoryId;
    private Integer userId;
}
