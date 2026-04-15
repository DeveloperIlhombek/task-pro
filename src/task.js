// =============================================
// task.ts — task.html uchun
// Task CRUD: yaratish, o'qish, yangilash, o'chirish
// =============================================
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// --- SOZLAMALAR ---
var API = 'https://helminthoid-clumsily-xuan.ngrok-free.dev';
var SKIP_NGROK = {
    'ngrok-skip-browser-warning': 'true',
};
// --- TOKEN ---
function getToken() {
    return localStorage.getItem('token') || '';
}
// Token yo'q bo'lsa — login sahifasiga qaytaramiz
if (!getToken()) {
    window.location.href = './index.html';
}
// Har bir so'rovda Authorization header kerak
function authHeader() {
    return __assign({ Authorization: "Bearer ".concat(getToken()) }, SKIP_NGROK);
}
// --- SANA ---
var days = [
    'Yakshanba',
    'Dushanba',
    'Seshanba',
    'Chorshanba',
    'Payshanba',
    'Juma',
    'Shanba',
];
var months = [
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
];
var now = new Date();
document.getElementById('date-line').textContent =
    "".concat(days[now.getDay()], ", ").concat(now.getDate(), " ").concat(months[now.getMonth()], " ").concat(now.getFullYear());
// --- FOYDALANUVCHI ISMINI YUKLASH ---
function loadUser() {
    return __awaiter(this, void 0, void 0, function () {
        var res, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("".concat(API, "/user/me"), { headers: authHeader() })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    user = _a.sent();
                    if (!user.username) {
                        localStorage.removeItem('token');
                        window.location.href = './index.html';
                        return [2 /*return*/];
                    }
                    ;
                    document.getElementById('nav-username').textContent =
                        user.username;
                    return [2 /*return*/];
            }
        });
    });
}
// --- TASKLAR RO'YXATINI YUKLASH ---
function loadTasks() {
    return __awaiter(this, void 0, void 0, function () {
        var res, tasks, done, pending, list;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("".concat(API, "/tasks/"), { headers: authHeader() })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()
                        // Statistika
                    ];
                case 2:
                    tasks = _a.sent();
                    done = tasks.filter(function (t) { return t.completed; }).length;
                    pending = tasks.length - done;
                    document.getElementById('stat-total').textContent = String(tasks.length);
                    document.getElementById('stat-done').textContent =
                        String(done);
                    document.getElementById('stat-pending').textContent =
                        String(pending);
                    list = document.getElementById('task-list');
                    if (tasks.length === 0) {
                        list.innerHTML = "<p class=\"text-center text-slate-400 py-10 text-lg\">Hozircha vazifalar yo'q \u2726</p>";
                        return [2 /*return*/];
                    }
                    // Har bir task uchun HTML chiqaramiz
                    list.innerHTML = tasks
                        .map(function (task) { return "\n    <div class=\"bg-slate-800 border border-slate-600 rounded-xl px-6 py-4\n                flex items-start gap-4 group hover:border-violet-500/50 transition-colors\n                ".concat(task.completed ? 'opacity-60' : '', "\">\n\n      <!-- Bajarildi tugmasi -->\n      <button\n        onclick=\"toggleDone(").concat(task.id, ", ").concat(task.completed, ")\"\n        class=\"mt-1 w-6 h-6 min-w-6 rounded-full border-2 flex items-center justify-center transition-all\n               ").concat(task.completed
                        ? 'bg-green-500 border-green-500 text-slate-900 text-xs font-bold'
                        : 'border-slate-500 hover:border-green-400', "\">\n        ").concat(task.completed ? '✓' : '', "\n      </button>\n\n      <!-- Sarlavha va ta'rif -->\n      <div class=\"flex-1\">\n        <p class=\"text-white font-medium ").concat(task.completed ? 'line-through text-slate-400' : '', "\">\n          ").concat(task.title, "\n        </p>\n        <p class=\"text-slate-400 text-sm mt-1\">").concat(task.description, "</p>\n      </div>\n\n      <!-- Tahrirlash / O'chirish (hover da ko'rinadi) -->\n      <div class=\"flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity\">\n        <button\n          onclick=\"openEditModal(").concat(task.id, ", '").concat(task.title, "', '").concat(task.description, "', ").concat(task.completed, ")\"\n          class=\"w-8 h-8 rounded-lg bg-slate-700 border border-slate-500\n                 hover:border-violet-400 text-slate-300 hover:text-violet-400 transition-all\">\n          \u270E\n        </button>\n        <button\n          onclick=\"removeTask(").concat(task.id, ")\"\n          class=\"w-8 h-8 rounded-lg bg-slate-700 border border-slate-500\n                 hover:border-red-400 text-slate-300 hover:text-red-400 transition-all\">\n          \u2715\n        </button>\n      </div>\n    </div>\n  "); })
                        .join('');
                    return [2 /*return*/];
            }
        });
    });
}
// --- YANGI TASK QO'SHISH (Create) ---
function addTask() {
    return __awaiter(this, void 0, void 0, function () {
        var titleInput, descInput, title, description, body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    titleInput = document.getElementById('new-title');
                    descInput = document.getElementById('new-desc');
                    title = titleInput.value.trim();
                    description = descInput.value.trim();
                    if (!title) {
                        alert('Vazifa nomini kiriting!');
                        return [2 /*return*/];
                    }
                    body = { title: title, description: description };
                    return [4 /*yield*/, fetch("".concat(API, "/tasks/"), {
                            method: 'POST',
                            headers: __assign({ 'Content-Type': 'application/json' }, authHeader()),
                            body: JSON.stringify(body),
                        })];
                case 1:
                    _a.sent();
                    titleInput.value = '';
                    descInput.value = '';
                    loadTasks();
                    return [2 /*return*/];
            }
        });
    });
}
// --- BAJARILDI / BAJARILMADI (Update) ---
function toggleDone(id, currentCompleted) {
    return __awaiter(this, void 0, void 0, function () {
        var res, tasks, task, body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("".concat(API, "/tasks/"), { headers: authHeader() })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    tasks = _a.sent();
                    task = tasks.find(function (t) { return t.id === id; });
                    if (!task)
                        return [2 /*return*/];
                    body = {
                        title: task.title,
                        description: task.description,
                        completed: !currentCompleted, // teskarisiga o'zgartiramiz
                    };
                    return [4 /*yield*/, fetch("".concat(API, "/tasks/").concat(id), {
                            method: 'PUT',
                            headers: __assign({ 'Content-Type': 'application/json' }, authHeader()),
                            body: JSON.stringify(body),
                        })];
                case 3:
                    _a.sent();
                    loadTasks();
                    return [2 /*return*/];
            }
        });
    });
}
// --- MODALNI OCHISH (Edit) ---
// Qaysi task tahrirlanayotganini saqlash
var editingTaskId = 0;
function openEditModal(id, title, description, completed) {
    editingTaskId = id;
    document.getElementById('edit-title').value = title;
    document.getElementById('edit-desc').value =
        description;
    document.getElementById('modal').classList.remove('hidden');
}
// --- MODALNI YOPISH ---
function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    editingTaskId = 0;
}
// --- SAQLASH (Update) ---
function saveTask() {
    return __awaiter(this, void 0, void 0, function () {
        var title, description, res, tasks, task, body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    title = document.getElementById('edit-title').value.trim();
                    description = document.getElementById('edit-desc').value.trim();
                    if (!title) {
                        alert("Sarlavha bo'sh bo'lmasin!");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, fetch("".concat(API, "/tasks/"), { headers: authHeader() })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    tasks = _a.sent();
                    task = tasks.find(function (t) { return t.id === editingTaskId; });
                    if (!task)
                        return [2 /*return*/];
                    body = { title: title, description: description, completed: task.completed };
                    return [4 /*yield*/, fetch("".concat(API, "/tasks/").concat(editingTaskId), {
                            method: 'PUT',
                            headers: __assign({ 'Content-Type': 'application/json' }, authHeader()),
                            body: JSON.stringify(body),
                        })];
                case 3:
                    _a.sent();
                    closeModal();
                    loadTasks();
                    return [2 /*return*/];
            }
        });
    });
}
// --- O'CHIRISH (Delete) ---
function removeTask(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm("Bu vazifani o'chirasizmi?"))
                        return [2 /*return*/];
                    return [4 /*yield*/, fetch("".concat(API, "/tasks/").concat(id), {
                            method: 'DELETE',
                            headers: authHeader(),
                        })];
                case 1:
                    _a.sent();
                    loadTasks();
                    return [2 /*return*/];
            }
        });
    });
}
// --- LOGOUT ---
function logout() {
    localStorage.removeItem('token');
    window.location.href = './index.html';
}
// --- TUGMALAR ---
;
document.getElementById('btn-add').addEventListener('click', addTask);
document.getElementById('btn-save').addEventListener('click', saveTask);
document.getElementById('btn-cancel').addEventListener('click', closeModal);
document.getElementById('btn-logout').addEventListener('click', logout);
// ESC tugmasi bilan modalni yopish
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape')
        closeModal();
});
window.toggleDone = toggleDone;
window.openEditModal = openEditModal;
window.removeTask = removeTask;
// --- SAHIFA OCHILGANDA ---
loadUser();
loadTasks();
