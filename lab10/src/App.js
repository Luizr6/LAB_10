import React, { Component } from 'react';
import { 
  Container, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TextField, 
  Button, 
  Box, 
  CircularProgress 
} from '@mui/material';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productos: [],
      recuperado: false,
      descripcion: '',
      precio: ''
    };
  }

  componentDidMount() {
    this.obtenerProductos();
  }

  obtenerProductos = () => {
    fetch('http://127.0.0.1:8000/api/producto/')
      .then((response) => response.json())
      .then((prod) => {
        this.setState({
          productos: prod,
          recuperado: true
        });
      })
      .catch((error) => console.error('Error al conectar:', error));
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

handleSubmit = (e) => {
    e.preventDefault();
    const { descripcion, precio } = this.state;

    fetch('http://127.0.0.1:8000/api/producto/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ descripcion, precio })
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Producto guardado:', data);
        this.setState({ descripcion: '', precio: '' });
        this.obtenerProductos(); // Vuelve a pedir la lista actualizada
      })
      .catch((err) => console.error('Error al agregar:', err));
  };

  mostrarTabla() {
    return (
      <Container maxWidth="md" sx={{ marginTop: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Gestión de Productos
        </Typography>

        {/* Formulario para agregar producto */}
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
          <Typography variant="h6" gutterBottom>
            Agregar Nuevo Producto
          </Typography>
          <Box component="form" onSubmit={this.handleSubmit} sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Descripción"
              name="descripcion"
              value={this.state.descripcion}
              onChange={this.handleChange}
              required
              fullWidth
            />
            <TextField
              label="Precio"
              name="precio"
              type="number"
              value={this.state.precio}
              onChange={this.handleChange}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary" sx={{ minWidth: '120px' }}>
              Agregar
            </Button>
          </Box>
        </Paper>

        {/* Tabla estilizada con Material-UI */}
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: '#1976d2' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Código</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Precio (S/)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.productos.map((prod) => (
                <TableRow key={prod.codigo}>
                  <TableCell>{prod.codigo}</TableCell>
                  <TableCell>{prod.descripcion}</TableCell>
                  <TableCell>{Number(prod.precio).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    );
  }

  render() {
    if (this.state.recuperado) {
      return this.mostrarTabla();
    } else {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 2 }}>
          <CircularProgress />
          <Typography variant="h6">Recuperando datos...</Typography>
        </Box>
      );
    }
  }
}

export default App;