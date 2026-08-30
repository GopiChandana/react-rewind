import { restaurants } from './restaurantData'

const foods = restaurants.map((restaurant)=> restaurant.cuisine)
console.log(foods)