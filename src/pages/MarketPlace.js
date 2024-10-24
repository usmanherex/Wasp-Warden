import React, { useState } from 'react';
import { Search, Star, Tractor, Truck, Wrench } from 'lucide-react';

import Image1 from '../assets/images/sprayer.jpg';
import Image2 from '../assets/images/harvester.jpeg';
import Image3 from '../assets/images/tractor.jpeg';
import Image4 from '../assets/images/plough.jpg';

const equipment = [
  { id: 1, name: 'Compact Tractor', price: 15000, oldPrice: 18000, discount: '17%', image: Image3, category: 'Tractors', rating: 4.8, description: 'A versatile compact tractor suitable for small to medium-sized farms. Features a 30HP engine and hydraulic system.' },
  { id: 2, name: 'Harvester', price: 50000, oldPrice: null, discount: null, image: Image2, category: 'Harvesters', rating: 4.9, description: 'High-capacity harvester with advanced threshing technology. Ideal for large-scale grain harvesting operations.' },
  { id: 3, name: 'Sprayer', price: 8000, oldPrice: 10000, discount: '20%', image: Image1, category: 'Sprayers', rating: 4.7, description: 'Efficient crop sprayer with a 500-gallon tank and 60-foot boom. Provides precise chemical application.' },
  { id: 4, name: 'Plough', price: 2000, oldPrice: null, discount: null, image: Image4, category: 'Tillage Equipment', rating: 4.6, description: 'Heavy-duty plough for primary tillage. Suitable for various soil types and field conditions.' },
];

const SearchBar = () => (
  <div className="relative w-full max-w-2xl mx-auto mt-8 mb-12">
    <input
      type="text"
      placeholder="Search for agricultural equipment"
      className="w-full p-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
    />
    <button className="absolute right-0 top-0 h-full px-4 bg-green-600 text-white rounded-r-lg">
      <Search className="w-6 h-6" />
    </button>
  </div>
);

const EquipmentCard = ({ equipment, onEquipmentClick }) => (
  <div className="bg-white p-4 rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105" onClick={() => onEquipmentClick(equipment)}>
    <div className="relative mb-4">
      <img src={equipment.image} alt={equipment.name} className="w-full h-48 object-cover rounded" />
      {equipment.discount && (
        <span className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-sm">{equipment.discount}</span>
      )}
    </div>
    <h3 className="font-semibold text-lg">{equipment.name}</h3>
    <p className="text-gray-600">{equipment.category}</p>
    <div className="flex justify-between items-center mt-2">
      <div>
        <span className="text-green-700 font-bold text-xl">${equipment.price.toLocaleString()}</span>
        {equipment.oldPrice && (
          <span className="text-gray-400 line-through ml-2">${equipment.oldPrice.toLocaleString()}</span>
        )}
      </div>
      <div className="flex items-center">
        <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
        <span>{equipment.rating}</span>
      </div>
    </div>
  </div>
);

const EquipmentPopup = ({ equipment, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg p-8 max-w-3xl w-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-3xl font-bold text-green-800">{equipment.name}</h2>
          <p className="text-gray-600">{equipment.category}</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
          &times;
        </button>
      </div>
      <div className="flex flex-col md:flex-row mb-6">
        <img src={equipment.image} alt={equipment.name} className="w-full md:w-1/2 h-64 object-cover rounded mr-6 mb-4 md:mb-0" />
        <div className="flex-1">
          <div className="flex items-center mb-4">
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm mr-2">
              {equipment.discount || 'New'}
            </span>
            <span className="bg-yellow-400 text-white px-3 py-1 rounded-full text-sm flex items-center">
              <Star className="w-4 h-4 mr-1" fill="currentColor" /> {equipment.rating}
            </span>
          </div>
          <p className="text-gray-700 mb-4">{equipment.description}</p>
          <div className="flex items-center mb-4">
            <span className="text-green-700 text-3xl font-bold">${equipment.price.toLocaleString()}</span>
            {equipment.oldPrice && (
              <span className="text-gray-400 line-through ml-2 text-xl">${equipment.oldPrice.toLocaleString()}</span>
            )}
          </div>
          <button className="bg-green-600 text-white px-6 py-2 rounded-full w-full text-lg font-semibold hover:bg-green-700 transition-colors">
           Add to Cart
          </button>
          <p className="text-gray-600 mt-2 text-center">Limited stock available</p>
        </div>
      </div>
      <div className="border-t pt-4">
        <h3 className="font-semibold text-lg mb-2">Equipment Details:</h3>
        <ul className="list-disc list-inside text-gray-700">
          <li>Manufacturer: FarmTech Industries</li>
          <li>Model Year: 2024</li>
          <li>Warranty: 2 years</li>
          <li>Financing Options Available</li>
        </ul>
      </div>
    </div>
  </div>
);

const AgriEquipmentMarketplace = () => {
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  return (
    <div className="bg-white min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-4 text-green-800">Agricultural Equipment Marketplace</h1>
      <p className="text-center text-gray-600 mb-8">
        Find the best farming equipment to boost your agricultural productivity
      </p>
      <SearchBar />
      <div className="flex justify-center space-x-4 mb-8">
        <CategoryButton icon={<Tractor className="w-6 h-6 mr-2" />} label="Tractors" />
        <CategoryButton icon={<Wrench className="w-6 h-6 mr-2" />} label="Farm Tools" />
        <CategoryButton icon={<Truck className="w-6 h-6 mr-2" />} label="Harvesters" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {equipment.map(item => (
          <EquipmentCard key={item.id} equipment={item} onEquipmentClick={setSelectedEquipment} />
        ))}
      </div>
      {selectedEquipment && (
        <EquipmentPopup equipment={selectedEquipment} onClose={() => setSelectedEquipment(null)} />
      )}
    </div>
  );
};

const CategoryButton = ({ icon, label }) => (
  <button className="flex items-center bg-white text-green-700 px-4 py-2 rounded-full shadow-md hover:bg-green-100 transition-colors">
    {icon}
    {label}
  </button>
);

export default AgriEquipmentMarketplace;