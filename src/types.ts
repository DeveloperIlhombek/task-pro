// Foydalanuvchi ma'lumotlari
export interface User {
	id: number
	username: string
}

// Login bo'lganda serverdan keladigan javob
export interface TokenResponse {
	access_token: string
	token_type: string
}

// Yangi task yaratishda yuboriladigan ma'lumot
export interface TaskCreate {
	title: string
	description: string	
}

// Taskni yangilashda yuboriladigan ma'lumot
export interface TaskUpdate {
	title: string
	description: string
	completed: boolean
}

// Serverdan keladigan task ma'lumoti
export interface Task {
	id: number
	title: string
	description: string
	completed: boolean
	owner_id: number
	created_at: string
}
