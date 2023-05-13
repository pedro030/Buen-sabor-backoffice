import { Section } from "../../../models/Section";

interface props {
  obj: {
    id: string,
    name: string,
    section: Section
  }
}
const LocationInfo = ({ obj }: props) => {
  return (
    <>
      <span className='card-name'>{obj.name}</span>
      <span className='card-name'>{obj.section.name}</span>
    </>
  )
}

export default LocationInfo