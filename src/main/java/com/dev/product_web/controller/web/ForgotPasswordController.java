package com.dev.product_web.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ForgotPasswordController {
    @GetMapping("/forgot-password")
    public String registerUser(){
        return "web/forgot-password";
    }
}
