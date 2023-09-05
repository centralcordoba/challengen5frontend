import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Button } from "@mui/material";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUserName, setNewUserName] = useState("");
  const [newUserLastName, setNewUserLastName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get("https://localhost:44344/api/Permisoes/")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`https://localhost:44344/api/Permisoes/${id}`)
      .then(() => {
        // Elimina el usuario de la lista después de confirmar que se ha eliminado del servidor
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        fetchUsers();
      })
      .catch((err) => {
        console.error("Error al eliminar el usuario:", err);
      });
  };

  function permisoToLetter(tipoPermiso) {
    switch (tipoPermiso) {
      case 1:
        return "Escritura";
      case 2:
        return "Lectura";
      case 3:
        return "Modificacion";
      default:
        return "Desconocido";
    }
  }
  const handleAddUser = () => {
    const newUser = {
      NombreEmpleado: newUserName,
      ApellidoEmpleado: newUserLastName,
      TipoPermiso: newUserEmail,
    };
    axios
      .post("https://localhost:44344/api/Permisoes", newUser)
      .then((response) => {
        setUsers((prevUsers) => [...prevUsers, response.data]);
        setNewUserName("");
        setNewUserLastName("");
        setNewUserEmail("");
      })
      .catch((err) => {
        console.error("Error al agregar el usuario:", err);
      });
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error al cargar la lista de permisos: {error.message}</p>;
  }

  return (
    <Container>
      <div>
        <h2>Lista de Usuarios / Permisos</h2>

        {/* Formulario de Agregación */}
        <div>
          <input
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="Nombre del Usuario"
          />
          <input
            value={newUserLastName}
            onChange={(e) => setNewUserLastName(e.target.value)}
            placeholder="Apellido del Usuario"
          />
          <select
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
          >
            <option value="1">Escritura</option>
            <option value="2">Lectura</option>
            <option value="3">Modificacion</option>
          </select>
          <Button onClick={handleAddUser}>Agregar Usuario/Permiso</Button>
        </div>
        {/* Lista de Usuarios */}
        <ul>
          {users.map((user) => (
            <li key={user.Id}>
              {user.NombreEmpleado +
                user.ApellidoEmpleado +
                permisoToLetter(user.TipoPermiso)}
              <Button onClick={() => handleDelete(user.Id)}>Eliminar</Button>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}

export default UserList;
