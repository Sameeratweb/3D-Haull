import { proxy } from "valtio";

const state = proxy({
  intro: true,
  homeScrollY: 0,
  
  shirtColor: '#5B8CFF',
  pantsColor: '#2E3D6B',
  shoesColor: '#1A1A2E',
  selectedMesh: null,
  wishlist: [],  
  cart: [],      
  color: '#EFBD48',
})
export default state;