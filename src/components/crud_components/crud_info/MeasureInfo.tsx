interface props {
    obj: {
        measure: string;
    }
}
const MeasureInfo = ({obj}: props) => {
  return (
        <span className='card-name'>{obj.measure}</span>
  )
}

export default MeasureInfo