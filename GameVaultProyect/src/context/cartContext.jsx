/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [itemsCarro, setItemsCarro] = useState([]);

    const agregarAlCarro = (item) => {
        if (!itemsCarro.some((i) => i.id === item.id)) {
            setItemsCarro([...itemsCarro, item]);
        }
    };

    const eliminarDelCarro = (id) => {
        setItemsCarro((prev) =>
            prev.filter((item) => item.id !== id)
        );
    };

    const vaciarCarro = () => {
        setItemsCarro([]);
    };

    const total = itemsCarro.reduce(
        (acc, item) => acc + Number(item.price ?? item.precio ?? 0), 0
    );

    return (
        <CartContext.Provider
            value={{ itemsCarro, agregarAlCarro, eliminarDelCarro, vaciarCarro, total, }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => { return useContext(CartContext); };
