import './HeaderBlue.css'
import logo from '../../assets/img/logo.png'

function HeaderBlue() {
  return (
    <div className="header-blue">
      <div className="header-logo-wrapper">
      <img src={logo} alt="Clinica Sanicen" className="header-logo-img" />
      </div>
    </div>
  )
}

export default HeaderBlue

