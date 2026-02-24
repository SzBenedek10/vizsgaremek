import React, { useEffect, useState, useContext } from 'react';
import { 
  Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Button, Box, Tab, Tabs, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Select, MenuItem, InputLabel, FormControl, FormControlLabel, Switch, Chip 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event'; 
import MessageIcon from '@mui/icons-material/Message';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HUF = new Intl.NumberFormat("hu-HU");

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0); 

  // --- ÁLLAPOTOK (STATE) ---
  const [borok, setBorok] = useState([]);
  const [users, setUsers] = useState([]);
  const [szolgaltatasok, setSzolgaltatasok] = useState([]);
  const [uzenetek, setUzenetek] = useState([]);
  const [rendelesek, setRendelesek] = useState([]);
  const [foglalasok, setFoglalasok] = useState([]);

  // Modal statek
  const [openBorDialog, setOpenBorDialog] = useState(false);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openSzolgDialog, setOpenSzolgDialog] = useState(false); 
  const [openUzenetDialog, setOpenUzenetDialog] = useState(false); // <--- ÚJ: ÜZENET DIALOG
  
  const [editingBor, setEditingBor] = useState(null);
  const [editingSzolg, setEditingSzolg] = useState(null); 
  const [editingUzenet, setEditingUzenet] = useState(null); // <--- ÚJ: ÜZENET SZERKESZTÉS

  // Űrlap statek
  const [borForm, setBorForm] = useState({ nev: '', evjarat: '', ar: '', keszlet: '', leiras: '', bor_szin_id: 1, alkoholfok: '' });
  const [userForm, setUserForm] = useState({ nev: '', email: '', password_hash: '', telefonszam: '' });
  const [szolgForm, setSzolgForm] = useState({ nev: '', leiras: '', ar: '', kapacitas: '', datum: '', idotartam: '', extra: '', aktiv: 1 });
  const [uzenetForm, setUzenetForm] = useState({ nev: '', email: '', targy: '', uzenet: '' }); // <--- ÚJ: ÜZENET FORM

  // Védelmi ellenőrzés
  useEffect(() => {
    if (user && user.role !== 'ADMIN') navigate('/');
  }, [user, navigate]);

  // Adatok betöltése
  useEffect(() => {
    fetchBorok();
    fetchUsers();
    fetchSzolgaltatasok();
    fetchUzenetek();
    fetchRendelesek();
    fetchFoglalasok();
  }, []);

  // --- LEKÉRDEZÉSEK ---
  const fetchBorok = async () => { try { const res = await axios.get('http://localhost:5000/api/borok'); setBorok(res.data); } catch (err) { console.error(err); } };
  const fetchUsers = async () => { try { const res = await axios.get('http://localhost:5000/api/users'); setUsers(res.data); } catch (err) { console.error(err); } };
  const fetchSzolgaltatasok = async () => { try { const res = await axios.get('http://localhost:5000/api/admin/szolgaltatasok'); setSzolgaltatasok(res.data); } catch (err) { console.error(err); } };
  const fetchUzenetek = async () => { try { const res = await axios.get('http://localhost:5000/api/admin/uzenetek'); setUzenetek(res.data); } catch (err) { console.error(err); } };
  const fetchRendelesek = async () => { try { const res = await axios.get('http://localhost:5000/api/admin/rendelesek'); setRendelesek(res.data); } catch (err) { console.error(err); } };
  const fetchFoglalasok = async () => { try { const res = await axios.get('http://localhost:5000/api/admin/foglalasok'); setFoglalasok(res.data); } catch (err) { console.error(err); } };

  // --- STÁTUSZ FRISSÍTÉSEK (Rendelés és Foglalás) ---
  const updateRendelesStatusz = async (id, ujStatusz) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/rendelesek/${id}/statusz`, { statusz: ujStatusz });
      fetchRendelesek();
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Státusz frissítve!', showConfirmButton: false, timer: 1500 });
    } catch (err) { Swal.fire('Hiba', 'Nem sikerült frissíteni a státuszt', 'error'); }
  };

  const updateFoglalasStatusz = async (id, ujStatusz) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/foglalasok/${id}/statusz`, { statusz: ujStatusz });
      fetchFoglalasok();
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Státusz frissítve!', showConfirmButton: false, timer: 1500 });
    } catch (err) { Swal.fire('Hiba', 'Nem sikerült frissíteni a státuszt', 'error'); }
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

  // --- SZOLGÁLTATÁS KEZELÉS --- 
  const handleOpenSzolgDialog = (szolg = null) => {
    if (szolg) {
      setEditingSzolg(szolg);
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

  // --- ÜZENET KEZELÉS ---
  const handleOpenUzenetDialog = (msg) => {
    setEditingUzenet(msg);
    setUzenetForm({ nev: msg.nev, email: msg.email, targy: msg.targy, uzenet: msg.uzenet });
    setOpenUzenetDialog(true);
  };
  
  const handleSaveUzenet = async () => {
    try {
      await axios.put(`http://localhost:5000/api/admin/uzenetek/${editingUzenet.id}`, uzenetForm);
      Swal.fire('Siker', 'Üzenet módosítva!', 'success'); 
      setOpenUzenetDialog(false); 
      fetchUzenetek();
    } catch (error) { Swal.fire('Hiba', 'Nem sikerült módosítani.', 'error'); }
  };

  const handleDeleteUzenet = (id) => { 
    Swal.fire({ title: 'Törlöd ezt az üzenetet?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Igen' })
    .then(async (result) => { 
        if (result.isConfirmed) { 
            await axios.delete(`http://localhost:5000/api/admin/uzenetek/${id}`); 
            fetchUzenetek(); 
            Swal.fire('Törölve!', '', 'success'); 
        } 
    }); 
  };

  // --- USER TÖRLÉS ---
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
        <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} variant="scrollable" scrollButtons="auto" textColor="inherit" indicatorColor="primary">
          <Tab label="Borok kezelése" />
          <Tab label="Felhasználók" />
          <Tab label="Kóstolók" icon={<EventIcon />} iconPosition="start" />
          <Tab label="Üzenetek" icon={<MessageIcon />} iconPosition="start" />
          <Tab label="Rendelések" icon={<ShoppingCartIcon />} iconPosition="start" />
          <Tab label="Foglalások" icon={<EventAvailableIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* --- 0. TAB: BOROK --- */}
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

      {/* --- 1. TAB: FELHASZNÁLÓK --- */}
      {tabIndex === 1 && (
        <>
           <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2, bgcolor: '#722f37' }} onClick={() => setOpenUserDialog(true)}>Új felhasználó</Button>
           <TableContainer component={Paper}><Table><TableHead sx={{ bgcolor: '#eee' }}><TableRow><TableCell>Név</TableCell><TableCell>Email</TableCell><TableCell>Szerepkör</TableCell><TableCell align="center">Műveletek</TableCell></TableRow></TableHead><TableBody>{users.map((u) => (<TableRow key={u.id}><TableCell>{u.nev}</TableCell><TableCell>{u.email}</TableCell><TableCell>{u.role}</TableCell><TableCell align="center"><Button color="error" onClick={() => handleDeleteUser(u.id)} disabled={u.role === 'ADMIN'}><DeleteIcon /></Button></TableCell></TableRow>))}</TableBody></Table></TableContainer>
        </>
      )}

      {/* --- 2. TAB: SZOLGÁLTATÁSOK --- */}
      {tabIndex === 2 && (
        <>
           <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2, bgcolor: '#722f37' }} onClick={() => handleOpenSzolgDialog()}>Új esemény</Button>
           <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: '#eee' }}><TableRow><TableCell>Dátum</TableCell><TableCell>Név</TableCell><TableCell>Ár</TableCell><TableCell>Kapacitás</TableCell><TableCell>Státusz</TableCell><TableCell align="center">Műveletek</TableCell></TableRow></TableHead>
              <TableBody>{szolgaltatasok.map((sz) => (<TableRow key={sz.id}><TableCell>{sz.datum ? new Date(sz.datum).toLocaleDateString() : 'Nincs dátum'}</TableCell><TableCell>{sz.nev}</TableCell><TableCell>{sz.ar} Ft</TableCell><TableCell>{sz.kapacitas} fő</TableCell><TableCell>{sz.aktiv ? "Aktív" : "Inaktív"}</TableCell><TableCell align="center"><Button color="primary" onClick={() => handleOpenSzolgDialog(sz)}><EditIcon /></Button><Button color="error" onClick={() => handleDeleteSzolg(sz.id)}><DeleteIcon /></Button></TableCell></TableRow>))}</TableBody>
            </Table>
           </TableContainer>
        </>
      )}

      {/* --- 3. TAB: ÜZENETEK --- */}
      {tabIndex === 3 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#eee' }}><TableRow><TableCell>Dátum</TableCell><TableCell>Feladó</TableCell><TableCell>Email</TableCell><TableCell>Tárgy</TableCell><TableCell>Üzenet</TableCell><TableCell align="center">Műveletek</TableCell></TableRow></TableHead>
            <TableBody>
              {uzenetek.length > 0 ? uzenetek.map((msg) => (
                  <TableRow key={msg.id} hover>
                      <TableCell>{new Date(msg.datum).toLocaleString('hu-HU')}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>{msg.nev}</TableCell>
                      <TableCell>{msg.email}</TableCell>
                      <TableCell>{msg.targy}</TableCell>
                      <TableCell sx={{ maxWidth: '300px', whiteSpace: 'pre-wrap' }}>{msg.uzenet}</TableCell>
                      <TableCell align="center">
                          <Button color="primary" onClick={() => handleOpenUzenetDialog(msg)}><EditIcon /></Button>
                          <Button color="error" onClick={() => handleDeleteUzenet(msg.id)}><DeleteIcon /></Button>
                      </TableCell>
                  </TableRow>
              )) : <TableRow><TableCell colSpan={6} align="center">Jelenleg nincsenek beérkezett üzenetek.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* --- 4. TAB: RENDELÉSEK --- */}
      {tabIndex === 4 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#eee' }}>
              <TableRow>
                <TableCell>Azonosító</TableCell>
                <TableCell>Dátum</TableCell>
                <TableCell>Vásárló Neve</TableCell>
                <TableCell>Végösszeg</TableCell>
                <TableCell>Státusz Módosítása</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rendelesek.length > 0 ? rendelesek.map((rendeles) => (
                <TableRow key={rendeles.id} hover>
                  <TableCell>#{rendeles.id}</TableCell>
                  <TableCell>{new Date(rendeles.datum).toLocaleString('hu-HU')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{rendeles.szaml_nev || "Ismeretlen"}</TableCell>
                  <TableCell>{HUF.format(rendeles.vegosszeg)} Ft</TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={rendeles.statusz}
                      onChange={(e) => updateRendelesStatusz(rendeles.id, e.target.value)}
                      sx={{ minWidth: 150, bgcolor: rendeles.statusz === 'KISZALLITVA' ? '#e8f5e9' : 'white' }}
                    >
                      <MenuItem value="KOSAR">Kosárban hagyott</MenuItem>
                      <MenuItem value="FELDOLGOZAS">Feldolgozás alatt</MenuItem>
                      <MenuItem value="FIZETVE">Fizetve</MenuItem>
                      <MenuItem value="KISZALLITVA">Kiszállítva</MenuItem>
                      <MenuItem value="TOROLVE">Törölve</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              )) : <TableRow><TableCell colSpan={5} align="center">Még nincs leadott rendelés.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* --- 5. TAB: FOGLALÁSOK --- */}
      {tabIndex === 5 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#eee' }}>
              <TableRow>
                <TableCell>Lefoglalt Időpont</TableCell>
                <TableCell>Foglaló Neve</TableCell>
                <TableCell>Szolgáltatás</TableCell>
                <TableCell>Létszám</TableCell>
                <TableCell>Státusz Módosítása</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {foglalasok.length > 0 ? foglalasok.map((foglalas) => (
                <TableRow key={foglalas.id} hover>
                  <TableCell>{new Date(foglalas.datum || foglalas.foglalas_datuma).toLocaleString('hu-HU')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{foglalas.user_nev || "Ismeretlen"} <br/><small style={{fontWeight:'normal', color:'gray'}}>{foglalas.user_email}</small></TableCell>
                  <TableCell>{foglalas.szolgaltatas_nev || "Borkóstoló"}</TableCell>
                  <TableCell>{foglalas.letszam} fő</TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={foglalas.statusz}
                      onChange={(e) => updateFoglalasStatusz(foglalas.id, e.target.value)}
                      sx={{ 
                        minWidth: 150, 
                        bgcolor: foglalas.statusz === 'CONFIRMED' ? '#e8f5e9' : foglalas.statusz === 'CANCELLED' ? '#ffebee' : 'white' 
                      }}
                    >
                      <MenuItem value="PENDING">Függőben (Pending)</MenuItem>
                      <MenuItem value="CONFIRMED">Visszaigazolva</MenuItem>
                      <MenuItem value="CANCELLED">Elutasítva / Törölve</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              )) : <TableRow><TableCell colSpan={5} align="center">Még nincs leadott foglalás.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* DIALOG: BOR */}
      <Dialog open={openBorDialog} onClose={() => setOpenBorDialog(false)} maxWidth="sm" fullWidth><DialogTitle>{editingBor ? 'Bor szerkesztése' : 'Új bor'}</DialogTitle><DialogContent><TextField margin="dense" label="Név" fullWidth value={borForm.nev} onChange={(e) => setBorForm({...borForm, nev: e.target.value})} /><TextField margin="dense" label="Évjárat" type="number" fullWidth value={borForm.evjarat} onChange={(e) => setBorForm({...borForm, evjarat: e.target.value})} /><TextField margin="dense" label="Ár" type="number" fullWidth value={borForm.ar} onChange={(e) => setBorForm({...borForm, ar: e.target.value})} /><TextField margin="dense" label="Készlet" type="number" fullWidth value={borForm.keszlet} onChange={(e) => setBorForm({...borForm, keszlet: e.target.value})} /><TextField margin="dense" label="Leírás" multiline rows={2} fullWidth value={borForm.leiras} onChange={(e) => setBorForm({...borForm, leiras: e.target.value})} /></DialogContent><DialogActions><Button onClick={() => setOpenBorDialog(false)}>Mégsem</Button><Button onClick={handleSaveBor} variant="contained" sx={{ bgcolor: '#722f37' }}>Mentés</Button></DialogActions></Dialog>

      {/* DIALOG: SZOLGÁLTATÁS */}
      <Dialog open={openSzolgDialog} onClose={() => setOpenSzolgDialog(false)} maxWidth="sm" fullWidth><DialogTitle>{editingSzolg ? 'Kóstoló szerkesztése' : 'Új kóstoló létrehozása'}</DialogTitle><DialogContent><TextField margin="dense" label="Név" fullWidth value={szolgForm.nev} onChange={(e) => setSzolgForm({...szolgForm, nev: e.target.value})} /><TextField margin="dense" label="Dátum" type="date" fullWidth InputLabelProps={{shrink: true}} value={szolgForm.datum} onChange={(e) => setSzolgForm({...szolgForm, datum: e.target.value})} /><TextField margin="dense" label="Időtartam (pl. 02:00)" type="time" fullWidth InputLabelProps={{shrink: true}} value={szolgForm.idotartam} onChange={(e) => setSzolgForm({...szolgForm, idotartam: e.target.value})} /><TextField margin="dense" label="Ár (Ft/fő)" type="number" fullWidth value={szolgForm.ar} onChange={(e) => setSzolgForm({...szolgForm, ar: e.target.value})} /><TextField margin="dense" label="Kapacitás (fő)" type="number" fullWidth value={szolgForm.kapacitas} onChange={(e) => setSzolgForm({...szolgForm, kapacitas: e.target.value})} /><TextField margin="dense" label="Extra infó" fullWidth value={szolgForm.extra} onChange={(e) => setSzolgForm({...szolgForm, extra: e.target.value})} /><TextField margin="dense" label="Leírás" multiline rows={3} fullWidth value={szolgForm.leiras} onChange={(e) => setSzolgForm({...szolgForm, leiras: e.target.value})} /><FormControlLabel control={<Switch checked={Boolean(szolgForm.aktiv)} onChange={(e) => setSzolgForm({...szolgForm, aktiv: e.target.checked ? 1 : 0})} />} label="Aktív (Látható a weboldalon)" sx={{ mt: 1 }} /></DialogContent><DialogActions><Button onClick={() => setOpenSzolgDialog(false)}>Mégsem</Button><Button onClick={handleSaveSzolg} variant="contained" sx={{ bgcolor: '#722f37' }}>Mentés</Button></DialogActions></Dialog>
      
      {/* DIALOG: ÜZENET */}
      <Dialog open={openUzenetDialog} onClose={() => setOpenUzenetDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Üzenet szerkesztése</DialogTitle>
        <DialogContent>
            <TextField margin="dense" label="Név" fullWidth value={uzenetForm.nev} onChange={(e) => setUzenetForm({...uzenetForm, nev: e.target.value})} />
            <TextField margin="dense" label="Email" fullWidth value={uzenetForm.email} onChange={(e) => setUzenetForm({...uzenetForm, email: e.target.value})} />
            <TextField margin="dense" label="Tárgy" fullWidth value={uzenetForm.targy} onChange={(e) => setUzenetForm({...uzenetForm, targy: e.target.value})} />
            <TextField margin="dense" label="Üzenet" multiline rows={4} fullWidth value={uzenetForm.uzenet} onChange={(e) => setUzenetForm({...uzenetForm, uzenet: e.target.value})} />
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpenUzenetDialog(false)}>Mégsem</Button>
            <Button onClick={handleSaveUzenet} variant="contained" sx={{ bgcolor: '#722f37' }}>Mentés</Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG: USER */}
      <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)}><DialogTitle>Új user</DialogTitle><DialogContent><TextField margin="dense" label="Név" fullWidth onChange={(e) => setUserForm({...userForm, nev: e.target.value})} /><TextField margin="dense" label="Email" fullWidth onChange={(e) => setUserForm({...userForm, email: e.target.value})} /><TextField margin="dense" label="Jelszó" type="password" fullWidth onChange={(e) => setUserForm({...userForm, password_hash: e.target.value})} /></DialogContent><DialogActions><Button onClick={() => setOpenUserDialog(false)}>Mégsem</Button><Button onClick={handleSaveUser} variant="contained" sx={{ bgcolor: '#722f37' }}>Mentés</Button></DialogActions></Dialog>

    </Container>
  );
}