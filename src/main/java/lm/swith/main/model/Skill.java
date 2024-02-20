package lm.swith.main.model;

import java.sql.Blob;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Skill {
	private Long skill_no;
	private String skill_name;
	private Blob img;
}