import BillForm from "../../components/modals/bill_form/BillForm"
import { Bill } from "../../models/Bill"
import { useSelector } from "react-redux"
import { loadBills } from "../../state/actions/billActions"
import { billSelector } from "../../state/selectors"
import CrudCard from "../../components/crud_components/crud_card/CrudCard"
import { BillService } from '../../services/Bill'
import CrudCreateButton from '../../components/crud_components/crud_create_button/CrudCreateButton'
import CrudDeleteModal from '../../components/crud_components/crud_delete_modal/CrudDeleteModal'

function Bill() {

  const bill = useSelector(billSelector)
  const billService = new BillService()

  return (
    <>
          {/* <CrudHead/> */}
          <CrudCreateButton Modal={BillForm} Title='Bill'/>
          <div className="th-container">
            <span>Date</span>
            <span></span>
            <span>Order ID</span>
          </div>
          { bill && bill[0] && bill.map((cat:Bill) => {
            return <CrudCard
            key={cat.id}
            obj={cat}
            EditModal={BillForm}
            loadAction={loadBills}
            apiServ={billService}
            DeleteModal={CrudDeleteModal}
            modelo='Bill'
            />
          })}
    </>
  )
}

export default Bill