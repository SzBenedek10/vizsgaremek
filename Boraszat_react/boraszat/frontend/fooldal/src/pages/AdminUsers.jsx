import React, { useEffect, useState } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Delete as DeleteIcon, Person as PersonIcon } from '@mui/icons-material';
import axios from 'axios';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);

    // Felhasználók betöltése
    const loadUsers = async () => {
        const res = await axios.get('http://localhost:5000/api/admin/users');
        setUsers(res.data);
    };

    useEffect(() => { loadUsers(); }, []);

    // Törlés funkció
    const handleDelete = async (id) => {
        if (window.confirm("Biztosan törlöd?")) {
            await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
            loadUsers(); // Lista frissítése
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'nev', headerName: 'Név', width: 200 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'role', headerName: 'Jogkör', width: 120 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Műveletek',
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<DeleteIcon color="error" />}
                    label="Törlés"
                    onClick={() => handleDelete(params.id)}
                />
            ],
        },
    ];

    return (
        <div style={{ height: 400, width: '100%', padding: '20px' }}>
            <h2>Adminisztrációs felület - Felhasználók</h2>
            <DataGrid rows={users} columns={columns} pageSize={5} autoHeight />
        </div>
    );
}