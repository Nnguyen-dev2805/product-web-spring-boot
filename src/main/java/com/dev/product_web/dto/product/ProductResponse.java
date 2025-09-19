package com.dev.product_web.dto.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private Integer id;
    private String name;
    private Double price;
    private Integer quantity;
    private Integer userId;
    private String userFullName;
    private Integer categoryId;
    private String categoryName;
}
