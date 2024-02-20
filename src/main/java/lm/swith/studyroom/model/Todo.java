package lm.swith.studyroom.model;
import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Todo {
	private Long id;
	private Long post_no;
	private String todo_list;
	private String checked;
	private Date todo_date;	
}