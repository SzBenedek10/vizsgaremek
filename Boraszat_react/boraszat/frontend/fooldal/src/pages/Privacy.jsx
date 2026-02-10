import React from 'react';
import { Container, Typography, Box, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Privacy() {
  return (
    <Box sx={{ py: 8, bgcolor: '#fdfbfb', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 5, borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#722f37', fontWeight: 'bold' }}>
            Adatkezelési Tájékoztató
          </Typography>
          <Typography paragraph color="text.secondary">
            A Pince Borászat elkötelezett az Ön személyes adatainak védelme mellett. Az alábbiakban tájékoztatjuk arról, hogyan kezeljük adatait.
          </Typography>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">Milyen adatokat gyűjtünk?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              A rendelés teljesítéséhez szükséges adatokat: Név, Cím (szállítási és számlázási), Email cím, Telefonszám.
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">Miért kezeljük az adatokat?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              Az adatkezelés célja a megrendelések teljesítése, a számlázás, valamint a kapcsolattartás (pl. szállítási értesítő).
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">Kinek továbbítjuk az adatokat?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              Kizárólag a szerződés teljesítésében résztvevő partnereknek:
              <ul>
                <li>Futárszolgálat (Név, Cím, Telefonszám)</li>
                <li>Könyvelőiroda (Számlázási adatok)</li>
                <li>Tárhelyszolgáltató</li>
              </ul>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">Az Ön jogai</Typography>
            </AccordionSummary>
            <AccordionDetails>
              Bármikor kérheti adatai törlését, módosítását vagy tájékoztatást kérhet a kezelt adatokról az info@szentepince.hu email címen.
            </AccordionDetails>
          </Accordion>

        </Paper>
      </Container>
    </Box>
  );
}