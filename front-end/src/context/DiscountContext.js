import React, { createContext, useContext, useState, useEffect } from 'react';
import ProductService from '../services/api/ProductService';

export const DiscountContext = createContext();

export const useDiscount = () => useContext(DiscountContext);

export const DiscountProvider = ({ children }) => {
  const [discountSuggestions, setDiscountSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDiscountSuggestions = async () => {
    setLoading(true);
    try {
      const data = await ProductService.getAlldDiscountSuggestions();
      setDiscountSuggestions(data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscountSuggestions();
  }, []);

  return (
    <DiscountContext.Provider value={{ discountSuggestions, loading, error, refetch: fetchDiscountSuggestions }}>
      {children}
    </DiscountContext.Provider>
  );
};
