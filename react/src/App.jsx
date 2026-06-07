import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import ProtectedRouteByRole from './components/ProtectedRouteByRole'
// Public pages
import Home from './pages/public/Home'
import Nosotros from './pages/public/Nosotros'
import Contacto from './pages/public/Contacto'
// Auth pages
import Login from './pages/auth/Login'
import Registro from './pages/auth/Registro'
import RecuperarPaso1 from './pages/auth/RecuperarPaso1'
import RecuperarPaso2 from './pages/auth/RecuperarPaso2'
// Dashboard
import Portal from './pages/dashboard/Portal'
import PortalMedico from './pages/dashboard/PortalMedico'
import PortalAdmin from './pages/dashboard/PortalAdmin'
import PortalRecepcionista from './pages/dashboard/PortalRecepcionista'
// Citas
import Citas from './pages/citas/Citas'
import ConfirmarCita from './pages/citas/ConfirmarCita'
// Perfil
import Perfil from './pages/perfil/Perfil'
// Medico
import RegistroMedico from './pages/medico/RegistroMedico'
import DetalleRegistro from './pages/medico/DetalleRegistro'
import RecetaElectronica from './pages/medico/RecetaElectronica'
import CitasMedico from './pages/medico/CitasMedico'
import DetalleCitaMedico from './pages/medico/DetalleCitaMedico'
import PacientesMedico from './pages/medico/PacientesMedico'
// Tratamiento
import Tratamiento from './pages/tratamiento/Tratamiento'
// Admin
import MedicosAdmin from './pages/admin/MedicosAdmin'
import PacientesAdmin from './pages/admin/PacientesAdmin'
import UsuariosAdmin from './pages/admin/UsuariosAdmin'
import CitasAdmin from './pages/admin/CitasAdmin'
import ServiciosAdmin from './pages/admin/ServiciosAdmin'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/recuperar-paso1" element={<RecuperarPaso1 />} />
        <Route path="/recuperar-paso2" element={<RecuperarPaso2 />} />

        {/* Rutas protegidas (requieren autenticación) */}
        <Route
          path="/portal"
          element={
            <ProtectedRoute>
              <Portal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portal-medico"
          element={
            <ProtectedRouteByRole allowedRoles="medico">
              <PortalMedico />
            </ProtectedRouteByRole>
          }
        />
        <Route
          path="/portal-admin"
          element={
            <ProtectedRouteByRole allowedRoles="administrador">
              <PortalAdmin />
            </ProtectedRouteByRole>
          }
        />
        <Route
          path="/portal-recepcionista"
          element={
            <ProtectedRouteByRole allowedRoles="recepcionista"> 
              <PortalRecepcionista />
            </ProtectedRouteByRole>
          }
        />
        {/* Rutas de médico */}
        <Route
          path="/medico/citas"
          element={
            <ProtectedRouteByRole allowedRoles="medico">
              <CitasMedico />
            </ProtectedRouteByRole>
          }
        />
        <Route
          path="/medico/citas/:id"
          element={
            <ProtectedRouteByRole allowedRoles="medico">
              <DetalleCitaMedico />
            </ProtectedRouteByRole>
          }
        />
        <Route
          path="/medico/pacientes"
          element={
            <ProtectedRouteByRole allowedRoles="medico">
              <PacientesMedico />
            </ProtectedRouteByRole>
          }
        />
        <Route
          path="/citas"
          element={
            <ProtectedRoute>
              <Citas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tratamiento"
          element={
            <ProtectedRoute>
              <Tratamiento />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registro-medico"
          element={
            <ProtectedRoute>
              <RegistroMedico />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receta-electronica"
          element={
            <ProtectedRoute>
              <RecetaElectronica />
            </ProtectedRoute>
          }
        />
        <Route
          path="/confirmar-cita"
          element={
            <ProtectedRoute>
              <ConfirmarCita />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detalle-registro"
          element={
            <ProtectedRoute>
              <DetalleRegistro />
            </ProtectedRoute>
          }
        />

        {/* Rutas de administrador */}
        <Route
          path="/admin/medicos"
          element={
            <ProtectedRouteByRole allowedRoles="administrador">
              <MedicosAdmin />
            </ProtectedRouteByRole>
          }
        />
        <Route
          path="/admin/pacientes"
          element={
            <ProtectedRouteByRole allowedRoles="administrador">
              <PacientesAdmin />
            </ProtectedRouteByRole>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRouteByRole allowedRoles="administrador">
              <UsuariosAdmin />
            </ProtectedRouteByRole>
          }
        />
        <Route
          path="/admin/citas"
          element={
            <ProtectedRouteByRole allowedRoles="administrador">
              <CitasAdmin />
            </ProtectedRouteByRole>
          }
        />
        <Route
          path="/admin/servicios"
          element={
            <ProtectedRouteByRole allowedRoles="administrador">
              <ServiciosAdmin />
            </ProtectedRouteByRole>
          }
        />
        <Route
          path="/recepcionista/medicos"
          element={
            <ProtectedRouteByRole allowedRoles="recepcionista">
              <MedicosAdmin />
            </ProtectedRouteByRole>
          }
        />
        
        {/* Rutas de recepcionista */}
        <Route
          path="/recepcionista/medicos"
          element={
            <ProtectedRouteByRole allowedRoles="recepcionista">
              <MedicosAdmin />
            </ProtectedRouteByRole>
          }
        />
        <Route
         path="/recepcionista/pacientes"
          element={
            <ProtectedRouteByRole allowedRoles="recepcionista">
              <PacientesAdmin />
          </ProtectedRouteByRole>
        }
      />

        <Route
          path="/recepcionista/citas"
          element={
            <ProtectedRouteByRole allowedRoles="recepcionista">
              <CitasAdmin />
            </ProtectedRouteByRole>
          }
        />

        <Route
          path="/recepcionista/pagos"
          element={
            <ProtectedRouteByRole allowedRoles="recepcionista">
              <CitasAdmin />
            </ProtectedRouteByRole>
          }
        />

        <Route
          path="/recepcionista/boletas"
          element={
            <ProtectedRouteByRole allowedRoles="recepcionista">
              <CitasAdmin />
            </ProtectedRouteByRole>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
