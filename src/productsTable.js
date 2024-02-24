import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductsTable.css';
import { API_URL } from './constants';

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: '',
    unitPrice: '',
    stock: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL + '/items');
      setProducts(response.data);
    } catch (error) {
      console.error("Couldn't fetch products", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/items/delete/${id}`);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Couldn't delete product", error);
    }
  };

  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setIsEditMode(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      name: currentProduct.name,
      unitPrice: parseInt(currentProduct.unit_price, 10),
      stock: parseInt(currentProduct.stock, 10),
    };

    try {
      if (isEditMode) {
        await axios.put(
          `${API_URL}/items/update/${currentProduct.id}`,
          productData
        );
        setProducts(
          products.map((product) =>
            product.id === currentProduct.id
              ? { ...product, ...productData }
              : product
          )
        );
        await fetchProducts();
      } else {
        const response = await axios.post(
          API_URL + '/items/createItem',
          productData
        );
        setProducts([...products, response.data]);
      }
      setCurrentProduct({ id: null, name: '', unit_price: '', stock: '' });
      setIsEditMode(false);
    } catch (error) {
      console.error("Couldn't submit the form", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Unit Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.unit_price}</td>
              <td>{product.stock}</td>
              <td>
                <button
                  className="button edit"
                  onClick={() => handleEditClick(product)}
                >
                  Edit
                </button>
                <button
                  className="button delete"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="form-container">
        <form onSubmit={handleSubmit} className="add-product-form">
          <input
            type="text"
            value={currentProduct.name}
            onChange={(e) =>
              setCurrentProduct({ ...currentProduct, name: e.target.value })
            }
            placeholder="Name"
            required
          />
          <input
            type="number"
            value={currentProduct.unit_price}
            onChange={(e) =>
              setCurrentProduct({
                ...currentProduct,
                unit_price: e.target.value,
              })
            }
            placeholder="Unit Price"
            required
          />
          <input
            type="number"
            value={currentProduct.stock}
            onChange={(e) =>
              setCurrentProduct({ ...currentProduct, stock: e.target.value })
            }
            placeholder="Stock"
            required
          />
          <button type="submit">
            {isEditMode ? 'Update Product' : 'Add Product'}
          </button>
          {isEditMode && (
            <button onClick={() => setIsEditMode(false)}>Cancel</button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProductsTable;
