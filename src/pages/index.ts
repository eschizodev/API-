import React, { JSX } from 'react';
import ClienteForm from '../../components/ClienteForm'; // Certifique-se de que o caminho para o seu componente está correto


const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f7fc',
    fontFamily: 'Arial, Helvetica, sans-serif',
    padding: '0 20px',
  },
  header: {
    marginBottom: '30px',
    textAlign: 'center',
  },
  headerText: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '600px',
    padding: '20px',
  },
  formCard: {
    width: '100%',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};
