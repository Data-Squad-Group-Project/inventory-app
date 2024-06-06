import React, { useEffect, useState } from "react";
import "/public/style.css";
import apiURL from "../api";
import UpdateItemForm from "./UpdateItemForm";
import Inventory from "./Inventory";
import CreateItemForm from "./CreateItemForm";

export const App = () => {
    const [items, setItems] = useState([]);
    const [currentItem, setCurrentItem] = useState(null);
    const [isFormShowing, setIsFormShowing] = useState(false);
    const [isCreateFormShowing, setIsCreateFormShowing] = useState(false);
    const [isUpdateFormShowing, setIsUpdateFormShowing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    async function addItem(data) {
        const response = await fetch(`${apiURL}/items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const newItem = await response.json();
            setItems([newItem, ...items]);
            setIsFormShowing(false);
        }
    }

    async function updateItem(id, data) {
        const response = await fetch(`${apiURL}/items/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const updatedItem = await response.json();

            const updatedItems = items.map(item => {
                if (item.id === id) {
                    return updatedItem;
                } else {
                    return item;
                }
            });

            setItems(updatedItems);
            setCurrentItem(updatedItem);

            setIsUpdateFormShowing(false);
        }
    }

    async function deleteItem(id) {
        const response = await fetch(`${apiURL}/items/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            const filteredItems = items.filter(item => item.id !== id);
            setItems(filteredItems);
            setCurrentItem(null);
        }
    }

    useEffect(() => {
        async function fetchItems() {
            try {
                const response = await fetch(`${apiURL}/items`);
                const itemsData = await response.json();
                setItems(itemsData);
            } catch (err) {
                console.log("Oh no an error!", err);
            }
        }

        fetchItems();
    }, []);

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const getOtherItems = () => {
        const otherItems = items.filter(item => item.id !== currentItem.id);
        const shuffledItems = shuffleArray(otherItems);
        return shuffledItems.slice(0, 3);
    };

    return (
        <main>
            {currentItem && (
                <div>
                    <button onClick={() => setIsUpdateFormShowing(!isUpdateFormShowing)}>
                        {isUpdateFormShowing ? "Hide Form" : "Show Form"}
                    </button>
                    {isUpdateFormShowing && <UpdateItemForm {...currentItem} updateItem={updateItem} />}
                </div>
            )}

            {!currentItem && (
                <>
                    <h1>Inventory App, please browse our wares</h1>
                    <div className="search-bar-container">
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-bar"
                        />
                    </div>
                    <button onClick={() => setIsCreateFormShowing(!isCreateFormShowing)}>
                        {isCreateFormShowing ? "Hide Form" : "Show Form"}
                    </button>
                    {isCreateFormShowing && <CreateItemForm addItem={addItem} />}
                    <Inventory items={filteredItems} setCurrentItem={setCurrentItem} />
                </>
            )}

            {currentItem && (
                <div className="current-item">
                    <img src={currentItem.image} alt="" />
                    <div className="current-item-details">
                        <h1>{currentItem.name}</h1>
                        <p><strong>Price:</strong> £{currentItem.price.toFixed(2)}</p>
                        <p><strong>Category:</strong> {currentItem.category}</p>
                        <p><strong>Description:</strong> {currentItem.description}</p>
                        <div className="current-item-buttons">
                            <button onClick={() => setCurrentItem(null)}>All Items</button>
                            <button onClick={() => deleteItem(currentItem.id)}>Delete Item</button>
                        </div>
                    </div>
                </div>
            )}

            {currentItem && (
                <div className="other-items">
                    <h2>Other items you may be interested in...</h2>
                    <ul className="other-items-list">
                        {getOtherItems().map(item => (
                            <li key={item.id}>
                                <button onClick={() => setCurrentItem(item)}>
                                    <h3>{item.name}</h3>
                                    <img src={item.image} alt="" />
                                    <p>£{item.price.toFixed(2)}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </main>
    );
};
