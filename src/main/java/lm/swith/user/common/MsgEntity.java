package lm.swith.user.common;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.*;
@Getter
@Setter
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
public class MsgEntity {
	private String msg;
	private Object result;
	
}