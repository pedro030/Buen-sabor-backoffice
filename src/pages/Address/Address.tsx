import AddressForm from "../../components/modals/address_form/AddressForm"
import { Address } from "../../models/Address"
import { useSelector } from "react-redux"
import { loadAddresses } from "../../state/actions/addressActions"
import { addressSelector } from "../../state/selectors"
import CrudCard from "../../components/crud_components/crud_card/CrudCard"
import { AddressService } from '../../services/Address'
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import CrudDeleteModal from '../../components/crud_components/crud_delete_modal/CrudDeleteModal'
import { FiEdit2 } from 'react-icons/fi'
import { RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri';

function Address() {

  const address = useSelector(addressSelector)
  const addressService = new AddressService()

  return (
    <div className="m-4">
      <CrudCreateButton Modal={AddressForm} Title='Addresses' />
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Addresses</h2>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Streat</th>
              <th>Number</th>
              <th>Location</th>
              <th>User ID</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {address.map((addressItem: Address, i:number) => (
              <tr key={i}>
                <td>{addressItem.streat}</td>
                <td>{addressItem.number}</td>
                <td>{addressItem.location.name}</td>
                <td>{addressItem.user.id}</td>
                <td>
                  <div className='flex gap-2'>
                    <RiEyeLine className='w-5 h-5 eye-icon' />
                    <FiEdit2 className='w-5 h-5 edit-icon' />
                    <RiDeleteBin6Line className='w-5 h-5 delete-icon' />
                  </div>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>
    // <>
    //       {/* <CrudHead/> */}
    //       <CrudCreateButton Modal={AddressForm} Title='Address'/>
    //       <div className="th-container">
    //         <span>Streat</span>
    //         <span></span>
    //         <span>Number</span>
    //         <span></span>
    //         <span>Location</span>
    //         <span>User ID</span>
    //       </div>
    //       { address && address[0] && address.map((cat:Address) => {
    //         return <CrudCard
    //         key={cat.id}
    //         obj={cat}
    //         EditModal={AddressForm}
    //         loadAction={loadAddresses}
    //         apiServ={addressService}
    //         DeleteModal={CrudDeleteModal}
    //         modelo='Address'
    //         />
    //       })}
    // </>
  )
}

export default Address