import Sidebar from '../Sidebar'
import TopHeader from '../TopHeader'
import '../../styles/common.css'

function LayoutWithSidebar({ children, showTopHeader = false, topHeaderText = '' }) {
  return (
    <div className="layout-with-sidebar">
      <Sidebar />
      <div className={`main-content ${showTopHeader ? 'white' : ''}`}>
        {showTopHeader && <TopHeader text={topHeaderText} />}
        {children}
      </div>
    </div>
  )
}

export default LayoutWithSidebar

