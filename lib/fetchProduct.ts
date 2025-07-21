// lib/fetchProduct.ts
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";

export interface Product {
  id?: string;
  title: string;
  description: string;
  image: string; // This will be a URL from Firebase Storage
  link: string;
}

// Fetch all products from Firestore
export const fetchProducts = async (): Promise<Product[]> => {
  const productsCol = collection(firestore, "products");
  try {
    const productSnapshot = await getDocs(productsCol);
    if (productSnapshot.empty) {
      return [];
    }
    return productSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Add a new product to Firestore
export const addProduct = async (product: Omit<Product, "id">) => {
  const productsCol = collection(firestore, "products");
  try {
    const docRef = await addDoc(productsCol, product);
    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    return null;
  }
};

// Update an existing product in Firestore
export const updateProduct = async (id: string, updates: Partial<Product>) => {
  const productDoc = doc(firestore, "products", id);
  try {
    await updateDoc(productDoc, updates);
    return true;
  } catch (error) {
    console.error("Error updating product:", error);
    return false;
  }
};

// Delete a product from Firestore
export const deleteProduct = async (id: string) => {
  const productDoc = doc(firestore, "products", id);
  try {
    await deleteDoc(productDoc);
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
};
