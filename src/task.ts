// =============================================
// task.ts — task.html uchun
// Task CRUD: yaratish, o'qish, yangilash, o'chirish
// =============================================

// --- TIPLAR ---

interface User {
	id: number
	username: string
}

interface TaskCreate {
	title: string
	description: string
}

interface TaskUpdate {
	title: string
	description: string
	completed: boolean
}

interface Task {
	id: number
	title: string
	description: string
	completed: boolean
	owner_id: number
	created_at: string
}

// --- SOZLAMALAR ---

const API: string = 'https://helminthoid-clumsily-xuan.ngrok-free.dev'

const SKIP_NGROK: Record<string, string> = {
	'ngrok-skip-browser-warning': 'true',
}

// --- TOKEN ---

function getToken(): string {
	return localStorage.getItem('token') || ''
}

// Token yo'q bo'lsa — login sahifasiga qaytaramiz
if (!getToken()) {
	window.location.href = './index.html'
}

// Har bir so'rovda Authorization header kerak
function authHeader(): Record<string, string> {
	return {
		Authorization: `Bearer ${getToken()}`,
		...SKIP_NGROK,
	}
}

// --- SANA ---

const days = [
	'Yakshanba',
	'Dushanba',
	'Seshanba',
	'Chorshanba',
	'Payshanba',
	'Juma',
	'Shanba',
]
const months = [
	'Yanvar',
	'Fevral',
	'Mart',
	'Aprel',
	'May',
	'Iyun',
	'Iyul',
	'Avgust',
	'Sentabr',
	'Oktabr',
	'Noyabr',
	'Dekabr',
]
const now = new Date()

;(document.getElementById('date-line') as HTMLElement).textContent =
	`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`

// --- FOYDALANUVCHI ISMINI YUKLASH ---

async function loadUser(): Promise<void> {
	const res = await fetch(`${API}/user/me`, { headers: authHeader() })
	const user: User = await res.json()

	if (!user.username) {
		localStorage.removeItem('token')
		window.location.href = './index.html'
		return
	}

	;(document.getElementById('nav-username') as HTMLElement).textContent =
		user.username
}

// --- TASKLAR RO'YXATINI YUKLASH ---

async function loadTasks(): Promise<void> {
	const res = await fetch(`${API}/tasks/`, { headers: authHeader() })
	const tasks: Task[] = await res.json()

	// Statistika
	const done = tasks.filter((t: Task) => t.completed).length
	const pending = tasks.length - done

	;(document.getElementById('stat-total') as HTMLElement).textContent = String(
		tasks.length,
	)
	;(document.getElementById('stat-done') as HTMLElement).textContent =
		String(done)
	;(document.getElementById('stat-pending') as HTMLElement).textContent =
		String(pending)

	const list = document.getElementById('task-list') as HTMLElement

	if (tasks.length === 0) {
		list.innerHTML = `<p class="text-center text-slate-400 py-10 text-lg">Hozircha vazifalar yo'q ✦</p>`
		return
	}

	// Har bir task uchun HTML chiqaramiz
	list.innerHTML = tasks
		.map(
			(task: Task) => `
    <div class="bg-slate-800 border border-slate-600 rounded-xl px-6 py-4
                flex items-start gap-4 group hover:border-violet-500/50 transition-colors
                ${task.completed ? 'opacity-60' : ''}">

      <!-- Bajarildi tugmasi -->
      <button
        onclick="toggleDone(${task.id}, ${task.completed})"
        class="mt-1 w-6 h-6 min-w-6 rounded-full border-2 flex items-center justify-center transition-all
               ${
									task.completed
										? 'bg-green-500 border-green-500 text-slate-900 text-xs font-bold'
										: 'border-slate-500 hover:border-green-400'
								}">
        ${task.completed ? '✓' : ''}
      </button>

      <!-- Sarlavha va ta'rif -->
      <div class="flex-1">
        <p class="text-white font-medium ${task.completed ? 'line-through text-slate-400' : ''}">
          ${task.title}
        </p>
        <p class="text-slate-400 text-sm mt-1">${task.description}</p>
      </div>

      <!-- Tahrirlash / O'chirish (hover da ko'rinadi) -->
      <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onclick="openEditModal(${task.id}, '${task.title}', '${task.description}', ${task.completed})"
          class="w-8 h-8 rounded-lg bg-slate-700 border border-slate-500
                 hover:border-violet-400 text-slate-300 hover:text-violet-400 transition-all">
          ✎
        </button>
        <button
          onclick="removeTask(${task.id})"
          class="w-8 h-8 rounded-lg bg-slate-700 border border-slate-500
                 hover:border-red-400 text-slate-300 hover:text-red-400 transition-all">
          ✕
        </button>
      </div>
    </div>
  `,
		)
		.join('')
}

// --- YANGI TASK QO'SHISH (Create) ---

async function addTask(): Promise<void> {
	const titleInput = document.getElementById('new-title') as HTMLInputElement
	const descInput = document.getElementById('new-desc') as HTMLInputElement

	const title = titleInput.value.trim()
	const description = descInput.value.trim()

	if (!title) {
		alert('Vazifa nomini kiriting!')
		return
	}

	const body: TaskCreate = { title, description }

	await fetch(`${API}/tasks/`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', ...authHeader() },
		body: JSON.stringify(body),
	})

	titleInput.value = ''
	descInput.value = ''
	loadTasks()
}

// --- BAJARILDI / BAJARILMADI (Update) ---

async function toggleDone(
	id: number,
	currentCompleted: boolean,
): Promise<void> {
	// Shu taskni topish uchun avval barcha tasklarni olamiz
	const res = await fetch(`${API}/tasks/`, { headers: authHeader() })
	const tasks: Task[] = await res.json()
	const task = tasks.find((t: Task) => t.id === id)

	if (!task) return

	const body: TaskUpdate = {
		title: task.title,
		description: task.description,
		completed: !currentCompleted, // teskarisiga o'zgartiramiz
	}

	await fetch(`${API}/tasks/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json', ...authHeader() },
		body: JSON.stringify(body),
	})

	loadTasks()
}

// --- MODALNI OCHISH (Edit) ---

// Qaysi task tahrirlanayotganini saqlash
let editingTaskId: number = 0

function openEditModal(
	id: number,
	title: string,
	description: string,
	completed: boolean,
): void {
	editingTaskId = id
	;(document.getElementById('edit-title') as HTMLInputElement).value = title
	;(document.getElementById('edit-desc') as HTMLTextAreaElement).value =
		description

	document.getElementById('modal')!.classList.remove('hidden')
}

// --- MODALNI YOPISH ---

function closeModal(): void {
	document.getElementById('modal')!.classList.add('hidden')
	editingTaskId = 0
}

// --- SAQLASH (Update) ---

async function saveTask(): Promise<void> {
	const title = (
		document.getElementById('edit-title') as HTMLInputElement
	).value.trim()
	const description = (
		document.getElementById('edit-desc') as HTMLTextAreaElement
	).value.trim()

	if (!title) {
		alert("Sarlavha bo'sh bo'lmasin!")
		return
	}

	// Eski completed holatini saqlab qolish uchun
	const res = await fetch(`${API}/tasks/`, { headers: authHeader() })
	const tasks: Task[] = await res.json()
	const task = tasks.find((t: Task) => t.id === editingTaskId)

	if (!task) return

	const body: TaskUpdate = { title, description, completed: task.completed }

	await fetch(`${API}/tasks/${editingTaskId}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json', ...authHeader() },
		body: JSON.stringify(body),
	})

	closeModal()
	loadTasks()
}

// --- O'CHIRISH (Delete) ---

async function removeTask(id: number): Promise<void> {
	if (!confirm("Bu vazifani o'chirasizmi?")) return

	await fetch(`${API}/tasks/${id}`, {
		method: 'DELETE',
		headers: authHeader(),
	})

	loadTasks()
}

// --- LOGOUT ---

function logout(): void {
	localStorage.removeItem('token')
	window.location.href = './index.html'
}

// --- TUGMALAR ---

;(document.getElementById('btn-add') as HTMLElement).addEventListener(
	'click',
	addTask,
)
;(document.getElementById('btn-save') as HTMLElement).addEventListener(
	'click',
	saveTask,
)
;(document.getElementById('btn-cancel') as HTMLElement).addEventListener(
	'click',
	closeModal,
)
;(document.getElementById('btn-logout') as HTMLElement).addEventListener(
	'click',
	logout,
)

// ESC tugmasi bilan modalni yopish
document.addEventListener('keydown', (e: KeyboardEvent) => {
	if (e.key === 'Escape') closeModal()
})

// HTML dagi onclick lar uchun (inline onclick funksiyalarni topadi)
;(window as any).toggleDone = toggleDone
;(window as any).openEditModal = openEditModal
;(window as any).removeTask = removeTask

// --- SAHIFA OCHILGANDA ---
loadUser()
loadTasks()
