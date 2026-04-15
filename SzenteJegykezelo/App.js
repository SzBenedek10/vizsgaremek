import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons'; 

// IDE ÍRD BE A LAPTOPOD IP CÍMÉT A LOCALHOST HELYETT! (Pl. http://192.168.1.65:5000)
const API_URL = "http://192.168.1.8:5000";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccessMark, setShowSuccessMark] = useState(false);

  if (!permission) return <View />; 
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>Szükségünk van a kamera engedélyre a szkenneléshez!</Text>
        <Button onPress={requestPermission} title="Kamera engedélyezése" color="#722f37" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setLoading(true);
    setErrorMsg("");
    setShowSuccessMark(false);

    try {
      const response = await fetch(`${API_URL}/api/admin/foglalasok/jegy/${data}`);
      if (!response.ok) {
        throw new Error("Nem található ilyen jegy a rendszerben!");
      }
      const ticket = await response.json();
      setTicketData(ticket);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const redeemTicket = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/foglalasok/jegy/FOGL-${ticketData.id}/bevalt`, {
        method: 'PUT'
      });
      
      if (!response.ok) {
        throw new Error("Hiba történt, vagy ezt a jegyet már beváltották!");
      }
      
      setLoading(false);
      setShowSuccessMark(true);

      setTimeout(() => {
        setShowSuccessMark(false);
        setTicketData({ ...ticketData, bevaltva: 1 });
      }, 1500);

    } catch (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setTicketData(null);
    setErrorMsg("");
    setShowSuccessMark(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Szente Pincészet</Text>
        <Text style={styles.subHeaderText}>Jegykezelő Rendszer</Text>
      </View>

      {!scanned ? (
        <View style={styles.scannerContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          />
          <View style={styles.overlay}>
            <View style={styles.scanFrame} />
            <Text style={styles.scanText}>Irányítsd a kamerát a jegyen lévő QR kódra</Text>
          </View>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#722f37" />
          ) : errorMsg ? (
            <View style={[styles.card, { borderColor: '#d32f2f', borderWidth: 3 }]}>
              <Text style={styles.errorTitle}>Hiba!</Text>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : ticketData ? (

            showSuccessMark ? (
              <View style={styles.successContainer}>
                <Ionicons name="checkmark-circle" size={120} color="#2e7d32" />
                <Text style={styles.successTitle}>Sikeres beváltás!</Text>
                <Text style={styles.successSub}>A vendég beléphet.</Text>
              </View>
            ) : (
              <View style={styles.card}>
                <Text style={styles.ticketId}>Azonosító: #FOGL-{ticketData.id}</Text>
                <Text style={styles.guestName}>{ticketData.user_nev}</Text>
                <Text style={styles.details}>{ticketData.szolgaltatas_nev}</Text>
                <Text style={styles.details}>Létszám: {ticketData.letszam} fő</Text>
                
                <View style={[styles.statusBox, { backgroundColor: ticketData.bevaltva ? '#ffebee' : '#e8f5e9' }]}>
                  <Text style={[styles.statusText, { color: ticketData.bevaltva ? '#d32f2f' : '#2e7d32' }]}>
                    {ticketData.bevaltva ? "EZ A JEGY MÁR BE VAN VÁLTVA!" : "ÉRVÉNYES JEGY"}
                  </Text>
                </View>

                {!ticketData.bevaltva && (
                  <TouchableOpacity style={styles.redeemBtn} onPress={redeemTicket}>
                    <Text style={styles.redeemBtnText}>JEGY BEVÁLTÁSA</Text>
                  </TouchableOpacity>
                )}
              </View>
            )

          ) : null}

          {!showSuccessMark && (
            <TouchableOpacity style={styles.backBtn} onPress={resetScanner}>
              <Text style={styles.backBtnText}>Új QR kód beolvasása</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfbfb' },
  header: { paddingTop: 60, paddingBottom: 20, backgroundColor: '#722f37', alignItems: 'center' },
  headerText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  subHeaderText: { color: '#e0e0e0', fontSize: 14, marginTop: 5 },
  scannerContainer: { flex: 1, position: 'relative' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  scanFrame: { width: 250, height: 250, borderColor: '#fff', borderWidth: 2, borderRadius: 20 },
  scanText: { color: 'white', marginTop: 20, fontSize: 16, fontWeight: 'bold' },
  resultContainer: { flex: 1, padding: 20, justifyContent: 'center' },
  card: { backgroundColor: 'white', padding: 25, borderRadius: 15, elevation: 5, alignItems: 'center', width: '100%' },
  errorTitle: { fontSize: 22, fontWeight: 'bold', color: '#d32f2f', marginBottom: 10 },
  errorText: { fontSize: 16, color: '#333', textAlign: 'center' },
  ticketId: { fontSize: 14, color: '#888', marginBottom: 10, letterSpacing: 1 },
  guestName: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 5, textAlign: 'center' },
  details: { fontSize: 18, color: '#666', marginBottom: 5, textAlign: 'center' },
  statusBox: { marginTop: 20, padding: 15, borderRadius: 10, width: '100%', alignItems: 'center' },
  statusText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  redeemBtn: { backgroundColor: '#2e7d32', padding: 18, borderRadius: 10, width: '100%', marginTop: 20, alignItems: 'center' },
  redeemBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  backBtn: { marginTop: 30, padding: 15, borderColor: '#722f37', borderWidth: 2, borderRadius: 10, alignItems: 'center' },
  backBtnText: { color: '#722f37', fontSize: 16, fontWeight: 'bold' },
  successContainer: { alignItems: 'center', justifyContent: 'center', padding: 30, backgroundColor: 'white', borderRadius: 20, elevation: 5 },
  successTitle: { fontSize: 28, fontWeight: 'bold', color: '#2e7d32', marginTop: 10 },
  successSub: { fontSize: 16, color: '#666', marginTop: 5 }
});