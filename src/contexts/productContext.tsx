import { debounce } from "@mui/material";
import { Cancelable } from "@mui/utils/debounce";
import React, { useContext, useState } from "react";
import { createContext } from "react";

interface ProductContext {
  selectedCategory: number;
  setSelectedCategory: React.Dispatch<number>;
  currentPage: number;
  setCurrentPage: React.Dispatch<number>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<string>;
  handleChangeSearchTerm: ((e: React.ChangeEvent<HTMLInputElement>) => void) & Cancelable;
};

const ProductContext = createContext<ProductContext>(null);

export const ProductProvider : React.FC<{ children: React.ReactNode }> = ({
  children,
}) => { 
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedCategory, setSelectedCategory] = useState<number>();
    const [searchTerm, setSearchTerm] = useState<string>("");

    const changeSearchTerm = (e : React.ChangeEvent<HTMLInputElement> ) =>  {
        const value = e.target.value;
        setSearchTerm(value);
    }       

    const handleChangeSearchTerm = debounce(changeSearchTerm, 500);


    return (
      <ProductContext.Provider
        value={{
          currentPage,
          setCurrentPage,
          selectedCategory,
          setSelectedCategory,
          handleChangeSearchTerm,
          setSearchTerm,
          searchTerm,
        }}
      >
        {children}
      </ProductContext.Provider>
    );
};

export const useProduct = ( ) => { 
    return useContext(ProductContext);
}
