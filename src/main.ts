// --- CONSTANTS ---
const IS_LOCAL: boolean =
	window.location.hostname === '127.0.0.1' ||
	window.location.hostname === 'localhost'

const API: string = IS_LOCAL
	? 'http://127.0.0.1:8000'
	: 'https://helminthoid-clumsily-xuan.ngrok-free.dev'

const SKIP_NGROK: Record<string, string> = {
	'ngrok-skip-browser-warning': 'true',
}

// --- TYPES & INTERFACES ---

interface AuthData {
	username: string
	password: string
}

interface TokenResponse {
	access_token: string
	token_type: string
}

interface ErrorResponse {
	detail?: string
	[key: string]: any
}

// Generic API response type
type ApiResponse<T> = T | ErrorResponse

// --- HELPERS ---

function getInputValue(id: string): string {
	const el = document.getElementById(id) as HTMLInputElement | null
	return el?.value || ''
}

function getData(): AuthData {
	return {
		username: getInputValue('username'),
		password: getInputValue('password'),
	}
}

function setResult(data: unknown): void {
	const el = document.getElementById('result')
	if (el) {
		el.innerText =
			typeof data === 'string' ? data : JSON.stringify(data, null, 2)
	}
}

// --- GENERIC FETCH FUNCTION ---

async function request<T>(
	url: string,
	options: RequestInit,
): Promise<ApiResponse<T>> {
	try {
		const res = await fetch(url, options)
		return (await res.json()) as ApiResponse<T>
	} catch (err) {
		return { detail: 'Network error' }
	}
}

// --- REGISTER ---

interface IRequestResult {
	id: number
	hashPasword: string
}

async function register(): Promise<void> {
	const data = getData()

	const result = await request<unknown>(`${API}/user/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...SKIP_NGROK,
		},
		body: JSON.stringify(data),
	})

	setResult(result)
}

// --- LOGIN ---

async function login(): Promise<void> {
	const data = getData()

	const params = new URLSearchParams()
	params.append('username', data.username)
	params.append('password', data.password)

	const result = await request<TokenResponse>(`${API}/user/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			...SKIP_NGROK,
		},
		body: params,
	})

	if ('access_token' in result) {
		localStorage.setItem('token', result.access_token)
		setResult('Login muvaffaqiyatli. Token saqlandi.')
	} else {
		setResult(result)
	}
}

// --- GET ME ---

interface User {
	id: number
	username: string
}

async function getMe(): Promise<void> {
	const token = localStorage.getItem('token')

	if (!token) {
		setResult('Token topilmadi. Avval login qiling.')
		return
	}

	const result = await request<User>(`${API}/user/me`, {
		headers: {
			Authorization: `Bearer ${token}`,
			...SKIP_NGROK,
		},
	})

	setResult(result)
}

// --- LOGOUT ---

function logout(): void {
	localStorage.removeItem('token')
	setResult('Logged out.')
}
