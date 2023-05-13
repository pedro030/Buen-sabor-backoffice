import { useEffect } from "react"
import SectionForm from "../../components/modals/section_form/SectionForm"
import { Section } from "../../models/Section"
import { useDispatch, useSelector } from "react-redux"
import { loadSections } from "../../state/actions/sectionActions"
import { sectionSelector } from "../../state/selectors"
import CrudCard from "../../components/crud_components/crud_card/CrudCard"
import { SectionService } from '../../services/Section'
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import CrudDeleteModal from '../../components/crud_components/crud_delete_modal/CrudDeleteModal'

function Section() {

  const section = useSelector(sectionSelector)
  const sectionService = new SectionService()

  return (
    <>
          {/* <CrudHead/> */}
          <CrudCreateButton Modal={SectionForm} Title='Section'/>
          <div className="th-container">
            <span>Section Name</span>
          </div>
          { section && section[0] && section.map((cat:Section) => {
            return <CrudCard
            key={cat.id}
            obj={cat}
            EditModal={SectionForm}
            loadAction={loadSections}
            apiServ={sectionService}
            DeleteModal={CrudDeleteModal}
            modelo='Section'
            />
          })}
    </>
  )
}

export default Section