import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    marginTop:10,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  heading: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#008080',
  },
  section: {
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  table: {
    // border: '1pt solid #ccc',
    borderTop: '1pt solid #ccc',
    borderBottom: '1pt solid #ccc',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottom: '1pt solid #ccc',
    padding: 5,
  },
  cell: {
    flex: 1,
    padding: 3,
  },
  total: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  footer: {
    fontSize: 9,
    marginTop: 20,
  },
  topContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 20,
},
logoText: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#8B4513',
},
resortNameAccent: {
  color: '#008080',
},
invoiceTitle: {
  fontSize: 18,
  color: '#006666',
  fontWeight: 'bold',
  textAlign: 'right',
},
});

function invoice() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
  {/* Left: Resort Logo and Address */}
  <View style={{ flex: 1 }}>
    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#8B4513' }}>Scarlet <Text style={{ color: '#008080' }}>Resort</Text></Text>
    <Text>Swami Samartha Nagar Pimpal Bhat</Text>
    <Text>Near Swami Samartha Matth, Alibag</Text>
    <Text>Raigad, Alibag 402201</Text>
    <Text>7887522080</Text>
  </View>

  {/* Right: Invoice Title & Info */}
  <View style={{ flex: 1, alignItems: 'flex-end' }}>
    <Text style={{ fontSize: 18, color: '#006666', fontWeight: 'bold' }}>TAX INVOICE</Text>
    <Text style={{ fontSize: 11, fontWeight: 'bold', marginTop: 4 }}>Invoice# INV-0001056</Text>
    
    <Text style={{ fontSize: 10, marginTop: 10 }}>Balance Due</Text>
    <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>₹3,000.00</Text>

    <Text style={{ fontSize: 10 }}>Invoice Date : 17/07/2025</Text>
    <Text style={{ fontSize: 10 }}>Due Date : 20/07/2025</Text>
  </View>
</View>
        <View style={styles.section}>
          <Text style={styles.label}>Booking For Customer:</Text>
          <Text>Chandranai A.J. | 8433572396</Text>
          <Text>Check-In: 19/07/2025 | Check-Out: 20/07/2025</Text>
          <Text>Number Of Rooms: 2</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.row, { backgroundColor: '#3fb6b6ff' }]}>
            <Text style={styles.cell}>#</Text>
            <Text style={styles.cell}>Item & Description</Text>
            <Text style={styles.cell}>Qty</Text>
            <Text style={styles.cell}>Rate</Text>
            <Text style={styles.cell}>Amount</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>1</Text>
            <Text style={styles.cell}>AC Room (6 Adult)</Text>
            <Text style={styles.cell}>2 Room</Text>
            <Text style={styles.cell}>₹2,500.00</Text>
            <Text style={styles.cell}>₹5,000.00</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}>Sub Total:</Text>
            <Text style={styles.cell}>₹5,000.00</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}>Total:</Text>
            <Text style={styles.cell}>₹5,000.00</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}>GST (18%):</Text>
            <Text style={styles.cell}>₹900.00</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}>Payment Made:</Text>
            <Text style={styles.cell}>₹2,000.00</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}>Balance Due:</Text>
            <Text style={styles.cell}>₹3,000.00</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}>Total in Words:</Text>
            <Text style={styles.cell}>Indian Rupee Five Thousand Only</Text>
          </View>
        </View>

        <View style={styles.total}>
          <Text></Text>
        </View>

        <View style={styles.section}>
          <Text>UPI: 9593476569</Text>
          <Text>Note: 2% charge will be applied for CC/DC payments.</Text>
        </View>

        <View style={styles.footer}>
          <Text>Terms & Conditions:</Text>
          <Text>1. Check-In: 11:00 AM, Check-Out: 10:00 AM</Text>
          <Text>2. Room key on full payment and ID verification.</Text>
          <Text>3. Hot water from 8:00 AM to 10:00 AM only.</Text>
          <Text>4. AC must be turned off when leaving the room.</Text>
          <Text>5. 1L bottled water included.</Text>
          <Text>6. Guests liable for damage.</Text>
          <Text>7. 3rd guest Rs. 500 extra charge.</Text>
          <Text>8. Notify reception before 10 AM for late checkout.</Text>
          <Text>9. No alcohol in public areas.</Text>
          <Text>10. Pool access 7:00 AM - 1:00 PM strictly.</Text>
          <Text>11. No outside food during specific times.</Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text>Authorized Signature: ___________________</Text>
        </View>

      </Page>
    </Document>
  );
}

export default invoice;