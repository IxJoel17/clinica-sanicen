import 'bootstrap/dist/css/bootstrap.min.css'
import { Capacitor } from '@capacitor/core'

const API_BASE_URL = Capacitor.isNativePlatform()
  ? 'http://192.168.1.25:8080/api'
  : 'http://localhost:8080/api'

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const token = localStorage.getItem('authToken')
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
  }

  try {
    const response = await fetch(url, config)

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')

      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }

      throw new Error('Sesión expirada. Inicia sesión nuevamente.')
    }

    const text = await response.text()
    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
      throw new Error(data?.message || data?.error || `Error ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const authAPI = {
  login: (usuario, contrasena) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usuario, contrasena }),
    }),

  register: (data) =>
    fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

export const especialidadesAPI = {
  getAll: () => fetchAPI('/especialidades'),
  getById: (id) => fetchAPI(`/especialidades/${id}`),

  create: (data) =>
    fetchAPI('/especialidades', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    fetchAPI(`/especialidades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    fetchAPI(`/especialidades/${id}`, {
      method: 'DELETE',
    }),
}

export const medicosAPI = {
  getAll: () => fetchAPI('/medicos'),
  getById: (id) => fetchAPI(`/medicos/${id}`),

  getByCorreo: (correo) =>
    fetchAPI(`/medicos/correo/${encodeURIComponent(correo)}`),

  getByEspecialidad: (idEspecialidad) =>
    fetchAPI(`/medicos/especialidad/${idEspecialidad}`),

  getAllIncludingInactive: () => fetchAPI('/medicos/all'),

  create: (data) =>
    fetchAPI('/medicos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    fetchAPI(`/medicos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    fetchAPI(`/medicos/${id}`, {
      method: 'DELETE',
    }),
}

export const pacientesAPI = {
  getAll: () => fetchAPI('/pacientes'),
  getById: (id) => fetchAPI(`/pacientes/${id}`),

  getByCorreo: (correo) =>
    fetchAPI(`/pacientes/correo/${encodeURIComponent(correo)}`),

  create: (data) =>
    fetchAPI('/pacientes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    fetchAPI(`/pacientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    fetchAPI(`/pacientes/${id}`, {
      method: 'DELETE',
    }),
}

export const citasAPI = {
  getAll: () => fetchAPI('/citas'),
  getById: (id) => fetchAPI(`/citas/${id}`),

  getByPaciente: (idPaciente) =>
    fetchAPI(`/citas/paciente/${idPaciente}`),

  getByMedico: (idMedico) =>
    fetchAPI(`/citas/medico/${idMedico}`),

  create: (data) =>
    fetchAPI('/citas', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    fetchAPI(`/citas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    fetchAPI(`/citas/${id}`, {
      method: 'DELETE',
    }),
}

export const historialAPI = {
  getByPaciente: (idPaciente) =>
    fetchAPI(`/historial/paciente/${idPaciente}`),

  getAllByPaciente: (idPaciente) =>
    fetchAPI(`/historial/paciente/${idPaciente}/all`),

  getById: (id) =>
    fetchAPI(`/historial/${id}`),

  create: (data) =>
    fetchAPI('/historial', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    fetchAPI(`/historial/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
}

export const recetasAPI = {
  getByPaciente: (idPaciente) =>
    fetchAPI(`/recetas/paciente/${idPaciente}`),

  getById: (id) =>
    fetchAPI(`/recetas/${id}`),

  create: (data) =>
    fetchAPI('/recetas', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    fetchAPI(`/recetas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
}

export const boletasAPI = {
  getByPaciente: (idPaciente) =>
    fetchAPI(`/boletas/paciente/${idPaciente}`),

  getByCita: (idCita) =>
    fetchAPI(`/boletas/cita/${idCita}`),

  getById: (id) =>
    fetchAPI(`/boletas/${id}`),

  create: (data) =>
    fetchAPI('/boletas', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

export const usuariosAPI = {
  getAll: () => fetchAPI('/usuarios'),
  getById: (id) => fetchAPI(`/usuarios/${id}`),

  create: (data) =>
    fetchAPI('/usuarios', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    fetchAPI(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    fetchAPI(`/usuarios/${id}`, {
      method: 'DELETE',
    }),
}

export const consultaCuentaAPI = {
  buscar: (codigo) =>
    fetchAPI(`/consulta-cuenta/${encodeURIComponent(codigo)}`),

  busqueda: (texto) =>
    fetchAPI(`/consulta-cuenta/busqueda?texto=${encodeURIComponent(texto)}`),
}

export default {
  auth: authAPI,
  especialidades: especialidadesAPI,
  medicos: medicosAPI,
  pacientes: pacientesAPI,
  citas: citasAPI,
  historial: historialAPI,
  recetas: recetasAPI,
  boletas: boletasAPI,
  usuarios: usuariosAPI,
  consultaCuenta: consultaCuentaAPI,
} 