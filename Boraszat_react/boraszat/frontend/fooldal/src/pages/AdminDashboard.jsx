import React, { useEffect, useState, useContext } from 'react';
import { 
  Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Button, Box, Tab, Tabs, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Select, MenuItem, InputLabel, FormControl 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0); // 0: Borok, 1: Felhasználók

  // Adatok state
  const [borok, setBorok] = useState([]);
  const [users, setUsers] = useState([]);

  // Modal (Dialog) statek
  const [openBorDialog, setOpenBorDialog] = useState(false);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [editingBor, setEditingBor] = useState(null); // Ha null, akkor új hozzáadása, amúgy szerkesztés

  // Űrlap statek (Bor)
  const [borForm, setBorForm] = useState({
    nev: '', evjarat: '', ar: '', keszlet: '', leiras: '', bor_szin_id: 1, alkoholfok: ''
  });

  // Űrlap state (User hozzáadásához)
  const [userForm, setUserForm] = useState({
    nev: '', email: '', password_hash: '', telefonszam: ''
  });

  // Védelmi ellenőrzés
  useEffect(() => {
    if (user && user.role !== 'ADMIN') navigate('/');
  }, [user, navigate]);

  // Adatok betöltése
  useEffect(() => {
    fetchBorok();
    fetchUsers();
  }, []);

  const fetchBorok = async () => {
    try { const res = await axios.get('http://localhost:5000/api/borok'); setBorok(res.data); } 
    catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try { const res = await axios.get('http://localhost:5000/api/users'); setUsers(res.data); } 
    catch (err) { console.error(err); }
  };

  // --- BOR KEZELÉS (MŰVELETEK) ---

  const handleOpenBorDialog = (bor = null) => {
    if (bor) {
      setEditingBor(bor);
      setBorForm(bor); // Betöltjük az adatokat a formba
    } else {
      setEditingBor(null);
      setBorForm({ nev: '', evjarat: '2023', ar: '', keszlet: '0', leiras: '', bor_szin_id: 1, alkoholfok: '' });
    }
    setOpenBorDialog(true);
  };

  const handleSaveBor = async () => {
    try {
      if (editingBor) {
        // Módosítás (PUT)
        await axios.put(`http://localhost:5000/api/borok/${editingBor.id}`, borForm);
        Swal.fire('Siker', 'Bor frissítve!', 'success');
      } else {
        // Új hozzáadása (POST)
        await axios.post('http://localhost:5000/api/borok', borForm);
        Swal.fire('Siker', 'Új bor hozzáadva!', 'success');
      }
      setOpenBorDialog(false);
      fetchBorok(); // Lista frissítése
    } catch (error) {
      Swal.fire('Hiba', 'Nem sikerült a mentés.', 'error');
    }
  };

  const handleDeleteBor = (id) => {
    Swal.fire({ title: 'Biztosan törlöd?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Igen' })
      .then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(`http://localhost:5000/api/borok/${id}`);
          fetchBorok();
          Swal.fire('Törölve!', '', 'success');
        }
      });
  };

  // --- USER KEZELÉS (MŰVELETEK) ---
  
  const handleSaveUser = async () => {
    // Ez gyakorlatilag a regisztráció végpont meghívása
    try {
        await axios.post('http://localhost:5000/api/register', { ...userForm, orszag:'Magyarország' });
        setOpenUserDialog(false);
        fetchUsers();
        Swal.fire('Siker', 'Felhasználó létrehozva!', 'success');
    } catch(err) {
        Swal.fire('Hiba', err.response?.data?.error || 'Hiba történt', 'error');
    }
  };

  const handleDeleteUser = (id) => {
    Swal.fire({ title: 'Biztosan törlöd a felhasználót?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Igen' })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.delete(`http://localhost:5000/api/users/${id}`);
            fetchUsers();
            Swal.fire('Törölve!', '', 'success');
          } catch(err) {
             Swal.fire('Hiba', err.response?.data?.error || 'Nem sikerült törölni', 'error');
          }
        }
      });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ color: '#722f37', fontWeight: 'bold', mb: 2 }}>
        Admin Vezérlőpult
      </Typography>

      {/* FÜLEK (TABS) */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} textColor="inherit" indicatorColor="primary">
          <Tab label="Borok kezelése" />
          <Tab label="Felhasználók kezelése" />
        </Tabs>
      </Box>

      {/* --- 1. TAB: BOROK --- */}
      {tabIndex === 0 && (
        <>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2, bgcolor: '#722f37' }} onClick={() => handleOpenBorDialog()}>
            Új bor hozzáadása
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: '#eee' }}>
                <TableRow>
                  <TableCell>Név</TableCell>
                  <TableCell>Évjárat</TableCell>
                  <TableCell>Ár</TableCell>
                  <TableCell>Készlet</TableCell>
                  <TableCell align="center">Műveletek</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {borok.map((bor) => (
                  <TableRow key={bor.id}>
                    <TableCell>{bor.nev}</TableCell>
                    <TableCell>{bor.evjarat}</TableCell>
                    <TableCell>{bor.ar} Ft</TableCell>
                    <TableCell>{bor.keszlet} db</TableCell>
                    <TableCell align="center">
                      <Button color="primary" onClick={() => handleOpenBorDialog(bor)}><EditIcon /></Button>
                      <Button color="error" onClick={() => handleDeleteBor(bor.id)}><DeleteIcon /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* --- 2. TAB: USERS --- */}
      {tabIndex === 1 && (
        <>
           <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2, bgcolor: '#722f37' }} onClick={() => setOpenUserDialog(true)}>
            Új felhasználó
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: '#eee' }}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Név</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Szerepkör</TableCell>
                  <TableCell align="center">Műveletek</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.id}</TableCell>
                    <TableCell>{u.nev}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell align="center">
                      <Button color="error" onClick={() => handleDeleteUser(u.id)} disabled={u.role === 'ADMIN'}>
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* --- DIALOG: BOR SZERKESZTÉS/LÉTREHOZÁS --- */}
      <Dialog open={openBorDialog} onClose={() => setOpenBorDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingBor ? 'Bor szerkesztése' : 'Új bor hozzáadása'}</DialogTitle>
        <DialogContent>
            <TextField margin="dense" label="Név" fullWidth value={borForm.nev} onChange={(e) => setBorForm({...borForm, nev: e.target.value})} />
            <TextField margin="dense" label="Évjárat" type="number" fullWidth value={borForm.evjarat} onChange={(e) => setBorForm({...borForm, evjarat: e.target.value})} />
            <TextField margin="dense" label="Ár (Ft)" type="number" fullWidth value={borForm.ar} onChange={(e) => setBorForm({...borForm, ar: e.target.value})} />
            <TextField margin="dense" label="Készlet (db)" type="number" fullWidth value={borForm.keszlet} onChange={(e) => setBorForm({...borForm, keszlet: e.target.value})} />
            <TextField margin="dense" label="Alkoholfok (%)" type="number" fullWidth value={borForm.alkoholfok} onChange={(e) => setBorForm({...borForm, alkoholfok: e.target.value})} />
            <TextField margin="dense" label="Leírás" multiline rows={3} fullWidth value={borForm.leiras} onChange={(e) => setBorForm({...borForm, leiras: e.target.value})} />
            
            <FormControl fullWidth margin="dense">
                <InputLabel>Típus (Szín)</InputLabel>
                <Select value={borForm.bor_szin_id} label="Típus (Szín)" onChange={(e) => setBorForm({...borForm, bor_szin_id: e.target.value})}>
                    <MenuItem value={1}>Fehér</MenuItem>
                    <MenuItem value={2}>Vörös</MenuItem>
                    <MenuItem value={3}>Rosé</MenuItem>
                </Select>
            </FormControl>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpenBorDialog(false)}>Mégsem</Button>
            <Button onClick={handleSaveBor} variant="contained" sx={{ bgcolor: '#722f37' }}>Mentés</Button>
        </DialogActions>
      </Dialog>

      {/* --- DIALOG: USER HOZZÁADÁS --- */}
      <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Új felhasználó</DialogTitle>
        <DialogContent>
            <TextField margin="dense" label="Név" fullWidth onChange={(e) => setUserForm({...userForm, nev: e.target.value})} />
            <TextField margin="dense" label="Email" fullWidth onChange={(e) => setUserForm({...userForm, email: e.target.value})} />
            <TextField margin="dense" label="Jelszó" type="password" fullWidth onChange={(e) => setUserForm({...userForm, password_hash: e.target.value})} />
            <TextField margin="dense" label="Telefonszám" fullWidth onChange={(e) => setUserForm({...userForm, telefonszam: e.target.value})} />
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpenUserDialog(false)}>Mégsem</Button>
            <Button onClick={handleSaveUser} variant="contained" sx={{ bgcolor: '#722f37' }}>Létrehozás</Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
}