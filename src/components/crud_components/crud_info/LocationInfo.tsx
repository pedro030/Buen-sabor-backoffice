import { Section } from "../../../models/Section";

interface props {
  obj: {
    id: string,
    location: string,
    section: Section
  }
}
const LocationInfo = ({ obj }: props) => {
  return (
    <>
      <span className='card-name'>{obj.location}</span>
      <span className='card-name'>{obj.section.type}</span>
    </>
  )
}

export default LocationInfo