import bcryptjs from "bcryptjs"

export const isPasswordMatched = async (plainPassword: string, hashedPassword: string) => {
	const isMatched = await bcryptjs.compare(plainPassword, hashedPassword)
	return isMatched
}