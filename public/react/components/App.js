import React, { useEffect, useState } from "react";

import apiURL from "../api";

export const App = () => {
	const [items, setItems] = useState([]);
	const [currentItem, setCurrentItem] = useState(null);

	async function deleteItem(id) {
		const response = await fetch(`${apiURL}/items/${id}`, {
			method: "DELETE",
		});

		if (response.ok) {
			const filteredItems = items.filter(item => {
				if (item.id === id) {
					return false;
				} else {
					return true;
				}
			});

			setItems(filteredItems);

			setCurrentItem(null);
		}
	}

	function confirmDelete(id) {
		const confirmed = window.confirm("Are you sure you want to delete this item?");

		if (confirmed) {
			deleteItem(id);
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

	if (!currentItem) {
		return (
			<main>
				<h1>Inventory App</h1>
				<ul>
					{items.map(item => (
						<li key={item.id}>
							<h2>
								<button onClick={() => setCurrentItem(item)}>{item.name}</button>
							</h2>
							<img src={item.image} alt="" />
						</li>
					))}
				</ul>
			</main>
		);
	}

	return (
		<main>
			<h1>{currentItem.name}</h1>
			<p>£{currentItem.price.toFixed(2)}</p>
			<p>{currentItem.description}</p>
			<img src={currentItem.image} alt="" />
			<p>
				<button onClick={() => setCurrentItem(null)}>All Items</button>
			</p>
			<p>
				<button onClick={() => confirmDelete(currentItem.id)}>Delete Item</button>
			</p>
		</main>
	);
};