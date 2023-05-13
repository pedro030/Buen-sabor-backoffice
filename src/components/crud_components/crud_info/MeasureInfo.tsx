interface props {
    obj: {
        name: string;
    }
}
const MeasureInfo = ({obj}: props) => {
  return (
        <span className='card-name'>{obj.name}</span>
  )
}

export default MeasureInfo