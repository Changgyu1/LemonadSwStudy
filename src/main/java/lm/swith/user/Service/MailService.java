package lm.swith.user.Service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.messaging.MessagingException;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

//MailService.java
@Service
@RequiredArgsConstructor
public class MailService {
  private final JavaMailSender javaMailSender;
  private static final String senderEmail= "lemonadeswith@gmail.com";
  //private static int number;
  private int number;
  public void createNumber(){
  	// (int) Math.random() * (최댓값-최소값+1) + 최소값
     number = (int)(Math.random() * (90000)) + 100000;
  }

  public MimeMessage CreateMail(String email) throws MessagingException{
      createNumber();
      MimeMessage message = javaMailSender.createMimeMessage();

	        try {
	        	message.setFrom(senderEmail);
		        message.setRecipients(MimeMessage.RecipientType.TO, email);
		        message.setSubject("이메일 인증");
		        String body = "";
		        body += "<h3>" + "요청하신 인증 번호입니다." + "</h3>";
		        body += "<h1>" + number + "</h1>";
		        body += "<h3>" + "감사합니다." + "</h3>";
				message.setText(body,"UTF-8", "html");
			} catch (jakarta.mail.MessagingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

      return message;
  }

 
  public int sendMail(String email){
      MimeMessage message = CreateMail(email);
      javaMailSender.send(message);
      return number;
  }
}