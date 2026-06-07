
export const ROLES = {
  ADMINISTRADOR: 'administrador',
  MEDICO: 'medico',
  PACIENTE: 'paciente',
  RECEPCIONISTA: 'recepcionista',
  FARMACEUTICO: 'farmaceutico',
}

export function hasRole(user, rol) {
  if (!user || !user.rol) return false
  return user.rol.toLowerCase() === rol.toLowerCase()
}

export function isMedico(user) {
  return hasRole(user, ROLES.MEDICO)
}

export function isAdministrador(user) {
  return hasRole(user, ROLES.ADMINISTRADOR)
}

export function isPaciente(user) {
  return hasRole(user, ROLES.PACIENTE)
}

export function getRolName(rol) {
  const rolesMap = {
    administrador: 'Administrador',
    medico: 'Médico',
    paciente: 'Paciente',
    recepcionista: 'Recepcionista',
    farmaceutico: 'Farmacéutico',
  }
  return rolesMap[rol?.toLowerCase()] || rol
}

