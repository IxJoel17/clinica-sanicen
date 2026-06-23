import 'bootstrap/dist/css/bootstrap.min.css';
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
    defaultOptions.headers['Authorization'] = `Bearer ${token}`
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
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
    }
    
    const data = await response.json()

    if (!response.ok) {
      const errorMessage = data.message || data.error || `Error: ${response.statusText}`
      throw new Error(errorMessage)
    }

    return data
  } catch (error) {
    console.error('Error en API:', error)
    throw error
  }
}

export const authAPI = {
  login: async (usuario, contrasena) => {
    return await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usuario, contrasena }),
    })
  },

  register: async (userData) => {
    return await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },
}

export const especialidadesAPI = {
  getAll: async () => {
    return await fetchAPI('/especialidades')
  },

  getById: async (id) => {
    return await fetchAPI(`/especialidades/${id}`)
  },

  create: async (especialidadData) => {
    return await fetchAPI('/especialidades', {
      method: 'POST',
      body: JSON.stringify(especialidadData),
    })
  },

  update: async (id, especialidadData) => {
    return await fetchAPI(`/especialidades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(especialidadData),
    })
  },

  delete: async (id) => {
    return await fetchAPI(`/especialidades/${id}`, {
      method: 'DELETE',
    })
  },
}

export const medicosAPI = {
  getAll: async () => {
    return await fetchAPI('/medicos')
  },

  getById: async (id) => {
    return await fetchAPI(`/medicos/${id}`)
  },

  getByCorreo: async (correo) => {
    return await fetchAPI(`/medicos/correo/${encodeURIComponent(correo)}`)
  },

  getByEspecialidad: async (idEspecialidad) => {
    return await fetchAPI(`/medicos/especialidad/${idEspecialidad}`)
  },

  getAllIncludingInactive: async () => {
    return await fetchAPI('/medicos/all')
  },

  create: async (medicoData) => {
    return await fetchAPI('/medicos', {
      method: 'POST',
      body: JSON.stringify(medicoData),
    })
  },

  update: async (id, medicoData) => {
    return await fetchAPI(`/medicos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(medicoData),
    })
  },

  delete: async (id) => {
    return await fetchAPI(`/medicos/${id}`, {
      method: 'DELETE',
    })
  },
}

export const pacientesAPI = {
  getAll: async () => {
    return await fetchAPI('/pacientes')
  },

  getById: async (id) => {
    return await fetchAPI(`/pacientes/${id}`)
  },

  getByCorreo: async (correo) => {
    return await fetchAPI(`/pacientes/correo/${encodeURIComponent(correo)}`)
  },

  create: async (pacienteData) => {
    return await fetchAPI('/pacientes', {
      method: 'POST',
      body: JSON.stringify(pacienteData),
    })
  },

  update: async (id, pacienteData) => {
    return await fetchAPI(`/pacientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pacienteData),
    })
  },

  delete: async (id) => {
    return await fetchAPI(`/pacientes/${id}`, {
      method: 'DELETE',
    })
  },
}

export const citasAPI = {
  getAll: async () => {
    return await fetchAPI('/citas')
  },

  getById: async (id) => {
    return await fetchAPI(`/citas/${id}`)
  },

  getByPaciente: async (idPaciente) => {
    return await fetchAPI(`/citas/paciente/${idPaciente}`)
  },

  getByMedico: async (idMedico) => {
    return await fetchAPI(`/citas/medico/${idMedico}`)
  },

  create: async (citaData) => {
    return await fetchAPI('/citas', {
      method: 'POST',
      body: JSON.stringify(citaData),
    })
  },

  update: async (id, citaData) => {
    return await fetchAPI(`/citas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(citaData),
    })
  },
    
  delete: async (id) => {
    return await fetchAPI(`/citas/${id}`, {
      method: 'DELETE',
    })
  },
}

export const historialAPI = {
  getByPaciente: async (idPaciente) => {
    return await fetchAPI(`/historial/paciente/${idPaciente}`)
  },

  getAllByPaciente: async (idPaciente) => {
    return await fetchAPI(`/historial/paciente/${idPaciente}/all`)
  },

  create: async (historialData) => {
    return await fetchAPI('/historial', {
      method: 'POST',
      body: JSON.stringify(historialData),
    })
  },

  update: async (id, historialData) => {
    return await fetchAPI(`/historial/${id}`, {
      method: 'PUT',
      body: JSON.stringify(historialData),
    })
  },
}

export const recetasAPI = {
  getByPaciente: async (idPaciente) => {
    const response = await api.get(`/recetas/paciente/${idPaciente}`)
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/recetas/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/recetas', data)
    return response.data
  },

  update: async (idReceta, data) => {
    const response = await api.put(`/recetas/${idReceta}`, data)
    return response.data
  },
}

export const boletasAPI = {
  getByPaciente: async (idPaciente) => {
    return await fetchAPI(`/boletas/paciente/${idPaciente}`)
  },

  getByCita: async (idCita) => {
    return await fetchAPI(`/boletas/cita/${idCita}`)
  },

  getById: async (id) => {
    return await fetchAPI(`/boletas/${id}`)
  },

  create: async (boletaData) => {
    return await fetchAPI('/boletas', {
      method: 'POST',
      body: JSON.stringify(boletaData),
    })
  },
}

export const usuariosAPI = {
  getAll: async () => {
    return await fetchAPI('/usuarios')
  },

  getById: async (id) => {
    return await fetchAPI(`/usuarios/${id}`)
  },

  create: async (usuarioData) => {
    return await fetchAPI('/usuarios', {
      method: 'POST',
      body: JSON.stringify(usuarioData),
    })
  },

  update: async (id, usuarioData) => {
    return await fetchAPI(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(usuarioData),
    })
  },

  delete: async (id) => {
    return await fetchAPI(`/usuarios/${id}`, {
      method: 'DELETE',
    })
  },
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
}

