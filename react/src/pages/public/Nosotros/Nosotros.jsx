import Header from '../../../components/Header'
import '../../../styles/common.css'
import './Nosotros.css'

function Nosotros() {
  return (
    <>
      <Header />
      <section className="about-intro">
        <div className="container">
          <p>
            La clínica Sanicen es una institución de salud comprometida con el bienestar y la
            atención integral de nuestros pacientes. Ofrecemos un servicio moderno y accesible a
            través de nuestra plataforma digital, que permite gestionar citas médicas de manera
            rápida, segura y eficiente. Nuestro equipo de profesionales está enfocado en brindar
            una atención humana, confiable y de calidad, garantizando la satisfacción y confianza
            de cada paciente.
          </p>
        </div>
      </section>

      <section className="mission-vision">
        <div className="container">
          <div className="mv-block">
            <h2>Misión</h2>
            <p>
              Brindar servicios de salud de calidad mediante una atención eficiente, humana y
              personalizada, apoyada en el uso de tecnologías digitales que faciliten la gestión de
              citas, el acceso a la información médica y la mejora continua de la experiencia del
              paciente.
            </p>
          </div>

          <div className="mv-block">
            <h2>Visión</h2>
            <p>
              Ser un policlínico líder en innovación tecnológica y atención médica en la región,
              reconocido por la excelencia en el servicio, la confianza de nuestros pacientes y el
              compromiso con la mejora constante de la salud y el bienestar de la comunidad.
            </p>
          </div>
        </div>
      </section>

      <section className="infografia">
        <div className="container">
          <div className="texto-infografia">
            <h2>Bienvenidos a Clínica Sanicen</h2>
            <p>
              Somos una clínica de salud innovadora con atención de calidad. Ofrecemos diversas especialidades médicas y contamos con el mejor equipo profesional para tu salud.
            </p>
          </div>

          <div className="imagenes-infografia">
            <img src="https://www.example.com/image1.jpg" alt="Imagen 1" className="imagen" />
            <img src="https://www.example.com/image2.jpg" alt="Imagen 2" className="imagen" />
            <img src="https://www.example.com/image3.jpg" alt="Imagen 3" className="imagen" />
          </div>
        </div>
      </section>
    </>
  )
}

export default Nosotros
