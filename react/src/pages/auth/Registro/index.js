export { default } from './Registro'

import 'bootstrap/dist/css/bootstrap.min.css';

const handleDniChange = (e) => {
  const { value } = e.target;

  // Filtra cualquier carácter que no sea un número (0-9) y limita a 8 caracteres
  const newValue = value.replace(/[^0-9]/g, '').slice(0, 8);

  setFormData({
    ...formData,
    dni: newValue,
  });
};
