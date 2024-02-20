package lm.swith.studyroom.model;

public class MessageResponseDto {
	private final Long id;

	private final String value;

	public MessageResponseDto(Long id, String value) {
		this.id = id;

		this.value = value;
	}

	public Long getId() {
		return id;
	}



	public String getValue() {
		return value;
	}
}
