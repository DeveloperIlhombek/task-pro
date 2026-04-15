// --- CONSTANTS ---
const IS_LOCAL = window.location.hostname === '127.0.0.1' ||
    window.location.hostname === 'localhost';
const API = IS_LOCAL
    ? 'http://127.0.0.1:8000'
    : 'https://helminthoid-clumsily-xuan.ngrok-free.dev';
const SKIP_NGROK = {
    'ngrok-skip-browser-warning': 'true',
};
// --- HELPERS ---
function getInputValue(id) {
    const el = document.getElementById(id);
    return el?.value || '';
}
function getData() {
    return {
        username: getInputValue('username'),
        password: getInputValue('password'),
    };
}
function setResult(data) {
    const el = document.getElementById('result');
    if (el) {
        el.innerText =
            typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    }
}
// --- GENERIC FETCH FUNCTION ---
async function request(url, options) {
    try {
        const res = await fetch(url, options);
        return (await res.json());
    }
    catch (err) {
        return { detail: 'Network error' };
    }
}
async function register() {
    const data = getData();
    const result = await request(`${API}/user/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...SKIP_NGROK,
        },
        body: JSON.stringify(data),
    });
    setResult(result);
}
// --- LOGIN ---
async function login() {
    const data = getData();
    const params = new URLSearchParams();
    params.append('username', data.username);
    params.append('password', data.password);
    const result = await request(`${API}/user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            ...SKIP_NGROK,
        },
        body: params,
    });
    if ('access_token' in result) {
        localStorage.setItem('token', result.access_token);
        setResult('Login muvaffaqiyatli. Token saqlandi.');
    }
    else {
        setResult(result);
    }
}
async function getMe() {
    const token = localStorage.getItem('token');
    if (!token) {
        setResult('Token topilmadi. Avval login qiling.');
        return;
    }
    const result = await request(`${API}/user/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
            ...SKIP_NGROK,
        },
    });
    setResult(result);
}
// --- LOGOUT ---
function logout() {
    localStorage.removeItem('token');
    setResult('Logged out.');
}
