import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFolders();
    fetchImages();
  }, []);

  const fetchFolders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/folders', {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setFolders(res.data);
    } catch (err) {
      console.error(err);
    }
  };


    const fetchImages = async () => {
        try {
        const res = await axios.get('http://localhost:5000/api/images', {
            headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        setImages(res.data);
        } catch (err) {
        console.error(err);
        }
    };

    const createFolder = async (e) => {
        e.preventDefault();
        try {
        await axios.post('http://localhost:5000/api/folders', 
            { name: newFolderName, parentId: selectedFolder },
            { headers: { 'x-auth-token': localStorage.getItem('token') } }
        );
        setNewFolderName('');
        fetchFolders();
        } catch (err) {
        console.error(err);
        }
    };

    const uploadImage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', e.target.image.files[0]);
        formData.append('name', e.target.name.value);
        formData.append('folderId', selectedFolder);

        try {
        await axios.post('http://localhost:5000/api/images', formData, {
            headers: { 
            'x-auth-token': localStorage.getItem('token'),
            'Content-Type': 'multipart/form-data'
            }
        });
        fetchImages();
        } catch (err) {
        console.error(err);
        }
    };

    const searchImages = async () => {
        try {
        const res = await axios.get(`http://localhost:5000/api/images/search?query=${searchQuery}`, {
            headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        setImages(res.data);
        } catch (err) {
        console.error(err);
        }
    };

    return (
        <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        
        <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Create Folder</h3>
            <form onSubmit={createFolder} className="flex">
            <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder Name"
                className="p-2 border rounded mr-2"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create</button>
            </form>
        </div>

        <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Upload Image</h3>
            <form onSubmit={uploadImage} className="flex flex-col">
            <input type="file" name="image" accept="image/*" className="mb-2" />
            <input type="text" name="name" placeholder="Image Name" className="p-2 border rounded mb-2" />
            <select 
                value={selectedFolder} 
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="p-2 border rounded mb-2"
            >
                <option value="">Select Folder</option>
                {folders.map(folder => (
                <option key={folder._id} value={folder._id}>{folder.name}</option>
                ))}
            </select>
            <button type="submit" className="bg-green-500 text-white p-2 rounded">Upload</button>
            </form>
        </div>

        <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Search Images</h3>
            <div className="flex">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search images..."
                className="p-2 border rounded mr-2"
            />
            <button onClick={searchImages} className="bg-purple-500 text-white p-2 rounded">Search</button>
            </div>
        </div>

        <div>
            <h3 className="text-xl font-semibold mb-2">Your Images</h3>
            <div className="grid grid-cols-3 gap-4">
            {images.map(image => (
                <div key={image._id} className="border p-2 rounded">
                <img src={`http://localhost:5000/${image.path}`} alt={image.name} className="w-full h-40 object-cover mb-2" />
                <p className="text-center">{image.name}</p>
            </div>
        ))}
        </div>
    </div>
    </div>
);
};

export default Dashboard;