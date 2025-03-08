import { useEffect, useState } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/items")
      .then((response) => response.json())
      .then((data) => setItems(data));
  }, []);

  const addItem = async () => {
    const response = await fetch("http://127.0.0.1:5000/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newItem }),
    });
    const data = await response.json();
    setItems([...items, data]);
    setNewItem("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Flask + React</h1>
      <input
        type="text"
        className="border rounded p-2 mb-2"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="Enter an item"
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={addItem}
      >
        Add Item
      </button>
      <ul className="mt-4">
        {items.map((item) => (
          <li key={item.id} className="p-2 bg-white shadow rounded my-2">
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
