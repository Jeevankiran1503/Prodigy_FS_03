import React from 'react';
import { useProductStore } from '../store/useProductStore';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddProducts = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const { addProduct, loading } = useProductStore();
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [sizes, setSizes] = React.useState('');
    const [colors, setColors] = React.useState('');
    const [image, setImage] = React.useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('You must be logged in to add a product.');
            navigate('/login');
            return;
        }
        if (!image) {
            toast.error('Please select an image for the product.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('sizes', sizes);
        formData.append('colors', colors);
        formData.append('image', image);

        await toast.promise(
            addProduct(formData),
            {
                loading: 'Adding product...',
                success: (data) => {
                    navigate('/');
                    return `Product "${data.product.name}" added successfully!`;
                },
                error: (err) => `Error: ${err.response?.data?.message || err.message}`,
            }
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="max-w-lg w-full bg-gray-800 p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-white text-center mb-6">Add a New Product</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    <input type="text" placeholder="Sizes (comma-separated)" value={sizes} onChange={(e) => setSizes(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="Colors (comma-separated)" value={colors} onChange={(e) => setColors(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600" required />
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Adding Product...' : 'Add Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProducts;
