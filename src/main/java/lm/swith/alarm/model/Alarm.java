package lm.swith.alarm.model;

import java.sql.Timestamp;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Alarm {
	private Long alarm_no;
	private Long user_no;
	private Long post_no;
	private Timestamp timestamp;
	private String alarm_message;

}
