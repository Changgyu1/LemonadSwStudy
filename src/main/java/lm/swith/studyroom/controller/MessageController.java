package lm.swith.studyroom.controller;

import java.sql.Timestamp;
import java.time.Instant;

import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import lm.swith.studyroom.model.MessageRequestDto;
import lm.swith.studyroom.service.ConvertAndSendMessageService;
import lm.swith.studyroom.service.EnterRoomService;
import lm.swith.studyroom.service.QuitRoomService;
import lm.swith.studyroom.service.StudyRoomService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://lemonadswith.store:8080")
public class MessageController {
    private final EnterRoomService enterRoomService;
    private final QuitRoomService quitRoomService;
    private final ConvertAndSendMessageService convertAndSendMessageService;
    private final StudyRoomService studyRoomService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/enter")
    public void enter(MessageRequestDto messageRequestDto) {
        enterRoomService.enterRoom(
            messageRequestDto.getPost_no(),
            messageRequestDto.getNickname()
        );
    }

    @MessageMapping("/chat/quit")
    public void quit(MessageRequestDto messageRequestDto) {
        quitRoomService.quitRoom(
  
            messageRequestDto.getPost_no(),
            messageRequestDto.getNickname()
        );
    }

    @MessageMapping("/chat/message")
    public void message(MessageRequestDto messageRequestDto) {
        convertAndSendMessageService.convertAndSendMessage(
            messageRequestDto.getPost_no(),
            messageRequestDto.getNickname(),
            messageRequestDto.getMessage()
        );
        Timestamp times = Timestamp.from(Instant.now());
        messageRequestDto.setTimestamp(times);
        System.out.println("getMessage : " + messageRequestDto.getMessage());
        System.out.println("getPost_no : " + messageRequestDto.getPost_no());
        System.out.println("nickname : " + messageRequestDto.getNickname());
        System.out.println("getTimestamp : " +messageRequestDto.getTimestamp());
        studyRoomService.saveChatMessage(messageRequestDto);
        System.out.println("실행완");
        String destination = "/subscription/chat/" + messageRequestDto.getPost_no();
        messagingTemplate.convertAndSend(destination, messageRequestDto);
    }

    @MessageExceptionHandler
    public String exception(Exception ex) {
        // 예외 처리 로직 추가
        return "Error has occurred: " + ex.getMessage();
    }
}