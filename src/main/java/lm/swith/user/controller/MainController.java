package lm.swith.user.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
//@CrossOrigin(origins="http://localhost:3000", allowCredentials = "true")
public class MainController {
	@GetMapping("/as")
	public String showMain() {
		return "check";
	}

}