import { useEffect, useState } from "react";
import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/products`;

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: ""
  });
  const [editId, setEditId] = useState(null);

  const getProducts = async () => {
    const res = await axios.get(API);
    setProducts(res.data);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity)
    };

    if (editId) {
      await axios.put(`${API}/${editId}`, data);
      setEditId(null);
    } else {
      await axios.post(API, data);
    }

    setForm({ name: "", category: "", price: "", quantity: "" });
    getProducts();
  };

  const deleteProduct = async (id) => {
    await axios.delete(`${API}/${id}`);
    getProducts();
  };

  const editProduct = (product) => {
    setForm(product);
    setEditId(product._id);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Inventory Manager</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
        <input name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} />
        <button type="submit">
          {editId ? "Update Product" : "Add Product"}
        </button>
      </form>

      <h2>Products</h2>

      {products.map((p) => (
        <div key={p._id} style={{ marginBottom: "10px" }}>
          {p.name} | {p.category} | ₹{p.price} | Qty: {p.quantity}

          <button onClick={() => editProduct(p)} style={{ marginLeft: "10px" }}>
            Edit
          </button>

          <button onClick={() => deleteProduct(p._id)} style={{ marginLeft: "10px" }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;