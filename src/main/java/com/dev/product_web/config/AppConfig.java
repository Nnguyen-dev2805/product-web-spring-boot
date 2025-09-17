package com.dev.product_web.config;

import com.dev.product_web.dto.category.CategoryResponse;
import com.dev.product_web.dto.product.ProductResponse;
import com.dev.product_web.entity.Category;
import com.dev.product_web.entity.Product;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        // -- add thêm rule cho Product
        modelMapper.typeMap(Product.class, ProductResponse.class).addMappings(mapper -> {
            mapper.map(src -> src.getUser().getFullname(), ProductResponse::setUserFullName);
            mapper.map(src -> src.getCategory().getName(), ProductResponse::setCategoryName);
        });
        return modelMapper;
    }
}
