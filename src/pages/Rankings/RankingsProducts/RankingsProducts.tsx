import { useEffect, useState } from "react"
import store from "../../../state/store/store";

const RankingsProducts = () => {
  const token = store.getState().userSession.token
  const apiURL = import.meta.env.VITE_REACT_APP_API_URL;
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch(`${apiURL}/products/getByQuanSold`, {
      headers: {
        Authorization: `Bearer ${(token).trim()}`
      }
    })
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(error => console.error(error))
  }, [])

  return (
    <div>
      Rankings Products
      {
        products.map((product: any, index: number) => {
          <div key={index}>
            <h1>{product.name}</h1>
          </div>
        })
      }
    </div>
  )
}

export default RankingsProducts
