import styles from '../styles/Home.module.css'
import ProductsTable from '../components/productsTable'

export default function Home() {
  return (
    <div className={styles.container}>
      <ProductsTable />
    </div>
  )
} 
