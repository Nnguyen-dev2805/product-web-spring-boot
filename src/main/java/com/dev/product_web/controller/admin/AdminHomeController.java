package com.dev.product_web.controller.admin;

import com.dev.product_web.entity.User;
import com.dev.product_web.utils.Constant;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin")
public class AdminHomeController {
    @GetMapping
    public String adminHome(RedirectAttributes redirectAttributes, HttpSession session, Model model) {
        User u = (User) session.getAttribute(Constant.SESSION_USER);
        if(u == null) {
            return "redirect:/login";
        }
//        redirectAttributes.addFlashAttribute("user", u);
        return "admin/index";
    }

    @GetMapping("/profile")
    public String profile(HttpSession session, Model model) {
        User user = (User) session.getAttribute(Constant.SESSION_USER);
        if (user == null) {
            return "redirect:/login";
        }
        model.addAttribute("user", user);
        return "web/profile";
    }
}
