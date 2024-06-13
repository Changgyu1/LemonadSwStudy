package lm.swith.user.controller;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.List;

import javax.imageio.ImageIO;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import lm.swith.main.model.Likes;
import lm.swith.main.model.StudyApplication;
import lm.swith.user.Service.MailService;
import lm.swith.user.Service.UserService;
import lm.swith.user.model.SwithDTO;
import lm.swith.user.model.SwithUser;
import lm.swith.user.token.TokenProvider;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/users")
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:8080")
@CrossOrigin(origins = "http://lemonadswith.store:8080")
public class RegisterController {
    private final UserService userService;
    private final JavaMailSender javaMailSender;
    private final TokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/info/{user_no}")
    public ResponseEntity<?> findByUserNo(@PathVariable Long user_no) {
        SwithUser user = userService.findByUserNo(user_no);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticate(@RequestBody SwithUser swithUser) {
        SwithUser user = userService.getByCredentials(swithUser.getEmail(), swithUser.getPassword(), passwordEncoder);
        if (user != null) {
            if ("FALSE".equals(user.getSignout())) {
                final String token = tokenProvider.createAccessToken(user);
                final SwithDTO responseUserDTO = SwithDTO.builder()
                        .email(user.getEmail())
                        .user_no(user.getUser_no())
                        .username(user.getUsername())
                        .useraddress(user.getUseraddress())
                        .nickname(user.getNickname())
                        .token(token)
                        .build();
                return ResponseEntity.ok(responseUserDTO);
            } else if ("TRUE".equals(user.getSignout())) {
                return ResponseEntity.ok("Withdrawal");
            }
        } else {
            return ResponseEntity.ok("Error");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("UnknownError");
    }

    @GetMapping("/userinfo")
    public ResponseEntity<?> getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            SwithUser user = userService.getAuthenticatedUser(authentication.getName());
            if (user != null) {
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/mail")
    public ResponseEntity<String> MailSend(@RequestBody SwithUser swithUser) {
        SwithUser user = userService.getUserByEmail(swithUser.getEmail());
        if (user != null) {
            return ResponseEntity.ok("exists");
        } else {
            int number = userService.sendVerificationMail(swithUser.getEmail());
            return ResponseEntity.ok(String.valueOf(number));
        }
    }

    @PostMapping("/findPassword")
    public ResponseEntity<String> findPassword(@RequestBody SwithUser swithUser) {
        int number = userService.sendVerificationMail(swithUser.getEmail());
        return ResponseEntity.ok(String.valueOf(number));
    }

    @PostMapping("/ExistEmail")
    public ResponseEntity<String> checkEmail(@RequestBody SwithUser swithUser) {
        SwithUser user = userService.getUserByEmail(swithUser.getEmail());
        if (user != null) {
            return ResponseEntity.ok("existsEmail");
        } else {
            return ResponseEntity.ok("none");
        }
    }

    @PostMapping("/nickname")
    public ResponseEntity<String> checkNickname(@RequestBody SwithUser swithUser) {
        SwithUser user = userService.getUserByNickname(swithUser.getNickname());
        if (user != null) {
            return ResponseEntity.ok("existsNick");
        } else {
            return ResponseEntity.ok("new");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<SwithUser> registerUser(@RequestBody SwithUser swithUser) throws IOException {
        SwithUser createdUser = userService.registerUser(swithUser);
        return ResponseEntity.ok(createdUser);
    }

    @PostMapping("/updateUserProfile")
    public ResponseEntity<String> updateUserProfile(@RequestBody SwithUser swithUser) throws IOException {
        userService.updateUserProfile(swithUser);
        return ResponseEntity.ok("User updated successfully");
    }

    @PostMapping("/updateUser")
    public ResponseEntity<String> updateUser(@RequestBody SwithUser swithUser) {
        userService.updateUser(swithUser);
        return ResponseEntity.ok("User updated successfully");
    }

    @PostMapping("/updatePassword")
    public ResponseEntity<String> updatePassword(@RequestBody SwithUser swithUser) {
        userService.updatePassword(swithUser);
        return ResponseEntity.ok("User's password updated successfully");
    }

    @PostMapping("/deleteUser")
    public ResponseEntity<String> deleteUser(@RequestBody SwithUser swithUser) {
        userService.deleteUser(swithUser);
        return ResponseEntity.ok("Delete User hold");
    }

    @PostMapping("/deleteLikes")
    public ResponseEntity<?> deleteUserLikes(@RequestBody Likes likes) {
        userService.deleteUserLikes(likes);
        return ResponseEntity.ok("Delete User's Like");
    }

    @PostMapping("/deleteApplication")
    public ResponseEntity<String> deleteUserApplication(@RequestBody StudyApplication studyApplication) {
        userService.deleteUserApplication(studyApplication);
        return ResponseEntity.ok("Delete User's StudyPost Application");
    }

    @GetMapping("/selectDeleteUser")
    public ResponseEntity<List<SwithUser>> selectDeleteUserList() {
        List<SwithUser> users = userService.selectDeleteUserList();
        if (!users.isEmpty()) {
            return ResponseEntity.ok(users);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @PostMapping("deleteAdmin/{user_no}")
    public ResponseEntity<String> deleteAdmin(@PathVariable Long user_no, @RequestBody SwithUser swithUser) {
        swithUser.setUser_no(user_no);
        userService.deleteAdmin(swithUser);
        return ResponseEntity.ok("Delete User");
    }
}
