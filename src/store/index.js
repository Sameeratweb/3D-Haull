import { proxy } from "valtio";

const state = proxy({
  intro: true,
  // Per-mesh colors
  shirtColor: '#5B8CFF',
  pantsColor: '#2E3D6B',
  shoesColor: '#1A1A2E',
  // Which mesh is currently selected for editing
  selectedMesh: null, // 'shirt' | 'pants' | 'shoes' | null
  // Wishlist & Cart
  wishlist: [],  // array of product ids
  cart: [],      // array of product ids
  // Legacy
  color: '#EFBD48',
})
export default state;