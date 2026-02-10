import React, { useEffect, useState, useContext } from 'react';
import { 
  Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Button, Box, Tab, Tabs, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Select, MenuItem, InputLabel, FormControl, FormControlLabel, Switch 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event'; // Ikon a szolgáltatásokhoz
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0); // 0: Borok, 1: Felhasználók, 2: Szolgáltatások

  // Adatok state
  const [borok, setBorok] = useState([]);
  const [users, setUsers] = useState([]);
  const [szolgaltatasok, setSzolgaltatasok] = useState([]); // <--- ÚJ STATE

  // Modal (Dialog) statek
  const [openBorDialog, setOpenBorDialog] = useState(false);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openSzolgDialog, setOpenSzolgDialog] = useState(false); // <--- ÚJ DIALOG
  
  const [editingBor, setEditingBor] = useState(null);
  const [editingSzolg, setEditingSzolg] = useState(null); // <--- ÚJ SZERKESZTÉS STATE

  // Űrlap statek
  const [borForm, setBorForm] = useState({
    nev: '', evjarat: '', ar: '', keszlet: '', leiras: '', bor_szin_id: 1, alkoholfok: ''
  });

  const [userForm, setUserForm] = useState({
    nev: '', email: '', password_hash: '', telefonszam: ''
  });

  // <--- ÚJ FORM STATE A SZOLGÁLTATÁSHOZ
  const [szolgForm, setSzolgForm] = useState({
    nev: '', leiras: '', ar: '', kapacitas: '', datum: '', idotartam: '', extra: '', aktiv: 1
  });

  // Védelmi ellenőrzés
  useEffect(() => {
    if (user && user.role !== 'ADMIN') navigate('/');
  }, [user, navigate]);

  // Adatok betöltése
  useEffect(() => {
    fetchBorok();
    fetchUsers();
    fetchSzolgaltatasok(); // <--- BETÖLTÉS
  }, []);

  const fetchBorok = async () => { try { const res = await axios.get('http://localhost:5000/api/borok'); setBorok(res.data); } catch (err) { console.error(err); } };
  const fetchUsers = async () => { try { const res = await axios.get('http://localhost:5000/api/users'); setUsers(res.data); } catch (err) { console.error(err); } };
  
  // <--- ÚJ LEKÉRDEZÉS
  const fetchSzolgaltatasok = async () => { 
      try { 
          const res = await axios.get('http://localhost:5000/api/admin/szolgaltatasok'); 
          setSzolgaltatasok(res.data); 
      } catch (err) { console.error(err); } 
  };

  // --- BOR KEZELÉS ---
  const handleOpenBorDialog = (bor = null) => {
    if (bor) { setEditingBor(bor); setBorForm(bor); } 
    else { setEditingBor(null); setBorForm({ nev: '', evjarat: '2023', ar: '', keszlet: '0', leiras: '', bor_szin_id: 1, alkoholfok: '' }); }
    setOpenBorDialog(true);
  };

  const handleSaveBor = async () => {
    try {
      if (editingBor) await axios.put(`http://localhost:5000/api/borok/${editingBor.id}`, borForm);
      else await axios.post('http://localhost:5000/api/borok', borForm);
      Swal.fire('Siker', 'Bor mentve!', 'success'); setOpenBorDialog(false); fetchBorok();
    } catch (error) { Swal.fire('Hiba', 'Nem sikerült a mentés.', 'error'); }
  };

  const handleDeleteBor = (id) => {
    Swal.fire({ title: 'Biztosan törlöd?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Igen' })
      .then(async (result) => { if (result.isConfirmed) { await axios.delete(`http://localhost:5000/api/borok/${id}`); fetchBorok(); Swal.fire('Törölve!', '', 'success'); } });
  };

  // --- SZOLGÁLTATÁS (KÓSTOLÓ) KEZELÉS --- <--- ÚJ RÉSZ
  const handleOpenSzolgDialog = (szolg = null) => {
    if (szolg) {
      setEditingSzolg(szolg);
      // Dátum formázása az inputhoz (YYYY-MM-DD)
      const formattedDate = szolg.datum ? new Date(szolg.datum).toISOString().split('T')[0] : '';
      setSzolgForm({ ...szolg, datum: formattedDate });
    } else {
      setEditingSzolg(null);
      setSzolgForm({ nev: 'BORKOSTOLÁS', leiras: '', ar: '', kapacitas: 10, datum: '', idotartam: '02:00', extra: '', aktiv: 1 });
    }
    setOpenSzolgDialog(true);
  };

  const handleSaveSzolg = async () => {
    try {
      if (editingSzolg) await axios.put(`http://localhost:5000/api/szolgaltatasok/${editingSzolg.id}`, szolgForm);
      else await axios.post('http://localhost:5000/api/szolgaltatasok', szolgForm);
      Swal.fire('Siker', 'Kóstoló mentve!', 'success'); setOpenSzolgDialog(false); fetchSzolgaltatasok();
    } catch (error) { Swal.fire('Hiba', 'Nem sikerült a mentés.', 'error'); }
  };

  const handleDeleteSzolg = (id) => {
    Swal.fire({ title: 'Biztosan törlöd ezt a kóstolót?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Igen' })
      .then(async (result) => { if (result.isConfirmed) { await axios.delete(`http://localhost:5000/api/szolgaltatasok/${id}`); fetchSzolgaltatasok(); Swal.fire('Törölve!', '', 'success'); } });
  };

  // --- USER KEZELÉS ---
  const handleSaveUser = async () => {
    try { await axios.post('http://localhost:5000/api/register', { ...userForm, orszag:'Magyarország' }); setOpenUserDialog(false); fetchUsers(); Swal.fire('Siker', 'Felhasználó létrehozva!', 'success'); } 
    catch(err) { Swal.fire('Hiba', err.response?.data?.error || 'Hiba történt', 'error'); }
  };
  const handleDeleteUser = (id) => { Swal.fire({ title: 'Törlöd?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Igen' }).then(async (result) => { if (result.isConfirmed) { try { await axios.delete(`http://localhost:5000/api/users/${id}`); fetchUsers(); Swal.fire('Törölve!', '', 'success'); } catch(err) { Swal.fire('Hiba', 'Hiba történt', 'error'); } } }); };


  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ color: '#722f37', fontWeight: 'bold', mb: 2 }}>
        Admin Vezérlőpult
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} textColor="inherit" indicatorColor="primary">
          <Tab label="Borok kezelése" />
          <Tab label="Felhasználók" />
          <Tab label="BorKóstolók" icon={<EventIcon />} iconPosition="start" /> {/* ÚJ TAB */}
        </Tabs>
      </Box>

      {/* --- 1. TAB: BOROK --- */}
      {tabIndex === 0 && (
        <>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2, bgcolor: '#722f37' }} onClick={() => handleOpenBorDialog()}>Új bor</Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: '#eee' }}><TableRow><TableCell>Név</TableCell><TableCell>Évjárat</TableCell><TableCell>Ár</TableCell><TableCell>Készlet</TableCell><TableCell align="center">Műveletek</TableCell></TableRow></TableHead>
              <TableBody>{borok.map((bor) => (<TableRow key={bor.id}><TableCell>{bor.nev}</TableCell><TableCell>{bor.evjarat}</TableCell><TableCell>{bor.ar} Ft</TableCell><TableCell>{bor.keszlet} db</TableCell><TableCell align="center"><Button color="primary" onClick={() => handleOpenBorDialog(bor)}><EditIcon /></Button><Button color="error" onClick={() => handleDeleteBor(bor.id)}><DeleteIcon /></Button></TableCell></TableRow>))}</TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* --- 2. TAB: FELHASZNÁLÓK --- */}
      {tabIndex === 1 && (
        <>
           <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2, bgcolor: '#722f37' }} onClick={() => setOpenUserDialog(true)}>Új felhasználó</Button>
           <TableContainer component={Paper}><Table><TableHead sx={{ bgcolor: '#eee' }}><TableRow><TableCell>Név</TableCell><TableCell>Email</TableCell><TableCell>Szerepkör</TableCell><TableCell align="center">Műveletek</TableCell></TableRow></TableHead><TableBody>{users.map((u) => (<TableRow key={u.id}><TableCell>{u.nev}</TableCell><TableCell>{u.email}</TableCell><TableCell>{u.role}</TableCell><TableCell align="center"><Button color="error" onClick={() => handleDeleteUser(u.id)} disabled={u.role === 'ADMIN'}><DeleteIcon /></Button></TableCell></TableRow>))}</TableBody></Table></TableContainer>
        </>
      )}

      {/* --- 3. TAB: SZOLGÁLTATÁSOK (KÓSTOLÓK) --- */}
      {tabIndex === 2 && (
        <>
           <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2, bgcolor: '#722f37' }} onClick={() => handleOpenSzolgDialog()}>Új esemény</Button>
           <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: '#eee' }}>
                <TableRow>
                  <TableCell>Dátum</TableCell>
                  <TableCell>Név</TableCell>
                  <TableCell>Ár</TableCell>
                  <TableCell>Kapacitás</TableCell>
                  <TableCell>Státusz</TableCell>
                  <TableCell align="center">Műveletek</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {szolgaltatasok.map((sz) => (
                  <TableRow key={sz.id}>
                    <TableCell>{sz.datum ? new Date(sz.datum).toLocaleDateString() : 'Nincs dátum'}</TableCell>
                    <TableCell>{sz.nev}</TableCell>
                    <TableCell>{sz.ar} Ft</TableCell>
                    <TableCell>{sz.kapacitas} fő</TableCell>
                    <TableCell>{sz.aktiv ? "Aktív" : "Inaktív"}</TableCell>
                    <TableCell align="center">
                      <Button color="primary" onClick={() => handleOpenSzolgDialog(sz)}><EditIcon /></Button>
                      <Button color="error" onClick={() => handleDeleteSzolg(sz.id)}><DeleteIcon /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
           </TableContainer>
        </>
      )}

      {/* --- DIALOG: BOR --- */}
      <Dialog open={openBorDialog} onClose={() => setOpenBorDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingBor ? 'Bor szerkesztése' : 'Új bor'}</DialogTitle>
        <DialogContent>
            <TextField margin="dense" label="Név" fullWidth value={borForm.nev} onChange={(e) => setBorForm({...borForm, nev: e.target.value})} />
            <TextField margin="dense" label="Évjárat" type="number" fullWidth value={borForm.evjarat} onChange={(e) => setBorForm({...borForm, evjarat: e.target.value})} />
            <TextField margin="dense" label="Ár" type="number" fullWidth value={borForm.ar} onChange={(e) => setBorForm({...borForm, ar: e.target.value})} />
            <TextField margin="dense" label="Készlet" type="number" fullWidth value={borForm.keszlet} onChange={(e) => setBorForm({...borForm, keszlet: e.target.value})} />
            <TextField margin="dense" label="Leírás" multiline rows={2} fullWidth value={borForm.leiras} onChange={(e) => setBorForm({...borForm, leiras: e.target.value})} />
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpenBorDialog(false)}>Mégsem</Button>
            <Button onClick={handleSaveBor} variant="contained" sx={{ bgcolor: '#722f37' }}>Mentés</Button>
        </DialogActions>
      </Dialog>

      {/* --- DIALOG: SZOLGÁLTATÁS (ÚJ) --- */}
      <Dialog open={openSzolgDialog} onClose={() => setOpenSzolgDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingSzolg ? 'Kóstoló szerkesztése' : 'Új kóstoló létrehozása'}</DialogTitle>
        <DialogContent>
            <TextField margin="dense" label="Név" fullWidth value={szolgForm.nev} onChange={(e) => setSzolgForm({...szolgForm, nev: e.target.value})} />
            <TextField margin="dense" label="Dátum" type="date" fullWidth InputLabelProps={{shrink: true}} value={szolgForm.datum} onChange={(e) => setSzolgForm({...szolgForm, datum: e.target.value})} />
            <TextField margin="dense" label="Időtartam (pl. 02:00)" type="time" fullWidth InputLabelProps={{shrink: true}} value={szolgForm.idotartam} onChange={(e) => setSzolgForm({...szolgForm, idotartam: e.target.value})} />
            <TextField margin="dense" label="Ár (Ft/fő)" type="number" fullWidth value={szolgForm.ar} onChange={(e) => setSzolgForm({...szolgForm, ar: e.target.value})} />
            <TextField margin="dense" label="Kapacitás (fő)" type="number" fullWidth value={szolgForm.kapacitas} onChange={(e) => setSzolgForm({...szolgForm, kapacitas: e.target.value})} />
            <TextField margin="dense" label="Extra infó" fullWidth value={szolgForm.extra} onChange={(e) => setSzolgForm({...szolgForm, extra: e.target.value})} />
            <TextField margin="dense" label="Leírás" multiline rows={3} fullWidth value={szolgForm.leiras} onChange={(e) => setSzolgForm({...szolgForm, leiras: e.target.value})} />
            
            <FormControlLabel
              control={<Switch checked={Boolean(szolgForm.aktiv)} onChange={(e) => setSzolgForm({...szolgForm, aktiv: e.target.checked ? 1 : 0})} />}
              label="Aktív (Látható a weboldalon)" sx={{ mt: 1 }}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpenSzolgDialog(false)}>Mégsem</Button>
            <Button onClick={handleSaveSzolg} variant="contained" sx={{ bgcolor: '#722f37' }}>Mentés</Button>
        </DialogActions>
      </Dialog>
      
      {/* DIALOG: USER (marad ugyanaz, csak röviden) */}
      <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)}><DialogTitle>Új user</DialogTitle><DialogContent><TextField label="Név" fullWidth onChange={(e) => setUserForm({...userForm, nev: e.target.value})} /><TextField label="Email" fullWidth onChange={(e) => setUserForm({...userForm, email: e.target.value})} /><TextField label="Jelszó" type="password" fullWidth onChange={(e) => setUserForm({...userForm, password_hash: e.target.value})} /></DialogContent><DialogActions><Button onClick={() => setOpenUserDialog(false)}>Mégsem</Button><Button onClick={handleSaveUser} variant="contained">Mentés</Button></DialogActions></Dialog>

    </Container>
  );
}