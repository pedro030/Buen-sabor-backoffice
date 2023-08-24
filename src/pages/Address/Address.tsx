import AddressForm from "../../components/modals/address_form/AddressForm"
import { Address } from "../../models/Address"
import { useDispatch, useSelector } from "react-redux"
import { loadAddresses } from "../../state/actions/addressActions"
import { addressSelector } from "../../state/selectors"
import CrudCard from "../../components/crud_components/crud_card/CrudCard"
import { AddressService } from '../../services/Address'
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import CrudDeleteModal from '../../components/crud_components/crud_delete_modal/CrudDeleteModal'
import { FiEdit2 } from 'react-icons/fi'
import { RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri';
import { useState } from "react"

function Address() {

  const dispatch = useDispatch()
  const address = useSelector(addressSelector)
  const addressService = new AddressService()

  // edit modal config
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [selectedAddress, setSelectedAddress] = useState<Address>()
  const openEditModal = (l: Address) => {
    setSelectedAddress(l);
    setEditModalOpen(true)
  }

  const handleDelete = (state: Address) => {
    if (confirm(`You want to delete this item?`)) {
      addressService.deleteObj(state)
        .then(() => {
          addressService.GetAll()
            .then((res: Address[]) => {
              dispatch(loadAddresses(res))
            })
        })
    }
  }

  return (
    <div className="m-4">
      <CrudCreateButton Modal={AddressForm} Title='Addresses' />
      <AddressForm
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        obj={selectedAddress}
      />
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Addresses</h2>
      <div className="flex items-center justify-center w-full gap-5 my-5">
        <input type="text" placeholder='STREET' className=" input input-sm input-disabled" />
        <input type="text" placeholder='LOCATION' className=" input input-sm input-disabled" />
        <select className="w-full max-w-xs select select-bordered select-sm" /*onChange={handleChangeSorting}*/>
          <option selected value={1}>SORT BY: FEATURED</option>
          <option value={2}>SORT BY PRICE: LOW to HIGH</option>
          <option value={3}>SORT BY PRICE: HIGH to LOW</option>
          <option value={4}>SORT BY NAME: A - Z</option>
          <option value={5}>SORT BY NAME: Z - A</option>
        </select>
      </div>
      <div className="overflow-x-auto h-[35rem]">
        <table className="table table-xs table-pin-rows ">
          <thead>
            <tr>
              <th>Street</th>
              <th>Number</th>
              <th>Location</th>
              <th>User ID</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {address.map((addressItem: Address, i: number) => (
              <tr key={i}>
                <td>{addressItem.street}</td>
                <td>{addressItem.number}</td>
                <td>{addressItem.location.location}</td>
                <td>{addressItem.user.id}</td>
                <td>
                  <div className='flex gap-2'>
                    <button><RiEyeLine className='w-5 h-5 eye-icon' /> </button>
                    <button onClick={() => openEditModal(addressItem)}><FiEdit2 className='w-5 h-5 edit-icon' /> </button>
                    <button onClick={() => handleDelete(addressItem)}><RiDeleteBin6Line className='w-5 h-5 delete-icon' /> </button>
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