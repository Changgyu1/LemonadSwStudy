package lm.swith.studyroom.model;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MessageRequestDto {
    private Long message_id;
    
    private Long post_no;
    
    private String nickname;

    private String message;
    
    private Timestamp timestamp;


    
}