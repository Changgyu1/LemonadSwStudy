package lm.swith.user.Service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.List;

import javax.imageio.ImageIO;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import lm.swith.main.model.Likes;
import lm.swith.main.model.StudyApplication;
import lm.swith.user.mapper.UsersMapper;
import lm.swith.user.model.SwithUser;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UsersMapper usersMapper;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender javaMailSender;

    public SwithUser registerUser(SwithUser swithUser) throws IOException {
        if (swithUser.getImg() != null && !swithUser.getImg().isEmpty()) {
            String imageData = swithUser.getImg().split(",")[1];
            byte[] imageBytes = Base64.getDecoder().decode(imageData);

            ByteArrayInputStream bis = new ByteArrayInputStream(imageBytes);
            BufferedImage originalImage = ImageIO.read(bis);
            bis.close();

            int newWidth = 500;
            int newHeight = (int) (originalImage.getHeight() * (1.0 * newWidth / originalImage.getWidth()));
            BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_ARGB);
            resizedImage.getGraphics().drawImage(originalImage, 0, 0, newWidth, newHeight, null);

            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            ImageIO.write(resizedImage, "png", bos);
            byte[] compressedImageBytes = bos.toByteArray();
            bos.close();
            swithUser.setUser_profile(compressedImageBytes);
        } else {
            ClassPathResource defaultImageResource = new ClassPathResource("img/girl.png");
            byte[] defaultImageBytes = StreamUtils.copyToByteArray(defaultImageResource.getInputStream());
            swithUser.setUser_profile(defaultImageBytes);
        }

        swithUser.setPassword(passwordEncoder.encode(swithUser.getPassword()));
        usersMapper.insertUser(swithUser);
        return swithUser;
    }

    public SwithUser findByUserNo(Long user_no) {
        return usersMapper.findByUserNo(user_no);
    }

    public SwithUser getByCredentials(String email, String password, PasswordEncoder encoder) {
        SwithUser originalUser = usersMapper.findByEmail(email);
        if (originalUser != null && encoder.matches(password, originalUser.getPassword())) {
            return originalUser;
        }
        return null;
    }

    public SwithUser getAuthenticatedUser(String email) {
        SwithUser user = getUserByEmail(email);
        if (user != null) {
            byte[] profile_img = user.getUser_profile();
            if (profile_img != null && profile_img.length > 0) {
                String imageBase64 = Base64.getEncoder().encodeToString(profile_img);
                String cutString = imageBase64.substring(imageBase64.indexOf("data:image/jpeg;base64") + "data:image/jpeg;base64".length());
                String imageUrl = "data:image/jpeg;base64,/" + cutString;
                user.setPassword(null);
                user.setImg(imageUrl);
            }
        }
        return user;
    }

    public SwithUser getUserByEmail(String email) {
        return usersMapper.findByEmail(email);
    }

    public SwithUser getUserByNickname(String nickname) {
        return usersMapper.findByNickname(nickname);
    }

    public void updateUserProfile(SwithUser swithUser) throws IOException {
        if (swithUser.getImg() != null && !swithUser.getImg().isEmpty()) {
            String imageData = swithUser.getImg().split(",")[1];
            byte[] imageBytes = Base64.getDecoder().decode(imageData);

            ByteArrayInputStream bis = new ByteArrayInputStream(imageBytes);
            BufferedImage originalImage = ImageIO.read(bis);
            bis.close();

            int newWidth = 500;
            int newHeight = (int) (originalImage.getHeight() * (1.0 * newWidth / originalImage.getWidth()));
            BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_ARGB);
            resizedImage.getGraphics().drawImage(originalImage, 0, 0, newWidth, newHeight, null);

            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            ImageIO.write(resizedImage, "png", bos);
            byte[] compressedImageBytes = bos.toByteArray();
            bos.close();
            swithUser.setUser_profile(compressedImageBytes);
        }
        usersMapper.updateUserProfile(swithUser);
    }

    public void updateUser(SwithUser swithUser) {
        usersMapper.updateUser(swithUser);
    }

    public void updatePassword(SwithUser swithUser) {
        swithUser.setPassword(passwordEncoder.encode(swithUser.getPassword()));
        usersMapper.updatePassword(swithUser);
    }

    public void deleteUser(SwithUser swithUser) {
        usersMapper.deleteUser(swithUser);
    }

    public void deleteUserLikes(Likes likes) {
        usersMapper.deleteUserLikes(likes);
    }

    public void deleteUserApplication(StudyApplication studyApplication) {
        usersMapper.deleteUserApplication(studyApplication);
    }

    public List<SwithUser> selectDeleteUserList() {
        return usersMapper.selectDeleteUserList();
    }

    public void deleteAdmin(SwithUser swithUser) {
        usersMapper.deleteAdmin(swithUser);
    }

    public int sendVerificationMail(String email) {
        // MailService 객체 생성 및 메일 전송 로직 추가
        MailService mailService = new MailService(javaMailSender);
        return mailService.sendMail(email);
    }
}
