import BillForm from "../../components/modals/bill_form/BillForm"
import { Bill } from "../../models/Bill"
import { useSelector } from "react-redux"
import { loadBills } from "../../state/actions/billActions"
import { billSelector } from "../../state/selectors"
import CrudCard from "../../components/crud_components/crud_card/CrudCard"
import { BillService } from '../../services/Bill'
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import CrudDeleteModal from '../../components/crud_components/crud_delete_modal/CrudDeleteModal'
import { FiEdit2 } from 'react-icons/fi'
import { RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri';

function Bill() {

  const bill: Bill[] = useSelector(billSelector)
  const billService = new BillService()

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
            {bill.map((b: Bill, i: number) => (
              <tr key={i}>
                <td>{b.date}</td>
                <td>{b.order.id}</td>
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
    //       <CrudCreateButton Modal={BillForm} Title='Bill'/>
    //       <div className="th-container">
    //         <span>Date</span>
    //         <span></span>
    //         <span>Order ID</span>
    //       </div>
    //       { bill && bill[0] && bill.map((cat:Bill) => {
    //         return <CrudCard
    //         key={cat.id}
    //         obj={cat}
    //         EditModal={BillForm}
    //         loadAction={loadBills}
    //         apiServ={billService}
    //         DeleteModal={CrudDeleteModal}
    //         modelo='Bill'
    //         />
    //       })}
    // </>
  )
}

export default Bill