import { useEffect } from "react"
import AddressForm from "../../components/modals/address_form/AddressForm"
import { Address } from "../../models/Address"
import { useDispatch, useSelector } from "react-redux"
import { loadAddresses } from "../../state/actions/addressActions"
import { addressSelector } from "../../state/selectors"
import CrudCard from "../../components/crud_components/crud_card/CrudCard"
import { AddressService } from '../../services/Address'
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import CrudDeleteModal from '../../components/crud_components/crud_delete_modal/CrudDeleteModal'

function Address() {

  const address = useSelector(addressSelector)
  const addressService = new AddressService()

  return (
    <>
          {/* <CrudHead/> */}
          <CrudCreateButton Modal={AddressForm} Title='Address'/>
          <div className="th-container">
            <span>Streat</span>
            <span></span>
            <span>Number</span>
            <span></span>
            <span>Location</span>
            <span>User ID</span>
          </div>
          { address && address[0] && address.map((cat:Address) => {
            return <CrudCard
            key={cat.id}
            obj={cat}
            EditModal={AddressForm}
            loadAction={loadAddresses}
            apiServ={addressService}
            DeleteModal={CrudDeleteModal}
            modelo='Address'
            />
          })}
    </>
  )
}

export default Address