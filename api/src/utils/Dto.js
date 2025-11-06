export class DTO {
	static userDto(user) {
		return {
			_id: user._id,
			name: user.name,
			fatherName: user.fatherName,
			email: user.email,
			role: user.role,
			employeeCode: user.employeeCode || null,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}
}
