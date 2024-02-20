package lm.swith.studyroom.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import lm.swith.studyroom.model.MessageResponseDto;
import lm.swith.studyroom.utils.MessageIdGenerator;

@Service
public class QuitRoomService {
    @Autowired
    private SimpMessagingTemplate template;

    public void quitRoom(
                         Long roomId,
                         String nickname) {
        template.convertAndSend(
            "/subscription/chat/room/" + roomId,
            new MessageResponseDto(
                MessageIdGenerator.generateId(),

                "사용자 " + nickname + " 님이 "
                    + "채팅방 " + roomId + "에서 나갔습니다."
            )
        );
    }
}
