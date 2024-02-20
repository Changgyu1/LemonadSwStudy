package lm.swith.main.model;

import lombok.Getter;
import lombok.Setter;

@Getter  @Setter
public class Likes {
	private Long post_no;
	private Long user_no;
	private String is_liked; 
	private int likesCount;
}