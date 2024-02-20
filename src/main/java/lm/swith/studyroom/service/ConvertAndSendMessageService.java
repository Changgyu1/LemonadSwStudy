package lm.swith.studyroom.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import lm.swith.studyroom.model.MessageResponseDto;
import lm.swith.studyroom.utils.MessageIdGenerator;

@Service
public class ConvertAndSendMessageService {
    @Autowired
    private SimpMessagingTemplate template;

    public void convertAndSendMessage(
                                      Long roomId,
                                      String nickname,
                                      String message) {
        template.convertAndSend(
            "/subscription/chat/room/" + roomId,
            new MessageResponseDto(
                MessageIdGenerator.generateId(),
               
                nickname + ": " + message
            )
        );
    }
}
