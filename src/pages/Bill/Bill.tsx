import BillForm from "../../components/modals/bill_form/BillForm"
import { Bill } from "../../models/Bill"
import { useDispatch, useSelector } from "react-redux"
import { loadBills } from "../../state/actions/billActions"
import { billSelector } from "../../state/selectors"
import CrudCard from "../../components/crud_components/crud_card/CrudCard"
import { BillService } from '../../services/Bill'
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import CrudDeleteModal from '../../components/crud_components/crud_delete_modal/CrudDeleteModal'
import { FiEdit2 } from 'react-icons/fi'
import { RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri';

function Bill() {

  const dispatch = useDispatch()
  const bill: Bill[] = useSelector(billSelector)
  const billService = new BillService()

  const handleDelete = (state: Bill) => {
    if (confirm(`You want to delete this item?`)) {
      billService.deleteObj(state)
        .then(() => {
          billService.GetAll()
            .then((res: Bill[]) => {
              dispatch(loadBills(res))
            })
        })
    }
  }

  return (
    <div className="m-4">
      <CrudCreateButton Modal={BillForm} Title='Bills' />
      <h2 className='my-2 text-lg font-bold text-center stat-title'>Bills</h2>
      <div className="overflow-x-auto h-[35rem]">
        <table className="table table-xs table-pin-rows ">
          <thead>
            <tr>
              <th>Date</th>
              <th>Order ID</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bill.map((item: Bill, i: number) => (
              <tr key={i}>
                <td>{item.date}</td>
                <td>{item.order.id}</td>
                <td>
                  <div className='flex gap-2'>
                    <button><RiEyeLine className='w-5 h-5 eye-icon' /> </button>
                    <button><FiEdit2 className='w-5 h-5 edit-icon' /> </button>
                    <button onClick={() => handleDelete(item)}><RiDeleteBin6Line className='w-5 h-5 delete-icon' /> </button>
                  </div>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Bill